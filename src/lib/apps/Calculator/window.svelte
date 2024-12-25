<script lang="ts">
  import Interact from "interactjs";
  import { onMount, type Snippet } from "svelte";
  import screenfull from "screenfull";
  // import type { WindowProps } from "@/components/window";
  import { Win7BarMenu, type MenuProps } from "@/components/context_menu";
  import { NOT_SELECTABLE } from "@/components/selecto";
  import { preventDefault } from "svelte/legacy";

  type WindowProps = {
    children: Snippet<[]>;
    title: string;
    showBarMenu: boolean;
    onclose?: () => void;
    placement?: {
      x: number;
      y: number;
    };
  };

  const {
    children,
    title,
    onclose,
    showBarMenu = true,
    placement = $bindable({ x: 0, y: 0 }),
  }: WindowProps = $props();

  let windowUi: HTMLElement;

  let position = $state(placement);
  let windowInstance = $state<ReturnType<typeof Interact> | null>(null);
  let isFullscreen = $state(false);

  onMount(() => {
    function dragMoveListener(event: any) {
      console.log("Hello");
      let target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
        y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
      // translate the element
      target.style.webkitTransform = target.style.transform =
        "translate(" + x + "px, " + y + "px)";
      // update the posiion attributes
      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    }
    // this is used later in the resizing and gesture demos
    // @ts-expect-error
    window.dragMoveListener = dragMoveListener;
    windowInstance = Interact(windowUi);
  });

  // Fullscreen logic
  const requestFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.request(windowUi);
      isFullscreen = true;
    }
  };

  const exitFullscreen = () => {
    screenfull.exit();
    isFullscreen = false;
  };

  const minimizeWindow = () => {
    windowInstance?.unset();
    windowUi.style.visibility = "hidden";
  };

  const closeWindow = () => {
    if (onclose) {
      onclose();
    }
    // windowInstance?.unset();
    // windowUi.style.display = "none";
  };

  $effect(() => {
    if (!windowInstance) return;

    windowInstance
      .draggable({
        inertia: true,
        allowFrom: ".drag-handle",
        listeners: {
          start() {
            // Bring up the active window
            windowUi.classList.add("active_window");
          },

          move(event) {
            // Update position based on dragging
            position.x += event.dx;
            position.y += event.dy;

            // Apply translation
            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;

            // Save updated position
            event.target.dataset.x = position.x.toString();
            event.target.dataset.y = position.y.toString();
          },
          end(e) {
            // reset the active window zIndex
            // windowUi.classList.remove("background_window");
          },
        },
      })
      .resizable({
        edges: {
          top: ".top-resize-handle",
          left: ".left-resize-handle",
          bottom: ".bottom-resize-handle",
          right: ".right-resize-handle",
        },
        listeners: {
          move(event) {
            let x = parseFloat(event.target.dataset.x) || 0;
            let y = parseFloat(event.target.dataset.y) || 0;

            // Update position based on resizing
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            Object.assign(event.target.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              transform: `translate(${x}px, ${y}px)`,
            });

            // Save updated position to shared state and dataset
            position.x = x;
            position.y = y;
            Object.assign(event.target.dataset, { x, y });
          },
        },
        modifiers: [
          // Keep the edges inside the viewport
          Interact.modifiers.restrictEdges({
            outer: "parent",
          }),

          // Minimum size
          Interact.modifiers.restrictSize({
            // TODO add min and max resizable constraints
            min: { height: 330, width: 270 },
            max: { height: 330, width: 270 },
          }),
        ],
      });
  });
</script>

<!-- <svelte:window on:drag={dragMoveListener} /> -->

{#snippet resizeHandles()}
  <div
    class={`top-resize-handle w-full h-1 absolute top-0 z-30 ${NOT_SELECTABLE}`}
  ></div>
  <div
    class={`left-resize-handle w-1 h-full absolute left-0 z-30 ${NOT_SELECTABLE}`}
  ></div>
  <div
    class={`right-resize-handle w-1 h-full absolute right-0 z-30 ${NOT_SELECTABLE}`}
  ></div>
  <div
    class={`bottom-resize-handle w-full h-1 absolute z-30 bottom-0 ${NOT_SELECTABLE}`}
  ></div>
{/snippet}

<!-- TODO there is a potential bug with statically setting the translate values when resizing window
 potential fix: use windowUi instance to specify the translate value on mount.
 
-->
<div
  class="background absolute select-none"
  bind:this={windowUi}
  data-x={position.x}
  data-y={position.y}
  style={`width: 270px; height: 330px; margin-left: 80px; transform: translate(${position.x}px, ${position.y}px)`}
>
  <!-- {@render resizeHandles()} -->

  <div
    class="window glass active relative"
    style="max-width: 100%; height: 100%; display: flex; flex-direction: column; --window-background-color: #805ba5;"
  >
    <!-- Window Drag Handle -->
    <div
      class="drag-handle h-6 w-full absolute top-0 z-30"
      style="pointer-events: none;"
    >
      <div
        class={`active-drag-area h-full w-[calc(100%-90px)] absolute left-0 ${NOT_SELECTABLE}`}
        style="pointer-events: auto;"
      ></div>
    </div>

    <div class="title-bar">
      <div class="title-bar-text flex gap-x-2">
        <img
          src="/1023.ico"
          alt="wind"
          class="size-4 bg-transparent object-fill"
        />
        {title}
      </div>

      <!-- Window Controls -->
      <div class="title-bar-controls">
        <button aria-label="Minimize" onclick={minimizeWindow}></button>

        <!-- TODO make sure to add a prop for window controls -->
        <!-- {#if !isFullscreen}
          <button aria-label="Maximize" onclick={requestFullscreen}></button>
        {:else}
          <button aria-label="Restore" onclick={exitFullscreen}></button>
        {/if} -->

        <button aria-label="Close" onclick={closeWindow}></button>
      </div>
    </div>

    <!-- Updated to fill the remaining space -->
    <div
      class="window-body flex-1 flex flex-col overflow-auto"
      style="height: 100%;"
    >
      <!-- The content inside window-body -->
      <div class="content-area flex-1 bg-white p-0">{@render children()}</div>
    </div>
  </div>
</div>

<style>
  .active_window {
    z-index: 200 !important;
    position: absolute;
  }

  .background_window {
    z-index: 10 !important;
    position: absolute;
  }
</style>
