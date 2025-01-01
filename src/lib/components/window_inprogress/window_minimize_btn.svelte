<script lang="ts">
  import { cn } from "@/utils";
  import type { MinimizeBtnProps } from ".";

  let { onminimize, class: className }: MinimizeBtnProps = $props();

  const minimizeWindow = () => {
    if (onminimize) {
      onminimize();
    }
  };
</script>

<button class={cn(className)} aria-label="Minimize" onclick={minimizeWindow}
></button>
