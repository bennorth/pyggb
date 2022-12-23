import Dexie, { Table } from "dexie";

export type UserFile = {
  id?: number;
  name: string;
  codeText: string;
  mtime: number;
};

export type UserFileUpdate = Required<Pick<UserFile, "id" | "codeText">>;
export type UserFilePreview = Required<Pick<UserFile, "id" | "name">>;
