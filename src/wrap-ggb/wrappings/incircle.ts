import { RegisterFun } from "../../shared/appApi";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { SignatureSpec, wrapIfMatching } from "../command-invocation";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kSignatures: Array<SignatureSpec> = [
  { argTypes: ["point", "point", "point"] },
];

export const register: RegisterFun = (mod, appApi) => {
  mod.Incircle = new Sk.builtin.func(function Incircle(...args) {
    return wrapIfMatching(appApi.ggb, kSignatures, "Incircle", args);
  });
};
