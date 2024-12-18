<script lang="ts">
  const { children } = $props();
</script>

<!-- As it is height and width are static pass them as props -->
<div class="[&>*]:min-h-[230px] flex-1 [&>*]:min-w-[375px]">
  {@render children?.()}
</div>
