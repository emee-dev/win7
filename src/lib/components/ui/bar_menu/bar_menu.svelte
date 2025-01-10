<script lang="ts">
  import { type MenuProps } from "./index";
  const { menuItems }: { menuItems: MenuProps[] } = $props();
</script>

{#snippet nestedMenuItem(menuItem: MenuProps)}
  {@const isDisabled = menuItem?.isDisabled || null}

  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <li
    role="menuitem"
    aria-haspopup="true"
    aria-disabled={isDisabled}
    onclick={menuItem?.onclick}
  >
    {menuItem.label}

    {#if menuItem.subMenu}
      <ul role="menu">
        {#each menuItem.subMenu as subMenuItem (subMenuItem.label)}
          <li role="menuitem" onclick={subMenuItem?.onclick}>
            <span class="menuitem">{subMenuItem.label}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </li>
{/snippet}

{#snippet menuItem(menuItem: MenuProps)}
  {@const isDisabled = menuItem?.isDisabled || null}

  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <li role="menuitem" aria-disabled={isDisabled} onclick={menuItem.onclick}>
    {menuItem.label}
  </li>
{/snippet}

<ul role="menubar" class="can-hover h-[28px]">
  {#each menuItems as item (item.label)}
    {#if item.subMenu}
      {@render nestedMenuItem(item)}
    {:else}
      {@render menuItem(item)}
    {/if}
  {/each}
</ul>
