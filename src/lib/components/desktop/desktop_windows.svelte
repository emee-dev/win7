<script lang="ts">
  import Calculator from "@/apps/Calculator/calculator.svelte";
  import FileExplorer, {
    type FileExplorerProps,
  } from "@/apps/File_Explorer/file_explorer.svelte";
  import Notepad from "@/apps/Notepad/notepad.svelte";
  import { getFs, type TaskManagerItem } from "./file_system.svelte";
  import { type InstalledPrograms } from "./utils";

  const fs = getFs();
</script>

{#snippet renderCalculator(task: TaskManagerItem)}
  <Calculator {...task} />
{/snippet}

{#snippet renderNotepad(task: TaskManagerItem)}
  <Notepad {...task} />
{/snippet}

{#snippet renderFileExplorer(task: FileExplorerProps)}
  <FileExplorer {...task} />
{/snippet}

{#each fs.getTasks() as window (window.id)}
  {@const programId = window.programId as InstalledPrograms}
  {@const executeBy = window?.executeBy as InstalledPrograms}

  {#if programId === "Calculator"}
    {@render renderCalculator(window)}
  {:else if programId === "Notepad"}
    {@render renderNotepad(window)}
  {:else if programId === "File_Explorer"}
    {@render renderFileExplorer(window as FileExplorerProps)}
  {/if}

  <!-- Execute by -->
  {#if executeBy === "Notepad"}
    {@render renderNotepad(window)}
  {/if}
{/each}
