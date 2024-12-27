<script lang="ts">
  import { CONTEXT_ZINDEX, type TriggerProps } from "@/components/context_menu";
  import { getContextMenu } from "./ctx.svelte";
  import { cn } from "@/utils";
  import { onMount } from "svelte";

  const context = getContextMenu();

  onMount(() => {
    context.initContent();
  });

  let { children, class: className, ...rest }: TriggerProps = $props();
</script>

{#if context.showMenu}
  <nav
    class={cn("w-fit h-fit", className)}
    {...rest}
    use:context.updateMenuDimensions
    onclick_outside={() => context.handleClickOutside()}
    style="position: absolute; top:{context.pos.y}px; left:{context.pos
      .x}px; z-index: {CONTEXT_ZINDEX}"
  >
    {@render children?.()}
  </nav>
{/if}
