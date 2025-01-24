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
  } from "@/components/desktop/file_system.svelte";
  import { FolderDatabase, persistItem } from "@/components/desktop/indexeddb";
  import { findHandler, getDesktopIcon } from "@/components/desktop/utils";
  import { Selecto } from "@/components/selecto";
  import * as ContextMenu from "@/components/ui/context-menu/index";
  import { type MenuProps } from "@/components/ui/popup_menu";
  import { listItem } from "@/components/ui/popup_menu/popup_menu.svelte";
  import { StartMenu } from "@/components/ui/startmenu";
  import Taskbar from "@/components/ui/taskbar/taskbar.svelte";
  import {
    desktopBackgrounds,
    mediaAssets,
    textFiles,
    windows7Folders,
  } from "@/const";
  import { useDropzone } from "@/hooks/Dropzone";
  import { onMount } from "svelte";
  import { hasWindow } from "std-env";
  import { Howl } from "howler";
  import Button from "@/components/ui/button/button.svelte";

  let sound: Howl;
  let desktop: HTMLElement;
  // svelte-ignore non_reactive_update
  let videoElement: HTMLVideoElement;
  // svelte-ignore non_reactive_update
  let startMenu: HTMLDivElement | null = null;

  const fs = os.initFs("Guest");
  const desktopPath = "C:/Libraries/Desktop";

  let mouseCoordinates = $state({ x: 0, y: 0 });
  let isStartMenuOpen = $state(false);
  let isOpen = $state(false);
  let over_dropzone = $state(false);
  let files_data = $state<File[]>([]);
  let hasBootEnded = $state(process.env.NODE_ENV === "development" || false);
  let currentBg = $state<string>(mediaAssets.DesktopDefaultBackground);

  onMount(() => {
    sound = new Howl({
      src: ["https://z4woa7oobctpvgvy.public.blob.vercel-storage.com/boot.mp3"],
    });

    fs.mount({
      desktop,
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

  const onMouseMove = (ev: any) => {
    mouseCoordinates.x = ev.clientX;
    mouseCoordinates.y = ev.clientY;
  };

  const onItemClick = (d: MenuProps) => (isOpen = !isOpen);
  const hover = (data: CustomEvent<boolean>) => (over_dropzone = data.detail);

  async function on_file_drop(data: CustomEvent<File[]>) {
    try {
      const files = data.detail;
      const db = fs.getFolderDb();

      if (!files) {
        return;
      }

      if (!db) {
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

  const menuItems: MenuProps[] = [
    {
      icon: "https://img.icons8.com/color/18/000000/monitor--v1.png",
      label: "Sort by",
      subMenu: [
        {
          label: "Name",
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
      hasDivider: "has-divider",
      isDisabled: true,
    },
    {
      icon: "https://img.icons8.com/color/18/000000/remote-desktop.png",
      label: "Toggle wallpaper",
      onclick() {
        let bgs = Object.values(desktopBackgrounds);

        let randomBg = Math.ceil(Math.random() * bgs.length);

        let bg = bgs[randomBg];

        currentBg = bg;
      },
    },
  ];
</script>

<Selecto>
  <ContextMenu.Root open={isOpen} onOpenChange={(v) => (isOpen = v)}>
    <ContextMenu.Trigger oncontextmenu={(e) => e.stopPropagation()}>
      <!-- svelte-ignore a11y_media_has_caption -->
      <main
        class="desktop relative h-screen scrollbar-hide overflow-hidden select-none"
        bind:this={desktop}
        onmousemove={onMouseMove}
        style="--icon: url('{currentBg}');"
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

        <StartMenu bind:isStartMenuOpen bind:startMenu />
        <Taskbar bind:isStartMenuOpen bind:startMenu />
      </main>
    </ContextMenu.Trigger>
    <ContextMenu.Content class="z-50 w-full max-w-[229px] outline-none">
      <ul
        role="menu"
        style="width: 200px"
        class="can-hover select-none outline-none"
      >
        {#each menuItems as item (item.label)}
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
