<script lang="ts">
  import { Win7BarMenu } from "@/components/ui/bar_menu";
  import { getWindowContext } from "./ctx.svelte";
  import { type MenuProps } from "../context_menu";

  const ctx = getWindowContext();

  let menuItems = $state<MenuProps[]>([
    {
      label: "File",
      subMenu: [
        { label: "Open", onclick: () => console.log("Ctrl+O") },
        { label: "Save", onclick: () => console.log("Ctrl+S") },
        {
          label: "Save As...",
          hasDivider: "has-divider",
          onclick: () => console.log("Ctrl+Shift+S"),
        },
        { label: "Exit" },
      ],
    },
    {
      label: "Edit",
      subMenu: [
        { label: "Undo" },
        { label: "Copy" },
        { label: "Cut" },
        { label: "Paste", hasDivider: "has-divider" },
        { label: "Delete" },
        { label: "Find..." },
        { label: "Replace..." },
        { label: "Go to..." },
      ],
    },
    {
      label: "View",
      subMenu: [
        {
          label: "Zoom",
          subMenu: [
            { label: "Zoom In", onclick: () => console.log("Zoom In") },
            { label: "Zoom Out", onclick: () => console.log("Zoom Out") },
          ],
        },
        { label: "Status Bar" },
      ],
    },
    {
      label: "Help",
      subMenu: [{ label: "View Help" }, { label: "About" }],
    },
  ]);

  let { children } = $props();
</script>

<!-- The content inside window-body -->
<div
  class="window-body flex-1 flex flex-col overflow-auto"
  style="height: 100%;"
>
  {#if ctx.showBarMenu}
    <Win7BarMenu {menuItems} />
  {/if}

  <div class="content-area flex-1 bg-white p-0">{@render children?.()}</div>
</div>
