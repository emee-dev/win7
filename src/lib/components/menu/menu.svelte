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
    {#if menuItem.icon}
      <img src={menuItem.icon} alt={menuItem.label} />
    {/if}

    {menuItem.label}

    {#if menuItem.subMenu}
      <ul role="menu">
        {#each menuItem.subMenu as subMenuItem}
          <li role="menuitem" onclick={(e) => subMenuItem.onclick?.()}>
            <!-- <a href="#menu" class="menuitem">{subMenuItem.label}</a> -->
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
    tabindex={idx === 0 ? 0 : null}
  >
    {#if menuItem.icon}
      <img src={menuItem.icon} alt={menuItem.label} />
    {/if}

    <!-- <a href="#menu">{menuItem.label}</a> -->
    <span class="menuitem">{menuItem.label}</span>
  </li>
{/snippet}

<ul role="menu" style="width: 200px" class="can-hover select-none">
  {#each menuItems as item, index}
    {#if !item.subMenu}
      {@render menuItem(item, index)}
    {:else}
      {@render nestedMenuItem(item, index)}
    {/if}
  {/each}
</ul>
