<script lang="ts">
  import { onMount } from "svelte";

  interface SparkleProps {
    color?: string;
  }

  let position = $state({ x: 0, y: 0 });

  let { color = "#FF3E00" }: SparkleProps = $props();

  onMount(() => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    position = { x, y };
  });
</script>

<svg
  width="20"
  height="20"
  viewBox="0 0 160 160"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  style="position: absolute; left: {position.x}px; top: {position.y}px; transform: translate(-50%, -50%); animation: sparkle 1s infinite alternate;;"
>
  <path
    d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
    fill={color}
  />
</svg>

<style>
  @keyframes sparkle {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>
