<script lang="ts">
  import { onMount } from "svelte";
  import { handleBattery, type CustomNavigator } from "./utils";

  let { isStartMenuOpen = $bindable(false) }: { isStartMenuOpen: boolean } =
    $props();

  onMount(() => {
    if (navigator) {
      //   handleBattery(navigator as CustomNavigator);
    }
  });
</script>

<div id="taskbar" class="">
  <div
    id="start-button"
    onclick={() => {
      isStartMenuOpen = !isStartMenuOpen;
    }}
  >
    <span data-icon="start-button" class="icon"></span>
    <!-- style="--icon: url('/img/startbutton.webp');" -->
  </div>

  <!-- https://win7simu.visnalize.com -->
  <div id="taskbar-items">
    <div class="taskbar-item" data-target="computer" data-icon="computer"></div>
    <div class="taskbar-item opened" data-target="bin" data-icon="bin"></div>
    <!-- Place window tray here... -->
  </div>

  <div id="taskbar-tray">
    <!-- Action center icon -->
    <div class="taskbar-item">
      <img
        src="https://win7simu.visnalize.com/img/action-center.4d8b33c7.webp"
        style="width: 20px;"
        alt=""
      />
    </div>

    <!-- Battery -->
    <div class="taskbar-item">
      <div class="battery">
        <div style="height: 31%; top: 69%;"></div>
      </div>
    </div>

    <!-- Calendar icon -->
    <div class="taskbar-item calendar">
      <span>15:30</span>
      <span>15/12/2024</span>
    </div>

    <div
      class="taskbar-item show-desktop min-w-[18px]"
      aria-label="Desktop"
    ></div>
  </div>
</div>

