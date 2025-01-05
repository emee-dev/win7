<script lang="ts">
  import {
    Directory,
    FileItem,
    getFs,
    type TaskManagerItem,
  } from "@/components/desktop/file_system.svelte";
  import { getIconByProgramId, interpolate } from "@/components/desktop/utils";
  import Window from "./window.svelte";
  import { Window as WindowWIP } from "@/components/window_inprogress";
  import Icon from "svelte-awesome";
  import arrowLeft from "svelte-awesome/icons/arrowLeft";
  import { onMount, untrack } from "svelte";
  import { getHistory } from "./undoRedo.svelte";

  const fs = getFs();
  const history = getHistory();

  type NotepadProps = {
    placement?: {
      x: number;
      y: number;
    };
  } & TaskManagerItem;

  let {
    label,
    id: windowId,
    programId,
    placement = $bindable({ x: 0, y: 0 }),
    meta = {
      folder_path: "C:",
    },
  }: NotepadProps = $props();

  type FileType = {
    name: string;
    mimetype?: string | null;
    content?: string | null;
    type: "File";
    path?: string;
  };

  type FolderType = {
    name: string;
    type: "Folder";
    path?: string;
  };

  type Folder = FileType | FolderType;

  const onclose = () => {
    fs.terminateTask(windowId);
    console.log("windowId", windowId);
  };

  const onminimize = () => {
    fs.modifyTask(windowId, { windowStatus: "minimized" });
  };

  let folderItems = $state<Folder[]>([]);

  $effect(() => {
    const items = fs.fs!.readRaw(history.peek());

    if (!items) {
      return console.log("Folder is potentially empty.");
    }

    const formatted = items.map((item) => {
      if (item instanceof FileItem) {
        return {
          name: item.name,
          type: "File",
          mimetype: item.mimetype,
          content: item.content as string,
          path: item.full_path,
        };
      } else {
        return {
          name: item.name,
          type: "Folder",
          path: item.full_path,
        };
      }
    }) as (FileType | FolderType)[];

    untrack(() => (folderItems = formatted));
  });

  $inspect(history.peek()).with((t, v) => console.log("peek()", v));
  $inspect(history.getHistory()).with((t, v) => console.log("getHistory()", v));

  const quickAccess = [
    {
      icon: "",
      label: "Desktop",
      path: "C:/Users/{{root_user}}/Desktop",
    },
    {
      icon: "",
      label: "Downloads",
      path: "C:/Users/{{root_user}}/Downloads",
    },
    {
      icon: "",
      label: "Documents",
      path: "C:/Users/{{root_user}}/Documents",
    },
    {
      icon: "",
      label: "Music",
      path: "C:/Users/{{root_user}}/Music",
    },
    {
      icon: "",
      label: "Pictures",
      path: "C:/Users/{{root_user}}/Pictures",
    },
    {
      icon: "",
      label: "Videos",
      path: "C:/Users/{{root_user}}/Videos",
    },
  ];
</script>

<Window title="File Explorer" showBarMenu>
  <div class="px-1 grid grid-cols-[220px_1fr] h-full">
    <div class="sidebar w-[220px] h-full bg-green-300">
      <ul class="tree-view">
        <li>
          <details open>
            <summary> Quick access </summary>

            <ul>
              {#each quickAccess as item}
                <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
                <li
                  onclick={() =>
                    history.append(
                      interpolate(item.path, { root_user: fs.getUser() })
                    )}
                >
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
    <div class="folder_viewflex-1 h-full">
      <form
        class="flex flex-col"
        onsubmit={(e) => {
          e.preventDefault();

          const form = new FormData(e.currentTarget);

          const input = form.get("path") as string;

          if (!input) {
            return console.log("input is empty");
          }

          // currentPath = currentPath + input.trim();
          // currentPath = input.trim();
          history.append(input.trim());
        }}
      >
        <input
          type="text"
          name="path"
          autocomplete="off"
          placeholder="Enter folder eg /Desktop"
        />

        <button type="submit"> Load Path </button>
      </form>
      <div class="flex flex-col">
        <span class="px-2 font-medium text-base">Folders</span>

        <div>
          <div class="bg-blue-300">
            {#if history.isRewindPossible()}
              <span>Can Rewind</span>
            {:else}
              <span>Cannot Rewind</span>
            {/if}
          </div>

          <div class="bg-green-300">
            {#if history.isForwardPossible()}
              <span>Can Forward</span>
            {:else}
              <span>Cannot Forward</span>
            {/if}
          </div>
        </div>

        {#if folderItems.length > 0}
          <div class="flex flex-wrap gap-2 p-3">
            {#each folderItems as item (item.name)}
              <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
              <div
                class="w-[200px] h-[25%] flex program rounded-sm"
                onclick={(e) => {}}
                ondblclick={() => {
                  console.log("Item", `/${item.name}`);
                }}
              >
                <div class="size-[55px] object-center">
                  <img
                    src="/img/text_file.webp"
                    alt="abc"
                    class="size-full object-fill"
                  />
                </div>

                <div class=" mt-2 w-[calc(100%-50px)] flex flex-col gap-y-1">
                  <span class="truncate">{item.name.toLowerCase()}</span>
                  <span>12/22/2222</span>
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
