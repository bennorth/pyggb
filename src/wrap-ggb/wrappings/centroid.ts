import { RegisterFun } from "../../shared/appApi";
import { kPolygonTypeAndSubtypes } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { SignatureSpec, wrapIfMatching } from "../command-invocation";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kSignatures: Array<SignatureSpec> = [
  { argTypes: [kPolygonTypeAndSubtypes] },
];

export const register: RegisterFun = (mod, appApi) => {
  mod.Centroid = new Sk.builtin.func((...args) =>
    wrapIfMatching(appApi.ggb, kSignatures, "Centroid", args)
  );
};
