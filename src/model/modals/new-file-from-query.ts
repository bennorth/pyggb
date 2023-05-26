import { Action, Thunk, thunk } from "easy-peasy";
import { propSetterAction } from "../../shared/utils";
import { AsyncInflateOptions, decompress } from "fflate";

function zlibDecompress(
  data: Uint8Array,
  opts: AsyncInflateOptions
): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    decompress(data, opts, (err, data) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

type NewFileFromQueryState =
  | { kind: "idle" }
  | { kind: "preparing" }
  | { kind: "offering"; name: string; codeText: string };

const idleState: NewFileFromQueryState = { kind: "idle" };

export type NewFileFromQuery = {
  state: NewFileFromQueryState;
  setState: Action<NewFileFromQuery, NewFileFromQueryState>;
};

export let newFileFromQuery: NewFileFromQuery = {
  state: idleState,
  setState: propSetterAction("state"),
};
