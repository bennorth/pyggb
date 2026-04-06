import { GgbApi, GgbObjectType } from "../shared/vendor-types/ggbapi";
import {
  KeywordArgsArray,
  SkObject,
  SkulptApi,
} from "../shared/vendor-types/skulptapi";
import {
  assembledCommand,
  isGgbObject,
  isPythonOrGgbNumber,
  labelIsValid,
  SkGgbObject,
  strOfNumber,
} from "./shared";
import { wrapExistingGgbObject } from "./type-registry";

declare var Sk: SkulptApi; // eslint-disable-line no-var

////////////////////////////////////////////////////////////////////////
// Utilities to construct a command string.

// TODO: Remove duplication with argumentString()?
export const ggbArgumentStr = (ggb: GgbApi, x: SkObject): string => {
  if (isGgbObject(ggb, x)) {
    return x.$ggbLabel;
  }

  if (Sk.builtin.checkNumber(x)) {
    return strOfNumber(x.v);
  }

  throw new Sk.builtin.RuntimeError(
    "internal error: bad Python type for GeoGebra argument"
  );
};

const cmdWithArgs = (
  ggb: GgbApi,
  ggbCommandName: string,
  pyArgs: Array<SkObject>
): string => {
  const ggbArgStrs = pyArgs.map((pyArg) => ggbArgumentStr(ggb, pyArg));
  const ggbFullCmd = assembledCommand(ggbCommandName, ggbArgStrs);
  return ggbFullCmd;
};

////////////////////////////////////////////////////////////////////////
// Types to describe list of overloaded signatures of a Ggb function,
// and predicates to determine whether a candidate list of arguments
// matches a signature.

export type ScalarArgType =
  | GgbObjectType
  | "ggb-object"
  | "py-number"
  | "py-string"
  | "py-object"
  | "either-number";

type IterableArgType = {
  kind: "iterable";
  elementType: ScalarArgType;
};

type ArgType = ScalarArgType | IterableArgType;

function argTypeIsIterable(argType: ArgType): argType is IterableArgType {
  return (
    typeof argType === "object" &&
    "kind" in argType &&
    argType.kind === "iterable"
  );
}

function objIsOfOneType(
  ggb: GgbApi,
  obj: SkObject,
  requiredType: ArgType
): boolean {
  if (argTypeIsIterable(requiredType)) {
    return objIsIterableOfType(ggb, obj, requiredType.elementType);
  }

  switch (requiredType) {
    case "ggb-object":
      return isGgbObject(ggb, obj);
    case "py-number":
      return Sk.builtin.checkNumber(obj);
    case "py-string":
      return Sk.builtin.checkString(obj);
    case "py-object":
      return true;
    case "either-number":
      return isPythonOrGgbNumber(ggb, obj);
    default:
      return isGgbObject(ggb, obj, requiredType);
  }
}

function objIsIterableOfType(
  ggb: GgbApi,
  obj: SkObject,
  requiredType: ArgType
): boolean {
  return (
    Sk.builtin.checkIterable(obj) &&
    Sk.misceval
      .arrayFromIterable(obj)
      .every((elt) => objIsOfOneType(ggb, elt, requiredType))
  );
}

type ArgTypeOrTypes = ArgType | Array<ArgType>;

function objMeetsTypeSpec(
  ggb: GgbApi,
  obj: SkObject,
  typeSpec: ArgTypeOrTypes
): boolean {
  // Collapse by converting, e.g., "point" -> ["point"]?
  return Array.isArray(typeSpec)
    ? typeSpec.some((oneSpec) => objIsOfOneType(ggb, obj, oneSpec))
    : objIsOfOneType(ggb, obj, typeSpec);
}

type VariadicArgsSpec = {
  atLeast: number;
  ofType: ArgType;
};

type SignatureArgsSpec = Array<ArgTypeOrTypes> | VariadicArgsSpec;

export type SignatureSpec = {
  argTypes: SignatureArgsSpec;
  ggbCommand?: (ggb: GgbApi, args: Array<SkObject>) => string;
  errorMessage?: (ggb: GgbApi, args: Array<SkObject>) => string;
  returnsMultiple?: "take-all" | "take-first";
};

type SignatureSpecOptions = Array<SignatureSpec>;

