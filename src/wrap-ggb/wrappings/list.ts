import { RegisterFun } from "../../shared/appApi";
import { augmentedGgbApi, SkGgbObject } from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";
import {
  constructIfMatching,
  ggbArgumentStr,
  SignatureSpec,
} from "../command-invocation";
import { GgbApi } from "../../shared/vendor-types/ggbapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

interface SkGgbList extends SkGgbObject {
  $length: (this: SkGgbList) => number;
}

const makeEmptyCommand = (_ggb: GgbApi, _args: Array<SkObject>) => "{}";

const makeIterableCommand = (ggb: GgbApi, args: Array<SkObject>) => {
  const elements = Sk.misceval.arrayFromIterable(args[0]);
  const elementLabels = elements.map((elt) => ggbArgumentStr(ggb, elt));
  const ggbCmd = `{${elementLabels.join(",")}}`;
  return ggbCmd;
};

const kCtorSignatures: Array<SignatureSpec> = [
  { argTypes: [], ggbCommand: makeEmptyCommand },
  {
    argTypes: [{ kind: "iterable", elementType: "ggb-object" }],
    ggbCommand: makeIterableCommand,
  },
];

export const register: RegisterFun = (mod, appApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("List", {
    constructor: function List(this: SkGgbList, ggbLabel: string) {
      this.$ggbLabel = ggbLabel;
    },
    proto: {
      $length(this: SkGgbList) {
        const ggbCmd = `Length(${this.$ggbLabel})`;
        const ggbLabel = ggb.evalCmd(ggbCmd);
        const nElts = ggb.getValue(ggbLabel);
        ggb.deleteObject(ggbLabel);
        return nElts;
      },
    },
    slots: {
      tp$new(args) {
        // In fact the ggbCommand arg ("List") is unused, because
        // the specs have custom ggbCommand()s, but provide it anyway.
        return constructIfMatching(
          appApi.ggb,
          kCtorSignatures,
          "List",
          args,
          cls
        );
      },
      sq$length(this: SkGgbList) {
        return this.$length();
      },
      mp$subscript(pyIndex) {
        const nElts = this.$length();
        const rawIdx0b = Sk.misceval.asIndexSized(pyIndex);
        const idx0b = rawIdx0b >= 0 ? rawIdx0b : rawIdx0b + nElts;
        if (idx0b < 0 || idx0b >= nElts) {
          throw new Sk.builtin.IndexError("List object index out of range");
        }

        const idx1b = idx0b + 1;
        const ggbCmd = `${this.$ggbLabel}(${idx1b})`;
        const eltLabel = ggb.evalCmd(ggbCmd);
        return ggb.wrapExistingGgbObject(eltLabel);
      },
    },
  });

  mod.List = cls;
  registerObjectType("list", cls);
};
