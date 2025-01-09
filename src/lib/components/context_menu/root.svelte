<script lang="ts">
  import { onMount } from "svelte";
  import { setContextMenu } from "./ctx.svelte";
  import { type ContextProps } from "./index";

  const context = setContextMenu();

  let { children }: ContextProps = $props();
  type OnContextMenu = MouseEvent & { currentTarget: EventTarget };

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
  on:contextmenu={(e: OnContextMenu) => {
    e.preventDefault();
  }}
/>
