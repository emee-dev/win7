// /**
//  * Extracts the path and the last folder or file name with extension.
//  *
//  * @param path_like - The full path of the file or folder.
//  * @returns An object with `path` (directory) and `filename_ext` (file or folder name).
//  */
// export const extractPath = (path_like) => {
//   const regex = /^(.*[\/])([^\/]+)$/;

//   const match = path_like.match(regex);
//   if (!match) {
//     return null;
//   }

//   const path = match[1];
//   const filename_ext = match[2];

//   return { path, filename_ext };
// };

function collapseDesktopFolders(dir) {
  const desktopFolders = dir.filter((path) => /\/Desktop(\/|$)/.test(path));

  const collapsedFolders = desktopFolders.reduce((result, path) => {
    const parent = result.find((p) => path.startsWith(p + "/"));
    if (!parent) {
      result.push(path);
    }
    return result;
  }, []);

  return collapsedFolders;
}

const dir = [
  "C:",
  "C:/Users",
  "C:/Users/:root",
  "C:/Users/:root/Desktop",
  "C:/Users/:root/Desktop/New folder",
  "C:/Users/:root/Desktop/Abc",
  "C:/Users/:root/Desktop/Abc/Opp/SK",
  "C:/Users/:root/Desktop/Op/Opp/SK",
];

const result = collapseDesktopFolders(dir);
console.log(result);
