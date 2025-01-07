<script lang="ts">
  import { ContextMenu } from "@/components/context_menu";
  import { os } from "@/components/desktop";
  import type {
    DesktopIcon,
    ExtraIconProps,
  } from "@/components/desktop/file_system.svelte";
  import { Directory } from "@/components/desktop/file_system.svelte";
  import { SELECTABLE_ITEM } from "@/components/selecto";
  import { Win7ContextMenu } from "@/components/ui/popup_menu";
  import { cn } from "@/utils";
  import type { SvelteHTMLElements } from "svelte/elements";

  type IconProps = DesktopIcon & SvelteHTMLElements["div"] & ExtraIconProps;

  const fs = os.getFs();
</script>

{#snippet Icon(props: IconProps)}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    ondblclick={() => {
      if (Directory.isFilePath(props.file_path)) {
        // Check if is an installed program
        if ("programId" in props) {
          fs.launchTask({
            id: crypto.randomUUID(),
            label: props.programId,
            taskStatus: "running",
            windowStatus: "inview",
            pinnedToTaskbar: false,
            programId: props.programId,
          });
        }

        if ("executeBy" in props) {
          fs.launchTask({
            id: crypto.randomUUID(),
            label: props.executeBy,
            taskStatus: "running",
            windowStatus: "inview",
            pinnedToTaskbar: false,
            executeBy: props.executeBy,
            meta: {
              file_path: props.file_path,
            },
          });
        }
      }

      if (!Directory.isFilePath(props.file_path)) {
        fs.launchTask({
          id: crypto.randomUUID(),
          label: "File_Explorer",
          taskStatus: "running",
          windowStatus: "inview",
          pinnedToTaskbar: false,
          programId: "File_Explorer",
          meta: {
            folder_path: props.file_path,
          },
        });
      }
    }}
    class={cn("item ml-1", SELECTABLE_ITEM)}
    style={`width: 70px; height: 70px; z-index: 1; top: ${props.placement?.column}px; left: ${props.placement?.row}px;`}
    {...props}
  >
    <span class="icon-wrapper">
      <span class="icon" style="--icon: url('{props.icon}');"> </span>
    </span>
    <div class=" h-full text-wrap">{props.label.replace(".exe", "")}</div>
  </div>
{/snippet}

{#each fs.getDesktopFiles() as item (item.id)}
  <ContextMenu>
    <ContextMenu.Trigger>
      {@render Icon(item as IconProps)}
    </ContextMenu.Trigger>
    <ContextMenu.Content
      class="z-50 w-full max-w-[229px] outline-none first:bg-red-400"
    >
      <Win7ContextMenu
        menuItems={[
          {
            label: "Open",
            onclick() {},
          },
          { label: "Pin to Taskbar" },
          { label: "Delete" },
          { label: "Rename" },
        ]}
      />
    </ContextMenu.Content>
  </ContextMenu>
{/each}

<style>
  .item {
    font-family:
      Segoe UI,
      sans-serif;
    user-select: none;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 3px;
  }

  .item:hover {
    background-color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .icon-wrapper {
    user-select: none;
    width: 100%;
    height: calc(100% - 20px);
    min-height: 40px;
    position: relative;
  }

  .icon-wrapper .icon {
    display: inline-block;
    background: var(--icon) no-repeat 50%;
    background-size: contain;
    width: 100%;
    height: 100%;
    margin: 0px;
  }
</style>