function argsMeetSpec(
  ggb: GgbApi,
  args: Array<SkObject>,
  argsSpec: SignatureArgsSpec
): boolean {
  const nObjs = args.length;

  if (Array.isArray(argsSpec)) {
    if (nObjs !== argsSpec.length) {
      return false;
    }
    for (let i = 0; i !== nObjs; ++i) {
      if (!objMeetsTypeSpec(ggb, args[i], argsSpec[i])) {
        return false;
      }
    }
  } else {
    if (nObjs < argsSpec.atLeast) {
      return false;
    }
    for (let i = 0; i !== nObjs; ++i) {
      if (!objIsOfOneType(ggb, args[i], argsSpec.ofType)) {
        return false;
      }
    }
  }

  return true;
}

////////////////////////////////////////////////////////////////////////
// Utilities to turn an argument-list spec into a human-language
// (English for now) summary.

function displayArgType(argType: ArgType): string {
  if (argTypeIsIterable(argType)) {
    return `iterable-of-${displayArgType(argType.elementType)}`;
  }

  switch (argType) {
    case "ggb-object":
      return "any-ggb-object";
    case "py-number":
      return "python-number";
    case "py-string":
      return "python-string";
    case "py-object":
      return "python-object";
    case "either-number":
      return "py-or-ggb-number";
    default:
      return argType;
  }
}

function displayArgTypeOrTypes(argSpec: ArgTypeOrTypes): string {
  return Array.isArray(argSpec)
    ? argSpec.map(displayArgType).join("|")
    : displayArgType(argSpec);
}

function displaySignatureSpec(spec: SignatureSpec): string {
  const argTypes = spec.argTypes;
  if (Array.isArray(argTypes)) {
    const argSpecList = argTypes.map(displayArgTypeOrTypes).join(", ");
    return `(${argSpecList})`;
  } else {
    return `(${argTypes.ofType}{${argTypes.atLeast},})`;
  }
}

function displaySignatureSpecOptions(
  specOptions: SignatureSpecOptions
): string {
  const nOptions = specOptions.length;
  const content = specOptions.map(displaySignatureSpec);
  switch (nOptions) {
    case 1:
      return content[0];
    default: {
      const head = content.slice(0, nOptions - 1);
      const headStr = head.join(", ");
      const tail = content[nOptions - 1];
      return `${headStr}, or ${tail}`;
    }
  }
}

////////////////////////////////////////////////////////////////////////
// Functions to look for an arg-spec which matches a list of arguments,
// and evaluate a command if one is found, producing a SkObject.

type MatchedCommandInfo = {
  matchedSpec: SignatureSpec;
  command: string;
};

export function firstMatchingCommand(
  ggb: GgbApi,
  sigSpecs: SignatureSpecOptions,
  ggbCommandName: string,
  pyArgs: Array<SkObject>
): MatchedCommandInfo | null {
  for (const sigSpec of sigSpecs) {
    if (argsMeetSpec(ggb, pyArgs, sigSpec.argTypes)) {
      const command =
        sigSpec.ggbCommand != null
          ? sigSpec.ggbCommand(ggb, pyArgs)
          : cmdWithArgs(ggb, ggbCommandName, pyArgs);
      return { matchedSpec: sigSpec, command };
    }
  }

  return null;
}

type EvaluationInfo = {
  commandName: string;
  matchedSpec: SignatureSpec;
  maybeLabels: string;
};

function evalCmdIfMatching(
  ggb: GgbApi,
  sigSpecs: SignatureSpecOptions,
  ggbCommandName: string,
  pyArgs: Array<SkObject>
): EvaluationInfo | null {
  const mMatchInfo = firstMatchingCommand(
    ggb,
    sigSpecs,
    ggbCommandName,
    pyArgs
  );

  if (mMatchInfo == null) {
    return null;
  }

  const { matchedSpec, command } = mMatchInfo;

  const maybeLabels = ggb.evalCommandGetLabels(command);

  if (maybeLabels == null) {
    const errorMessage =
      matchedSpec.errorMessage != null
        ? matchedSpec.errorMessage(ggb, pyArgs)
        : `GeoGebra command "${command}" returned null`;

    throw new Sk.builtin.RuntimeError(errorMessage);
  }

  return { commandName: ggbCommandName, matchedSpec, maybeLabels };
}

