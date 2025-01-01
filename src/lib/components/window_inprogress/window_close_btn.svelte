<script lang="ts">
  import { cn } from "@/utils";
  import type { CloseBtnProps } from ".";
  import { getWindowContext } from "./ctx.svelte";

  const ctx = getWindowContext();

  let { onclose, class: className }: CloseBtnProps = $props();

  const closeWindow = () => {
    if (!ctx.windowUi) return;

    ctx.windowUi.style.display = "none";

    if (onclose) {
      onclose();
    }
  };
</script>

<button class={cn(className)} aria-label="Close" onclick={closeWindow}></button>
