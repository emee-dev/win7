<script lang="ts">
  import { NOT_SELECTABLE } from "@/components/selecto";
  import Interact from "interactjs";
  import { onDestroy, onMount, untrack } from "svelte";
  import type { WindowProps } from ".";
  import { getFs } from "../desktop/file_system.svelte";
  import { setWindowContext } from "./ctx.svelte";

  let windowUi: HTMLElement;
  let windowInstance: ReturnType<typeof Interact> | null;
  const fs = getFs();

  const ctx = setWindowContext();

  const {
    children,
    interactjs,
    disableResize,
    showBarMenu = true,
    placement = $bindable({ x: 0, y: 0 }) as any,
    ...rest
  }: WindowProps = $props();

  onMount(() => {
    ctx.position = placement;

    if (disableResize) {
      ctx.disableResize = disableResize;
    }

    if (showBarMenu) {
      ctx.showBarMenu = showBarMenu;
    }

    windowInstance = Interact(windowUi);
  });

  $effect(() => {
    const tasks = fs.getTasks();

    if (tasks.length === 0) {
      return;
    }

    const currentTask = tasks.find((task) => task.windowId === rest.windowId);

    if (!currentTask) {
      return;
    }

    if (currentTask.windowStatus === "inview") {
      windowUi.style.visibility = "visible";
    }

    if (currentTask.windowStatus === "minimized") {
      windowUi.style.visibility = "hidden";
    }
  });

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
            ctx.position.x += event.dx;
            ctx.position.y += event.dy;

            // Apply translation
            event.target.style.transform = `translate(${ctx.position.x}px, ${ctx.position.y}px)`;

            // Save updated position
            event.target.dataset.x = ctx.position.x.toString();
            event.target.dataset.y = ctx.position.y.toString();
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
            ctx.position.x = x;
            ctx.position.y = y;
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
            min: interactjs?.min, //  min: { height: 300, width: 400 },
            max: interactjs?.max,
          }),
        ],
      });
  });

  onDestroy(() => {
    if (windowInstance) {
      windowInstance.unset();
    }
  });

  // initialize windowUi in context once.
  $effect(() => {
    untrack(() => (ctx.windowUi = windowUi));
  });
</script>

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

<!-- style={`width: 270px; height: 330px; margin-left: 80px; transform: translate(${ctx.position.x}px, ${ctx.position.y}px)`} -->
<div
  class="background absolute select-none"
  bind:this={windowUi}
  data-x={ctx.position.x}
  data-y={ctx.position.y}
  style={`margin-left: 80px; transform: translate(${ctx.position.x}px, ${ctx.position.y}px); ${rest.style}`}
>
  <!-- TODO: Only show resize handles when disableResize is falsy or null -->
  {#if ctx.disableResize !== true}
    {@render resizeHandles()}
  {/if}

  <div
    class="window glass active relative"
    style="max-width: 100%; height: 100%; display: flex; flex-direction: column; --window-background-color: #805ba5;"
  >
    {@render children?.()}
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
