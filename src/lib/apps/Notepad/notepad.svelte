<script lang="ts">
  import {
    getFs,
    type TaskManagerItem,
  } from "@/components/desktop/file_system.svelte";
  import { getIconByProgramId } from "@/components/desktop/utils";
  import { Window } from "@/components/window";
  import { onDestroy, onMount } from "svelte";

  let defaultText = $state(
    `Svelte is a UI framework that uses a compiler to let you write
  breathtakingly concise components that do minimal work in the browser, using
  languages you already know — HTML, CSS and JavaScript. It’s a love letter to
  web development. But don’t take our word for it. Developers consistently
  rank Svelte as the framework they’re most excited about using.`.trim()
  );

  const fs = getFs();

  type NotepadProps = TaskManagerItem & {
    placement?: {
      x: number;
      y: number;
    };
    file_path: string;
    meta?: {
      storage?: "indexeddb";
    };
  };

  let {
    label,
    id: windowId,
    programId,
    file_path,
    placement = $bindable({ x: 0, y: 0 }),
    meta,
    ...rest
  }: NotepadProps = $props();

  type BlobResults = {
    url: string;
    content: string;
  };

  let objectUrl = $state<BlobResults | null>(null);

  const onclose = () => {
    fs.terminateTask(windowId);
    console.log("windowId", windowId);
  };

  const onminimize = () => {
    fs.modifyTask(windowId, { windowStatus: "minimized" });
  };

  async function fetchContent(url: string) {
    const response = await fetch(url);
    return await response.text();
  }

  // TODO add error handling.
  async function loadTextFile() {
    if (meta && file_path && meta.storage === "indexeddb") {
      let fileItem = await fs.getPersistedFileByPath(file_path);

      if (!fileItem) {
        return;
      }

      let url = URL.createObjectURL(fileItem.blob);

      objectUrl = { url, content: await fetchContent(url) };

      return;
    }

    if (!file_path) {
      return;
    }

    let textFile = fs.fs?.readFile(file_path);

    if (!textFile) {
      return;
    }

    objectUrl = {
      url: "",
      content: (await textFile?.readAsText()) || defaultText,
    };
  }

  onMount(() => {
    loadTextFile();
  });

  onDestroy(() => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl.url);
    }
  });
</script>

<Window
  {windowId}
  showBarMenu
  bind:placement
  style="width: 700px; height: 400px;"
  interactjs={{ min: { height: 300, width: 400 } }}
>
  <Window.Head title={label} icon={getIconByProgramId("Notepad")}>
    <Window.MinimizeBtn {onminimize} />
    <Window.ResizeBtn />
    <Window.CloseBtn {onclose} />
  </Window.Head>

  <Window.Content>
    <div
      class="h-[calc(100%_-_28px)] overflow-hidden px-1 min-h-full [&>*]:min-w-[375px]"
    >
      <textarea
        class="h-full pt-1 text-balance has-scrollbar flex-1 w-full focus-within:outline-none"
        spellcheck="false"
        value={objectUrl?.content || defaultText}
      ></textarea>
      <!-- bind:value={resolvedValue || "no value"} -->
    </div>
  </Window.Content>
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
    line-height: 1.5;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
