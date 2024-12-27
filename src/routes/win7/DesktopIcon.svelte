<!-- <script lang="ts">
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
</script> -->

<!-- id={selecto_meta.label}
data-label={selecto_meta.label}
data-selecto={JSON.stringify(selecto_meta)}
{...rest} -->
<div class={`item group flex flex-col`}>
  <span class="icon-wrapper mx-auto">
    <span
      class="icon size-[40px] pt-1"
      style="--icon: url('/img/empty_folder.webp');"
    >
    </span>
  </span>

  <span class="mx-auto">Computer</span>
</div>

<style>
  .item {
    /* display: block; */
    position: absolute;
    width: 70px;
    height: 70px;
    background-size: 48px;
    background-repeat: no-repeat;
    background-position: top center;
    border: solid 1px transparent;
    border-radius: 2px;
    z-index: 2;
  }

  /* .item::after {
    display: block;
    position: absolute;
    top: 50px;
    width: 100%;
    text-align: center;
    content: attr(data-label);
    color: #ffffff;
    text-shadow: 0 2px 2px #000;
  } */

  .item .icon-wrapper {
    user-select: none;
    position: relative;
  }

  .item .icon-wrapper .icon {
    display: inline-block;
    background: var(--icon) no-repeat 50%;
    background-size: contain;
    /* width: 100%;
    height: 100%; */
    margin: 0;
  }

  .item:hover {
    background-color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
  }
</style>
