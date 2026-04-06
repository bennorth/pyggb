import { RegisterFun } from "../../shared/appApi";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import {
  ScalarArgType,
  SignatureSpec,
  wrapIfMatching,
} from "../command-invocation";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kEllipseTypes: Array<ScalarArgType> = ["ellipse", "circle"];

const kConicTypes: Array<ScalarArgType> = [
  "conic",
  "ellipse",
  "circle",
  "parabola",
  "hyperbola",
];

const kSignatures: Array<SignatureSpec> = [
  { argTypes: [["point", "line"], kConicTypes], returnsMultiple: "take-all" },
  { argTypes: [kEllipseTypes, kEllipseTypes], returnsMultiple: "take-all" },
  {
    argTypes: [
      ["point", "either-number"],
      ["function", "parabola"],
    ],
  },
];

export const register: RegisterFun = (mod, appApi) => {
  mod.Tangent = new Sk.builtin.func(function Tangent(...args) {
    return wrapIfMatching(appApi.ggb, kSignatures, "Tangent", args);
  });
};
