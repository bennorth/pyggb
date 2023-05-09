import { GgbApi } from "../shared/vendor-types/ggbapi";
import { WrapExistingCtorSpec, SkGgbObject } from "./shared";
import { SkulptApi } from "../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi;

type ConstructibleFromWrapExistingSpec = {
  new (spec: WrapExistingCtorSpec): SkGgbObject;
};

let registry = new Map<string, ConstructibleFromWrapExistingSpec>();

/** Register the given `cls` as being the Skulpt/Python wrapper class
 * for GeoGebra objects whose type has the given `typeName`. */
export const registerObjectType = (
  typeName: string,
  cls: ConstructibleFromWrapExistingSpec
): void => {
  registry.set(typeName, cls);
};

/** Create and return a new Skulpt/Python object wrapping the GeoGebra
 * object with the given `objectLabel`. */
export const wrapExistingGgbObject = (
  ggbApi: GgbApi,
  objectLabel: string
): SkGgbObject => {
  const objectType = ggbApi.getObjectType(objectLabel);
  const maybeCls = registry.get(objectType);
  if (maybeCls == null)
    throw new Sk.builtin.RuntimeError(
      `unknown object-type "${objectType}"` +
        ` when trying to wrap ggb object "${objectLabel}"`
    );

  return new maybeCls({ kind: "wrap-existing", label: objectLabel });
};
