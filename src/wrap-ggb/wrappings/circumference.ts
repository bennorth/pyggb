import { RegisterFun } from "../../shared/appApi";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { SignatureSpec, wrapIfMatching } from "../command-invocation";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kSignatures: Array<SignatureSpec> = [
  { argTypes: [["circle", "ellipse"]] },
];

export const register: RegisterFun = (mod, appApi) => {
  mod.Circumference = new Sk.builtin.func((...args) =>
    wrapIfMatching(appApi.ggb, kSignatures, "Circumference", args)
  );
};
