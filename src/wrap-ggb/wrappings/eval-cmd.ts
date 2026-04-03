import { RegisterFun } from "../../shared/appApi";
import { augmentedGgbApi, AugmentedGgbApi, labelIsValid } from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

function transformResultSingle(ggb: AugmentedGgbApi, evalResultStr: string) {
  if (evalResultStr.includes(",")) {
    throw new Sk.builtin.RuntimeError(
      "GeoGebra command produced multiple objects"
    );
  }
  return ggb.wrapExistingGgbObject(evalResultStr);
}

function transformResultMulti(ggb: AugmentedGgbApi, evalResultStr: string) {
  const validLabels = evalResultStr.split(",").filter(labelIsValid);
  return new Sk.builtin.list(validLabels.map(ggb.wrapExistingGgbObject));
}

const badResultError = new Sk.builtin.RuntimeError(
  "GeoGebra command did not produce a result"
);

function wrappedEvalFun(
  ggb: AugmentedGgbApi,
  cmdName: string,
  transformResultStr: (ggb: AugmentedGgbApi, evalResultStr: string) => SkObject
) {
  const badArgsError = new Sk.builtin.TypeError(
    `${cmdName}() arguments must be (string)`
  );

  return new Sk.builtin.func((...args) => {
    if (args.length !== 1) throw badArgsError;

    const arg = args[0];
    if (!Sk.builtin.checkString(arg)) throw badArgsError;

    const evalResultStr = ggb.evalCmd(arg.v);
    if (evalResultStr == null) throw badResultError;

    return transformResultStr(ggb, evalResultStr);
  });
}

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  mod.EvalCommand = wrappedEvalFun(ggb, "EvalCommand", transformResultSingle);

  mod.EvalCommandMultiple = wrappedEvalFun(
    ggb,
    "EvalCommandMultiple",
    transformResultMulti
  );
};
