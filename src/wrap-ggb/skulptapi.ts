// This file doesn't know anything about PyGgb, the idea being that it
// might be useful elsewhere.

export interface SkObject {}

export interface SkBool extends SkObject {
  v: boolean;
}
export interface SkInt extends SkObject {
  v: number;
}
export interface SkFloat extends SkObject {
  v: number;
}
export interface SkString extends SkObject {
  v: string;
}

export interface SkList extends SkObject {
  v: Array<SkObject>;
}
export interface SkTuple extends SkObject {
  v: Array<SkObject>;
}

export interface SkObject {
  tp$setattr(
    this: SkObject,
    name: SkString,
    value: SkObject,
    canSuspend?: boolean
  ): SkObject;
}

// TODO: There are some "any"s left in this file.  Can we tighten?

export type KeywordArgsArray = Array<string | SkObject>;

type BuildNativeClassOptions = Partial<{
  constructor: any;
  proto: { [key: string]: any };
  slots: {
    tp$new: (args: Array<SkObject>, kwargs: KeywordArgsArray) => SkObject;
    [key: string]: any;
  };
  methods: { [key: string]: any };
  getsets: { [key: string]: any };
  classmethods: { [key: string]: any };
}>;

interface SkAbstrT {
  buildNativeClass: (className: string, opts: BuildNativeClassOptions) => any;
  checkArgsLen: (
    funcName: string,
    args: Array<SkObject>,
    minargs: number,
    maxargs: number
  ) => void;
}

type SkJavaScriptFunction = (...args: Array<SkObject>) => SkObject;

type SkNoneT = {
  none$: SkObject;
};

type SkBuiltinT = {
  int_: { new (obj: any): SkInt };
  float_: { new (obj: any): SkFloat };
  str: { new (obj: any): SkString };
  bool: { new (obj: any): SkBool };
  func: { new (f: SkJavaScriptFunction): SkObject };
  list: { new (xs: SkObject | Array<SkObject>): SkList };
  tuple: { new (xs: SkObject | Array<SkObject>): SkTuple };

  RuntimeError: { new (message: string): SkObject };
  TypeError: { new (message: string): SkObject };
  ValueError: { new (message: string): SkObject };
  SystemExit: { new (): SkObject };

  isinstance(obj: SkObject, cls: SkObject): SkBool;

  checkNumber(obj: SkObject): obj is SkInt | SkFloat;
  checkBool(obj: SkObject): obj is SkBool;
  checkString(obj: SkObject): obj is SkString;

  none: SkNoneT;
};

type SkMiscEvalT = {
  isTrue: (obj: SkObject) => boolean;
  callsimOrSuspend: (fun: any) => any;
  arrayFromIterable: (obj: SkObject) => Array<SkObject>;
  promiseToSuspension(p: Promise<SkObject>): any;
};

type SkFfiT = {
  remapToJs(x: SkObject): any;
};

export type SkulptApi = {
  abstr: SkAbstrT;
  builtin: SkBuiltinT;
  misceval: SkMiscEvalT;
  ffi: SkFfiT;
};

declare var Sk: SkulptApi;

type AugmentedSkulptApi = {
  checkList(x: SkObject): x is SkList;
  checkTuple(x: SkObject): x is SkTuple;
  checkInt(x: SkObject): x is SkInt;
  checkFloat(x: SkObject): x is SkFloat;
};

export const augmentedSkulptApi: AugmentedSkulptApi = {
  checkList(x: SkObject): x is SkList {
    return x instanceof Sk.builtin.list;
  },
  checkTuple(x: SkObject): x is SkTuple {
    return x instanceof Sk.builtin.tuple;
  },
  checkInt(x: SkObject): x is SkInt {
    return x instanceof Sk.builtin.int_;
  },
  checkFloat(x: SkObject): x is SkFloat {
    return x instanceof Sk.builtin.float_;
  },
};
