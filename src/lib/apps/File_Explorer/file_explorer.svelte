<script lang="ts">
  import {
    getFs,
    type TaskManagerItem,
  } from "@/components/desktop/file_system.svelte";
  import { getIconByProgramId, interpolate } from "@/components/desktop/utils";
  import { Window } from "@/components/window_inprogress";
  import { getWindowContext } from "@/components/window_inprogress/ctx.svelte";
  import { onMount, untrack } from "svelte";
  import { setHistory } from "./undoRedo.svelte";
  import { formatFs, type Folder } from "./utils";

  const fs = getFs();
  const history = setHistory();

  export type FileExplorerProps = TaskManagerItem & {
    meta: {
      folder_path: string;
    };
    placement?: {
      x: number;
      y: number;
    };
  };

  let {
    label,
    id: windowId,
    programId,
    placement = $bindable({ x: 0, y: 0 }),
    meta = $bindable({ folder_path: "C:" }),
  }: FileExplorerProps = $props();

  const quickAccess = [
    {
      icon: "",
      label: "Desktop",
      path: "C:/Libraries/Desktop",
    },
    {
      icon: "/img/file_explorer_downloads.webp",
      label: "Downloads",
      path: "C:/Libraries/Downloads",
    },
    {
      icon: "",
      label: "Documents",
      path: "C:/Libraries/Documents",
    },
    {
      icon: "",
      label: "Music",
      path: "C:/Libraries/Music",
    },
    {
      icon: "",
      label: "Pictures",
      path: "C:/Libraries/Pictures",
    },
    {
      icon: "",
      label: "Videos",
      path: "C:/Libraries/Videos",
    },
  ];

  let folderItems = $state<Folder[]>([]);

  const onclose = () => {
    fs.terminateTask(windowId);
    console.log("windowId", windowId);
  };

  const onminimize = () => {
    fs.modifyTask(windowId, { windowStatus: "minimized" });
  };

  onMount(() => {
    const items = fs.getFolder(history.append(meta.folder_path));
    const formatted = formatFs(items);
    folderItems = formatted;
  });

  $effect(() => {
    const currentHistory = history.peek();
    const items = fs.getFolder(currentHistory);
    const formatted = formatFs(items);
    untrack(() => (folderItems = formatted));
  });
</script>

<Window
  {windowId}
  bind:placement
  showBarMenu
  style="width: 700px; height: 400px;"
  interactjs={{
    min: { width: 700, height: 400 },
  }}
>
  <Window.ExplorerHead title={label} icon={getIconByProgramId(programId)}>
    {#snippet minimize()}
      <Window.MinimizeBtn {onminimize} />
    {/snippet}

    {#snippet restore()}
      <Window.ResizeBtn />
    {/snippet}

    {#snippet close()}
      <Window.CloseBtn {onclose} />
    {/snippet}
  </Window.ExplorerHead>

  <Window.Content parentClass="has-scrollbar">
    <div
      class="px-1 grid grid-cols-[180px_1fr] h-full border-t-[1px] border-neutral-500/60"
    >
      <div
        class="sidebar w-[180px] border-r-[1px] h-full border-neutral-500/40"
      >
        <ul class="tree-view">
          <li>
            <details open>
              <summary class="flex items-center gap-x-1">
                <img
                  src="/img/file_explorer_libraries.webp"
                  alt="abc"
                  class="size-[15px] object-fill"
                /> Quick access
              </summary>

              <ul>
                {#each quickAccess as item}
                  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
                  <li
                    onclick={() =>
                      history.append(
                        interpolate(item.path, { root_user: fs.getUser() })
                      )}
                    class="flex items-center gap-x-1"
                  >
                    <img
                      src={item.icon}
                      alt="abc"
                      class="size-[15px] object-fill"
                    />
                    {item.label}
                  </li>
                {/each}
              </ul>
            </details>
          </li>
        </ul>
        <ul class="tree-view">
          <li>
            <details open>
              <summary> Computer </summary>
              <ul>
                <li>System (C:)</li>
                <li>DVD RW Drive (Z:)</li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
      <div class="folder_view flex-1 h-full">
        <div class="flex flex-col">
          <span class="px-2 py-1 font-medium text-base">Folders</span>
          {#if folderItems.length > 0}
            <div class="flex flex-wrap gap-2 p-3">
              {#each folderItems as item (item.name)}
                <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                <div
                  class="w-[200px] h-[25%] flex program rounded-sm"
                  onclick={(e) => {}}
                  ondblclick={() => {
                    if (item.type === "Folder") {
                      history.append(item.path as string);
                    }
                  }}
                >
                  <div class="size-[55px] object-center">
                    <img
                      src={item.icon}
                      alt="folder icon"
                      class="size-full object-fill"
                    />
                  </div>

                  <div class=" mt-2 w-[calc(100%-50px)] flex flex-col gap-y-1">
                    <span class="truncate">{item.name}</span>
                    <!-- <span>12/22/2222</span> -->
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="w-full justify-center flex">
              <span>This folder is empty</span>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </Window.Content>
</Window>

<style>
  .program {
    box-sizing: border-box;
    border: 1px solid transparent;
    position: relative;
  }

  :global(.program.active) {
    border-color: #7da2ce;
    background: linear-gradient(0deg, #c1dcfc, #dcebfc);
    -webkit-box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.6666666667);
    box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.6666666667);
  }

  .program:not(.active):hover {
    border-color: #b8d6fc;
    background: linear-gradient(0deg, #f2f7fe, #fcfdfe);
    -webkit-box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.6666666667);
    box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.6666666667);
  }
</style>
