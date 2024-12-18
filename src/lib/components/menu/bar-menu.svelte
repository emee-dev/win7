<script lang="ts">
  // import type { Snippet } from "svelte";
  import { type MenuProps } from "./index";

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
    tabindex={idx === 0 ? 0 : null}
  >
    {menuItem.label}

    {#if menuItem.subMenu}
      <ul role="menu">
        {#each menuItem.subMenu as subMenuItem}
          <li role="menuitem" onclick={(e) => subMenuItem.onclick?.()}>
            <span class="menuitem">{subMenuItem.label}</span>
            <!-- <a href="#menubar">
              {subMenuItem.label}
            </a> -->
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
    tabindex={idx === 0 ? 0 : null}
  >
    <!-- <a href="#menu">{menuItem.label}</a> -->
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
