<script lang="ts">
  import { ContextMenu, Label } from "bits-ui";
  import type { MenuProps } from ".";

  const { menuItems }: { menuItems: MenuProps[] } = $props();
</script>

{#snippet nestedMenuItem(menuItem: MenuProps)}
  {@const isDisabled = menuItem?.isDisabled || null}
  {@const divider = menuItem?.hasDivider || null}

  <!-- svelte-ignore a11y_click_events_have_key_events -->

  <li
    role="menuitem"
    class={divider}
    aria-haspopup="true"
    aria-disabled={isDisabled}
    onclick={menuItem.onclick}
  >
    {#if menuItem.icon}
      <img src={menuItem.icon} alt={menuItem.label} />
    {/if}

    {menuItem.label}

    {#if menuItem.subMenu}
      <ul role="menu">
        {#each menuItem.subMenu as subMenuItem (subMenuItem.label)}
          <li role="menuitem" onclick={(e) => subMenuItem.onclick?.()}>
            <span class="menuitem">{subMenuItem.label}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </li>
{/snippet}

{#snippet menuItem(menuItem: MenuProps)}
  {@const isDisabled = menuItem?.isDisabled || null}
  {@const divider = menuItem?.hasDivider || null}

  <!-- svelte-ignore a11y_click_events_have_key_events -->

  <li
    role="menuitem"
    class={divider}
    aria-disabled={isDisabled}
    onclick={menuItem.onclick}
  >
    {#if menuItem.icon}
      <img src={menuItem.icon} alt={menuItem.label} />
    {/if}

    <span class="menuitem">{menuItem.label}</span>
  </li>
{/snippet}

<ul role="menu" style="width: 200px" class="can-hover select-none">
  {#each menuItems as item (item.label)}
    {#if item.subMenu}
      {@render nestedMenuItem(item)}
    {:else}
      {@render menuItem(item)}
    {/if}
  {/each}
</ul>
