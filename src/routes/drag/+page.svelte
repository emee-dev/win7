<script lang="ts">
  import Moveable from "moveable";
  import Selecto from "selecto";
  import { onMount } from "svelte";

  const hitRate = 0;
  const selectByClick = true;
  const selectFromInside = false;
  const toggleContinueSelect = ["shift"];
  const ratio = 0;

  let targets = $state([]);
  let moveableRef: Moveable;
  let selectoRef: Selecto;

  onMount(() => {
    const element$0 = document.querySelector(
      `[data-croffle-ref="element$0"]`
    ) as HTMLElement;

    moveableRef = new Moveable(element$0, { target: targets, draggable: true });

    selectoRef = new Selecto({
      container: document.querySelector(
        `[data-croffle-ref="selectoRef"]`
      ) as HTMLElement,
      dragContainer: ".elements",
      selectableTargets: [".target"],
      hitRate: hitRate,
      selectByClick: selectByClick,
      selectFromInside: selectFromInside,
      toggleContinueSelect: toggleContinueSelect,
      ratio: ratio,
      keyContainer: window,
    });
  });

  function setTargets(nextTargets) {
    // targets = nextTargets;
    // moveableRef.target = targets;
    moveableRef.target = nextTargets;
  }

  $effect(() => {
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

    selectoRef.on("select", (e) => {
      e.added.forEach((el) => {
        // TODO make so it that the user can provide the select class
        el.classList.add("selected");
      });

      e.removed.forEach((el) => {
        el.classList.remove("selected");
      });
    });

    selectoRef.on("dragStart", (e: any) => {
      const target = e.inputEvent.target;

      if (
        moveableRef!.isMoveableElement(target) ||
        targets!.some((t) => t === target || t.contains(target))
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

      // setTargets(e.selected);

      moveableRef.target = e.selected;
    });
  });
</script>

<div class="moveable app">
  <div class="container" data-croffle-ref="element$0">
    <div data-croffle-ref="selectoRef"></div>
    <div class="elements selecto-area" data-croffle-ref="element$1">
      <div class="cube target"></div>
      <div class="cube target"></div>
      <div class="cube target"></div>
      <div class="cube target"></div>
      <div class="cube target"></div>
      <div class="cube target"></div>
      <div class="cube target"></div>
      <div class="cube target"></div>
      <div class="cube target"></div>
      <div class="cube target"></div>
      <div class="cube target"></div>
      <div class="cube target"></div>
      <div class="cube target"></div>
      <div class="cube target"></div>
      <div class="cube target"></div>
      <div class="cube target"></div>
      <div class="cube target"></div>
    </div>
    <div class="empty elements"></div>
  </div>
</div>

<style>
  html,
  body,
  #root {
    position: relative;
    margin: 0;
    padding: 0;
    height: 100%;
    color: #333;
    background: #fdfdfd;
  }

  .app {
    position: relative;
    min-height: 100%;
    padding: 10px 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .container {
    max-width: 800px;
  }

  body {
    background: #fff;
  }

  .logo {
    position: relative;
    width: 150px;
    height: 150px;
    margin: 0px auto;
    font-size: 0;
    text-align: left;
  }

  .logo.logos {
    width: 320px;
    text-align: center;
  }

  .logos .selecto {
    padding: 16px;
  }

  .logo img {
    position: relative;
    height: 100%;
    box-sizing: border-box;
  }

  .cube {
    display: inline-block;
    border-radius: 5px;
    width: 40px;
    height: 40px;
    margin: 4px;
    background: #eee;
    /* --color: #4af; */
    line-height: 40px;
  }

  h1,
  .description {
    text-align: center;
  }

  .selecto-area :global(.selected) {
    background: red;
    background-color: red;
  }
  /* 
  .button {
    border: 1px solid #333;
    color: #333;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    box-sizing: border-box;
    cursor: pointer;
    width: 120px;
    height: 42px;
    font-size: 14px;
    letter-spacing: 1px;
    transition: all ease 0.2s;
    margin: 0px 5px;
  } */

  /* .button:hover {
    background: #333;
    color: white;
  }

  .elements {
    margin-top: 40px;
    border: 2px solid #eee;
  } */

  .selecto-area {
    padding: 20px;
  }

  #selecto1 .cube {
    transition: all ease 0.2s;
  }

  .moveable #selecto1 .cube {
    transition: none;
  }

  /* .selecto-area .selected {
    color: #fff;
    background: var(--color);
  } */

  .scroll {
    overflow: auto;
    padding-top: 10px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .infinite-viewer,
  .scroll {
    width: 100%;
    height: 300px;
    box-sizing: border-box;
  }

  .infinite-viewer .viewport {
    padding-top: 10px;
  }

  .empty.elements {
    border: none;
  }

  .correct {
    position: relative;
    padding: 20px;
    text-align: center;
    margin: auto;
    width: 100%;
  }
  .correct .target {
    position: relative;
    width: 100px;
    height: 100px;
    color: #fff;
    margin: 10px 20px;
    line-height: 100px;
    text-align: center;
    display: inline-block;
  }
  .correct svg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    opacity: 0.9;
    transform: translateZ(0px);
  }
  .correct svg path {
    stroke: #333;
    stroke-width: 2;
    fill: transparent;
  }
</style>
