<script lang="ts">
  import {
    getFs,
    type TaskManagerItem,
  } from "@/components/desktop/file_system.svelte";
  import { getIconByProgramId } from "@/components/desktop/utils";
  import Window from "@/components/window/window.svelte";
  import { Window as WindowWIP } from "@/components/window_inprogress";

  let text = $state(
    `Svelte is a UI framework that uses a compiler to let you write
breathtakingly concise components that do minimal work in the browser, using
languages you already know — HTML, CSS and JavaScript. It’s a love letter to
web development. But don’t take our word for it. Developers consistently
rank Svelte as the framework they’re most excited about using.`.trim()
  );

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

  const onclose = () => {
    fs.terminateTask(windowId);
    console.log("windowId", windowId);
  };

  const onminimize = () => {
    fs.modifyTask(windowId, { windowStatus: "minimized" });
  };
</script>

<WindowWIP
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
</WindowWIP>

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
