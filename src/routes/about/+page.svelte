<script lang="ts">
  import Moveable from "moveable";
  import { onMount } from "svelte";
  import Dropzone from "svelte-file-dropzone";
  import { dropzone, type DropzoneParameter } from "@sveu/actions";
  // @ts-ignore
  import Plyr from "plyr";
  import "plyr/dist/plyr.css";

  const draggable = true;
  const throttleDrag = 1;
  const edgeDraggable = false;
  const startDragRotate = 0;
  const throttleDragRotate = 0;

  let moveable$0: Moveable;
  let player: Plyr;

  onMount(() => {
    moveable$0 = new Moveable(
      document.querySelector(`[data-croffle-ref="element$0"]`),
      {
        target: document.querySelector(`[data-croffle-ref="targetRef"]`),
        draggable: draggable,
        throttleDrag: throttleDrag,
        edgeDraggable: edgeDraggable,
        startDragRotate: startDragRotate,
        throttleDragRotate: throttleDragRotate,
      }
    );
  });

  onMount(() => {
    player = new Plyr("#player", {
      title: "Example Title",
      // blankVideo:
      //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    });
  });

  $effect(() => {
    moveable$0.on("drag", (e) => {
      e.target.style.transform = e.transform;
    });
  });

  let over_dropzone = $state(false);

  let files_data = $state<File[]>([]);

  function hover(data: CustomEvent<boolean>) {
    over_dropzone = data.detail;
  }

  function on_file_drop(data: CustomEvent<File[]>) {
    const files = data.detail;

    if (!files) {
      return;
    }

    files_data = files;

    // files_data = files.map((file: File) => ({
    //   name: file.name,
    //   size: file.size,
    //   type: file.type,
    //   last_modified: file.lastModified,
    // }));
  }

  $inspect(files_data).with((t, v) => console.log("files", v));
</script>

<!-- style="background: green;" -->
<div class="root">
  <div class="bg-red-300 w-3" data-croffle-ref="element$0">
    <div class="target bg-green-400 size-[90px]" data-croffle-ref="targetRef">
      Target
    </div>
  </div>

  <div class="bg-red-300 size-[200px]"></div>
</div>

<!-- svelte-ignore event_directive_deprecated -->
<div
  use:dropzone
  on:hover={hover}
  on:files={on_file_drop}
  class="flex flex-col h-[80px] bg-green-400 mt-6 w-full min-h-200px justify-center items-center"
>
  <p>Custom Icon Dropzone</p>
</div>

<div class="flex flex-wrap justify-center items-center">
  {#each files_data as file}
    {#if file.name.endsWith(".png")}
      <img src={URL.createObjectURL(file)} alt="ahc" />
    {:else}
      <div class="flex flex-col justify-center items-center">
        <div>File Name: {file.name}</div>
        <div>File Size: {file.size}</div>
        <div>File Type: {file.type}</div>
        <div>
          File Last Modified: {new Intl.DateTimeFormat("en-US").format(
            file.last_modified
          )}
        </div>
      </div>
    {/if}
  {/each}
</div>

<div class="size-[350px]">
  <!-- svelte-ignore a11y_media_has_caption -->
  <video
    src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    id="player"
    controls
  ></video>
</div>

<style>
  html,
  body {
    position: relative;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  html:has(.no-relative),
  body:has(.no-relative) {
    margin: 8px;
    padding: 8px;
    position: static;
    /* border: 8px solid red; */
  }

  html:has(.no-relative) {
    position: relative;
  }

  html:has(.margin),
  body:has(.margin) {
    /* margin-top: 50px; */
  }

  .margin .root {
    position: static;
  }

  .description {
    padding: 10px;
  }

  .root {
    position: relative;
  }

  .container {
    position: relative;
    margin-top: 50px;
  }

  .will-change-container {
    padding-left: 100px;
    padding-top: 100px;
    will-change: transform;
  }

  .will-change-target {
    position: relative;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    background: #ee8;
    color: #333;
    font-weight: bold;
    border: 1px solid #333;
    box-sizing: border-box;
  }

  .target {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 150px;
    left: 100px;
    line-height: 100px;
    text-align: center;
    background: #ee8;
    color: #333;
    font-weight: bold;
    border: 1px solid #333;
    box-sizing: border-box;
  }

  .target1 {
    left: 120px;
    top: 120px;
  }

  .target2 {
    left: 300px;
    top: 140px;
  }

  .target3 {
    left: 180px;
    top: 250px;
  }

  .nested {
    position: absolute;
    border: 4px solid #ccc;
    width: 100px;
    height: 100px;
    top: 50px;
    left: 70px;
    color: #333;
    /* box-sizing: border-box; */
  }

  .nested.first {
    top: 150px;
  }

  .nested.rotate {
    transform-origin: 0 0;
    transform: rotate(-30deg);
  }

  .nested.scale {
    transform: scale(1.5, 1.5);
  }

  .nested .target {
    top: 50px;
    left: 50px;
  }

  /* pos guidelines */
  .moveable-normal.red {
    background: red !important;
  }

  /* gap guidelines */
  .moveable-gap.red {
    background: red !important;
  }

  /* When snapped to an element in elementGuidelines */
  .moveable-bold.red {
    background: red !important;
  }

  /* A dashed line between target and element */
  .moveable-dashed.red {
    border-top-color: red !important;
    border-left-color: red !important;
  }

  /* pos guidelines */
  .moveable-normal.green {
    background: green !important;
  }

  /* gap guidelines */
  .moveable-gap.green {
    background: green !important;
  }

  /* When snapped to an element in elementGuidelines */
  .moveable-bold.green {
    background: green !important;
  }

  /* A dashed line between target and element */
  .moveable-dashed.green {
    border-top-color: green !important;
    border-left-color: green !important;
  }

  .scrollArea {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100vh - 100px);
    overflow: auto;
  }

  .scrollArea:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 300%;
    width: 100%;
    background: linear-gradient(#333, #fff);
  }

  .infinite-viewer {
    height: 500px;
  }

  .control-padding .moveable-around-control {
    background: #f55 !important;
  }

  .cube {
    display: inline-block;
    border-radius: 5px;
    width: 40px;
    height: 40px;
    margin: 4px;
    background: #eee;
    --color: #4af;
    color: #333;
    line-height: 40px;
    text-align: center;
  }

  .cube .cube {
    background: #ddd;
    margin-left: 20px;
  }
</style>
