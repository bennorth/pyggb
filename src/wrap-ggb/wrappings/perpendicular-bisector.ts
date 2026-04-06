import { RegisterFun } from "../../shared/appApi";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { SignatureSpec, wrapIfMatching } from "../command-invocation";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kSignatures: Array<SignatureSpec> = [
  { argTypes: ["segment"] },
  { argTypes: ["point", "point"] },
];

export const register: RegisterFun = (mod, appApi) => {
  mod.PerpendicularBisector = new Sk.builtin.func(
    function PerpendicularBisector(...args) {
      return wrapIfMatching(
        appApi.ggb,
        kSignatures,
        "PerpendicularBisector",
        args
      );
    }
  );
};
