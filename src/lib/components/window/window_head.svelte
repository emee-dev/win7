<script lang="ts">
  import { type HeadProps } from ".";
  import { NOT_SELECTABLE } from "../selecto";

  let controls: HTMLElement;

  // We need the drag handle to take most of the space.
  let dragAreaAndControlsWidth = $state(0);

  let { children, icon, title, class: className }: HeadProps = $props();

  $effect(() => {
    if (!controls) return;

    const childNodes = controls.children;

    if (childNodes.length === 2) {
      dragAreaAndControlsWidth = 150;
    }

    if (childNodes.length === 3) {
      dragAreaAndControlsWidth = 120;
    }
  });
</script>

<div
  class="drag-handle h-6 w-full absolute top-0 z-30"
  style="pointer-events: none;"
>
  <!-- class="active-drag-area h-full ester w-[calc(100%-${dragAreaAndControlsWidth}px)] absolute left-0 ${NOT_SELECTABLE}" -->
  <div
    class="active-drag-area h-full w-[calc(100%-{dragAreaAndControlsWidth}px)] absolute left-0 {NOT_SELECTABLE}"
    style="pointer-events: auto;"
  ></div>
</div>

<div class="title-bar">
  <div class="title-bar-text flex gap-x-2">
    <img
      src={icon}
      alt="Img for {title}"
      class="size-4 bg-transparent object-fill"
    />
    {title}
  </div>

  <!-- Window Controls -->
  <div class="title-bar-controls" bind:this={controls}>
    {@render children?.()}
  </div>
</div>
