import Dexie from "dexie";

type FileItem = {
  blob: Blob;
  path: string;
  type: "file";
  // storage: "window7fs" | "indexeddb";
  storage: "indexeddb";
};

type Dir = Pick<FileItem, "path" | "storage"> & {
  type: "dir";
};

export type DBEntity = Dir | FileItem;

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

// Function to add a folder path
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
    }

    await db.folders.add({
      path: args.path,
      type: "dir",
      storage: "indexeddb",
    });
  } catch (error) {
    if ((error as typeof Dexie.ModifyError).name === "ConstraintError") {
      console.error("This folder path already exists.");

      throw error;
    } else {
      console.error("Failed to add folder:", error);
    }
  }
};

export async function getAllFolders(db: FolderDatabase) {
  try {
    const entities = await db.folders.toArray();

    console.log("folders", entities);

    // return folders.map((folder) => folder.path);
    return entities;
  } catch (error) {
    console.error("Failed to retrieve folders:", error);
    return null;
  }
}

export { FolderDatabase };
