<script lang="ts">
  import { cn } from "@/utils";
  import screenfull from "screenfull";
  import type { ResizeBtnProps } from "..";
  import { getWindowContext } from "../ctx.svelte";

  const ctx = getWindowContext();

  const { class: className }: ResizeBtnProps = $props();

  const requestFullscreen = () => {
    if (!ctx.windowUi) return;

    if (screenfull.isEnabled) {
      screenfull.request(ctx.windowUi);
      ctx.isFullscreen = true;
    }
  };

  const exitFullscreen = () => {
    screenfull.exit();
    ctx.isFullscreen = false;
  };
</script>

{#if !ctx.isFullscreen}
  <button
    class={cn(className)}
    aria-label="Maximize"
    onclick={requestFullscreen}
  ></button>
{:else}
  <button class={cn(className)} aria-label="Restore" onclick={exitFullscreen}
  ></button>
{/if}
