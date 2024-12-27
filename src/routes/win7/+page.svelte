<script lang="ts">
  import Notepad from "@/apps/Notepad/notepad.svelte";
  import { ContextMenu, Win7ContextMenu } from "@/components/context_menu";
  import { Selecto } from "@/components/selecto";
  import Window from "@/components/window/window.svelte";
  import Calculator from "@/apps/Calculator/calculator.svelte";
  import { StartMenu } from "@/components/startmenu";
  import Taskbar from "@/components/taskbar/taskbar.svelte";
  import type { SvelteHTMLElements } from "svelte/elements";
  import { initFs, type TaskManagerItem } from "./FileSystem.svelte";
  import DesktopIcon from "./Icon.svelte";
  import { menuItems, type InstalledPrograms } from "./utils";

  let desktop: HTMLElement;

  type Placement = {
    column: number;
    row: number;
  };

  type SelectoItemProps = {
    label: string;
    id: string;
    props?: SvelteHTMLElements["div"];
    meta: any;
    placement?: Placement;
  };

  const fs = initFs(":root");

  let mouseCoordinates = $state({ x: 0, y: 0 });

  const ICON_SIZE = 70;
  const MARGIN = 2; // Margin between icons
  const ICON_STEP = ICON_SIZE + MARGIN;

  let currentRow = $state(0); // Tracks horizontal position (left to right)
  let currentColumn = $state(0); // Tracks vertical position (top to bottom)
  let isStartMenuOpen = $state(false);

  function placeNextIcon(): Placement {
    const desktopHeight = desktop.clientHeight;

    // Set the current position for the icon
    const column = currentColumn;
    const row = currentRow;

    // Move down to the next row
    currentColumn += ICON_STEP;

    // If the next row exceeds the desktop height, reset to the top and move to the next column
    if (currentColumn + ICON_SIZE > desktopHeight) {
      currentColumn = 0; // Reset to the top
      currentRow += ICON_STEP; // Move to the next column
    }

    return { column, row };
  }

  const onMouseMove = (ev: any) => {
    mouseCoordinates.x = ev.clientX;
    mouseCoordinates.y = ev.clientY;
  };
</script>

{#snippet selectoItems(items: SelectoItemProps[])}
  {#each items as item (item.id)}
    <ContextMenu menuItems={[{ label: "Icon rename" }]} class="">
      <ContextMenu.Trigger>
        <DesktopIcon
          style={`top: ${item.placement?.column}px; left: ${item.placement?.row}px;`}
          selecto_meta={item}
        />
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <Win7ContextMenu />
      </ContextMenu.Content>
    </ContextMenu>
  {/each}
{/snippet}

{#snippet renderCal(task: TaskManagerItem)}
  <Calculator placement={{ x: 349.333, y: 11.3333 }} {...task} />
{/snippet}

<Selecto>
  <ContextMenu {menuItems} class={`w-screen h-screen`}>
    <ContextMenu.Trigger>
      <main
        bind:this={desktop}
        onmousemove={onMouseMove}
        class="desktop relative h-screen scrollbar-hide overflow-hidden select-none"
      >
        {@render selectoItems(fs.getDesktopFiles())}

        <div class="flex">
          <button
            class="ml-auto"
            onclick={() => {
              let { column, row } = placeNextIcon();

              fs.createIcon({
                id: crypto.randomUUID(),
                label: `Icon ${fs.getDesktopFiles().length + 1}.exe`,
                placement: { column, row },
                meta: {
                  selecto: "meta",
                },
              });
            }}
          >
            Add new icon
          </button>
          <button
            onclick={() => {
              fs.launchTask({
                label: "Calculator",
                taskStatus: "running",
                windowStatus: "inview",
                pinnedToTaskbar: false,
                programId: "Calculator",
                windowId: crypto.randomUUID(),
              });
            }}
            >Start Calculator
          </button>
        </div>

        {#each fs.getTasks() as instance (instance.windowId)}
          <!-- TODO provide a proper taskId for id-ing installed programs -->
          {@const programId = instance.programId as InstalledPrograms}

          {#if programId === "Calculator"}
            {@render renderCal(instance)}
          {:else if programId === "Notepad"}
            <Window title="*Untitled - Notepad" showBarMenu>
              <Notepad />
            </Window>
          {/if}
        {/each}

        <!-- Startmenu -->
        <StartMenu bind:isStartMenuOpen />

        <Taskbar bind:isStartMenuOpen />
      </main>
    </ContextMenu.Trigger>
    <ContextMenu.Content>
      <Win7ContextMenu />
    </ContextMenu.Content>
  </ContextMenu>
</Selecto>

<style>
  .desktop {
    background-image: url("/bg.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
