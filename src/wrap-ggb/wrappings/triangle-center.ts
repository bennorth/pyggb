import { RegisterFun } from "../../shared/appApi";
import { augmentedGgbApi, AugmentedGgbApi } from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";

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

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    const badArgsError = new Sk.builtin.TypeError(
      "TriangleCenter() arguments must be (point, point, point, center-kind)," +
        ` where center-kind is one of ${kCenterKindStringsList}`
    );

    switch (args.length) {
      case 4: {
        const pointArgs = args.slice(0, 3);
        if (!ggb.everyElementIsGgbObjectOfType(pointArgs, "point")) {
          throw badArgsError;
        }

        const mCode = centerKindCodeFromString(args[3]);
        if (mCode == null) {
          throw badArgsError;
        }

        const ggbArgs = [
          ...pointArgs.map((a) => a.$ggbLabel),
          mCode.toString(),
        ];
        const ggbArgStr = ggbArgs.join(",");
        const ggbCmd = `TriangleCenter(${ggbArgStr})`;

        return Sk.misceval.promiseToSuspension(
          ggb.asyncEvalCmd(ggbCmd).then(ggb.wrapExistingGgbObject)
        );
      }
      default:
        throw badArgsError;
    }
  });

  mod.TriangleCenter = fun;
};
