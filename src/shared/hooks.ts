import React, { useEffect } from "react";

type FetchResult =
  | { status: "failed" }
  | { status: "succeeded"; data: unknown };

type FetchState = { status: "idle" | "pending" } | FetchResult;

type FetchStatus = FetchState["status"];

let cache = new Map<string, FetchResult>();

export const useJsonResource = (url: string): FetchState => {
  const mData = cache.get(url);
  const status0 = mData == null ? "idle" : mData.status;
  const data0 = mData == null || mData.status === "failed" ? null : mData.data;

  const [status, setStatus] = React.useState<FetchStatus>(status0);
  const [data, setData] = React.useState<unknown | null>(data0);

  useEffect(() => {
    if (status !== "idle") return;

    (async () => {
      setStatus("pending");
      try {
        const response = await fetch(url);
        const obj = await response.json();
        cache.set(url, { status: "succeeded", data: obj });
        setData(obj);
        setStatus("succeeded");
      } catch {
        setStatus("failed");
      }
    })();
  });

  switch (status) {
    case "idle":
    case "pending":
    case "failed":
      return { status };
    case "succeeded":
      return { status, data };
  }
};
