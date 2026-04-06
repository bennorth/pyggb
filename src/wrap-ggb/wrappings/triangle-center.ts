import { RegisterFun } from "../../shared/appApi";
import { assembledCommand, augmentedGgbApi } from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import {
  firstMatchingCommand,
  ggbArgumentStr,
  SignatureSpec,
  throwBadArgsError,
} from "../command-invocation";
import { GgbApi } from "../../shared/vendor-types/ggbapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kCenterKindsStringsWithCodes: Array<[string, number]> = [
  ["incenter", 1],
  ["centroid", 2],
  ["circumcenter", 3],
  ["orthocenter", 4],
  ["nine-point-center", 5],
  ["symmedian-point", 6],
  ["gergonne-point", 7],
  ["nagel-point", 8],
  ["first-isogonic-center", 13],
];

const kCenterKindCodeFromString = new Map<string, number>(
  kCenterKindsStringsWithCodes
);

const kCenterKindStringsList =
  "[" + kCenterKindsStringsWithCodes.map((x) => x[0]).join(", ") + "]";

function centerKindCodeFromString(pyStr: SkObject): number | undefined {
  if (!Sk.builtin.checkString(pyStr)) return undefined;

  return kCenterKindCodeFromString.get(pyStr.v);
}

const makeCommand = (ggb: GgbApi, args: Array<SkObject>) => {
  const pointArgStrs = args.slice(0, 3).map((arg) => ggbArgumentStr(ggb, arg));

  const mCode = centerKindCodeFromString(args[3]);
  if (mCode == null) {
    throw new Sk.builtin.ValueError(
      "TriangleCenter(): fourth (center-kind) argument" +
        ` must be one of ${kCenterKindStringsList}`
    );
  }

  const cmdArgs = [...pointArgStrs, mCode.toString()];

  return assembledCommand("TriangleCenter", cmdArgs);
};

const kCommandName = "TriangleCenter";
const kSignatures: Array<SignatureSpec> = [
  {
    argTypes: ["point", "point", "point", "py-string"],
    ggbCommand: makeCommand,
  },
];

export const register: RegisterFun = (mod, appApi) => {
  mod.TriangleCenter = new Sk.builtin.func((...args) => {
    const ggb = appApi.ggb;
    const augGgb = augmentedGgbApi(ggb);

    const mMatchInfo = firstMatchingCommand(
      ggb,
      kSignatures,
      kCommandName,
      args
    );

    if (mMatchInfo == null) {
      throwBadArgsError(kCommandName, kSignatures);
    }

    return Sk.misceval.promiseToSuspension(
      augGgb.asyncEvalCmd(mMatchInfo.command).then(augGgb.wrapExistingGgbObject)
    );
  });
};
