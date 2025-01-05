<script lang="ts">
  import Interact from "interactjs";
  import { onMount, untrack, type Snippet } from "svelte";
  import screenfull from "screenfull";
  import type { WindowProps } from "@/components/window";
  import { Win7BarMenu } from "@/components/ui/bar_menu";
  import { type MenuProps } from "@/components/context_menu";
  import Icon from "svelte-awesome";
  import arrowLeft from "svelte-awesome/icons/arrowLeft";
  import arrowRight from "svelte-awesome/icons/arrowRight";
  import type { FocusEventHandler } from "svelte/elements";
  import BarMenu from "./bar_menu.svelte";
  import { getHistory } from "./undoRedo.svelte";

  const { children, title, showBarMenu = true }: WindowProps = $props();

  let windowUi: HTMLElement;
  let position = $state({ x: 0, y: 0 });
  let windowInstance = $state<ReturnType<typeof Interact> | null>(null);
  let isFullscreen = $state(false);

  const history = getHistory();

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

  let isAddressFocused = $state(false);
  let searchBar: HTMLInputElement;

  $effect(() => {
    if (isAddressFocused && searchBar) {
      searchBar.focus();
      // searchBar.scrollIntoView();
    }
  });

  type OnFocus = FocusEvent & { currentTarget: EventTarget & HTMLInputElement };

  const resetCursor = (ev: OnFocus) => {
    const val = ev?.currentTarget?.value;
    ev.currentTarget.value = "";
    ev.currentTarget.value = val;
  };
</script>

