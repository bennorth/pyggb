import Dexie, { Table } from "dexie";
import { SemaphoreItem } from "./semaphore";

export type UserFile = {
  id?: number;
  name: string;
  codeText: string;
  mtime: number;
};

export type UserFileUpdate = Required<Pick<UserFile, "id" | "codeText">>;
export type UserFilePreview = Required<Pick<UserFile, "id" | "name">>;

export type NewFileDescriptor = {
  name: string;
  codeText?: string;
};

const kDefaultCodeText = "# Start writing your code!\n";

export class PyGgbDexie extends Dexie {
  userFiles!: Table<UserFile>;
  semaphore: SemaphoreItem;

  constructor() {
    super("pyggb");
    this.version(1).stores({
      userFiles: "++id,name",
    });

    this.semaphore = new SemaphoreItem(1);
  }

  async withLock<T extends () => any>(fun: T): Promise<Awaited<ReturnType<T>>> {
    try {
      await this.semaphore.acquire();
      return await fun();
    } finally {
      this.semaphore.release();
    }
  }

  async allFiles(): Promise<Array<UserFilePreview>> {
    let allFiles = await this.userFiles
      .toCollection()
      .reverse()
      .sortBy("mtime");
    return allFiles as Array<UserFilePreview>;
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

  async getFile(id: number) {
    return await this.userFiles.get(id);
  }

  async mostRecentlyOpenedPreview(): Promise<UserFilePreview> {
    const mostRecentFile = await (async () => {
      let mostRecent: UserFilePreview | null = null;
      let mostRecentMtime: number = 0;
      await this.userFiles.each((uf) => {
        if (uf.mtime > mostRecentMtime) {
          mostRecentMtime = uf.mtime;
          mostRecent = { id: uf.id!, name: uf.name };
        }
      });

      // https://github.com/microsoft/TypeScript/issues/11498
      return mostRecent as UserFilePreview | null;
    })();

    if (mostRecentFile == null) {
      throw new Error("userFiles empty");
    }

    return {
      id: mostRecentFile.id!,
      name: mostRecentFile.name,
    };
  }

  async updateFile(update: UserFileUpdate) {
    const currentValue = await this.userFiles.get(update.id);
    if (currentValue == null) {
      console.error(`could not find UserFile ${update.id} for update`);
      return;
    }

    const newValue = {
      id: currentValue.id,
      name: currentValue.name,
      codeText: update.codeText,
      mtime: Date.now(),
    };

    await this.userFiles.put(newValue);
  }

  async createNewFile(descriptor: NewFileDescriptor): Promise<UserFilePreview> {
    const codeText = descriptor.codeText ?? kDefaultCodeText;
    const newFile = {
      name: descriptor.name,
      codeText,
      mtime: Date.now(),
    };

    const newFileId = (await this.userFiles.add(newFile)) as number;
    return { id: newFileId, name: descriptor.name };
  }

  // TODO: What happens if a renameFile() call and a updateFile() call
  // try to run at the same time?

  async renameFile(id: number, newName: string): Promise<void> {
    // TODO: Error handling if no such file.
    const existingFile = await this.userFiles.get(id);
    if (existingFile == null) {
      console.error(`could not find file with id ${id}`);
      return;
    }

    // TODO: Would a user expect a rename operation to update the mtime?
    const newFile: UserFile = {
      ...existingFile,
      name: newName,
      mtime: Date.now(),
    };

    await this.userFiles.put(newFile);
  }

  async deleteFile(id: number): Promise<void> {
    await this.userFiles.delete(id);
  }
}

// Boots with most recently opened file in editor.  If list of files
// empty, create one called "Untitled" --- that can be a boot/dependency
// action.

export const db = new PyGgbDexie();
