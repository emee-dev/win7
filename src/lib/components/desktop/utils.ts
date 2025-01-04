import type { MenuProps } from "@/components/context_menu";

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
  // {
  //   label: "Refresh",
  //   hasDivider: "has-divider",
  // },
  // {
  //   label: "Paste",
  //   isDisabled: true,
  // },
  // {
  //   label: "Paste shortcut",
  //   // hasDivider: "has-divider",
  //   // isDisabled: true,
  // },
  // {
  //   icon: "https://img.icons8.com/color/18/000000/monitor--v1.png",
  //   label: "Screen resolution",
  // },
  // {
  //   icon: "https://img.icons8.com/color/18/000000/virtual-machine2.png",
  //   label: "Gadgets",
  // },
  // {
  //   icon: "https://img.icons8.com/color/18/000000/remote-desktop.png",
  //   label: "Personalize",
  // },
];

export type VariantPrograms = "RecycleBin";

// export type ProgramVariants = `${InstalledPrograms}_filled`;

export type NonVariantPrograms =
  | "Calculator"
  | "Notepad"
  | "MyComputer"
  | "File_Explorer";

export type InstalledPrograms = VariantPrograms | NonVariantPrograms;

// const abc: ProgramVariants = "";

export const getIconByProgramId = (program: InstalledPrograms) => {
  const installedPrograms = {
    Calculator: "/img/calculator.webp",
    MyComputer: "/img/mycomputer.webp",
    Notepad: "/img/notepad.webp",
    RecycleBin: "/img/recycle_empty.png",
    File_Explorer: "/img/file_explorer.webp",
    // RecycleBinFilled: "/img/recycle_filled.png",
  } as Record<InstalledPrograms, string>;

  return installedPrograms[program];
};

export const getDesktopIcon = (path_like: string): string => {
  const fileIcons = {
    txt: "/img/text_file.webp",
    mp4: "/img/video-file.webp",
    mkv: "/img/video-file.webp",
    avi: "/img/video-file.webp",
    mov: "/img/video-file.webp",
    webm: "/img/video-file.webp",
    jpg: "/img/image-file.webp",
    jpeg: "/img/image-file.webp",
    png: "/img/image-file.webp",
    gif: "/img/image-file.webp",
    bmp: "/img/image-file.webp",
    mp3: "/img/audio-file.webp",
    wav: "/img/audio-file.webp",
    flac: "/img/audio-file.webp",
    ogg: "/img/audio-file.webp",
    aac: "/img/audio-file.webp",
  } as Record<string, string>;

  const defaultIcons = {
    folder: "/img/folder_with_folders.png",
    emptyFolder: "/img/folder_empty.webp",
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

export const isMountedToDesktop = (path: string): boolean => {
  if (path.endsWith("/Desktop") || path.endsWith("/Desktop/")) {
    return true;
  } else {
    return false;
  }
};

// /**
//  * Checks if a folder exists and is mounted to the desktop path.
//  *
//  * @param folderPath - The path to check.
//  * @param desktopPath - The base desktop path.
//  * @returns The folder name if it exists in the desktop path, otherwise false.
//  */
// export const isFolderOnDesktop = (folderPath: string, desktopPath: string) => {
//   // Normalize desktopPath to ensure it matches `/Desktop` only
//   const normalizedDesktopPath = desktopPath.replace(/[\\/]+$/, "");

//   // Regex to match immediate folders within the desktop path
//   const desktopRegex = new RegExp(`^.*[\\/]Desktop[\\/]([^\\/]+)$`);

//   const match = folderPath.match(desktopRegex);
//   if (match) {
//     return match[1]; // Return the immediate folder name
//   }

//   return false;
// };

export const isFolderOnDesktop = (
  folderPath: string,
  desktopPath: string
): string | null => {
  const desktopIndex = folderPath.indexOf(desktopPath);

  // "/Desktop" not found
  if (desktopIndex === -1) {
    return null;
  }

  // Extract the part of the path after /Desktop
  const remainingPath = folderPath.slice(desktopIndex + desktopPath.length);

  // Check if the remaining path starts with a separator and extract the immediate folder
  const match = remainingPath.match(/^\/([^\/]+)/);

  if (match) {
    // Immediate folder name
    return match[1];
  }

  return null;
};
