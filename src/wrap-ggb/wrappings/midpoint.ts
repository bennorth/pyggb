import { RegisterFun } from "../../shared/appApi";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { SignatureSpec, wrapIfMatching } from "../command-invocation";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kSignatures: Array<SignatureSpec> = [
  { argTypes: [["segment", "circle", "ellipse"]] },
  { argTypes: ["point", "point"] },
];

export const register: RegisterFun = (mod, appApi) => {
  mod.Midpoint = new Sk.builtin.func(function Midpoint(...args) {
    return wrapIfMatching(appApi.ggb, kSignatures, "Midpoint", args);
  });
};
