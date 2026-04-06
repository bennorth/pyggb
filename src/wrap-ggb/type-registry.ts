import { GgbApi, GgbObjectType } from "../shared/vendor-types/ggbapi";
import { SkGgbObject } from "./shared";
import { SkulptApi } from "../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi; // eslint-disable-line no-var

type ConstructibleFromLabel = {
  new (label: string): SkGgbObject;
};

let registry = new Map<GgbObjectType, ConstructibleFromLabel>();

/** Register the given `cls` as being the Skulpt/Python wrapper class
 * for GeoGebra objects whose type has the given `typeName`. */
export const registerObjectType = (
  typeName: GgbObjectType,
  cls: ConstructibleFromLabel
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

  return new maybeCls(objectLabel);
};
