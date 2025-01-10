<script lang="ts">
  import Calculator from "@/apps/Calculator/calculator.svelte";
  import File_Explorer from "@/apps/File_Explorer/file_explorer.svelte";
  import Notepad from "@/apps/Notepad/notepad.svelte";
  import Plyr_Video from "@/apps/Plyr_Video/Plyr_video.svelte";
  import type { Component } from "svelte";
  import { type InstalledPrograms } from "./utils";
  import type { TaskManagerItem } from "./file_system.svelte";

  type WindowProps = TaskManagerItem & {
    executeBy: InstalledPrograms;
  };

  let props: WindowProps = $props();

  type ProgramRegistry = Record<InstalledPrograms, Component<any>>;

  const programRegistry: ProgramRegistry = {
    Calculator,
    Notepad,
    File_Explorer,
    Plyr_Video,
    MyComputer: File_Explorer,
    RecycleBin: File_Explorer,
  };

  const { programId, executeBy } = props;
  const programToRender: InstalledPrograms = executeBy || programId;

  const Dynamic = programRegistry[programToRender] ?? Calculator;
</script>

<Dynamic {...props} />
