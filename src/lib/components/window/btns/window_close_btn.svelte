<script lang="ts">
  import { cn } from "@/utils";
  import type { CloseBtnProps } from "..";
  import { getWindowContext } from "../ctx.svelte";
  import { getFs } from "@/components/desktop/file_system.svelte";

  const ctx = getWindowContext();
  const fs = getFs();

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
