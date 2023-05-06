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

export interface SkTracebackEntry {
  lineno: number;
  colno: number;
  filename: string;
}

export interface SkBaseException extends SkObject {
  args: SkTuple;
  traceback: Array<SkTracebackEntry>;
}

export interface SkObject {
  tp$name: string;
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

type SkSuspension = {
  $isSuspension: true;
};

type SkJavaScriptFunction = (...args: Array<SkObject>) => SkObject;

type SkNoneT = {
  none$: SkObject;
};

type SkBuiltinT = {
  int_: SkObject & { new (obj: any): SkInt };
  float_: SkObject & { new (obj: any): SkFloat };
  str: SkObject & { new (obj: any): SkString };
  bool: SkObject & { new (obj: any): SkBool };
  func: SkObject & { new (f: SkJavaScriptFunction): SkObject };
  list: SkObject & { new (xs: SkObject | Array<SkObject>): SkList };
  tuple: SkObject & { new (xs: SkObject | Array<SkObject>): SkTuple };

  RuntimeError: SkObject & { new (message: string): SkObject };
  TypeError: SkObject & { new (message: string): SkObject };
  ValueError: SkObject & { new (message: string): SkObject };
  SystemExit: SkObject & { new (): SkObject };

  isinstance(obj: SkObject, cls: SkObject): SkBool;

  checkNumber(obj: SkObject): obj is SkInt | SkFloat;
  checkBool(obj: SkObject): obj is SkBool;
  checkString(obj: SkObject): obj is SkString;
  checkIterable(obj: SkObject): boolean; // TODO: Type predicate?

  none: SkNoneT;
};

type SkMiscEvalT = {
  isTrue: (obj: SkObject) => boolean;
  callsimOrSuspend: (fun: any) => any;
  arrayFromIterable: (obj: SkObject) => Array<SkObject>;
  promiseToSuspension(p: Promise<SkObject>): any;
  asyncToPromise<T>(f: () => T): Promise<T>;
};

type SkFfiT = {
  remapToJs(x: SkObject): any;
};

export type SkulptApi = {
  abstr: SkAbstrT;
  builtin: SkBuiltinT;
  misceval: SkMiscEvalT;
  ffi: SkFfiT;

  configure(options: object): void;
  python3: object;

  importMainWithBody(
    name: string,
    dumpJS: boolean,
    body: string,
    canSuspend: boolean
  ): void;

  builtinFiles?: { files: { [filename: string]: string } };
};

declare var Sk: SkulptApi;

type AugmentedSkulptApi = {
  checkString(x: SkObject): x is SkString;
  checkList(x: SkObject): x is SkList;
  checkTuple(x: SkObject): x is SkTuple;
  checkInt(x: SkObject): x is SkInt;
  checkFloat(x: SkObject): x is SkFloat;
};

export const augmentedSkulptApi: AugmentedSkulptApi = {
  checkString(x: SkObject): x is SkString {
    return x instanceof Sk.builtin.str;
  },
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
