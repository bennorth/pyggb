import Dexie, { Table } from "dexie";

export type UserFile = {
  id?: number;
  name: string;
  codeText: string;
  mtime: number;
};

export type UserFileUpdate = Required<Pick<UserFile, "id" | "codeText">>;
export type UserFilePreview = Required<Pick<UserFile, "id" | "name">>;

export class PyGgbDexie extends Dexie {
  userFiles!: Table<UserFile>;

  constructor() {
    super("pyggb");
    this.version(1).stores({
      userFiles: "++id,name",
    });
  }
}

export const db = new PyGgbDexie();
