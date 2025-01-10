import { getContext, setContext } from "svelte";
import { Directory, FileItem } from "./fs/directory";
import { FolderDatabase, getAllDbEntities, type FileEntity } from "./indexeddb";
import {
  extractPath,
  findHandler,
  getDesktopIcon,
  getParentFolderInfo,
  interpolate,
  type InstalledPrograms,
} from "./utils";

type Placement = {
  column: number;
  row: number;
};

// 1. %s system user, 2. %s file_name
type DesktopFolderPath = `C:/Libraries/Desktop/${string}`;

export type IconProps = {
  id: string;
  label: string;
  placement?: Placement;
  meta?: Record<string, string>;
  ondblclick?: (meta: any) => void;
};

export type ExtraIconProps = {
  icon: string;
  file_path: DesktopFolderPath;
};

export type DesktopExecutable = IconProps & {
  type: "executable";
  programId: InstalledPrograms;
};

export type DesktopFile = IconProps &
  MountableFile & {
    type: "file";
    executeBy: InstalledPrograms;
  };

export type DesktopFolder = IconProps & {
  type: "folder";
  executeBy: InstalledPrograms;
};

export type DesktopIcon = DesktopExecutable | DesktopFile | DesktopFolder;

// For managing executable files.
export type TaskManagerItem = {
  id: string;
  label: string;
  taskStatus: "running" | "paused";
  windowStatus: "minimized" | "inview";
  programId: InstalledPrograms;
  meta?: Record<string, string>;
  pinnedToTaskbar: boolean;
};

type MountableProgram = {
  fileName: string;
  type: "executable";
  programId: InstalledPrograms;
  mount_to: string;
  meta?: Record<string, unknown> | undefined;
};

export type MountableFile = {
  blob: Blob;
  mount_to: string;
  type: "file";
  meta?: {
    storage?: "static" | "indexeddb";
  };
};

const ICON_SIZE = 70;
const MARGIN = 2;
const ICON_STEP = ICON_SIZE + MARGIN;

class Win7FileSystem {
  private user: string = "";
  private desktop: HTMLElement | null = null;
  fs: Directory | null = null;
  folderDB: FolderDatabase | null = null;

  // For placing icons on the desktop
  public currentRow = $state(0); // Tracks horizontal position (left to right)
  public currentColumn = $state(0); // Tracks vertical position (top to bottom)

  private desktopFiles = $state<
    (DesktopExecutable | DesktopFile | DesktopFolder)[]
  >([]);

  private taskManager = $state<TaskManagerItem[]>([]);

  constructor(user_name: string) {
    const root = new Directory(user_name);
    this.folderDB = new FolderDatabase();

    this.fs = root;
    this.user = user_name;
  }

  private getfs(): Directory | null {
    return this.fs;
  }

  getUser(): string {
    return this.user;
  }

  /**
   *
   * @param args
   * @returns
   * Recursively mounts directories and then files to the file system.
   */
  async mount(args: {
    desktop: HTMLElement;
    db: FolderDatabase;
    dir: string[];
    files?: (MountableProgram | MountableFile)[];
  }) {
    const dir = this.fs;
    this.desktop = args.desktop;

    let files = args.files || [];
    let folders = args.dir || [];

    if (!dir) {
      return;
    }

    let persistedFiles = await getAllDbEntities(args.db);

    if (persistedFiles && persistedFiles.length > 0) {
      persistedFiles.forEach((element) => {
        if (element.type === "file") {
          files.push({
            executeBy: findHandler(element.path),
            mimetype: element.blob.type,
            mount_to: element.path,
            type: "file",
            meta: {
              storage: "indexeddb",
            },
          } as MountableFile & { executeBy: string; mimetype: string });
        } else {
          folders.push(element.path);
        }
      });
    }

    folders.forEach((path) => {
      const replaceVariables = interpolate(path, { root_user: this.getUser() });

      // Here we check if the folder exists on the desktop path
      const { isOnDesktop, label } = getParentFolderInfo(replaceVariables);

      const desktopFiles = this.getDesktopFiles();

      // Simply mount the folder to fs.
      if (!isOnDesktop) {
        return dir.insertPath(replaceVariables);
      }

      // Prevent adding duplicate files
      if (desktopFiles.find((icon) => icon.label === label)) {
        return;
      }

      const { column, row } = this.placeNextIcon();

      // Make sure the the desktop folders to mount are unique.
      this.createDesktopIcon({
        id: crypto.randomUUID(),
        type: "folder",
        label: label as string,
        executeBy: "File_Manager" as InstalledPrograms,
        placement: { column, row },
      });

      return dir.insertPath(replaceVariables);
    });

    if (!files) {
      return;
    }

    files.forEach((file) => {
      const replaceVariables = interpolate(file.mount_to, {
        root_user: this.getUser(),
      });

      const item = extractPath(replaceVariables);

      if (!item) {
        return;
      }

      if (Directory.isFolder(replaceVariables)) {
        return;
      }

      const { isOnDesktop } = getParentFolderInfo(replaceVariables);

      if (!isOnDesktop) {
        if (file.type === "file") {
          dir.createBlobFile(item.path, item.filename_ext, file.blob);
        }

        if (file.type === "executable") {
          dir.createExecutableFile(item.path, item.filename_ext as string);
        }

        return;
      }

      // is on desktop
      this.mountDesktopIcon(file);
    });
  }

