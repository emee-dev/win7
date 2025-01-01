<script lang="ts">
  import { ContextMenu } from "@/components/context_menu_inprogress";
  import { os } from "@/components/desktop";
  import type {
    DesktopIcon,
    ExtraIconProps,
  } from "@/components/desktop/file_system.svelte";
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
  <ContextMenu.Root>
    <ContextMenu.Trigger
      ondblclick={(ev) => {
        ev.preventDefault();

        console.log("Trigger", item);
      }}
    >
      {@render Icon(item as IconProps)}
      <!-- {@render Icon({
        file_path: "/DD",
        id: crypto.randomUUID(),
        label: "MyComputer.exe",
        programId: "MyComputer",
        type: "executable",
      } as IconProps)} -->
    </ContextMenu.Trigger>
    <ContextMenu.Content class="z-50 w-full max-w-[229px] outline-none">
      <Win7ContextMenu
        menuItems={[{ label: "Icon rename" }, { label: "Icon Delete" }]}
      />
    </ContextMenu.Content>
  </ContextMenu.Root>
{/each}

<style>
  .item {
    /* visibility: inherit; */
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
    /* touch-action: manipulation; */
    /* padding: 4px 2px; */
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

    /* height: 40px; */
    /* width: 40px; */

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
