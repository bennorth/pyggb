import { RegisterFun } from "../../shared/appApi";
import { augmentedGgbApi, AugmentedGgbApi } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const predicateFun = (
    ggbCommand: string,
    requiredNArgs: number,
    requiredArgGgbType: string | undefined
  ) =>
    new Sk.builtin.func((...args) => {
      const requiredArgsHelp =
        "(" +
        Array.from({ length: requiredNArgs })
          .map(() => requiredArgGgbType ?? "object")
          .join(", ") +
        ")";

      const badArgsError = new Sk.builtin.TypeError(
        `${ggbCommand}() arguments must be ${requiredArgsHelp}`
      );

      if (args.length != requiredNArgs) {
        throw badArgsError;
      }

      if (requiredArgGgbType == null) {
        if (!ggb.everyElementIsGgbObject(args)) {
          throw badArgsError;
        }
      } else {
        if (!ggb.everyElementIsGgbObjectOfType(args, requiredArgGgbType)) {
          throw badArgsError;
        }
      }

      return ggb.existingFromCmdAndGgbArgs(ggbCommand, args);
    });

  mod.AreCollinear = predicateFun("AreCollinear", 3, "point");
  mod.AreConcurrent = predicateFun("AreConcurrent", 3, "line");
  mod.AreConcyclic = predicateFun("AreConcyclic", 4, "point");
  mod.AreCongruent = predicateFun("AreCongruent", 2, undefined);
  mod.AreEqual = predicateFun("AreEqual", 2, undefined);
  mod.AreParallel = predicateFun("AreParallel", 2, "line");
  mod.ArePerpendicular = predicateFun("ArePerpendicular", 2, "line");
};
