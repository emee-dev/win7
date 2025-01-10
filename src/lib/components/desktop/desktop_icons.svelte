<script lang="ts">
  import * as ContextMenu from "@/components/ui/context-menu/index";
  import { os } from "@/components/desktop";
  import type {
    DesktopIcon,
    ExtraIconProps,
  } from "@/components/desktop/file_system.svelte";
  import { Directory } from "@/components/desktop/file_system.svelte";
  import { NOT_SELECTABLE, SELECTABLE_ITEM } from "@/components/selecto";
  import { cn } from "@/utils";
  import { listItem } from "../ui/popup_menu/popup_menu.svelte";

  import type { Action } from "svelte/action";
  import { onDestroy, onMount } from "svelte";
  import { type MenuProps } from "@/components/ui/popup_menu";

  export type IconProps = DesktopIcon & ExtraIconProps;
  let props: IconProps = $props();
  const fs = os.getFs();

  let isOpen = $state(false);
  let isRenaming = $state(false);
  let inputField = $state<HTMLInputElement | null>(null);

  const onItemClick = (d: MenuProps) => {
    isOpen = !isOpen;
  };

  const menuItems: MenuProps<IconProps>[] = [
    { label: "Open", onclick() {} },
    { label: "Pin to Taskbar" },
    {
      label: "Delete",
      async onclick(props) {
        console.log(await fs.deleteFile(props.file_path));
      },
    },
    {
      label: "Rename",
      onclick() {
        isRenaming = !isRenaming;
      },
    },
  ];

  type OutsideClick = Action<
    HTMLFormElement,
    unknown,
    {
      onclick_outside: (e: CustomEvent) => void;
    }
  >;

  const handleClickOutside: OutsideClick = (node) => {
    const handleClick = (event: any) => {
      if (node && !node.contains(event.target)) {
        node.dispatchEvent(new CustomEvent("click_outside", node as any));
      }
    };

    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  };
</script>

<ContextMenu.Root open={isOpen} onOpenChange={(v) => (isOpen = v)}>
  <ContextMenu.Trigger class="w-fit h-fit">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      ondblclick={() => {
        if (Directory.isFile(props.file_path)) {
          if ("programId" in props && props.type === "executable") {
            fs.launchTask({
              id: crypto.randomUUID(),
              label: props.programId,
              taskStatus: "running",
              windowStatus: "inview",
              pinnedToTaskbar: false,
              programId: props.programId,
              meta: (props?.meta as Record<string, string>) || undefined,
            });
          }
          if ("executeBy" in props && props.type === "file") {
            fs.launchTask({
              id: crypto.randomUUID(),
              label: props.executeBy,
              taskStatus: "running",
              windowStatus: "inview",
              pinnedToTaskbar: false,
              executeBy: props.executeBy,
              file_path: props.file_path,
              meta: props?.meta as Record<string, string>,
            } as any);
          }
        }
        if (Directory.isFolder(props.file_path)) {
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

      {#if !isRenaming}
        <div class="label-wrapper">
          <div class="label">{props.label.replace(".exe", "")}</div>
        </div>
      {/if}

      {#if isRenaming}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <form
          class="input-wrapper"
          onsubmit={(e) => {
            e.preventDefault();
            let form = new FormData(e.currentTarget);

            let input = form.get("rename") as string;

            // fs.modifyTask()

            let file = fs.fs?.readFile(props.file_path);

            console.log("file", file);
          }}
          use:handleClickOutside
          onclick_outside={() => {
            inputField?.blur();
            isRenaming = !isRenaming;
          }}
          onclick={(e) => {
            e.stopPropagation();
            inputField?.focus();
            inputField?.select();
          }}
        >
          <input
            class="rename-input focus-within:outline-none"
            name="rename"
            type="text"
            defaultValue={props.label}
            bind:this={inputField}
          />
        </form>
      {/if}
    </div>
  </ContextMenu.Trigger>
  <ContextMenu.Content
    class="z-50 w-full max-w-[229px] outline-none first:bg-red-400"
  >
    <ul
      role="menu"
      style="width: 200px"
      class="can-hover select-none outline-none"
    >
      {#each menuItems as item (item.label)}
        {@render listItem(item, onItemClick, props)}
      {/each}
    </ul>
  </ContextMenu.Content>
</ContextMenu.Root>

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
    height: 50px;
    position: relative;
  }

  .icon-wrapper .icon {
    display: inline-block;
    background: var(--icon) no-repeat 50%;
    background-size: contain;
    width: 100%;
    height: 100%;
  }

  .label-wrapper {
    height: 15px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    font-size: 10px;
  }

  .input-wrapper {
    width: 100%;
    text-align: center;
  }

  .rename-input {
    width: 95%;
    font-size: 10px;
    /* padding: 2px; */
    box-sizing: border-box;
  }
</style>
