<script lang="ts">
  type MenuProps = {
    label: string;
    icon?: string;
    subMenu?: MenuProps[];
    isDisabled?: boolean;
    onclick?: () => void;
  };

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
  <!-- {@const divider = menuItem?.hasDivider || null} -->

  <!-- svelte-ignore a11y_click_events_have_key_events -->

  <li role="menuitem" aria-disabled={isDisabled} onclick={menuItem.onclick}>
    <!-- <span class="menuitem">{menuItem.label}</span> -->
    {menuItem.label}
  </li>
{/snippet}

<ul role="menubar" class="can-hover h-[28px] flex items-center">
  <div class="left flex items-center gap-x-2 pl-3">
    <div class="font-medium text-[12px] font-segoe">Organize</div>
    <div class="font-medium text-[12px] font-segoe">New Folder</div>
  </div>

  <div class="right ml-auto pr-3">
    <div class="font-medium text-[12px] font-segoe">Toggle</div>
  </div>
</ul>
