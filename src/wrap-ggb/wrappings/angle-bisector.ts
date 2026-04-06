import { RegisterFun } from "../../shared/appApi";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { SignatureSpec, wrapIfMatching } from "../command-invocation";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kSignatures: Array<SignatureSpec> = [
  { argTypes: ["line", "line"], returnsMultiple: "take-all" },
  { argTypes: ["point", "point", "point"] },
];

export const register: RegisterFun = (mod, appApi) => {
  mod.AngleBisector = new Sk.builtin.func((...args) =>
    wrapIfMatching(appApi.ggb, kSignatures, "AngleBisector", args)
  );
};
