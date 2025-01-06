<script lang="ts">
  import { type TriggerProps } from "./index";
  import { cn } from "@/utils";
  import { getContextMenu } from "./ctx.svelte";
  import { onMount } from "svelte";
  import { NOT_SELECTABLE } from "../selecto";

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
