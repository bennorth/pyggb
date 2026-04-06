import { GgbApi, GgbObjectType } from "../shared/vendor-types/ggbapi";
import { SkObject, SkulptApi } from "../shared/vendor-types/skulptapi";
import {
  assembledCommand,
  isGgbObject,
  isPythonOrGgbNumber,
  strOfNumber,
} from "./shared";

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
