<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import VanillaSelecto from "selecto";
  import Interact from "interactjs";
  import { NOT_SELECTABLE, SELECTABLE_ITEM } from ".";

  let container: HTMLElement;
  // let selectArea: HTMLElement;
  let interactable: ReturnType<typeof Interact>;

  const SELECTABLE = "." + SELECTABLE_ITEM;

  type SelectoProps = {
    children: Snippet<[]>;
    /**
     * Refers to on double click of a single `SelectoComponent` child components.
     * @param data
     */
  };

  const { children }: SelectoProps = $props();

  onMount(() => {
    interactable = Interact(SELECTABLE);
  });

  $effect(() => {
    if (!interactable) {
      return;
    }

    // interactable.on("doubletap", (event: any) => {
    //   if (event.double) {
    //     console.log("Double first");
    //     ondoubleclick({
    //       ev: "doubletap",
    //       meta: JSON.parse(event.target.getAttribute("data-selecto")!),
    //     });
    //   }
    // });
  });

  $effect(() => {
    if (!container || !interactable) {
      return;
    }

    const selecto = new VanillaSelecto({
      container: container as HTMLElement,
      dragContainer: ".selecto-area",
      selectableTargets: [".selecto-area", SELECTABLE],
      hitRate: "10px",
      selectByClick: true,
      selectFromInside: true,
      ratio: 0,
    });

    selecto.on("dragStart", (e: any) => {
      const target = e.inputEvent.target;

      // Prevent selecting icons when dragging an item.
      if (target.classList.contains(NOT_SELECTABLE)) {
        e.stop();
      }
    });

    selecto.on("select", (e) => {
      e.added.forEach((el) => {
        // TODO make so it that the user can provide the select class
        el.classList.add("selected");
      });

      e.removed.forEach((el) => {
        el.classList.remove("selected");
      });
    });
  });
</script>

<!-- Selecto area -->
<div class="w-full h-full" bind:this={container}>
  {@render children()}
</div>

<style>
  :global(:root) {
    --selecto-bg: #eee;
    --selecto-color: #4af;
    --selecto-size: 40px;
  }

  /* .selecto-area :global(.selected) {
      color: #fff;
      background: var(--color);
    } */

  /* Icon active state */
  :global(.selecto-area .selected) {
    background-color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
  }
</style>
