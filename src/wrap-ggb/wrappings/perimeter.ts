import { RegisterFun } from "../../shared/appApi";
import { kPolygonTypeAndSubtypes } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { SignatureSpec, wrapIfMatching } from "../command-invocation";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kSignatures: Array<SignatureSpec> = [
  { argTypes: [["arc", "circle", "ellipse", ...kPolygonTypeAndSubtypes]] },
];

export const register: RegisterFun = (mod, appApi) => {
  mod.Perimeter = new Sk.builtin.func(function Perimeter(...args) {
    return wrapIfMatching(appApi.ggb, kSignatures, "Perimeter", args);
  });
};
