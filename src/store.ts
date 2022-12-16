import { createStore, createTypedHooks } from "easy-peasy";
import { PyGgbModel, pyGgbModel } from "./model";

const { useStoreActions, useStoreState, useStoreDispatch } =
  createTypedHooks<PyGgbModel>();

export { useStoreActions, useStoreDispatch, useStoreState };

export const store = createStore(pyGgbModel);
