import { Action, Thunk, thunk } from "easy-peasy";
import { propSetterAction } from "../../shared/utils";
import { AsyncZlibOptions, strToU8, strFromU8, zlib } from "fflate";
import { encode as utf8BinaryStringFromString } from "utf8";
import { encode as b64StringFromBinaryString } from "base-64";
import { publicIndexUrl } from "../index-url";

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

type LaunchArgs = {
  name: string;
  codeText: string;
};

export type ShareAsUrl = {
  state: ShareAsUrlState;
  setState: Action<ShareAsUrl, ShareAsUrlState>;

  launch: Thunk<ShareAsUrl, LaunchArgs>;
  close: Thunk<ShareAsUrl>;
};

export let shareAsUrl: ShareAsUrl = {
  state: idleState,
  setState: propSetterAction("state"),

  launch: thunk(async (a, args) => {
    a.setState({ kind: "computing" });

    // This is not very elegant.  The base-64 library works with "binary
    // strings", i.e., JavaScript strings where every codepoint is
    // <=0xff.  The zlib library works with Uint8Arrays.  The utility
    // functions strToU8() and strFromU8() take a second "latin1"
    // argument, which achieves pass-through of all 8-bit values.  All
    // in all, there's quite a lot of back/forth here which could be
    // cleaned up by rewriting some of the utilities.

    const bstrCode = utf8BinaryStringFromString(args.codeText);
    const u8sZlibCode = await zlibCompress(strToU8(bstrCode), {});
    const pCode = b64StringFromBinaryString(strFromU8(u8sZlibCode, true));

    let url = publicIndexUrl();
    url.searchParams.set("name", args.name);
    url.searchParams.set("code", pCode);

    a.setState({ kind: "ready", url: url.toString() });
  }),

  close: thunk((a) => {
    a.setState(idleState);
  }),
};
