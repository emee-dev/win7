<script lang="ts">
  import { Win7ContextMenu } from "@/components/context_menu";
  import { cn } from "@/utils";
  import { onMount } from "svelte";
  import type { Action } from "svelte/action";
  import { type ContextPropsXRP } from ".";
  import { setContextState } from "./ctx.svelte";

  let content: HTMLElement;
  const context = setContextState();

  type OnContextMenu = MouseEvent & { currentTarget: EventTarget };

  type Dimensions = Action<
    HTMLElement,
    undefined,
    {
      onclick_outside: (e: CustomEvent) => void;
    }
  >;

  let {
    children,
    menuItems,
    class: className,
    ...rest
  }: ContextPropsXRP = $props();

  onMount(() => {
    context.init(menuItems);
  });

  // Cursor position during right click
  let pos = $state({ x: 0, y: 0 });

  // Dimensions of the context menu
  let menu = $state({ h: 0, w: 0 });

  // Dimensions of the browser window
  let browser = $state({ h: 0, w: 0 });

  // State for context-menu visibility
  let showMenu = $state(false);

  const handleClickOutside = () => (showMenu = false);

  function handleRightClick(ev: OnContextMenu) {
    ev.preventDefault();
    ev.stopPropagation();

    showMenu = true;

    // Update browser dimensions
    browser.w = window.innerWidth;
    browser.h = window.innerHeight;

    // Set initial cursor position
    pos.x = ev.clientX;
    pos.y = ev.clientY;

    const { h, w } = menu;
    const { x, y } = pos;
    const { h: browserH, w: browserW } = browser;

    // Adjust position if context menu overflows
    pos.x = browserW - x < w ? x - w : x;
    pos.y = browserH - y < h ? y - h : y;
  }

  const updateMenuDimensions: Dimensions = (node) => {
    // Update context menu dimensions
    menu.h = node.offsetHeight;
    menu.w = node.offsetWidth;

    const handleClick = (event: any) => {
      if (node && !node.contains(event.target) && !event.defaultPrevented) {
        node.dispatchEvent(new CustomEvent("click_outside", node as any));
      }
    };

    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  };
</script>

<div
  class={cn("w-fit h-fit", className)}
  {...rest}
  tabindex="-1"
  role="menu"
  oncontextmenu={handleRightClick}
  oncontextmenucapture={(e) => {
    console.log("e", e);
  }}
  data-ab="990"
  bind:this={content}
>
  {@render children()}
</div>

{#if showMenu}
  <nav
    use:updateMenuDimensions
    onclick_outside={handleClickOutside}
    style="position: absolute; top:{pos.y}px; left:{pos.x}px"
  >
    <Win7ContextMenu />
  </nav>
{/if}

<svelte:window
  on:contextmenu|preventDefault={(e: OnContextMenu) => {
    e.preventDefault();
  }}
/>
