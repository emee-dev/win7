<script lang="ts">
  type MenuProps = {
    label: string;
    icon?: string;
    subMenu?: MenuProps[];
    hasDivider?: "has-divider" | null;
    isDisabled?: boolean;
    onclick?: () => void;
  };

  const { menuItems }: { menuItems: MenuProps[] } = $props();
</script>

{#snippet nestedMenuItem(menuItem: MenuProps, idx: number)}
  {@const disable = menuItem.isDisabled}
  {@const divider = menuItem.hasDivider || null}

  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <li
    role="menuitem"
    class={divider}
    aria-haspopup="true"
    aria-disabled={disable}
    onclick={menuItem.onclick}
    tabindex={0}
  >
    {menuItem.label}

    {#if menuItem.subMenu}
      <ul role="menu">
        {#each menuItem.subMenu as subMenuItem}
          <li role="menuitem" onclick={(e) => subMenuItem.onclick?.()}>
            <span class="menuitem">{subMenuItem.label}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </li>
{/snippet}

{#snippet menuItem(menuItem: MenuProps, idx: number)}
  {@const disable = menuItem.isDisabled}
  {@const divider = menuItem.hasDivider || null}

  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <li
    role="menuitem"
    class={divider}
    aria-disabled={disable}
    onclick={menuItem.onclick}
    tabindex={0}
  >
    <span class="menuitem">{menuItem.label}</span>
  </li>
{/snippet}

<ul role="menubar" class="can-hover h-[28px]">
  {#each menuItems as item, index}
    {#if !item.subMenu}
      {@render menuItem(item, index)}
    {:else}
      {@render nestedMenuItem(item, index)}
    {/if}
  {/each}
</ul>
