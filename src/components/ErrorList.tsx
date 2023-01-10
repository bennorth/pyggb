import React from "react";
import { Alert } from "react-bootstrap";
import { PyError, TracebackEntry } from "../shared/appApi";
import { messageOfPyError } from "../shared/skulpt-interaction";
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

type ErrorReportProps = { error: PyError };
const ErrorReport: React.FC<ErrorReportProps> = ({ error }) => {
  // Get traceback with deepest frame last.
  let traceback = error.traceback.slice();
  traceback.reverse();

  return (
    <Alert variant="danger">
      <p>{messageOfPyError(error)}</p>
      <ul>
        {traceback.map((entry, i) => (
          <li key={i}>
            <TracebackEntryItem entry={entry} />
          </li>
        ))}
      </ul>
    </Alert>
  );
};

export const ErrorList: React.FC<{}> = () => {
  const errors = useStoreState((s) => s.pyErrors.errors);

  return (
    <div className="ErrorList abs-0000">
      <div className="error-list-inner">
        <h1>Your program has a problem:</h1>
        <ul>
          {errors.map((e, i) => (
            <li key={i}>
              <ErrorReport error={e} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
