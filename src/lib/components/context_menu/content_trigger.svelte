<script lang="ts">
  import { cn } from "@/utils";
  import { onMount } from "svelte";
  import { NOT_SELECTABLE } from "../selecto";
  import { getContextMenu } from "./ctx.svelte";
  import { type TriggerProps } from "./index";

  const context = getContextMenu();

  let { children, class: className, ...rest }: TriggerProps = $props();

  onMount(() => {
    context.initTrigger();
  });
</script>

<!-- TODO: make sure to close other context menus onright click -->

<div
  class={cn("", NOT_SELECTABLE, className)}
  {...rest}
  role="menu"
  tabindex="-1"
  oncontextmenu={(e) => {
    context.handleRightClick(e);
  }}
>
  {@render children?.()}
</div>

<!-- <svelte:window
  on:contextmenu={(e: OnContextMenu) => {
    console.log("Window");

    context.handleRightClick(e);
    // e.preventDefault();
  }}
/> -->
