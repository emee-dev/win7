<script lang="ts">
  import { setHistory } from "@/apps/File_Explorer/undoRedo.svelte";
  import { ContextMenu } from "@/components/context_menu";
  import { DesktopWindows, os } from "@/components/desktop";
  import DesktopIcons from "@/components/desktop/desktop_icons.svelte";
  import { menuItems } from "@/components/desktop/utils";
  import { Selecto } from "@/components/selecto";
  import { Win7ContextMenu } from "@/components/ui/popup_menu";
  import { StartMenu } from "@/components/ui/startmenu";
  import Taskbar from "@/components/ui/taskbar/taskbar.svelte";
  import { onMount } from "svelte";
  import { Button } from "@/components/ui/button";
  // import "7.css/dist/7.css";
  import "7.css/dist/gui/tabs.css";
  import "7.css/dist/gui/window.css";
  import "7.css/dist/gui/scrollbar.css";
  import "7.css/dist/gui/menu.css";
  import "7.css/dist/gui/searchbox.css";

  let desktop: HTMLElement;

  const fs = os.initFs("Guest");

  let mouseCoordinates = $state({ x: 0, y: 0 });

  let isStartMenuOpen = $state(false);

  // const windows7Folders = [
  //   "C:\\Users\\[Username]\\Desktop",
  //   "C:\\Users\\[Username]\\Documents",
  //   "C:\\Users\\[Username]\\Downloads",
  //   "C:\\Users\\[Username]\\Pictures",
  //   "C:\\Users\\[Username]\\Music",
  //   "C:\\Users\\[Username]\\Videos",
  //   "C:\\Users\\[Username]",
  //   "C:\\Users\\Public",
  //   "C:\\Program Files",
  //   "C:\\Program Files (x86)", // For 64-bit systems
  //   "C:\\Windows",
  //   "C:\\Users\\[Username]\\Favorites",
  //   "C:\\Users\\[Username]\\AppData", // Hidden system folder
  //   "C:\\Users\\[Username]\\AppData\\Local",
  //   "C:\\Users\\[Username]\\AppData\\Roaming",
  //   "C:\\Users\\[Username]\\AppData\\LocalLow",
  //   "C:\\Users\\[Username]\\Links", // Shortcuts like 'My Documents'
  //   "C:\\Users\\[Username]\\Saved Games",
  //   "C:\\Users\\[Username]\\Searches",
  //   "C:\\Recycle Bin",
  //   "C:\\Network",
  //   "C:\\Control Panel",
  //   "C:\\Libraries\\Documents",
  //   "C:\\Libraries\\Music",
  //   "C:\\Libraries\\Pictures",
  //   "C:\\Libraries\\Videos",
  // ];

  onMount(() => {
    fs.mount({
      desktop,
      dir: [
        "C:",
        "C:/Users",
        "C:/Users/{{root_user}}",
        "C:/Users/{{root_user}}/Desktop",
        "C:/Users/{{root_user}}/Downloads",
        "C:/Users/{{root_user}}/Documents",
        "C:/Users/{{root_user}}/Music",
        "C:/Users/{{root_user}}/Pictures",
        "C:/Users/{{root_user}}/Videos",
        "C:/Users/{{root_user}}/Desktop/New folder",
        "C:/Users/{{root_user}}/Documents",
      ],
      files: [
        {
          fileName: "MyComputer.exe",
          programId: "MyComputer",
          type: "executable",
          mount_to: "C:/Users/{{root_user}}/Desktop/MyComputer.exe",
        },
        {
          fileName: "npm.txt",
          executeBy: "Notepad",
          type: "file",
          textContent: "the following is my npm private keys.",
          mimetype: "application/text",
          mount_to: "C:/Users/{{root_user}}/Desktop/npm.txt",
        },
        {
          fileName: "exam.txt",
          executeBy: "Notepad",
          type: "file",
          textContent: "the following is my npm private keys.",
          mimetype: "application/text",
          mount_to: "C:/Users/{{root_user}}/Desktop/exam.txt",
        },
        {
          fileName: "exam.txt",
          executeBy: "Notepad",
          type: "file",
          textContent: "the following is my npm private keys.",
          mimetype: "application/text",
          mount_to: "C:/Users/{{root_user}}/Documents/exam.txt",
        },
      ],
    });
  });

  const onMouseMove = (ev: any) => {
    mouseCoordinates.x = ev.clientX;
    mouseCoordinates.y = ev.clientY;
  };

  const Icon = "/img/bg.jpg";