export function throwBadArgsError(
  ggbCommandName: string,
  argSpecs: Array<SignatureSpec>
): never {
  const displayOptions = displaySignatureSpecOptions(argSpecs);
  throw new Sk.builtin.TypeError(
    `${ggbCommandName}() arguments must be ${displayOptions}`
  );
}

function objectIfMatching(
  ggb: GgbApi,
  argSpecs: Array<SignatureSpec>,
  ggbCommandName: string,
  pyArgs: Array<SkObject>,
  objectFromEvalInfo: (evalInfo: EvaluationInfo) => SkObject
): SkObject {
  const evalInfo = evalCmdIfMatching(ggb, argSpecs, ggbCommandName, pyArgs);

  if (evalInfo == null) {
    throwBadArgsError(ggbCommandName, argSpecs);
  }

  return objectFromEvalInfo(evalInfo);
}

function verifyExactlyOneLabel(labelsStr: string, commandName: string) {
  const labels = labelsStr.split(",");
  const nLabels = labelsStr === "" ? 0 : labels.length;

  if (nLabels !== 1)
    throw new Sk.builtin.RuntimeError(
      `expecting one result from ${commandName}() but got ${nLabels}`
    );
}

////////////////////////////////////////////////////////////////////////
// Function to deliberately construct a new SkGgbObject.

function constructInstanceFun(nativeClass: {
  new (label: string): SkGgbObject;
}) {
  return (evalInfo: EvaluationInfo) => {
    const takeFirst = (() => {
      const spec = evalInfo.matchedSpec;
      if (spec.returnsMultiple === undefined) {
        return false;
      }
      if (spec.returnsMultiple === "take-first") {
        return true;
      }
      throw new Sk.builtin.RuntimeError(
        "internal error: bad returnsMultiple value for construct-instance"
      );
    })();

    const labelsStr = evalInfo.maybeLabels;
    const labels = labelsStr.split(",");

    if (!takeFirst) {
      verifyExactlyOneLabel(labelsStr, evalInfo.commandName);
    }

    const label = takeFirst ? labels[0] : labelsStr;
    return new nativeClass(label);
  };
}

export function constructIfMatching(
  ggb: GgbApi,
  ctorSpecs: Array<SignatureSpec>,
  ggbCommandName: string,
  pyArgs: Array<SkObject>,
  nativeClass: { new (label: string): SkGgbObject }
): SkObject {
  const ctor = constructInstanceFun(nativeClass);
  return objectIfMatching(ggb, ctorSpecs, ggbCommandName, pyArgs, ctor);
}

////////////////////////////////////////////////////////////////////////
// Function to invoke a Ggb function and wrap the return value; produce
// a Python list if we expect multiple returned Ggb objects.

function wrapInstanceOrListFun(ggb: GgbApi) {
  return (evalInfo: EvaluationInfo) => {
    const labelsStr = evalInfo.maybeLabels;
    const returnsMultiple = evalInfo.matchedSpec.returnsMultiple;

    if (returnsMultiple === undefined) {
      verifyExactlyOneLabel(labelsStr, evalInfo.commandName);
      return wrapExistingGgbObject(ggb, labelsStr);
    }

    return new Sk.builtin.list(
      labelsStr
        .split(",")
        .filter(labelIsValid)
        .map((label) => wrapExistingGgbObject(ggb, label))
    );
  };
}

export function wrapIfMatching(
  ggb: GgbApi,
  sigSpecs: Array<SignatureSpec>,
  ggbCommandName: string,
  pyArgs: Array<SkObject>
): SkObject {
  const wrap = wrapInstanceOrListFun(ggb);
  return objectIfMatching(ggb, sigSpecs, ggbCommandName, pyArgs, wrap);
}

////////////////////////////////////////////////////////////////////////
// Utility for making sure no keyword arguments.

export function throwIfAnyKeywordArgs(
  commandName: string,
  kwargs: KeywordArgsArray
) {
  if (kwargs !== undefined && kwargs.length !== 0)
    throw new Sk.builtin.TypeError(
      `${commandName}() must not be given keyword arguments`
    );
}
