import { RegisterFun } from "../../shared/appApi";
import { AugmentedGgbApi, augmentedGgbApi } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

const kArgTypes = [
  "arc",
  "circle",
  "ellipse",
  "polygon",
  "triangle",
  "quadrilateral",
  "pentagon",
  "hexagon",
];

export const register: RegisterFun = (mod, appApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    const badArgsError = new Sk.builtin.TypeError(
      "Perimeter() arguments must be (circle), or (ellipse), or (polygon)"
    );

    switch (args.length) {
      case 1: {
        if (!ggb.everyElementIsGgbObjectOfSomeType(args, kArgTypes)) {
          throw badArgsError;
        }
        return ggb.existingFromCmdAndGgbArgs("Perimeter", args);
      }
      default:
        throw badArgsError;
    }
  });

  mod.Perimeter = fun;
};
