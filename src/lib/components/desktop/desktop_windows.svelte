<script lang="ts">
  import Calculator2 from "@/apps/Calculator/calculator.svelte";
  import Notepad2 from "@/apps/Notepad/notepad.svelte";
  import { getFs, type TaskManagerItem } from "./file_system.svelte";
  import { type InstalledPrograms } from "./utils";

  const fs = getFs();
</script>

{#snippet renderCalculator(task: TaskManagerItem)}
  <!-- placement={{ x: 349.333, y: 11.3333 }}  -->
  <Calculator2 {...task} />
{/snippet}

{#snippet renderNotepad(task: TaskManagerItem)}
  <Notepad2 {...task} />
{/snippet}

{#each fs.getTasks() as window (window.id)}
  {@const programId = window.programId as InstalledPrograms}

  {#if programId === "Calculator"}
    {@render renderCalculator(window)}
  {:else if programId === "Notepad"}
    {@render renderNotepad(window)}
  {/if}
{/each}
