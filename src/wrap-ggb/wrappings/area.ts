import { RegisterFun } from "../../shared/appApi";
import { kPolygonTypeAndSubtypes } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { SignatureSpec, wrapIfMatching } from "../command-invocation";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kSignatures: Array<SignatureSpec> = [
  { argTypes: [["circle", "ellipse", ...kPolygonTypeAndSubtypes]] },
  { argTypes: { atLeast: 3, ofType: "point" } },
];

export const register: RegisterFun = (mod, appApi) => {
  mod.Area = new Sk.builtin.func(function Area(...args) {
    return wrapIfMatching(appApi.ggb, kSignatures, "Area", args);
  });
};
