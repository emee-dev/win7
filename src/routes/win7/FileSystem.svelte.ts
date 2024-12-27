import { getContext, setContext, untrack } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import type { InstalledPrograms } from "./utils";

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

// class FileItem extends Item {
//   public mimetype: string;
//   public textContent: string | null;
//   public executable: Executable | null;

//   constructor(
//     name: string,
//     mimetype: string,
//     textContent: string | null = null
//   ) {
//     super(name);
//     if (!/\.\w+$/.test(name)) {
//       throw new Error(
//         `Invalid file name '${name}'. A valid file extension is required.`
//       );
//     }
//     this.mimetype = mimetype;
//     this.textContent = textContent;
//   }
// }

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

  private isFilePath(path: string): boolean {
    return /\.\w+$/.test(path);
  }

  private validatePath(path: string): void {
    if (this.isFilePath(path)) {
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
    if (!this.isFilePath(pathLike)) {
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
    if (this.isFilePath(pathLike)) {
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

type SelectoItemProps = {
  label: string;
  id: string;
  props?: SvelteHTMLElements["div"];
  meta: any;
  placement?: Placement;
};

type DesktopFile = SelectoItemProps & {};

// For managing executable files.
export type TaskManagerItem = {
  label: string;
  windowId: string;
  taskStatus: "running" | "paused";
  windowStatus: "minimized" | "inview";
  programId: InstalledPrograms;
  meta?: Record<string, string>;
  content?: Executable;
  pinnedToTaskbar: boolean;
  // executablePath: string;
};

class Win7FileSystem {
  private desktopFiles = $state<DesktopFile[]>([
    {
      id: "1",
      label: "Computer",
      meta: {},
      placement: {
        row: 2,
        column: 2,
      },
    },
  ]);
  private SU: string = "";
  fs: Directory | null = null;

  private taskManager = $state<TaskManagerItem[]>([]);

  constructor(su: string) {
    const root = new Directory(su);

    root.insertPath("C:");
    root.insertPath("C:/Users");
    root.insertPath(`C:/Users/${su}`);
    root.insertPath(`C:/Users/${su}/Desktop`);

    this.fs = root;
    this.SU = su;
  }

  private getfs(): Directory | null {
    return this.fs;
  }

  createIcon(icon: DesktopFile) {
    const CWD = `C:/Users/${this.SU}/Desktop`;

    let fs = this.getfs();

    if (!fs) {
      return;
    }

    fs.createFile(CWD, icon.label, "", "");

    this.desktopFiles.push(icon);
  }

  getDesktopFiles() {
    return this.desktopFiles;
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
      if (item.windowId === taskId) {
        return {
          ...item,
          ...entries,
        };
      }

      return item;
    });

    this.taskManager = modified;

    // console.log("task", modified);
  }

  terminateTask(
    taskId: string,
    status?: Partial<Pick<TaskManagerItem, "windowStatus">>
  ) {
    let modified = this.taskManager.filter((item) => item.windowId !== taskId);

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
