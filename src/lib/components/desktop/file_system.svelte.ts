import { getContext, setContext, untrack } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import {
  extractPath,
  getDesktopIcon,
  isFolderOnDesktop,
  // getProgramIcon,
  isMountedToDesktop,
  type InstalledPrograms,
} from "./utils";
import { DesktopIcons } from ".";

class Item {
  public name: string;

  constructor(name: string) {
    if (new.target === Item) {
      throw new Error(
        "Item is an abstract class and cannot be instantiated directly."
      );
    }
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new Error("Invalid name provided.");
    }
    this.name = name;
  }
}

type Executable = {
  icon: string;
};

class FileItem extends Item {
  public mimetype: string;
  public content: string | Executable | null;

  constructor(
    name: string,
    mimetype: string,
    content: string | Executable | null = null
  ) {
    super(name);
    if (!/\.\w+$/.test(name)) {
      throw new Error(
        `Invalid file name '${name}'. A valid file extension is required.`
      );
    }
    this.mimetype = mimetype;
    this.content = content;
  }
}

class Directory extends Item {
  public children: Map<string, Directory | FileItem>;

  constructor(name: string) {
    super(name);
    this.children = new Map();
  }

  public static isFilePath(path: string): boolean {
    return /\.\w+$/.test(path);
  }

  private validatePath(path: string): void {
    // if (this.isFilePath(path)) {
    if (Directory.isFilePath(path)) {
      throw new Error(
        `Invalid path '${path}'. Paths must not contain file extensions.`
      );
    }
  }

  protected traversePath(path: string): Directory | FileItem | null {
    const parts = path.split("/").filter((part) => part.length > 0);
    let currentDir: Directory = this;

    for (const part of parts) {
      const nextItem = currentDir.children.get(part);
      if (!nextItem) {
        return null;
      }
      if (nextItem instanceof Directory) {
        currentDir = nextItem;
      } else {
        return nextItem;
      }
    }
    return currentDir;
  }

  insertPath(path: string): void {
    this.validatePath(path);

    const parts = path.split("/").filter((part) => part.length > 0);
    let currentDir: Directory = this;

    for (const part of parts) {
      if (!currentDir.children.has(part)) {
        currentDir.children.set(part, new Directory(part));
      }

      const nextItem = currentDir.children.get(part);

      if (nextItem instanceof Directory) {
        currentDir = nextItem;
      } else {
        throw new Error(`Path conflict: '${part}' is not a directory.`);
      }
    }
  }

  modifyPath(path: string, new_path: string): void {
    this.validatePath(path);
    this.validatePath(new_path);

    const oldParts = path.split("/").filter((part) => part.length > 0);
    const newParts = new_path.split("/").filter((part) => part.length > 0);

    let currentDir: Directory = this;

    let lastPart = oldParts[oldParts.length - 1];
    let newName = newParts[newParts.length - 1];

    for (const part of oldParts) {
      if (!currentDir.children.has(part)) {
        throw new Error(`Directory '${part}' does not exist.`);
      }

      if (currentDir.children.get(lastPart)) {
        let oldContents = currentDir.children.get(lastPart);

        currentDir.children.set(newName, oldContents as Directory | FileItem);

        // Delete the previous key, effectively renaming it.
        currentDir.children.delete(lastPart);
        return;
      }

      const nextItem = currentDir.children.get(part);

      if (nextItem instanceof Directory) {
        currentDir = nextItem;
      } else {
        throw new Error(`Path conflict: '${part}' is not a directory.`);
      }
    }
  }

  createFile(
    path: string,
    fileName: string,
    mimetype: string,
    textContent: string | null = null
  ): void {
    if (!/\.\w+$/.test(fileName)) {
      throw new Error(
        `Invalid file name '${fileName}'. A valid file extension is required.`
      );
    }

    const parts = path.split("/").filter((part) => part.length > 0);
    let currentDir: Directory = this;

    for (const part of parts) {
      const nextItem = currentDir.children.get(part);
      if (nextItem instanceof Directory) {
        currentDir = nextItem;
      } else if (nextItem === undefined) {
        throw new Error(`Directory '${part}' does not exist.`);
      } else {
        throw new Error(`Path conflict: '${part}' is not a directory.`);
      }
    }

    if (currentDir.children.has(fileName)) {
      throw new Error(`File '${fileName}' already exists.`);
    }

    currentDir.children.set(
      fileName,
      new FileItem(fileName, mimetype, textContent)
    );
  }

  modifyFile(
    path: string,
    fileName: string,
    mimetype: string,
    textContent: string | null = null
  ): void {
    if (!/\.\w+$/.test(fileName)) {
      throw new Error(
        `Invalid file name '${fileName}'. A valid file extension is required.`
      );
    }

    const parts = path.split("/").filter((part) => part.length > 0);
    let currentDir: Directory = this;

    for (const part of parts) {
      const nextItem = currentDir.children.get(part);
      if (nextItem instanceof Directory) {
        currentDir = nextItem;
      } else if (nextItem === undefined) {
        throw new Error(`Directory '${part}' does not exist.`);
      } else {
        throw new Error(`Path conflict: '${part}' is not a directory.`);
      }
    }

    if (!currentDir.children.has(fileName)) {
      throw new Error(`File '${fileName}' does not exist.`);
    }

    currentDir.children.set(
      fileName,
      new FileItem(fileName, mimetype, textContent)
    );
  }

  listContents(): string[] {
    return Array.from(this.children.keys());
  }

  readFile(pathLike: string): FileItem | null {
    if (!Directory.isFilePath(pathLike)) {
      throw new Error(
        `Invalid file path '${pathLike}'. A file path must end with a file extension.`
      );
    }
    const file = this.traversePath(pathLike) as FileItem | null;
    if (file && !(file instanceof FileItem)) {
      throw new Error(`Path '${pathLike}' does not point to a file.`);
    }
    return file;
  }

