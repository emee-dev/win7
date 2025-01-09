<script lang="ts">
  import Interact from "interactjs";
  import { onMount, type Snippet } from "svelte";
  import screenfull from "screenfull";
  import type { WindowProps } from ".";
  import { Win7BarMenu } from "@/components/ui/bar_menu";
  import { type MenuProps } from "@/components/context_menu";

  const { children, title, showBarMenu = true }: WindowProps = $props();

  let windowUi: HTMLElement;
  let position = $state({ x: 0, y: 0 });
  let windowInstance = $state<ReturnType<typeof Interact> | null>(null);
  let isFullscreen = $state(false);

  let menuItems = $state<MenuProps[]>([
    {
      label: "File",
      subMenu: [
        { label: "Open", onclick: () => console.log("Ctrl+O") },
        { label: "Save", onclick: () => console.log("Ctrl+S") },
        {
          label: "Save As...",
          hasDivider: "has-divider",
          onclick: () => console.log("Ctrl+Shift+S"),
        },
        { label: "Exit" },
      ],
    },
    {
      label: "Edit",
      subMenu: [
        { label: "Undo" },
        { label: "Copy" },
        { label: "Cut" },
        { label: "Paste", hasDivider: "has-divider" },
        { label: "Delete" },
        { label: "Find..." },
        { label: "Replace..." },
        { label: "Go to..." },
      ],
    },
    {
      label: "View",
      subMenu: [
        {
          label: "Zoom",
          subMenu: [
            { label: "Zoom In", onclick: () => console.log("Zoom In") },
            { label: "Zoom Out", onclick: () => console.log("Zoom Out") },
          ],
        },
        { label: "Status Bar" },
      ],
    },
    {
      label: "Help",
      subMenu: [{ label: "View Help" }, { label: "About" }],
    },
  ]);

  onMount(() => {
    // function dragMoveListener(event: any) {
    //   console.log("Hello");
    //   let target = event.target,
    //     // keep the dragged position in the data-x/data-y attributes
    //     x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
    //     y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
    //   // translate the element
    //   target.style.webkitTransform = target.style.transform =
    //     "translate(" + x + "px, " + y + "px)";
    //   // update the posiion attributes
    //   target.setAttribute("data-x", x);
    //   target.setAttribute("data-y", y);
    // }
    // // this is used later in the resizing and gesture demos
    // // @ts-expect-error
    // window.dragMoveListener = dragMoveListener;
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
    windowInstance?.unset();
    windowUi.style.display = "none";
  };

  $effect(() => {
    if (!windowInstance) return;

    windowInstance
      .draggable({
        inertia: true,
        allowFrom: ".drag-handle",
        listeners: {
          move(event) {
            // console.log("Move", event);

            // Update position based on dragging
            position.x += event.dx;
            position.y += event.dy;

            // Bring up the active window
            // windowUi.style.zIndex = "99999";

            // Apply translation
            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;

            // Save updated position
            event.target.dataset.x = position.x.toString();
            event.target.dataset.y = position.y.toString();
          },
          end(e) {
            // reset the active window zIndex
            // windowUi.style.zIndex = "10";
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
            min: { height: 300, width: 400 },
          }),
        ],
      });
  });
</script>

<!-- <svelte:window on:drag={dragMoveListener} /> -->
{#snippet resizeHandles()}
  <div class="top-resize-handle w-full h-1 absolute top-0 z-30"></div>
  <div class="left-resize-handle w-1 h-full absolute left-0 z-30"></div>
  <div class="right-resize-handle w-1 h-full absolute right-0 z-30"></div>
  <div class="bottom-resize-handle w-full h-1 absolute z-30 bottom-0"></div>
{/snippet}

<div
  class="background relative select-none"
  bind:this={windowUi}
  style="width: 700px; height: 400px; margin-left: 80px;"
>
  {@render resizeHandles()}

  <div
    class="window glass active relative"
    style="
      max-width: 100%; 
      height: 100%;  
      display: flex; 
      flex-direction: column; 
      --window-background-color: #805ba5;"
  >
    <!-- Window Drag Handle -->
    <div
      class="drag-handle h-6 w-full absolute top-0 z-30"
      style="pointer-events: none;"
    >
      <div
        class="active-drag-area not_selectible h-full w-[calc(100%-120px)] absolute left-0"
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

        {#if !isFullscreen}
          <button aria-label="Maximize" onclick={requestFullscreen}></button>
        {:else}
          <button aria-label="Restore" onclick={exitFullscreen}></button>
        {/if}

        <button aria-label="Close" onclick={closeWindow}></button>
      </div>
    </div>

    <!-- Updated to fill the remaining space -->
    <div
      class="window-body flex-1 flex flex-col overflow-auto"
      style="height: 100%;"
    >
      {#if showBarMenu}
        <Win7BarMenu {menuItems} />
      {/if}

      <!-- The content inside window-body -->
      <div class="content-area flex-1 bg-white p-0">{@render children()}</div>
    </div>
  </div>
</div>
