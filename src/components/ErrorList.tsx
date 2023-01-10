import React from "react";
import { TracebackEntry } from "../shared/skulpt-interaction";
import { useStoreState } from "../store";

type TracebackEntryItemProps = { entry: TracebackEntry };
const TracebackEntryItem: React.FC<TracebackEntryItemProps> = ({ entry }) => {
  const rawSource = entry.filename;
  const source = rawSource === "<stdin>.py" ? "your program" : rawSource;

  // Map linenumber back to the user's original program by taking
  // account of the "from ggb import *" we inserted at the start when
  // sending to Skulpt.
  const userLineNumber = entry.lineno - 2;

  return (
    <p>
      line {userLineNumber} (position {entry.colno}) of {source}
    </p>
  );
};

export const ErrorList: React.FC<{}> = () => {
  const errors = useStoreState((s) => s.pyErrors.errors);

  return (
    <div className="ErrorList abs-0000">
      <div className="error-list-inner">
        <h1>Your program has a problem:</h1>
      </div>
    </div>
  );
};
