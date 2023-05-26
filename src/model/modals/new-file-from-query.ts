import { Action, Thunk, thunk } from "easy-peasy";
import { propSetterAction } from "../../shared/utils";
import { PyGgbModel } from "..";
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

  acceptOffer: Thunk<NewFileFromQuery, void, any, PyGgbModel>;
  rejectOffer: Thunk<NewFileFromQuery>;
};

export let newFileFromQuery: NewFileFromQuery = {
  state: idleState,
  setState: propSetterAction("state"),

  acceptOffer: thunk(async (a, _voidPayload, helpers) => {
    const state = helpers.getState().state;
    if (state.kind !== "offering") {
      throw new Error("acceptOffer(): not offering");
    }

    const descriptor = { name: state.name, codeText: state.codeText };
    await helpers.getStoreActions().editor.createNew(descriptor);
    a.setState(idleState);
  }),

  rejectOffer: thunk((a) => {
    a.setState(idleState);
  }),
};
