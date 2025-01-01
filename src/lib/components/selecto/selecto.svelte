<script lang="ts">
  import Moveable, { type MoveableRefTargetType } from "moveable";
  import VanillaSelecto from "selecto";
  import { onMount, type Snippet } from "svelte";
  import { NOT_SELECTABLE } from ".";

  let moveableRef: Moveable;
  let selectoRef: VanillaSelecto;

  type SelectoProps = {
    children: Snippet<[]>;
  };

  const { children }: SelectoProps = $props();
  let targets = $state<MoveableRefTargetType[]>([]);

  const hitRate = 0;
  const selectByClick = true;
  const selectFromInside = false;
  const toggleContinueSelect = ["shift"];
  const ratio = 0;

  onMount(() => {
    const moveableParentContainer = document.querySelector(
      `.desktop`
    ) as HTMLElement;

    moveableRef = new Moveable(moveableParentContainer, {
      target: targets,
      origin: false,
      draggable: true,
    });

    selectoRef = new VanillaSelecto({
      dragContainer: ".desktop",
      selectableTargets: [".selecto_selectable"],
      hitRate: hitRate,
      selectByClick: selectByClick,
      selectFromInside: selectFromInside,
      toggleContinueSelect: toggleContinueSelect,
      ratio: ratio,
      keyContainer: window,
    });
  });

  $effect(() => {
    if (!selectoRef) {
      throw new Error("SelectoRef not defined.");
    }

    moveableRef.on("clickGroup", (e) => {
      selectoRef!.clickTarget(e.inputEvent, e.inputTarget);
    });

    moveableRef.on("render", (e) => {
      e.target.style.cssText += e.cssText;
    });

    moveableRef.on("renderGroup", (e) => {
      e.events.forEach((ev) => {
        ev.target.style.cssText += ev.cssText;
      });
    });

    selectoRef.on("dragStart", (e: any) => {
      const target = e.inputEvent.target as HTMLElement;

      // Prevent dragging on unsupported items.
      if (target.classList.contains(NOT_SELECTABLE)) {
        return e.stop();
      }

      let isMoveableElement = moveableRef.isMoveableElement(target);

      if (
        isMoveableElement ||
        // @ts-expect-error typeerror contains() is not defined.
        targets.some((t) => t === target || t.contains(target))
      ) {
        e.stop();
      }
    });

    selectoRef.on("selectEnd", (e) => {
      if (e.isDragStartEnd) {
        e.inputEvent.preventDefault();

        moveableRef!.waitToChangeTarget().then(() => {
          moveableRef!.dragStart(e.inputEvent);
        });
      }

      moveableRef.target = e.selected;
    });

    selectoRef.on("select", (e) => {
      e.added.forEach((el) => {
        el.classList.add("selected");
      });

      e.removed.forEach((el) => {
        el.classList.remove("selected");
      });
    });
  });
</script>

{@render children()}

<style>
  :global(:root) {
    --selecto-bg: #eee;
    --selecto-color: #4af;
    --selecto-size: 40px;
  }

  /* Icon active state */
  :global(.selecto-area .selected) {
    background-color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
  }
</style>
