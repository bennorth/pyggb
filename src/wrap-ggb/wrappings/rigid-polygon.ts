import { RegisterFun } from "../../shared/appApi";
import { assembledCommand, kPolygonTypeAndSubtypes } from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import {
  ggbArgumentStrsFromIterable,
  SignatureSpec,
  wrapIfMatching,
} from "../command-invocation";
import { GgbApi } from "../../shared/vendor-types/ggbapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kCommandName = "RigidPolygon";

const makePointIterableCommand = (ggb: GgbApi, args: Array<SkObject>) => {
  const pointLbls = ggbArgumentStrsFromIterable(ggb, args[0]);
  return assembledCommand(kCommandName, pointLbls);
};

const kSignatures: Array<SignatureSpec> = [
  { argTypes: [kPolygonTypeAndSubtypes] },
  { argTypes: [kPolygonTypeAndSubtypes, "either-number", "either-number"] },
  {
    argTypes: [{ kind: "iterable", elementType: "point" }],
    ggbCommand: makePointIterableCommand,
    returnsMultiple: "take-first",
  },
];

export const register: RegisterFun = (mod, appApi) => {
  mod.RigidPolygon = new Sk.builtin.func(function RigidPolygon(...args) {
    return wrapIfMatching(appApi.ggb, kSignatures, kCommandName, args);
  });
};
