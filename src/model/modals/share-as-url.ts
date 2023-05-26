import { AsyncZlibOptions, zlib } from "fflate";

type ShareAsUrlState =
  | { kind: "idle" }
  | { kind: "computing" }
  | { kind: "ready"; url: string };

const idleState: ShareAsUrlState = { kind: "idle" };

function zlibCompress(
  data: Uint8Array,
  opts: AsyncZlibOptions
): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    zlib(data, opts, (err, data) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
