import { RegisterFun } from "../../shared/appApi";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { SignatureSpec, wrapIfMatching } from "../command-invocation";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kSignatures: Array<SignatureSpec> = [
  { argTypes: ["point", ["line", "segment", "vector"]] },
];

export const register: RegisterFun = (mod, appApi) => {
  mod.PerpendicularLine = new Sk.builtin.func(function PerpendicularLine(
    ...args
  ) {
    return wrapIfMatching(appApi.ggb, kSignatures, "PerpendicularLine", args);
  });
};
