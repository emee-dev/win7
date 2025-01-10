<script lang="ts">
  import {
    getFs,
    type TaskManagerItem,
  } from "@/components/desktop/file_system.svelte";
  import { getIconByProgramId } from "@/components/desktop/utils";
  import { mediaAssets } from "@/const";
  import { onMount, untrack } from "svelte";
  import { Icon } from "svelte-awesome";
  import Close from "svelte-awesome/icons/close";
  import type { Action } from "svelte/action";
  import { getCurrentDateTime } from "./utils";

  const fs = getFs();

  let {
    isStartMenuOpen = $bindable(),
    startMenu = $bindable(null),
  }: { isStartMenuOpen: boolean; startMenu: HTMLDivElement | null } = $props();

  type OutsideClick = Action<
    HTMLDivElement,
    unknown,
    {
      onclick_outside: (e: CustomEvent) => void;
    }
  >;

  let showWelcomeToast = $state(false);

  let calendar = $state({
    time: { hours: 0, minutes: 0 },
    date: { day: 0, month: 0, year: 0 },
  });

  $effect.pre(() => {
    untrack(() => {
      calendar = getCurrentDateTime();
    });
  });

  onMount(() => {
    let holdOn = setTimeout(() => {
      showWelcomeToast = true;
    }, 1000);

    let id = setTimeout(() => {
      showWelcomeToast = false;
    }, 5000);

    if (navigator) {
      //   handleBattery(navigator as CustomNavigator);
    }

    return () => {
      clearTimeout(holdOn);
      clearTimeout(id);
    };
  });

  const toggleStartMenu = () => {
    isStartMenuOpen = !isStartMenuOpen;
  };

  const toggleWindowView = (
    windowId: string,
    status: "minimized" | "inview"
  ) => {
    if (status === "inview") {
      fs.modifyTask(windowId, { windowStatus: "minimized" });
    }

    if (status === "minimized") {
      fs.modifyTask(windowId, { windowStatus: "inview" });
    }
  };

  function handleClickOutside(event: any) {
    if (isStartMenuOpen) {
      isStartMenuOpen = !isStartMenuOpen;
    }
  }

  const clickListener: OutsideClick = (node) => {
    const handleClick = (event: any) => {
      if (
        node &&
        startMenu &&
        !node.contains(event.target) &&
        !startMenu.contains(event.target) &&
        !event.defaultPrevented
      ) {
        node.dispatchEvent(new CustomEvent("click_outside", node as any));
      }
    };

    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  };
</script>

{#snippet taskBarItem(window: TaskManagerItem & { executeBy: string })}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div
    class={`taskbar-item group relative ${window.windowStatus === "inview" && "opened"}`}
    style={`--icon: url('${getIconByProgramId(window.programId || window.executeBy)}');`}
    onclick={() => toggleWindowView(window.id, window.windowStatus)}
  >
    <!-- <div
      class="window hidden group-hover:block right-[50%] h-[180px] translate-x-[50%] absolute shadow-none bottom-[calc(40px)] bg-neutral-400"
      style="width: 230px; max-width: 229px;"
    >
      <div class="title-bar"></div>
      <div
        class="window-body has-space flex-1 flex flex-col overflow-auto bg-neutral-400"
        style="height: calc(100% - 10px);"
      >
        <p>There are just so many possibilities:</p>
        <ul>
          <li>A Task Manager</li>
          <li>A Notepad</li>
          <li>Or even a File Explorer!</li>
        </ul>
      </div>
    </div> -->
  </div>
{/snippet}

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div id="taskbar" class="">
  <div
    id="start-button"
    class="mr-6 ml-5"
    use:clickListener
    onclick_outside={handleClickOutside}
    onclick={() => toggleStartMenu()}
  >
    <span class="icon" style="--icon: url('{mediaAssets.StartButton}');"></span>
  </div>

  <div id="taskbar-items">
    {#each fs.getTasks() as item (item.id)}
      {@render taskBarItem(item as TaskManagerItem & { executeBy: string })}
    {/each}
  </div>

  <div id="taskbar-tray">
    <div class="taskbar-item relative justify-center w-fit tippy_target">
      <img
        src={mediaAssets.ActionCenterFlag}
        style="width: 20px;"
        alt="action center flag"
      />

      {#if showWelcomeToast}
        <div
          class=" absolute min-w-[100px] text-end w-[240px] h-[90px] -translate-y-[28px] right-0"
        >
          <div
            role="tooltip"
            class="is-top group text-black is-left relative w-full min-w-[90px] h-auto max-h-[90px] right-0 p-2"
          >
            <span class=""> Welcome 😃. I hope you 💖 it. </span>

            <div
              class="absolute rounded-md top-0 right-2 hidden group-hover:block"
              onclick={() => (showWelcomeToast = !showWelcomeToast)}
            >
              <Icon data={Close} />
            </div>
          </div>
        </div>
      {/if}
    </div>

    <div class="taskbar-item">
      <div class="battery">
        <div style="height: 31%; top: 69%;"></div>
      </div>
    </div>

    <div class="taskbar-item calendar">
      <!-- <span>15:30</span>
      <span>15/12/2024</span> -->
      <span>{calendar.time.hours}:{calendar.time.minutes}</span>
      <span>{calendar.date.day}/{calendar.date.month}/{calendar.date.year}</span
      >
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
    user-select: none;
    outline: none;
    box-sizing: border-box;
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

  #taskbar-items .taskbar-item:active {
    background-position: 55% 70%;
  }

  /* When the tab item window is minimized or opened */
  :global(.taskbar-item.opened::before) {
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
