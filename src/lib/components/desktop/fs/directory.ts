class Item {
  public name: string;
  public full_path?: string;

  constructor(name: string, full_path?: string) {
    if (new.target === Item) {
      throw new Error(
        "Item is an abstract class and cannot be instantiated directly."
      );
    }
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new Error("Invalid name provided.");
    }
    this.name = name;
    this.full_path = full_path;
  }
}

class FileItem extends Item {
  public mimetype: string;
  public content: string | null;

  constructor(
    name: string,
    mimetype: string,
    content: string | null = null,
    full_path?: string
  ) {
    super(name, full_path);
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

  constructor(name: string, full_path?: string) {
    super(name, full_path);
    this.children = new Map();
  }

  // public static isFilePath(path: string): boolean {
  //   return /\.\w+$/.test(path);
  // }

  public static isFile(path: string): boolean {
    const fileRegex = /.*\.[a-zA-Z0-9]+$/;
    return fileRegex.test(path);
  }

  public static isFolder(path: string): boolean {
    const folderRegex = /^[^*?"<>|]+\/?$/;
    return folderRegex.test(path) && !Directory.isFile(path);
  }

  private validatePath(path: string): void {
    if (Directory.isFile(path)) {
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
        // currentDir.children.set(part, new Directory(part, parts.join("")));
        currentDir.children.set(part, new Directory(part, path));
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
      new FileItem(fileName, mimetype, textContent, path)
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

  readFile(pathLike: string | null): FileItem | null {
    if (!pathLike) {
      return null;
    }

    if (!Directory.isFile(pathLike)) {
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

  readRaw(pathLike: string | null) {
    if (!pathLike) {
      return null;
    }

    const dir = this.traversePath(pathLike) as Directory | null;

    if (!dir) {
      return null;
    }

    return Array.from(dir.children.values());
  }

  readDir(pathLike: string | null): string[] | null {
    if (!pathLike) {
      return null;
    }

    if (Directory.isFile(pathLike)) {
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

export { FileItem, Directory };