  readDir(pathLike: string): string[] | null {
    if (Directory.isFilePath(pathLike)) {
      throw new Error(
        `Invalid directory path '${pathLike}'. A directory path must not contain a file extension.`
      );
    }

    const dir = this.traversePath(pathLike) as Directory | null;

    if (!dir) {
      return null;
    }

    return dir.listContents();
  }
}

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

export type DesktopFileOrFolder = IconProps & {
  type: "file_or_folder";
  executeBy: InstalledPrograms;
};

export type DesktopIcon = DesktopExecutable | DesktopFileOrFolder;

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

type ExecutableFile = {
  fileName: string;
  type: "executable";
  programId: InstalledPrograms;
  mount_to: string;
};

type NonExecutableFile = Omit<ExecutableFile, "programId" | "type"> & {
  executeBy: string;
  mimetype: string;
  textContent: string;
  type: "file_or_folder";
};

const ICON_SIZE = 70;
const MARGIN = 2;
const ICON_STEP = ICON_SIZE + MARGIN;

class Win7FileSystem {
  private SU: string = "";
  private desktop: HTMLElement | null = null;
  fs: Directory | null = null;

  // For placing icons on the desktop
  public currentRow = $state(0); // Tracks horizontal position (left to right)
  public currentColumn = $state(0); // Tracks vertical position (top to bottom)

  private desktopFiles = $state<(DesktopExecutable | DesktopFileOrFolder)[]>(
    []
  );
  private taskManager = $state<TaskManagerItem[]>([]);

  constructor(su: string) {
    const root = new Directory(su);

    // root.insertPath("C:");
    // root.insertPath("C:/Users");
    // root.insertPath(`C:/Users/${su}`);
    // root.insertPath(`C:/Users/${su}/Desktop`);
    // root.insertPath(`C:/Users/${su}/Desktop/New folder`);

    this.fs = root;
    this.SU = su;
  }

  private getfs(): Directory | null {
    return this.fs;
  }

  mount(args: {
    desktop: HTMLElement;
    dir: string[];
    files?: (ExecutableFile | NonExecutableFile)[];
  }) {
    const dir = this.fs;
    this.desktop = args.desktop;

    if (!dir) {
      return;
    }

    args.dir.forEach((path) => {
      // Here we check if the folder exists on the desktop path
      const isDesktopFolder = isFolderOnDesktop(path, "/Desktop");

      const desktopFiles = this.getDesktopFiles();

      // Simply mount the folder to fs.
      if (!isDesktopFolder) {
        return dir.insertPath(path);
      }

      // Prevent adding duplicate files.
      if (desktopFiles.find((icon) => icon.label === isDesktopFolder)) {
        return;
      }

      const { column, row } = this.placeNextIcon();

      // Make sure the the desktop folders to mount are unique.
      this.createIcon({
        id: crypto.randomUUID(),
        type: "file_or_folder",
        label: isDesktopFolder,
        executeBy: "File_Manager" as InstalledPrograms,
        placement: { column, row },
      });

      return dir.insertPath(path);
    });

    if (!args.files) {
      return;
    }

    for (let file of args.files) {
      let { column, row } = this.placeNextIcon();

      let data = extractPath(file.mount_to);

      if (!data) {
        throw new Error("Unable to parse file or file path.");
      }

      if (!isMountedToDesktop(data.path)) {
        return;
      }

      if ("programId" in file) {
        this.createIcon({
          type: "executable",
          id: crypto.randomUUID(),
          label: data.filename_ext,
          programId: file.programId as InstalledPrograms,
          placement: { column, row },
        });
      }

      // Can be executed by programs and have it's content read.
      if ("executeBy" in file) {
        this.createIcon({
          id: crypto.randomUUID(),
          type: "file_or_folder",
          label: data.filename_ext,
          executeBy: file.executeBy as InstalledPrograms,
          placement: { column, row },
        });
      }
    }

    // args.files.forEach((file) => {});
  }

  getFolder(path: any): any {
    return this.fs?.readDir(path);
  }

  // Desktop
  createIcon(args: DesktopIcon) {
    const desktopIcon = args as DesktopIcon & ExtraIconProps;
    const CWD = `C:/Users/${this.SU}/Desktop`;
    const fs = this.getfs();
    const file_path = `${CWD}/${desktopIcon.label}` as DesktopFolderPath;

    if (!fs) {
      throw new Error(
        "File system was not initialized. Did you forget to call os.setFs()."
      );
    }

    if ("executeBy" in desktopIcon) {
      // Checks if it is a typeof file and not a folder.
      if (Directory.isFilePath(file_path)) {
        fs.createFile(CWD, desktopIcon.label, "", "");
      } else {
        fs.insertPath(file_path);
      }

      this.desktopFiles.push({
        id: desktopIcon.id,
        label: desktopIcon.label,
        type: "file_or_folder",
        executeBy: desktopIcon.executeBy,
        placement: desktopIcon.placement,
        file_path: file_path,
        icon: getDesktopIcon(file_path),
      } as DesktopFileOrFolder & ExtraIconProps);
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

  // Task manager
  getTasks() {
    return this.taskManager;
  }

  launchTask(task: TaskManagerItem) {
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

    console.log("modified", modified);

    this.taskManager = modified;
  }
}

const FS_IDENTIFIER = Symbol("windows7_fs");

export function initFs(su: string = ":root") {
  return setContext(FS_IDENTIFIER, new Win7FileSystem(su));
}

export function getFs() {
  return getContext<ReturnType<typeof initFs>>(FS_IDENTIFIER);
}
