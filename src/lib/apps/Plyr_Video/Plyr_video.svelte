<script lang="ts">
  import {
    getFs,
    type TaskManagerItem,
  } from "@/components/desktop/file_system.svelte";
  import { getIconByProgramId } from "@/components/desktop/utils";
  import { Window } from "@/components/window_inprogress";
  // @ts-ignore
  import Plyr from "plyr";
  import "plyr/dist/plyr.css";
  import { hasWindow } from "std-env";

  import { onDestroy, onMount } from "svelte";

  const fs = getFs();
  let player: Plyr;

  export type PlyrVideoProps = TaskManagerItem & {
    placement?: {
      x: number;
      y: number;
    };
    file_path: string;
  };

  let {
    label,
    id: windowId,
    file_path,
    placement = $bindable({ x: 0, y: 0 }),
    // meta = $bindable({ file_path: "" }),
  }: PlyrVideoProps = $props();

  const onclose = () => {
    fs.terminateTask(windowId);
  };

  const onminimize = () => {
    fs.modifyTask(windowId, { windowStatus: "minimized" });
  };

  onMount(() => {
    player = new Plyr("#player", {
      disableContextMenu: true,
      fullscreen: { enabled: false },

      // blankVideo:
      //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    });
  });

  onDestroy(() => {
    if (!hasWindow) {
      return;
    }

    if (player) {
      player.destroy();
    }
  });
</script>

<Window
  {windowId}
  showBarMenu={false}
  bind:placement
  style="width: 700px; height: 420px;"
  interactjs={{ min: { height: 300, width: 400 } }}
>
  <Window.Head title={label} icon={getIconByProgramId("Plyr_Video")}>
    <Window.MinimizeBtn {onminimize} />
    <Window.ResizeBtn />
    <Window.CloseBtn {onclose} />
  </Window.Head>

  <Window.Content
    parentClass="overflow-hidden bg-black"
    wrapperClass="bg-black"
  >
    <div
      class="flex min-h-[350px] h-full min-w-[690px] flex-1 items-center justify-center object-center"
    >
      <!-- svelte-ignore a11y_media_has_caption -->
      <!-- src="/sample_video.mp4"  -->
      <!-- src="/sample_video_2.mp4" -->
      <!-- src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" -->
      <video src="/sample_video_2.mp4" id="player" class="size-full object-fill"
      ></video>
    </div>
  </Window.Content>
</Window>

<style>
</style>
