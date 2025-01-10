import { mediaAssets } from "@/const";
import type { MenuProps } from "../ui/popup_menu";

export const menuItems: MenuProps[] = [
  {
    label: "View",
  },
  {
    // icon: "https://img.icons8.com/color/18/000000/monitor--v1.png",
    label: "Sort by",
    subMenu: [
      {
        label: "Name",
      },
      {
        label: "Size",
      },
      {
        label: "Item type",
      },
      {
        label: "Date modified",
      },
    ],
  },
  {
    label: "Refresh",
    hasDivider: "has-divider",
  },
  {
    label: "Paste",
    isDisabled: true,
  },
  {
    label: "Paste shortcut",
    // hasDivider: "has-divider",
    // isDisabled: true,
  },
  {
    icon: "https://img.icons8.com/color/18/000000/monitor--v1.png",
    label: "Screen resolution",
  },
  {
    icon: "https://img.icons8.com/color/18/000000/virtual-machine2.png",
    label: "Gadgets",
  },
  {
    icon: "https://img.icons8.com/color/18/000000/remote-desktop.png",
    label: "Personalize",
  },
];

export type VariantPrograms = "RecycleBin";

export type NonVariantPrograms =
  | "Calculator"
  | "Notepad"
  | "MyComputer"
  | "File_Explorer"
  | "Plyr_Video";

export type InstalledPrograms = VariantPrograms | NonVariantPrograms;

export const getIconByProgramId = (program: InstalledPrograms) => {
  const installedPrograms = {
    // Calculator: "/img/calculator.webp",
    Calculator: mediaAssets.CalculatorIcon,
    // MyComputer: "/img/mycomputer.webp",
    MyComputer: mediaAssets.MyComputerIcon,
    // Notepad: "/img/notepad.webp",
    Notepad: mediaAssets.NotepadIcon,
    // RecycleBin: "/img/recycle_empty.png",
    RecycleBin: mediaAssets.RecycleEmpty,
    // File_Explorer: "/img/file_explorer.webp",
    File_Explorer: mediaAssets.FileExplorerIcon,
    // Plyr_Video: "/img/plyr_video.png",
    Plyr_Video: mediaAssets.PlyrVideo,
    // RecycleBinFilled: "/img/recycle_filled.png",
    // RecycleBinFilled: mediaAssets.RecycleFilled,
  } as Record<InstalledPrograms, string>;

  return installedPrograms[program];
};

export const getDesktopIcon = (path_like: string): string => {
  const fileIcons = {
    // txt: "/img/text_file.webp",
    // mp4: "/img/media_file.webp",
    txt: mediaAssets.TextFileIcon,
    mp4: mediaAssets.MediaFile,
    mkv: mediaAssets.MediaFile,
    avi: mediaAssets.MediaFile,
    mov: mediaAssets.MediaFile,
    webm: mediaAssets.MediaFile,
    jpg: mediaAssets.MediaFile,
    jpeg: mediaAssets.MediaFile,
    png: mediaAssets.MediaFile,
    gif: mediaAssets.MediaFile,
    bmp: mediaAssets.MediaFile,
    mp3: mediaAssets.MediaFile,
    wav: mediaAssets.MediaFile,
    flac: mediaAssets.MediaFile,
    ogg: mediaAssets.MediaFile,
    aac: mediaAssets.MediaFile,
  } as Record<string, string>;

  const defaultIcons = {
    // folder: "/img/folder_with_folders.png",
    folder: mediaAssets.FolderWithFile,
    // emptyFolder: "/img/folder_empty.webp",
    emptyFolder: mediaAssets.FolderEmpty,
    unknown: "/img/unknown-file.webp",
  };

  const match = path_like.match(/\.([a-zA-Z0-9]+)$/);
  const extension = match ? match[1].toLowerCase() : null;

  // Assume it's a folder if there is no extension
  if (!extension) {
    return defaultIcons.folder;
  }

  if (extension === "exe") {
    const program = extractPath(path_like);

    if (!program) {
      return defaultIcons.unknown;
    }

    const programName = program.filename_ext.replace(/\.exe$/i, "");

    // return installedPrograms[programName] || defaultIcons.unknown;
    return (
      getIconByProgramId(programName as InstalledPrograms) ||
      defaultIcons.unknown
    );
  }

  return fileIcons[extension] || defaultIcons.unknown;
};

/**
 *
 * @param path_like
 * @returns
 *
 * It splits a file extension from it's path and returns the path
 * and filename with extension. It also works for folders by
 * returning the folder name.
 */
export const extractPath = (path_like: string) => {
  const regex = /^(.*[\\/])([^\\/]+)$/;

  const match = path_like.match(regex);
  if (!match) {
    return null;
  }

  const path = match[1];
  const filename_ext = match[2];

  return { path, filename_ext };
};

export function getParentFolderInfo(path: string) {
  const regex = /\/desktop\/([^\/]+?)(?=\/|$)/i;
  const match = path.match(regex);

  if (!match) {
    return {
      isOnDesktop: false,
      label: null,
    };
  }

  return {
    isOnDesktop: true,
    label: match[1],
  };
}

type Variables = "root_user";

export function interpolate(
  template: string,
  variables: Record<Variables, string>
) {
  return template.replace(/{{(.*?)}}/g, (_, key: Variables) => {
    return key in variables ? variables[key] : `{{${key}}}`;
  });
}

export const findHandler = (filePath: string) => {
  const fileHandlers = {
    Image_Viewer: [".png", ".jpg"],
    Plyr_Video: [".mp4", ".mov"],
    Notepad: [".txt"],
    Plyr_Audio: [".mp3"],
  };

  const extension = filePath.slice(filePath.lastIndexOf(".")).toLowerCase();

  for (const [handler, extensions] of Object.entries(fileHandlers)) {
    if (extensions.includes(extension)) {
      return handler;
    }
  }

  return "Unknown_Handler";
};
