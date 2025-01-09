<script lang="ts">
  import {
    getFs,
    type TaskManagerItem,
  } from "@/components/desktop/file_system.svelte";
  import { getIconByProgramId } from "@/components/desktop/utils";
  import { Window } from "@/components/window_inprogress";
  import { onMount } from "svelte";

  let text = $state(
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
  };

  let {
    label,
    id: windowId,
    programId,
    file_path,
    placement = $bindable({ x: 0, y: 0 }),
    // meta = $bindable({ file_path: "" }),
    ...rest
  }: NotepadProps = $props();

  const onclose = () => {
    fs.terminateTask(windowId);
    console.log("windowId", windowId);
  };

  const onminimize = () => {
    fs.modifyTask(windowId, { windowStatus: "minimized" });
  };

  // $inspect(rest.pr).with((t, v) => console.log("rest", rest));

  onMount(() => {
    console.log("file_path", file_path);
    // if (!meta || !meta.file_path) {
    //   return;
    // }

    // console.log("meta.file_path", meta.file_path);

    // console.log("read", fs.fs?.readFile(meta.file_path));
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
        spellcheck="false"
        class="h-full pt-1 text-balance has-scrollbar flex-1 w-full"
        bind:value={text}
      ></textarea>
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
    line-height: 1.5; /* Ensure even line height */
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
