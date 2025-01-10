import type { MountableFile } from "@/components/desktop/file_system.svelte";

export const windows7Folders = [
  "C:/Users/Public",
  "C:/Program Files",
  "C:/Program Files (x86)",
  "C:/Windows",
  "C:/Users/{{root_user}}/Favorites",
  "C:/Users/{{root_user}}/AppData",
  "C:/Users/{{root_user}}/AppData/Local",
  "C:/Users/{{root_user}}/AppData/Roaming",
  "C:/Users/{{root_user}}/AppData/LocalLow",
  "C:/Users/{{root_user}}/Links",
  "C:/Users/{{root_user}}/Saved Games",
  "C:/Users/{{root_user}}/Searches",
  "C:/Recycle Bin",
  "C:/Network",
  "C:/Control Panel",
  "C:/Libraries/Desktop",
  "C:/Libraries/Documents",
  "C:/Libraries/Downloads",
  "C:/Libraries/Music",
  "C:/Libraries/Pictures",
  "C:/Libraries/Videos",
];

export const mediaAssets = {
  DesktopBackground:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/bg.jpg",
  Bootvideo:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/boot_sample.mp4",
  AccountProfileRing:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/account_profile_ring.webp",
  ActionCenterFlag:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/action_center_flag.webp",
  CalculatorIcon:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/calculator.webp",
  FileExplorerIcon:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/file_explorer.webp",
  FileExplorerDownloads:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/file_explorer_downloads.webp",
  FileExplorerGenericFolder:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/generic_folder.webp",
  FileExplorerDesktop:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/desktop.webp",
  FileExplorerLibraries:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/file_explorer_libraries.webp",
  FileExplorerToggle:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/file_explorer_toggle.webp",
  FolderEmpty:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/folder_empty.webp",
  FolderWithFile:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/folder_with_file.png",
  FolderWithIcons:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/folder_with_folders.png",
  MediaFile:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/media_file.webp",
  MyComputerIcon:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/mycomputer.webp",
  NotepadIcon:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/notepad.webp",
  MediaPlayerIcon:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/player.webp",
  PlyrVideo:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/plyr_video.png",
  RecycleEmpty:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/recycle_empty.png",
  RecycleFilled:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/recycle_filled.png",
  StartButton:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/startbutton.webp",
  StartMenuGuest:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/startmenu_guest.webp",
  TextFileIcon:
    "https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/text_file.webp",
} as const;

export let textFiles = [
  {
    type: "file",
    textContent:
      "Svelte 5 Hackathon Ideas:\n- Build a dynamic weather dashboard with real-time updates.\n- Create a minimalist task management app with drag-and-drop functionality.\n- Develop an interactive learning platform with quizzes and progress tracking.\n\nRemember: Simplicity, performance, and user experience are key!\n\nHackathon website: https://hack.sveltesociety.dev/2024",
    mount_to: "C:/Libraries/Desktop/inspiration-ideas.txt",
  },
  {
    type: "file",
    textContent:
      "Essential Svelte 5 Tips:\n- Leverage Svelte's reactivity for real-time data updates.\n- Use Svelte stores for state management across components.\n- Optimize your app's performance with code splitting and lazy loading.\n\nInspiration: \"The best way to predict the future is to create it.\"\n\nHackathon website: https://hack.sveltesociety.dev/2024",
    mount_to: "C:/Libraries/Desktop/svelte-tips.txt",
  },
  {
    type: "file",
    textContent:
      'Hackathon Motivation:\n- Stay focused on your goals and keep iterating on your ideas.\n- Collaboration and feedback are crucial—don’t hesitate to ask for help.\n- Push your limits and try something new with Svelte 5’s features.\n\n"Innovation distinguishes between a leader and a follower." – Steve Jobs\n\nHackathon website: https://hack.sveltesociety.dev/2024',
    mount_to: "C:/Libraries/Desktop/hackathon-motivation.txt",
  },
].map((item) => {
  return {
    type: "file",
    blob: new Blob([item.textContent], { type: "text/plain" }),
    mount_to: item.mount_to,
    meta: {
      storage: "static",
    },
  };
}) as MountableFile[];
