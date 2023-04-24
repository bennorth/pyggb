import { Actions, Helpers, Thunk, thunk } from "easy-peasy";
import { db } from "../shared/db";

export function thunkWithDbLock<
  Model extends object,
  Payload,
  Injections,
  StoreModel extends object,
  Result
>(
  f: (
    actions: Actions<Model>,
    payload: Payload,
    helpers: Helpers<Model, StoreModel, Injections>
  ) => Result
): Thunk<Model, Payload, Injections, StoreModel, Promise<Awaited<Result>>> {
  return thunk((actions, payload, helpers) =>
    db.withLock(() => f(actions, payload, helpers))
  );
}
