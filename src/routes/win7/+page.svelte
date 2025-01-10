<script lang="ts">
  import "7.css/dist/gui/global.css";
  import "7.css/dist/gui/menu.css";
  import "7.css/dist/gui/progressbar.css";
  import "7.css/dist/gui/scrollbar.css";
  import "7.css/dist/gui/searchbox.css";
  import "7.css/dist/gui/tabs.css";
  import "7.css/dist/gui/treeview.css";
  import "7.css/dist/gui/balloon.css";
  import "7.css/dist/gui/window.css";
  import { DesktopWindows, os } from "@/components/desktop";
  import DesktopIcons from "@/components/desktop/desktop_icons.svelte";
  import type {
    DesktopFile,
    ExtraIconProps,
    MountableFile,
  } from "@/components/desktop/file_system.svelte";
  import { FolderDatabase, persistItem } from "@/components/desktop/indexeddb";
  import {
    findHandler,
    getDesktopIcon,
    menuItems,
  } from "@/components/desktop/utils";
  import { Selecto } from "@/components/selecto";
  import * as ContextMenu from "@/components/ui/context-menu/index";
  import { type MenuProps } from "@/components/ui/popup_menu";
  import { listItem } from "@/components/ui/popup_menu/popup_menu.svelte";
  import { StartMenu } from "@/components/ui/startmenu";
  import Taskbar from "@/components/ui/taskbar/taskbar.svelte";
  import { mediaAssets, textFiles, windows7Folders } from "@/const";
  import { useDropzone } from "@/hooks/Dropzone";
  import { onDestroy, onMount } from "svelte";
  import { hasWindow } from "std-env";
  import { Howl } from "howler";

  let sound: Howl;
  let desktop: HTMLElement;
  let db: FolderDatabase | null;
  let videoElement: HTMLVideoElement;
  const fs = os.initFs("Guest");

  let mouseCoordinates = $state({ x: 0, y: 0 });
  let isStartMenuOpen = $state(false);
  let hasBootEnded = $state(process.env.NODE_ENV === "development" || false);

  onMount(() => {
    db = new FolderDatabase();
    sound = new Howl({
      src: ["https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/boot.mp3"],
    });

    fs.mount({
      desktop,
      db,
      dir: windows7Folders,
      files: [
        {
          fileName: "MyComputer.exe",
          programId: "File_Explorer",
          type: "executable",
          meta: {
            folder_path: "C:/Control Panel",
          },
          mount_to: "C:/Libraries/Desktop/MyComputer.exe",
        },
        ...textFiles,
      ],
    });
  });

  onDestroy(() => {
    if (db) {
      db = null;
    }
  });

  const onMouseMove = (ev: any) => {
    mouseCoordinates.x = ev.clientX;
    mouseCoordinates.y = ev.clientY;
  };

  const desktopPath = "C:/Libraries/Desktop";

  let over_dropzone = $state(false);

  let files_data = $state<File[]>([]);

  function hover(data: CustomEvent<boolean>) {
    over_dropzone = data.detail;
  }

  async function on_file_drop(data: CustomEvent<File[]>) {
    try {
      const files = data.detail;

      if (!files) {
        return;
      }

      if (files.length > 1) {
        console.log(
          `We only accept single files at the moment. You provided ${files.length}.`
        );
        return;
      }

      // For now we are handling single files
      const file = files[0];
      const blob = new Blob([file], { type: file.type });

      // Persist custom/user created files in indexeddb
      let { column, row } = fs.placeNextIcon();

      let file_path = `${desktopPath}/${file.name}`;

      // persist user created files
      await persistItem(db as FolderDatabase, {
        blob,
        type: "file",
        storage: "indexeddb",
        path: file_path,
      });

      fs.getDesktopFiles().push({
        id: crypto.randomUUID(),
        label: file.name,
        type: "file",
        executeBy: findHandler(file_path),
        placement: { column, row },
        file_path: file_path,
        meta: {
          storage: "indexeddb",
        },
        icon: getDesktopIcon(file_path),
      } as DesktopFile & ExtraIconProps);

      files_data = files;
    } catch (err) {
      console.log("Error", err);
    }
  }

  let isOpen = $state(false);

  const onItemClick = (d: MenuProps) => {
    isOpen = !isOpen;
  };

  console.log(process.env.NODE_ENV);

  $effect(() => {
    if (!videoElement) {
      return;
    }

    if (!hasWindow) {
      return;
    }

    const handler = () => {
      hasBootEnded = true;
      sound.play();
    };

    videoElement.addEventListener("ended", handler);

    return () => {
      videoElement.removeEventListener("ended", handler);
    };
  });
</script>

<Selecto>
  <ContextMenu.Root open={isOpen} onOpenChange={(v) => (isOpen = v)}>
    <ContextMenu.Trigger oncontextmenu={(e) => e.stopPropagation()}>
      <!-- svelte-ignore a11y_media_has_caption -->
      <main
        class="desktop relative h-screen scrollbar-hide overflow-hidden select-none"
        bind:this={desktop}
        onmousemove={onMouseMove}
        style="--icon: url('{mediaAssets.DesktopBackground}');"
        use:useDropzone
        onhover={hover}
        onfiles={on_file_drop}
      >
        {#each fs.getDesktopFiles() as item (item.id)}
          <DesktopIcons {...item as any} />
        {/each}

        {#each fs.getTasks() as window (window.id)}
          <DesktopWindows {...window as any} />
        {/each}

        {#if !hasBootEnded}
          <div
            class="absolute z-[9999999] flex items-center justify-center bg-black size-full"
          >
            <div class="w-[50%] h-auto">
              <video
                class="object-fill"
                muted
                autoplay
                playsinline
                bind:this={videoElement}
              >
                <source src={mediaAssets.Bootvideo} type="video/mp4" />
              </video>
            </div>
          </div>
        {/if}

        <!-- <div class="flex ml-[200px]">
          {#if over_dropzone}
            <span>Over zone</span>
          {:else}
            <span>Not over zone</span>
          {/if}
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
          <Button
            class="ml-auto"
            onclick={() => {
              let { column, row } = fs.placeNextIcon();

              fs.createDesktopIcon({
                id: crypto.randomUUID(),
                label: "abc.txt",
                type: "file",
                executeBy: "Plyr_Video",
                placement: { column, row },
              } as DesktopFile & ExtraIconProps);
            }}
          >
            Add new icon
          </Button>
          <Button
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
          </Button>
          <Button
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
          </Button>
          <Button
            onclick={() => {
              // fs.serializeFs();
              // console.log(fs.getFolder("C:"));
            }}
            >Serialize FS
          </Button>
        </div> -->

        <StartMenu bind:isStartMenuOpen />
        <Taskbar bind:isStartMenuOpen />
      </main>
    </ContextMenu.Trigger>
    <ContextMenu.Content class="z-50 w-full max-w-[229px] outline-none">
      <ul
        role="menu"
        style="width: 200px"
        class="can-hover select-none outline-none"
      >
        {#each menuItems as item (item.label)}
          <!-- TODO add context handling -->
          {@render listItem(item, onItemClick)}
        {/each}
      </ul>
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