<style>
  :global(#root) {
    --window-color: rgba(170, 209, 251, 0.65);
    --window-color-inactive: rgba(170, 209, 251, 0.3);
  }

  #taskbar {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 40px;
    left: 0;
    display: flex;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    backdrop-filter: blur(4px);
    background-color: var(--window-color);
    background-image: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.1333333333) 50px,
        transparent 80px
      ),
      linear-gradient(
        270deg,
        rgba(0, 0, 0, 0.1333333333) 200px,
        transparent 230px
      );
  }

  #taskbar::before {
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.2392156863),
      rgba(0, 0, 0, 0.2392156863) 70%,
      rgba(0, 0, 0, 0.4) 90%
    );
    box-shadow:
      inset 0 1px 0 rgba(0, 0, 0, 0.6666666667),
      inset 0 2px 0 hsla(0, 0%, 100%, 0.6666666667);
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    content: "";
    z-index: -1;
  }

  #start-button {
    padding: 0;
    margin: 0;
    width: 57px;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    display: flex;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  #start-button > span {
    --icon: url("/img/startbutton.webp");
    --tw-shadow: 0 0 transparent;
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --window-color: rgba(170, 209, 251, 0.65);
    --window-color-inactive: rgba(170, 209, 251, 0.3);
    --tw-ring-color: rgba(59, 130, 246, 0.5);
    --tw-ring-offset-shadow: 0 0 transparent;
    --tw-ring-shadow: 0 0 transparent;
    --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
    font-size: 16px;
    visibility: inherit;
    font-family:
      Segoe UI,
      sans-serif;
    user-select: none;
    display: inline-block;
    margin-right: 4px;
    width: 57px;
    height: 40px;
    background: var(--icon) -5px -9px no-repeat;
    background-size: 57px;
    filter: drop-shadow(0 0 1px #fff);
  }

  #start-button > span:hover {
    --window-color: rgba(170, 209, 251, 0.65);
    --window-color-inactive: rgba(170, 209, 251, 0.3);
    --icon: url("/img/startbutton.webp");
    --tw-shadow: 0 0 transparent;
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: rgba(59, 130, 246, 0.5);
    --tw-ring-offset-shadow: 0 0 transparent;
    --tw-ring-shadow: 0 0 transparent;
    --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
    font-size: 16px;
    visibility: inherit;
    font-family:
      Segoe UI,
      sans-serif;
    user-select: none;
    display: inline-block;
    margin-right: 4px;
    width: 57px;
    height: 40px;
    background: var(--icon) -5px -9px no-repeat;
    background-size: 57px;
    background-position-y: -66px;
    filter: drop-shadow(0 0 1px #fff);
  }

  #taskbar-items {
    --window-color: rgba(170, 209, 251, 0.65);
    --window-color-inactive: rgba(170, 209, 251, 0.3);
    --bg: url("https://win7simu.visnalize.com/img/default.deccec52.webp");
    --tw-shadow: 0 0 transparent;
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: rgba(59, 130, 246, 0.5);
    --tw-ring-offset-shadow: 0 0 transparent;
    --tw-ring-shadow: 0 0 transparent;
    --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
    font-size: 16px;
    visibility: inherit;
    font-family:
      Segoe UI,
      sans-serif;
    user-select: none;
    width: 100%;
    display: flex;
  }

  #taskbar-items .taskbar-item {
    visibility: inherit;
    --window-color: rgba(170, 209, 251, 0.65);
    --window-color-inactive: rgba(170, 209, 251, 0.3);
    --tw-shadow: 0 0 transparent;
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: rgba(59, 130, 246, 0.5);
    --tw-ring-offset-shadow: 0 0 transparent;
    --tw-ring-shadow: 0 0 transparent;
    --icon: url("https://win7simu.visnalize.com/img/computer.f1f7f519.webp");
    user-select: none;
    outline: none;
    box-sizing: border-box;
    --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    position: relative;
    color: #fff;
    height: 100%;
    border: 1px solid transparent;
    border-top: none;
    padding: 0;
    margin: 0;
    width: 60px;
    background: var(--icon) 50% no-repeat;
    background-size: 55%;
    margin-right: 2px;
  }

  .taskbar-item::before {
    position: absolute;
    top: 0;
    bottom: 0;
    content: "";
    width: 100%;
    height: 100%;
    opacity: 0;
    left: 0;
    right: 0;
    z-index: -1;
    -webkit-transition: opacity 0.2s;
    transition: opacity 0.2s;
  }

  .taskbar-item:not(.opened):hover::before {
    background-position-x: center, 0, calc(100% - 1px), 1px, 100%;
    background-image: radial-gradient(
        circle at bottom,
        rgba(191, 220, 250, 0.6666666667) 5%,
        transparent 15%
      ),
      radial-gradient(circle at 0 50%, rgba(0, 0, 0, 0.3333333333), transparent),
      radial-gradient(
        circle at 100% 50%,
        rgba(0, 0, 0, 0.3333333333),
        transparent
      ),
      radial-gradient(
        circle at 0 50%,
        hsla(0, 0%, 100%, 0.3333333333),
        transparent
      ),
      radial-gradient(
        circle at 100% 50%,
        hsla(0, 0%, 100%, 0.3333333333),
        transparent
      );
    background-size: 100%, 1px, 1px, 1px, 1px;
    background-repeat: no-repeat;
    -webkit-transition: none;
    transition: none;
    opacity: 1;
  }

  /* When the tab item window is minimized or opened */
  .taskbar-item.opened::before {
    background: linear-gradient(
      155deg,
      hsla(0, 0%, 100%, 0.7019607843),
      transparent 40%
    );
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.5333333333);
    -webkit-box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.5333333333);
    box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.5333333333);
    -webkit-transition: background-color 0.3s;
    transition: background-color 0.3s;
    opacity: 1;
  }

  .taskbar-item.opened:hover::before {
    background-color: hsla(0, 0%, 100%, 0.3333333333);
    -webkit-transition: background-color 0.3s;
    transition: background-color 0.3s;
    z-index: -1;
  }

  /* Tray */
  #taskbar-tray {
    --window-color: rgba(170, 209, 251, 0.65);
    --window-color-inactive: rgba(170, 209, 251, 0.3);
    --tw-shadow: 0 0 transparent;
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: rgba(59, 130, 246, 0.5);
    --tw-ring-offset-shadow: 0 0 transparent;
    --tw-ring-shadow: 0 0 transparent;
    --tw-ring-inset: var(--tw-empty,);
    font-size: 16px;
    font-family:
      Segoe UI,
      sans-serif;
    display: flex;
    user-select: none;
    align-items: center;
    visibility: inherit;
    -webkit-box-align: center;
  }

  #taskbar-tray .taskbar-item {
    padding: 0 5px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    min-width: 30px;
  }

  #taskbar-tray > .taskbar-item {
    user-select: none;
    box-sizing: border-box;
    --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    color: #fff;
    height: 100%;
    border: 1px solid transparent;
    border-top: none;
    padding: 0;
    margin: 0;
    margin-right: 2px;
  }

  :global(.battery) {
    border: 1.5px solid #fff;
    border-radius: 2px;
    padding: 1px;
    -webkit-box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4);
    background: rgba(0, 0, 0, 0.4);
    width: 11.1111111111px;
    height: 16.6666666667px;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .battery::before {
    left: 50%;
    right: unset;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    background: #fff;
    -webkit-box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.4);
    box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.4);
    position: absolute;
    top: unset;
    bottom: calc(100% + 1px);
    width: 50%;
    height: 2.0833333333px;
    content: "";
    opacity: unset;
  }

  .battery > div {
    background: #fff;
    position: relative;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .calendar {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    font-size: 80%;
  }

  .show-desktop {
    margin: 0;
    border-radius: 1px;
    -webkit-box-shadow:
      inset 0 0 0 1px rgba(0, 0, 0, 0.6),
      inset 0 0 0 2px hsla(0, 0%, 93.3%, 0.4666666667);
    box-shadow:
      inset 0 0 0 1px rgba(0, 0, 0, 0.6),
      inset 0 0 0 2px hsla(0, 0%, 93.3%, 0.4666666667);
    background: linear-gradient(
        180deg,
        hsla(0, 0%, 100%, 0.2),
        rgba(0, 0, 0, 0.2),
        hsla(0, 0%, 100%, 0.1333333333)
      ),
      radial-gradient(
        circle at 150% 100%,
        transparent 65% 70%,
        hsla(0, 0%, 100%, 0.2) 75%
      );
    min-width: 18px;
  }

  .show-desktop:hover {
    background-color: hsla(0, 0%, 100%, 0.2);
  }
</style>