</script>

<Selecto>
  <ContextMenu>
    <ContextMenu.Trigger>
      <main
        class="desktop relative h-screen scrollbar-hide overflow-hidden select-none"
        bind:this={desktop}
        onmousemove={onMouseMove}
        style="--icon: url('{Icon}');"
      >
        <DesktopIcons />

        <div class="flex">
          <Button
            class="ml-auto"
            onclick={() => {
              fs.launchTask({
                id: crypto.randomUUID(),
                label: "File_Explorer",
                taskStatus: "running",
                windowStatus: "inview",
                pinnedToTaskbar: false,
                programId: "File_Explorer",
                meta: {
                  folder_path: "C:/Users",
                },
              });
            }}
          >
            Start File_Explorer
          </Button>
          <!-- <button
            class="ml-auto"
            onclick={() => {
              let { column, row } = fs.placeNextIcon();

              // Create an executable shortcut
              // fs.createIcon({
              //   id: crypto.randomUUID(),
              //   label: "MyComputer.exe",
              //   programId: "MyComputer",
              //   type: "executable",
              //   placement: { column, row },
              // });
              fs.createIcon({
                id: crypto.randomUUID(),
                label: "RecycleBin.exe",
                programId: "RecycleBin",
                type: "executable",
                placement: { column, row },
              });

              // let { column: column2, row: row2 } = fs.placeNextIcon();

              // // Create a file shortcut
              // fs.createIcon({
              //   id: crypto.randomUUID(),
              //   label: "npm.txt",
              //   executeBy: "Notepad",
              //   type: "file_or_folder",
              //   placement: { column: column2, row: row2 },
              // });

              // let { column: column3, row: row3 } = fs.placeNextIcon();

              // // Create a folder shortcut
              // fs.createIcon({
              //   id: crypto.randomUUID(),
              //   label: "New folder",
              //   type: "file_or_folder",
              //   executeBy: "File_Manager",
              //   placement: { column: column3, row: row3 },
              // });
            }}
          >
            Add new icon
          </button> -->
          <button
            onclick={() => {
              fs.launchTask({
                id: crypto.randomUUID(),
                label: "Calculator",
                taskStatus: "running",
                windowStatus: "inview",
                pinnedToTaskbar: false,
                programId: "Calculator",
              });
            }}
            >Start Calculator
          </button>
          <button
            onclick={() => {
              fs.launchTask({
                id: crypto.randomUUID(),
                label: "Notepad",
                taskStatus: "running",
                windowStatus: "inview",
                pinnedToTaskbar: false,
                programId: "Notepad",
              });
            }}
            >Start Notepad
          </button>
          <button
            onclick={() => {
              // fs.serializeFs();
            }}
            >Serialize FS
          </button>
        </div>

        <DesktopWindows />

        <!-- <Notepad {...fs.getTasks?.()[0]} /> -->

        <StartMenu bind:isStartMenuOpen />
        <Taskbar bind:isStartMenuOpen />
      </main>
    </ContextMenu.Trigger>
    <ContextMenu.Content class="z-50 w-full max-w-[229px] outline-none">
      <Win7ContextMenu {menuItems} />
    </ContextMenu.Content>
  </ContextMenu>
</Selecto>

<style>
  .desktop {
    background-image: var(--icon);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
