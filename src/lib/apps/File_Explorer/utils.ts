import {
  Directory,
  FileItem,
  getFs,
  type TaskManagerItem,
} from "@/components/desktop/file_system.svelte";
import { getDesktopIcon, getIconByProgramId } from "@/components/desktop/utils";

export type FileType = {
  name: string;
  mimetype?: string | null;
  content?: string | null;
  type: "File";
  path?: string;
  icon: string;
};

export type FolderType = {
  name: string;
  type: "Folder";
  path?: string;
  icon: string;
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
        icon: getDesktopIcon(`${item?.full_path}/${item.name}` || ""),
      };
    } else {
      return {
        name: item.name,
        type: "Folder",
        path: item.full_path,
        icon: getDesktopIcon(item?.full_path || ""),
      };
    }
  }) as (FileType | FolderType)[];
};
