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
