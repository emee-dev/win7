<script lang="ts">
  import { type ContextProps } from "@/components/context_menu";
  import { onMount } from "svelte";
  import type { Action } from "svelte/action";
  import { setContextMenu } from "./ctx.svelte";

  const context = setContextMenu();

  type OnContextMenu = MouseEvent & { currentTarget: EventTarget };

  let { children, menuItems, ...rest }: ContextProps = $props();

  onMount(() => {
    context.init(menuItems);
  });

  onMount(() => {
    if (!context.context_trigger) {
      throw new Error(
        "[ContextMenu] Missing Trigger: `ContextMenu.Trigger` is required but was not found. Ensure you include it inside the `ContextMenu` component."
      );
    }

    if (!context.context_content) {
      throw new Error(
        "[ContextMenu] Missing Content: `ContextMenu.Content` is required but was not found. Ensure you include it inside the `ContextMenu` component."
      );
    }
  });
</script>

{@render children?.()}

<svelte:window
  on:contextmenu|preventDefault={(e: OnContextMenu) => e.preventDefault()}
/>
