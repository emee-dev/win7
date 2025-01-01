<script lang="ts">
  import { ContextMenu } from "@/components/context_menu_inprogress";
  import { DesktopWindows, os } from "@/components/desktop";
  import DesktopIcons from "@/components/desktop/desktop_icons.svelte";
  import { Selecto } from "@/components/selecto";
  import { Win7ContextMenu } from "@/components/ui/popup_menu";
  import { StartMenu } from "@/components/ui/startmenu";
  import Taskbar from "@/components/ui/taskbar/taskbar.svelte";
  import { onMount } from "svelte";
  import { menuItems } from "@/components/desktop/utils";
  import Window from "@/components/window/window.svelte";
  import Notepad from "@/apps/Notepad/notepad.svelte";

  let desktop: HTMLElement;

  const fs = os.initFs(":root");

  let mouseCoordinates = $state({ x: 0, y: 0 });

  let isStartMenuOpen = $state(false);

  onMount(() => {
    fs.mount({
      desktop,
      dir: [
        "C:",
        "C:/Users",
        "C:/Users/:root",
        "C:/Users/:root/Desktop",
        "C:/Users/:root/Desktop/New folder",
      ],
      files: [
        {
          fileName: "MyComputer.exe",
          programId: "MyComputer",
          type: "executable",
          mount_to: "C:/Users/:root/Desktop/MyComputer.exe",
        },
        {
          fileName: "npm.txt",
          executeBy: "Notepad",
          type: "file_or_folder",
          textContent: "the following is my npm private keys.",
          mimetype: "application/text",
          mount_to: "C:/Users/:root/Desktop/npm.txt",
        },
        {
          fileName: "exam.txt",
          executeBy: "Notepad",
          type: "file_or_folder",
          textContent: "the following is my npm private keys.",
          mimetype: "application/text",
          mount_to: "C:/Users/:root/Desktop/exam.txt",
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
  <ContextMenu.Root>
    <ContextMenu.Trigger
      oncontextmenu={(e) => {
        // Prevent accidental context menu on elements other than the desktop
        if (e.target !== desktop) {
          e.stopPropagation();
          e.preventDefault();

          return;
        }
      }}
    >
      <main
        class="desktop relative h-screen scrollbar-hide overflow-hidden select-none"
        bind:this={desktop}
        onmousemove={onMouseMove}
        style="--icon: url('{Icon}');"
      >
        <DesktopIcons />

        <div class="flex">
          <button
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
          </button>
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
              // console.log("Folders", fs.getFolder("C:/Users/:root/Desktop"));
              console.log("Folders", fs.getFolder("C:/Users/:root/Desktop"));
            }}
            >Log fs
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
  </ContextMenu.Root>
</Selecto>

<style>
  .desktop {
    background-image: var(--icon);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
