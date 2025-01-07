import { getContext, setContext } from "svelte";
import { Directory, FileItem } from "./fs/directory";
import {
  extractPath,
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
type DesktopFolderPath = `C:/Users/${string}/Desktop/${string}`;

export type IconProps = {
  id: string;
  label: string;
  placement?: Placement;
  meta?: Record<string, unknown>;
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
  /**
   * Depending on the program, meta will have program specific properties
   *
   * eg for handling text files by notepad, there will be a meta.file_path
   * eg for handling video files by video player, there will be a meta.file_path
   * eg for handling image files by image viewer, there will be a meta.file_path
   *
   * programId will specify the handling program.
   *
   */
  meta?: Record<string, string>;
  pinnedToTaskbar: boolean;
};

type MountableProgram = {
  fileName: string;
  type: "executable";
  programId: InstalledPrograms;
  mount_to: string;
};

type MountableFile = Omit<MountableProgram, "programId" | "type"> & {
  executeBy: string;
  mimetype: string;
  textContent: string;
  type: "file";
};

const ICON_SIZE = 70;
const MARGIN = 2;
const ICON_STEP = ICON_SIZE + MARGIN;

class Win7FileSystem {
  private user: string = "";
  private desktop: HTMLElement | null = null;
  fs: Directory | null = null;

  // For placing icons on the desktop
  public currentRow = $state(0); // Tracks horizontal position (left to right)
  public currentColumn = $state(0); // Tracks vertical position (top to bottom)

  private desktopFiles = $state<
    (DesktopExecutable | DesktopFile | DesktopFolder)[]
  >([]);

  private taskManager = $state<TaskManagerItem[]>([
    {
      id: crypto.randomUUID(),
      label: "Plyr_Video",
      taskStatus: "running",
      windowStatus: "inview",
      pinnedToTaskbar: false,
      programId: "Plyr_Video",
    },
  ]);

  constructor(user_name: string) {
    const root = new Directory(user_name);

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
   * Mounts directories and files to the file system.
   */
  mount(args: {
    desktop: HTMLElement;
    dir: string[];
    files?: (MountableProgram | MountableFile)[];
  }) {
    const dir = this.fs;
    this.desktop = args.desktop;

    if (!dir) {
      return;
    }

    args.dir.forEach((path) => {
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

    if (!args.files) {
      return;
    }

    args.files.forEach((file) => {
      const replaceVariables = interpolate(file.mount_to, {
        root_user: this.getUser(),
      });

      const noneDesktopItem = extractPath(replaceVariables);

      if (!noneDesktopItem) {
        return;
      }

      if (Directory.isFolder(replaceVariables)) {
        return;
      }

      const { isOnDesktop, label: desktopFile } =
        getParentFolderInfo(replaceVariables);

      if (!isOnDesktop) {
        dir.createFile(
          noneDesktopItem.path,
          noneDesktopItem.filename_ext as string,
          "text/plain",
          ""
        );
        return;
      }

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
    const CWD = `C:/Users/${this.getUser()}/Desktop`;
    const file_path = `${CWD}/${desktopIcon.label}` as DesktopFolderPath;

    if (!fs) {
      throw new Error(
        "File system was not initialized. Did you forget to call os.setFs()."
      );
    }

    if ("programId" in desktopIcon) {
      fs.createFile(CWD, desktopIcon.label, "application/executable", null);

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
      // Checks if it is a typeof file and not a folder.
      if (!Directory.isFile(file_path)) {
        return;
      }

      fs.createFile(
        CWD,
        desktopIcon.label,
        "plain/text",
        desktopIcon?.textContent || ""
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
      // Checks if it is a typeof file and not a folder.
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
    const CWD = `C:/Users/${this.getUser()}/Desktop`;
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
      fs.createFile(CWD, label, "application/executable", null);

      this.desktopFiles.push({
        id: crypto.randomUUID(),
        label: label,
        type: "executable",
        programId: args.programId,
        placement: { column, row },
        file_path: file_path,
        icon: getDesktopIcon(file_path),
      } as DesktopExecutable & ExtraIconProps);
    }

    if ("executeBy" in args && args.type === "file") {
      if (!Directory.isFile(file_path)) {
        return;
      }

      fs.createFile(CWD, label, "plain/text", args?.textContent || "");

      this.desktopFiles.push({
        id: crypto.randomUUID(),
        label: label,
        type: "file",
        executeBy: args.executeBy,
        placement: { column, row },
        file_path: file_path,
        icon: getDesktopIcon(file_path),
      } as DesktopFile & ExtraIconProps);
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
}

const FS_IDENTIFIER = Symbol("windows7_fs");

export { Directory, FileItem };

export function initFs(su: string = ":root") {
  return setContext(FS_IDENTIFIER, new Win7FileSystem(su));
}

export function getFs() {
  return getContext<ReturnType<typeof initFs>>(FS_IDENTIFIER);
}
