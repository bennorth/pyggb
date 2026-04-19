import { RegisterFun } from "../../shared/appApi";
import { GgbApi } from "../../shared/vendor-types/ggbapi";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import {
  ggbArgumentStr,
  ggbListStrFromIterable,
  SignatureSpec,
  wrapIfMatching,
} from "../command-invocation";
import { assembledCommand } from "../shared";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const makePointIterableCommand = (ggb: GgbApi, args: Array<SkObject>) => {
  const listArgStr = ggbListStrFromIterable(ggb, args[0]);
  const degreeArg = ggbArgumentStr(ggb, args[1]);
  return assembledCommand("FitPoly", [listArgStr, degreeArg]);
};

const kSignatures: Array<SignatureSpec> = [
  {
    argTypes: [{ kind: "iterable", elementType: "point" }, "either-number"],
    ggbCommand: makePointIterableCommand,
  },
];

export const register: RegisterFun = (mod, appApi) => {
  mod.FitPoly = new Sk.builtin.func(function FitPoly(...args) {
    return wrapIfMatching(appApi.ggb, kSignatures, "FitPoly", args);
  });
};
