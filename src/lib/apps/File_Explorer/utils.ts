import {
  Directory,
  FileItem,
  getFs,
  type TaskManagerItem,
} from "@/components/desktop/file_system.svelte";

export type FileType = {
  name: string;
  mimetype?: string | null;
  content?: string | null;
  type: "File";
  path?: string;
};

export type FolderType = {
  name: string;
  type: "Folder";
  path?: string;
};

export type Folder = FileType | FolderType;

export const formatFs = (items: (Directory | FileItem)[] | null) => {
  if (!items) {
    return [];
  }

  return items.map((item) => {
    if (item instanceof FileItem) {
      return {
        name: item.name,
        type: "File",
        mimetype: item.mimetype,
        content: item.content as string,
        path: item.full_path,
      };
    } else {
      return {
        name: item.name,
        type: "Folder",
        path: item.full_path,
      };
    }
  }) as (FileType | FolderType)[];
};
