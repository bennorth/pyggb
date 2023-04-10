import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  WrapExistingCtorSpec,
  SkGgbObject,
  AugmentedGgbApi,
} from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi;

interface SkGgbParabola extends SkGgbObject {
  focus: SkGgbObject;
  directrix: SkGgbObject;
}

type SkGgbParabolaCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "focus-directrix";
      focus: SkGgbObject;
      directrix: SkGgbObject;
    };

export const register = (mod: any, appApi: AppApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Parabola", {
    constructor: function Parabola(
      this: SkGgbParabola,
      spec: SkGgbParabolaCtorSpec
    ) {
      // TODO: This is messy; tidy up:
      if (spec.kind === "wrap-existing") {
        this.$ggbLabel = spec.label;
        return;
      }

      switch (spec.kind) {
        case "focus-directrix":
          // TODO: Check focus is a point and directrix is a line.  Where does
          // that check belong?
          const ggbArgs = `${spec.focus.$ggbLabel},${spec.directrix.$ggbLabel}`;
          const ggbCmd = `Parabola(${ggbArgs})`;
          const lbl = ggb.evalCmd(ggbCmd);
          this.$ggbLabel = lbl;
          this.focus = spec.focus;
          this.directrix = spec.directrix;
          console.log("Made Parabola?", lbl, spec);
          break;
        default:
          throw new Sk.builtin.RuntimeError(
            `bad Parabola spec.kind "${(spec as any).kind}"`
          );
      }
    },
    slots: {
      tp$new(args, _kwargs) {
        if (args.length !== 2)
          throw new Sk.builtin.TypeError("expected 2 args for Parabola()");
        ggb.throwIfNotGgbObjectOfType(args[0], "point", "Parabola ctor arg[0]");
        ggb.throwIfNotGgbObjectOfType(args[1], "line", "Parabola ctor arg[1]");

        return new mod.Parabola({
          kind: "focus-directrix",
          focus: args[0],
          directrix: args[1],
        });
      },
    },
    methods: {
      ...ggb.freeCopyMethodsSlice,
    },
    getsets: {
      color: ggb.sharedGetSets.color,
      color_ints: ggb.sharedGetSets.color_ints,
      color_floats: ggb.sharedGetSets.color_floats,
      line_thickness: ggb.sharedGetSets.line_thickness,
    },
  });
  mod.Parabola = cls;
  registerObjectType("parabola", cls);
};
