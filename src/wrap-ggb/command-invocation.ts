import { GgbApi } from "../shared/vendor-types/ggbapi";
import { SkObject, SkulptApi } from "../shared/vendor-types/skulptapi";
import {
  assembledCommand,
  isGgbObject,
  strOfNumber,
} from "./shared";

declare var Sk: SkulptApi; // eslint-disable-line no-var

////////////////////////////////////////////////////////////////////////
// Utilities to construct a command string.

// TODO: Remove duplication with argumentString()?
export const ggbArgumentStr = (ggb: GgbApi, x: SkObject): string => {
  if (isGgbObject(ggb, x)) {
    return x.$ggbLabel;
  }

  if (Sk.builtin.checkNumber(x)) {
    return strOfNumber(x.v);
  }

  throw new Sk.builtin.RuntimeError(
    "internal error: bad Python type for GeoGebra argument"
  );
};

const cmdWithArgs = (
  ggb: GgbApi,
  ggbCommandName: string,
  pyArgs: Array<SkObject>
): string => {
  const ggbArgStrs = pyArgs.map((pyArg) => ggbArgumentStr(ggb, pyArg));
  const ggbFullCmd = assembledCommand(ggbCommandName, ggbArgStrs);
  return ggbFullCmd;
};
