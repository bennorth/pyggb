import { Action, Thunk, thunk } from "easy-peasy";
import { propSetterAction } from "../../shared/utils";
import { PyGgbModel } from "..";
import { AsyncInflateOptions, decompress, strFromU8, strToU8 } from "fflate";
import { decode as stringFromUtf8BinaryString } from "utf8";
import { decode as binaryStringFromB64String } from "base-64";
import { URLSearchParams } from "url";

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
  | { kind: "failed" }
  | { kind: "offering"; name: string; codeText: string };

const idleState: NewFileFromQueryState = { kind: "idle" };

export type NewFileFromQuery = {
  state: NewFileFromQueryState;
  setState: Action<NewFileFromQuery, NewFileFromQueryState>;

  bootFromSearchParams: Thunk<NewFileFromQuery, URLSearchParams>;
  acceptOffer: Thunk<NewFileFromQuery, void, any, PyGgbModel>;
  rejectOffer: Thunk<NewFileFromQuery>;
};

export let newFileFromQuery: NewFileFromQuery = {
  state: idleState,
  setState: propSetterAction("state"),

  bootFromSearchParams: thunk(async (actions, urlSearchParams) => {
    const name = urlSearchParams.get("name");
    const mB64Code = urlSearchParams.get("code");
    if (name == null || mB64Code == null) {
      return;
    }

    const publicUrl = process.env.PUBLIC_URL;
    const rootUrl = publicUrl === "" ? "/" : publicUrl;
    window.history.replaceState(null, "", rootUrl);
    actions.setState({ kind: "preparing" });

    try {
      // See comment in share-as-url.ts regarding the dancing back and
      // forth with data types and representations here.
      const bstrZlibCode = binaryStringFromB64String(mB64Code);
      const u8sCode = await zlibDecompress(strToU8(bstrZlibCode, true), {});
      const codeText = stringFromUtf8BinaryString(strFromU8(u8sCode));

      actions.setState({ kind: "offering", name, codeText });
    } catch (err) {
      console.error("newFileFromQuery():", err);
      actions.setState({ kind: "failed" });
    }
  }),

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

export function previewFromString(text: string, nChars: number): string {
  return text.length <= nChars ? text : text.substring(0, nChars - 1) + "…";
}

type CodePreviewLine =
  | { kind: "code"; content: string }
  | { kind: "ellipsis"; content: "⋮" };

export function previewFromFullCode(
  codeText: string,
  nLines: number,
  nCharsPerLine: number
): Array<CodePreviewLine> {
  const allLines = codeText.split("\n");
  const lines = allLines.slice(0, nLines);

  const trimmedLines: Array<CodePreviewLine> = lines.map((line) => ({
    kind: "code",
    content: previewFromString(line, nCharsPerLine),
  }));

  const extraLines: Array<CodePreviewLine> =
    allLines.length > nLines ? [{ kind: "ellipsis", content: "⋮" }] : [];

  return trimmedLines.concat(extraLines);
}
