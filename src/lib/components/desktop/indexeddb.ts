import Dexie from "dexie";

export type FileEntity = {
  blob: Blob;
  path: string;
  type: "file";
  storage: "indexeddb";
};

type Dir = Pick<FileEntity, "path" | "storage"> & {
  type: "dir";
};

export type DBEntity = Dir | FileEntity;

class FolderDatabase extends Dexie {
  folders: Dexie.Table<DBEntity, string>;

  constructor() {
    super("FolderDatabase");
    this.version(1).stores({
      folders: "path, blob", // path will be the primary key
    });

    this.folders = this.table("folders");
  }
}

// TODO employ better error propagation and handling.
export const persistItem = async <T extends DBEntity>(
  db: FolderDatabase,
  args: T
): Promise<void> => {
  try {
    if (args.type === "file") {
      let blob = new Blob([args.blob], { type: "text/plain" });

      await db.folders.add({
        path: args.path,
        blob,
        type: "file",
        storage: "indexeddb",
      });
    } else {
      await db.folders.add({
        path: args.path,
        type: "dir",
        storage: "indexeddb",
      });
    }
  } catch (error) {
    if ((error as typeof Dexie.ModifyError).name === "ConstraintError") {
      console.error("This folder path already exists.");

      throw error;
    } else {
      console.error("Failed to add folder:", error);
    }
  }
};

export async function getAllDbEntities(db: FolderDatabase) {
  try {
    const entities = await db.folders.toArray();

    return entities;
  } catch (error) {
    console.error("Failed to retrieve folders:", error);
    return null;
  }
}

export { FolderDatabase };
