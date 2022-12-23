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

  async ensureUserFilesNonEmpty() {
    const nFiles = await this.userFiles.count();
    if (nFiles === 0) {
      await this.userFiles.add({
        name: "Untitled",
        codeText: "# Start writing your code!",
        mtime: Date.now(),
      });
    }
  }

  async mostRecentlyOpenedPreview(): Promise<UserFilePreview> {
    const recentFileArray = await this.userFiles
      .toCollection()
      .reverse()
      .limit(1)
      .sortBy("mtime");

    const mostRecentFile = recentFileArray[0];

    return {
      id: mostRecentFile.id!,
      name: mostRecentFile.name,
    };
  }
}

// TODO: Need some thought as to what the user experience is when they
// first come to the app.  Would be annoying if they had to create a new
// file before doing anything, but annoying for us if we had to handle
// two different backing states: temp-unnamed-file vs dexie-stored.  And
// what if they closed tab before saving?  Keep track of
// "explicitly-saved" flag per project?  Something a bit like Emacs's
// *scratch* buffer, but preserved from one session to the next? Special
// filename with a character which isn't allowed for user files?  Or
// just one they'd have to on purpose choose to overwrite?
//
// Just need something half-reasonable for initial tech PoC.
//
// Boots with most recently opened file in editor.  If list of files
// empty, create one called "Untitled" --- that can be a boot/dependency
// action.

export const db = new PyGgbDexie();
