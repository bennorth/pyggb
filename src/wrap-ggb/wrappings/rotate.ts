import { RegisterFun } from "../../shared/appApi";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { SignatureSpec, wrapIfMatching } from "../command-invocation";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kSignatures: Array<SignatureSpec> = [
  { argTypes: ["ggb-object", ["either-number", "angle"]] },
  { argTypes: ["ggb-object", ["either-number", "angle"], "point"] },
];

export const register: RegisterFun = (mod, appApi) => {
  mod.Rotate = new Sk.builtin.func(function Rotate(...args) {
    return wrapIfMatching(appApi.ggb, kSignatures, "Rotate", args);
  });
};
