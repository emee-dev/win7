<script lang="ts" module>
  import type { MenuProps } from ".";
  import * as ContextMenu from "$lib/components/ui/context-menu/index";
  import { type IconProps } from "@/components/desktop/desktop_icons.svelte";

  export { listItem };
</script>

{#snippet listItem(
  menuItem: MenuProps<IconProps>,
  onItemClick: any,
  iconProps?: any
)}
  {@const isDisabled = menuItem?.isDisabled || null}
  {@const divider = menuItem?.hasDivider || null}

  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <li
    role="menuitem"
    class="{divider} outline-none"
    aria-haspopup={menuItem.subMenu ? "true" : "false"}
    aria-disabled={isDisabled}
    onclick={(ev) => {
      if (!menuItem.subMenu) {
        ev.stopPropagation();
      }

      onItemClick(menuItem);

      // if (iconProps) {
      menuItem?.onclick?.(iconProps);
      // }
    }}
  >
    {#if menuItem.icon}
      <img src={menuItem.icon} alt={menuItem.label} />
    {/if}

    {#if menuItem.subMenu}
      {menuItem.label}
    {:else}
      <span class="menuitem">{menuItem.label}</span>
    {/if}

    {#if menuItem.subMenu}
      <ul role="menu">
        {#each menuItem.subMenu as subMenuItem (subMenuItem.label)}
          {@render listItem(subMenuItem, onItemClick, iconProps)}
        {/each}
      </ul>
    {/if}
  </li>
{/snippet}