<!-- <svelte:window on:drag={dragMoveListener} /> -->
{#snippet resizeHandles()}
  <div class="top-resize-handle w-full h-1 absolute top-0 z-30"></div>
  <div class="left-resize-handle w-1 h-full absolute left-0 z-30"></div>
  <div class="right-resize-handle w-1 h-full absolute right-0 z-30"></div>
  <div class="bottom-resize-handle w-full h-1 absolute z-30 bottom-0"></div>
{/snippet}

{#snippet breadCrumbs(history: ReturnType<typeof getHistory>)}
  {@const breadCrumbs =
    history.peek() === null ? [] : history.peek()!.split("/")}

  {#if breadCrumbs.length > 0}
    {#each breadCrumbs as item}
      <span class="first:ml-[5px] m-0 text-[13px] tracking-tight">{item}</span>
    {/each}
  {:else}
    <span class="first:ml-[5px] m-0 text-[13px] tracking-tight">C:</span>
  {/if}
{/snippet}

<div
  class="background absolute select-none"
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

    <!-- <div class="title-bar">
      <div class="title-bar-text flex gap-x-2">
        <img
          src="/delete_1023.ico"
          alt="wind"
          class="size-4 bg-transparent object-fill"
        />
        {title}
      </div>

      <div class="title-bar-controls">
        <button aria-label="Minimize" onclick={minimizeWindow}></button>

        {#if !isFullscreen}
          <button aria-label="Maximize" onclick={requestFullscreen}></button>
        {:else}
          <button aria-label="Restore" onclick={exitFullscreen}></button>
        {/if}

        <button aria-label="Close" onclick={closeWindow}></button>
      </div>
    </div> -->

    <div class="title-bar flex flex-col px-2 gap-y-1">
      <div class="flex justify-between w-full">
        <div class="title-bar-text flex gap-x-2">
          <img
            src="/delete_1023.ico"
            alt="wind"
            class="size-4 bg-transparent object-fill"
          />
          {title}
        </div>

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

      <div class="h-[30px] w-full flex items-center">
        <!-- svelte-ignore a11y_consider_explicit_label, a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <div class="navigation flex">
          <div
            class="button round mr-1 flex items-center justify-center {history.isRewindPossible()
              ? 'active'
              : ''}"
            onclick={() => history.rewind()}
          >
            <Icon data={arrowLeft} scale={1.2} />
          </div>

          <div
            class="button round flex items-center justify-center {history.isForwardPossible()
              ? 'active'
              : ''}"
            onclick={() => history.forward()}
          >
            <Icon data={arrowRight} scale={1.2} />
          </div>
        </div>

        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <div
          class="flex-1 mr-1 h-[calc(100%-5px)] gap-x-1 flex items-center overflow-hidden"
        >
          {#if !isAddressFocused}
            <div
              class="addr w-[85%] icon pt-[3px] pr-0 pb-[3px] pl-[24px] overflow-scroll scrollbar-hide"
              style="--icon: url('/img/mycomputer.webp')"
              onclick={() => (isAddressFocused = true)}
            >
              {@render breadCrumbs(history)}
            </div>
          {:else}
            <div
              class="addr w-[85%] icon pt-[3px] pr-0 pb-[3px] pl-[24px]"
              style="--icon: url('/img/mycomputer.webp')"
            >
              <input
                class="size-full bg-transparent outline-none border-none text-[13px] leading-4 tracking-wider font-medium"
                type="text"
                bind:this={searchBar}
                onfocus={resetCursor}
                value="/Computer/:C/Users"
                onblur={() => (isAddressFocused = false)}
              />
            </div>
          {/if}

          <div
            class="addr max-w-[20px] icon pt-[3px] pr-0 pb-[3px] pl-[24px]"
            style="--icon: url('/img/player.webp')"
          >
            abac
          </div>
        </div>

        <!-- Search bar -->
        <div class="h-[calc(100%-5px)] flex-1 ml-auto max-w-[200px]">
          <div class="addr">
            <!-- class="bg-transparent h-full w-full" -->
            <input
              type="search"
              class="size-full bg-transparent outline-none border-none placeholder:text-neutral-700"
              placeholder="Search files"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Updated to fill the remaining space -->
    <div
      class="window-body flex-1 flex flex-col overflow-auto"
      style="height: 100%;"
    >
      {#if showBarMenu}
        <!-- Show file explorer specific bar menu -->
        <!-- <BarMenu {menuItems} /> -->
      {/if}
      <BarMenu {menuItems} />

      <!-- The content inside window-body -->
      <div class="content-area flex-1 bg-white p-0">{@render children()}</div>
    </div>
  </div>
</div>

<style>
  .navigation .button {
    user-select: none;
    outline: none;
    box-sizing: border-box;
    line-height: 1;
    margin-right: 0.25rem;
    padding: 6px;
    border: 0;
    box-shadow:
      inset 0 0 2px #fff,
      inset 0 1px 3px hsla(0, 0%, 100%, 0.6),
      0 1px 1px rgba(0, 0, 0, 0.8),
      -1px -1px 1px rgba(0, 0, 0, 0.2),
      1px -1px 1px rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    color: #ccc;
    pointer-events: auto;
  }

  .navigation .button.active {
    color: #fff;
    background:
      radial-gradient(
        60px 40px at center 95%,
        transparent 30%,
        rgba(0, 0, 0, 0.3) 40%,
        hsla(0, 0%, 100%, 0.5) 50%
      ),
      linear-gradient(0deg, #82dff3 5%, transparent 30%) #0365c8;
  }

  .navigation .button.active:active {
    transform: scale(0.9);
    transition: transform 0.1s ease;
  }

  /* Addr */
  .addr {
    white-space: nowrap;
    position: relative;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-grow: 1;
    align-items: center;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.6666666667);
    box-shadow:
      0 0 0 1px hsla(0, 0%, 100%, 0.4666666667),
      inset 0 0 0 1px #fff;
    background-color: hsla(0, 0%, 100%, 0.6666666667);
  }

  .addr.icon {
    background: var(--icon) no-repeat;
    background-size: 18px;
    background-position: 0;
    background-color: hsla(0, 0%, 100%, 0.6666666667);
  }

  .addr > span {
    height: 100%;
    display: flex;
    align-items: center;
    font-family:
      Segoe UI,
      sans-serif;
    position: relative;
  }

  .addr > span::before {
    content: "\23f5";
    display: inline-block;
    height: auto;
    margin-right: 2px;
    font-size: inherit;
    line-height: inherit;
    align-self: center;
  }
</style>