  getFolder(path: string | null) {
    if (!this.fs) {
      return null;
    }

    return this.fs.readRaw(path);
  }

  /**
   *
   * @param args
   * @returns
   * Helper method for creating icons on the desktop by end users.
   */
  createDesktopIcon<T extends DesktopIcon>(args: T) {
    const fs = this.getfs();
    const desktopIcon = args as DesktopIcon & ExtraIconProps;
    const CWD = `C:/Libraries/Desktop`;
    const file_path = `${CWD}/${desktopIcon.label}` as DesktopFolderPath;

    if (!fs) {
      throw new Error(
        "File system was not initialized. Did you forget to call os.setFs()."
      );
    }

    if ("programId" in desktopIcon) {
      fs.createExecutableFile(CWD, desktopIcon.label);

      this.desktopFiles.push({
        id: desktopIcon.id,
        label: desktopIcon.label,
        type: "executable",
        programId: desktopIcon.programId,
        placement: desktopIcon.placement,
        file_path: file_path,
        icon: getDesktopIcon(file_path),
      } as DesktopExecutable & ExtraIconProps);
    }

    if ("executeBy" in desktopIcon && desktopIcon.type === "file") {
      if (!Directory.isFile(file_path)) return;

      fs.createBlobFile(
        CWD,
        desktopIcon.label,
        new Blob([""], { type: "text/plain" })
      );

      this.desktopFiles.push({
        id: desktopIcon.id,
        label: desktopIcon.label,
        type: "file",
        executeBy: desktopIcon.executeBy,
        placement: desktopIcon.placement,
        file_path: file_path,
        icon: getDesktopIcon(file_path),
      } as DesktopFile & ExtraIconProps);
    }

    if ("executeBy" in desktopIcon && desktopIcon.type === "folder") {
      if (!Directory.isFolder(file_path)) {
        return;
      }

      fs.insertPath(file_path);

      this.desktopFiles.push({
        id: desktopIcon.id,
        label: desktopIcon.label,
        type: "folder",
        executeBy: desktopIcon.executeBy,
        placement: desktopIcon.placement,
        file_path: file_path,
        icon: getDesktopIcon(file_path),
      } as DesktopFolder & ExtraIconProps);
    }
  }

