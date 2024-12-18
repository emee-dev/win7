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

<div
  class={`${className} computer icon group`}
  id={selecto_meta.label}
  data-label={selecto_meta.label}
  data-selecto={JSON.stringify(selecto_meta)}
  {...rest}
>
  <div class="absolute invisible group-hover:visible">
    {`col: ${selecto_meta?.placement?.column}px; row: ${selecto_meta?.placement?.row}px;`}
  </div>
</div>

<style>
  .cube {
    display: inline-block;
    border-radius: 5px;
    width: 40px;
    height: 40px;
    margin: 4px;
    background: #eee;
    --color: #4af;
    line-height: 40px;
  }

  /* Icons */
  .icon {
    position: absolute;
    display: block;
    width: 70px;
    height: 70px;
    background-size: 48px;
    background-repeat: no-repeat;
    background-position: top center;
    border: solid 1px transparent;
    border-radius: 2px;
    z-index: 2;
  }

  .icon::after {
    display: block;
    position: absolute;
    top: 50px;
    width: 100%;
    text-align: center;
    content: attr(data-label);
    color: #ffffff;
    text-shadow: 0 2px 2px #000;
  }

  .icon:hover {
    background-color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
  }

  #computer {
    top: 0;
    left: 0;
  }
</style>
