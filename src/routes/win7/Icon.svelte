<script lang="ts">
  import type { SvelteHTMLElements } from "svelte/elements";

  type Placement = {
    column: number;
    row: number;
  };

  type SelectoItemProps = {
    label: string;
    id: string;
    meta: any;
    placement?: Placement;
  };

  type SelectoItem = {
    selecto_meta: SelectoItemProps;
  } & SvelteHTMLElements["div"];

  let { selecto_meta, class: className, ...rest }: SelectoItem = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="item"
  style={`width: 70px; height: 70px; z-index: 1; ${rest.style}`}
  ondblclick={() => {
    console.log(selecto_meta);
  }}
  {...rest}
>
  <span class="icon-wrapper">
    <span class="icon" style="--icon: url('/img/empty_folder.webp');"> </span>
  </span>
  <span>Computer</span>
</div>

<style>
  .item {
    visibility: inherit;
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
    touch-action: manipulation;
    padding: 4px 2px;
    border: 1px solid transparent;
    border-radius: 3px;
    width: 70px;
    height: 70px;
    z-index: 1;
  }

  .item:hover {
    /* background: rgba(242, 247, 254, 0.4666666667);
    box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.6666666667); */

    background-color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .item .icon-wrapper {
    user-select: none;
    width: 100%;
    height: calc(100% - 20px);
    position: relative;
  }

  .item .icon-wrapper .icon {
    /* display: block; */
    display: inline-block;
    background: var(--icon) no-repeat 50%;
    background-size: contain;
    width: 100%;
    height: 100%;
    margin: 0;
  }
</style>