  private mountDesktopIcon<T extends MountableFile | MountableProgram>(
    args: T
  ) {
    const fs = this.getfs();
    const CWD = `C:/Libraries/Desktop`;
    const { column, row } = this.placeNextIcon();

    const replaceVariables = interpolate(args.mount_to, {
      root_user: this.getUser(),
    });

    const { isOnDesktop, label } = getParentFolderInfo(replaceVariables);

    if (!label || !isOnDesktop) {
      return;
    }

    const file_path = `${CWD}/${label}` as DesktopFolderPath;

    if (!fs) {
      throw new Error(
        "File system was not initialized. Did you forget to call os.setFs()."
      );
    }

    if ("programId" in args && args.type === "executable") {
      fs.createExecutableFile(CWD, label);

      this.desktopFiles.push({
        id: crypto.randomUUID(),
        label: label,
        type: "executable",
        programId: args.programId,
        placement: { column, row },
        file_path: file_path,
        meta: (args?.meta as any) || undefined,
        icon: getDesktopIcon(file_path),
      } as DesktopExecutable & ExtraIconProps);
    }

    // @ts-expect-error it is possibly undefined
    if (!args.executeBy && args.type === "file") {
      if (!Directory.isFile(file_path)) return;

      fs.createBlobFile(CWD, label, args.blob);

      this.desktopFiles.push({
        id: crypto.randomUUID(),
        label: label,
        type: "file",
        meta: args.meta,
        file_path: file_path,
        placement: { column, row },
        icon: getDesktopIcon(file_path),
        executeBy: findHandler(file_path),
      } as DesktopFile & ExtraIconProps);
    }

    // These types of files are the ones persisted in database and should not have its
    // Blob dropped into memory for efficiency reasons.
    if (
      args.meta &&
      args.type === "file" &&
      args.meta.storage === "indexeddb"
    ) {
      if (!Directory.isFile(file_path)) return;

      // TODO it should have an optional blob argument. Blob can be too large to read at once.
      fs.createBlobFile(CWD, label, new Blob([""], { type: "text/plain" }));

      this.desktopFiles.push({
        id: crypto.randomUUID(),
        label: label,
        type: "file",
        meta: args.meta,
        file_path: file_path,
        placement: { column, row },
        icon: getDesktopIcon(file_path),
        executeBy: findHandler(file_path),
      } as DesktopFile & ExtraIconProps);
    }
  }

  async getPersistedFileByPath(
    filePath: string
  ): Promise<FileEntity | undefined | null> {
    try {
      if (!this.folderDB) {
        return null;
      }

      const fileItem = await this.folderDB.folders
        .where("path")
        .equals(filePath)
        .and((item) => item.type === "file")
        .first();

      return fileItem as FileEntity;
    } catch (error) {
      console.error("Error fetching file:", error);
      return undefined;
    }
  }

  getDesktopFiles() {
    return this.desktopFiles;
  }

  placeNextIcon(): Placement {
    const desktop = this.desktop;

    if (!desktop) {
      throw new Error("Desktop was not initialized, be sure to mount it.");
    }

    const desktopHeight = desktop.clientHeight;

    // Set the current position for the icon
    const column = this.currentColumn;
    const row = this.currentRow;

    // Move down to the next row
    this.currentColumn += ICON_STEP;

    // If the next row exceeds the desktop height, reset to the top and move to the next column
    if (this.currentColumn + ICON_SIZE > desktopHeight) {
      this.currentColumn = 0; // Reset to the top
      this.currentRow += ICON_STEP; // Move to the next column
    }

    return { column, row };
  }

  /**
   *
   * @returns
   * Returns all active programs.
   */
  getTasks() {
    return this.taskManager;
  }

  launchTask(task: TaskManagerItem) {
    // Make sure meta is not an empty object to avoid overwriting default bindings/values
    const metaHasProperties = task.meta
      ? Object.keys(task.meta).length > 0
      : false;

    if (!metaHasProperties) {
      task.meta = undefined;
    }

    this.taskManager.push(task);
  }

  modifyTask(taskId: string, entries?: Partial<TaskManagerItem>) {
    let modified = this.taskManager.map((item) => {
      if (item.id === taskId) {
        return {
          ...item,
          ...entries,
        };
      }

      return item;
    });

    this.taskManager = modified;
  }

  terminateTask(taskId: string) {
    let modified = this.taskManager.filter((item) => item.id !== taskId);

    this.taskManager = modified;
  }

  /**
   * Will delete the file from system.
   */
  async deleteFile(file_path: string) {
    let db = this.folderDB;
    let fs = this.fs;
    let desktopFiles = this.desktopFiles as (DesktopFile | DesktopFolder)[];

    if (!db || !fs) return null;

    await db.folders.delete(file_path);

    fs.deleteFile(file_path);

    // @ts-expect-error it exists
    let newFiles = desktopFiles.filter((item) => item.file_path !== file_path);

    this.desktopFiles = newFiles;
    // console.log("js", JSON.stringify(desktopFiles, null, 3));
  }
}

const FS_IDENTIFIER = Symbol("windows7_fs");

export { Directory, FileItem };

export function initFs(su: string = ":root") {
  return setContext(FS_IDENTIFIER, new Win7FileSystem(su));
}

export function getFs() {
  return getContext<ReturnType<typeof initFs>>(FS_IDENTIFIER);
}
