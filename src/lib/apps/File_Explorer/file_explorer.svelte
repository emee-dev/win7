<script lang="ts">
  import {
    Directory,
    FileItem,
    getFs,
    type TaskManagerItem,
  } from "@/components/desktop/file_system.svelte";
  import { getIconByProgramId } from "@/components/desktop/utils";
  import Window from "./window.svelte";
  import { Window as WindowWIP } from "@/components/window_inprogress";
  import Icon from "svelte-awesome";
  import arrowLeft from "svelte-awesome/icons/arrowLeft";
  import { onMount, untrack } from "svelte";
  import { setHistory } from "./undoRedo.svelte";

  const fs = getFs();

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
  }: NotepadProps = $props();

  type FileType = {
    name: string;
    mimetype?: string | null;
    content?: string | null;
    type: "File";
  };

  const history = setHistory();

  type FolderType = {
    name: string;
    type: "Folder";
  };

  type CurrentRender = FileType | FolderType;

  const onclose = () => {
    fs.terminateTask(windowId);
    console.log("windowId", windowId);
  };

  const onminimize = () => {
    fs.modifyTask(windowId, { windowStatus: "minimized" });
  };

  // let currentPath = $state("C:");
  let folderItems = $state<CurrentRender[]>([]);

  $effect(() => {
    // const items = fs.fs!.readRaw(currentPath || "Null Folder");
    const items = fs.fs!.readRaw(history.peek() || "Null Folder");

    if (!items) {
      return console.log("Folder is potentially empty.");
    }

    let formatted = items.map((item) => {
      if (item instanceof FileItem) {
        return {
          name: item.name,
          type: "File",
          mimetype: item.mimetype,
          content: item.content as string,
          path: item.full_path,
          // path: `/${item.name}`,
        };
      } else {
        return {
          name: item.name,
          type: "Folder",
          path: item.full_path,
          // path: `/${item.name}`,
        };
      }
    }) as (FileType | FolderType)[];

    console.log("formatted", formatted);

    untrack(() => (folderItems = formatted));
  });

  $inspect(history.peek()).with((t, v) => console.log("peek()", v));
  $inspect(history.getHistory()).with((t, v) => console.log("getHistory()", v));
</script>

<!-- <WindowWIP
  {windowId}
  showBarMenu
  bind:placement
  style="width: 700px; height: 400px;"
  interactjs={{ min: { height: 300, width: 400 } }}
>
  <WindowWIP.Head title={label} icon={getIconByProgramId(programId)}>
    <WindowWIP.MinimizeBtn {onminimize} />
    <WindowWIP.ResizeBtn />
    <WindowWIP.CloseBtn {onclose} />
  </WindowWIP.Head>

  <WindowWIP.Content>
    <div
      class="h-[calc(100%_-_28px)] overflow-hidden px-1 min-h-full [&>*]:min-w-[375px]"
    >
      <textarea
        spellcheck="false"
        class="h-full pt-1 text-balance has-scrollbar flex-1 w-full"
        bind:value={text}
      ></textarea>
    </div>
  </WindowWIP.Content>
</WindowWIP> -->

<Window title="File Explorer" showBarMenu={false}>
  <div class="px-1 grid grid-cols-[220px_1fr] h-full">
    <div class="sidebar w-[220px] h-full bg-green-300">
      <ul class="tree-view">
        <li>
          <details open>
            <summary> Quick access </summary>
            <ul>
              <li>Desktop</li>
              <li>Downloads</li>
              <li>Documents</li>
              <li>Music</li>
              <li>Pictures</li>
              <li>Videos</li>
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
        Folders

        {#if !folderItems || folderItems.length === 0}
          <div class="w-full">Empty folers</div>
        {:else}
          <div class="flex flex-wrap gap-x-3">
            {#each folderItems as item (item.name)}
              <div
                class="w-[180px] h-[70px] bg-red-200 rounded-md"
                ondblclick={() => {
                  console.log("Item", `/${item.name}`);
                }}
              >
                {item.name.toLowerCase()}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</Window>

<style>
  textarea {
    overflow: auto;
    overflow-y: scroll;
    font:
      normal 13px "Lucida Console",
      Monaco,
      Courier,
      Monospace;
    resize: none;
    padding: 0;
    margin: 0;
    line-height: 1.5; /* Ensure even line height */
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
