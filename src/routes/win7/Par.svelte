<script lang="ts">
  import type { ParProps } from "@/components/context_menu";

  let { foo, children }: ParProps = $props();
</script>

<!-- <div>This is a wrapped element</div> -->
{@render children()}
