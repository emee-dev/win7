<script lang="ts">
  import { os } from "@/components/desktop";
  import { type TaskManagerItem } from "@/components/desktop/file_system.svelte";
  import {
    getIconByProgramId,
    type InstalledPrograms,
  } from "@/components/desktop/utils";
  import type { Action } from "svelte/action";

  const fs = os.getFs();

  let isFeaturedView = $state(true);
  let { isStartMenuOpen = $bindable(false) }: { isStartMenuOpen: boolean } =
    $props();

  const leftCaret = `\\23F4`;
  const rightCaret = `\\23F5`;

  const installed = [
    {
      id: crypto.randomUUID(),
      label: "Calculator",
      taskStatus: "running",
      windowStatus: "inview",
      pinnedToTaskbar: false,
      programId: "Calculator",
    },
    {
      id: crypto.randomUUID(),
      label: "File_Explorer",
      taskStatus: "running",
      windowStatus: "inview",
      pinnedToTaskbar: false,
      programId: "File_Explorer",
      meta: {
        folder_path: "C:",
      },
    },
    {
      id: crypto.randomUUID(),
      label: "MyComputer",
      taskStatus: "running",
      windowStatus: "inview",
      pinnedToTaskbar: false,
      programId: "File_Explorer",
      meta: {
        folder_path: "C:/Control Panel",
      },
    },
    {
      id: crypto.randomUUID(),
      label: "Notepad",
      taskStatus: "running",
      windowStatus: "inview",
      pinnedToTaskbar: false,
      programId: "Notepad",
    },
    {
      id: crypto.randomUUID(),
      label: "RecycleBin",
      taskStatus: "running",
      windowStatus: "inview",
      pinnedToTaskbar: false,
      programId: "File_Explorer",
      meta: {
        folder_path: "C:/Recycle Bin",
      },
    },
  ];

  function handleClickOutside(event: any) {
    isStartMenuOpen = false;
  }

  type OutsideClick = Action<
    HTMLDivElement,
    unknown,
    {
      onclick_outside: (e: CustomEvent) => void;
    }
  >;

  const clicks: OutsideClick = (node) => {
    const handleClick = (event: any) => {
      if (node && !node.contains(event.target) && !event.defaultPrevented) {
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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#snippet featuredPrograms(args: TaskManagerItem)}
  <div
    class="program featured flex items-center active"
    style=" --icon: url('{getIconByProgramId(
      args.label as InstalledPrograms
    )}');"
    onclick={() => fs.launchTask(args)}
  >
    {args.label.replace("_", " ")}
  </div>
{/snippet}

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#snippet mainPrograms(args: TaskManagerItem)}
  <div
    class="program flex items-center"
    style=" --icon: url('{getIconByProgramId(
      args.label as InstalledPrograms
    )}');"
    onclick={() => fs.launchTask(args)}
  >
    {args.label}
  </div>
{/snippet}

<div
  use:clicks
  onclick_outside={handleClickOutside}
  id="start-menu"
  class={isStartMenuOpen ? "flex" : "hidden"}
>
  <div class="programs">
    <div class="programs-list has-scrollbar">
      {#if isFeaturedView}
        <!-- There can only be 8 featured items at a time. -->
        {#each installed as program (program.id)}
          {@render featuredPrograms(program as TaskManagerItem)}
        {/each}
      {:else}
        {#each installed as normalProgram}
          {@render mainPrograms(normalProgram as TaskManagerItem)}
        {/each}
      {/if}
    </div>
    <div class="extra w-full">
      <hr
        class="mx-[auto] my-[0] border-[1px] border-[solid] border-[#d6e5f5] w-[90%]"
      />

      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class={`programs-nav before:content-['${isFeaturedView ? rightCaret : leftCaret}']`}
        onclick={() => {
          isFeaturedView = !isFeaturedView;
        }}
      >
        {isFeaturedView ? "All Programs" : "Back"}
      </div>
      <div class="program-search">
        <input class="w-full" type="search" placeholder="Search" />
      </div>
    </div>
  </div>
  <div class="links">
    <div class="account">
      <div class="img no-name">
        <img
          src="/img/startmenu_guest.webp"
          alt="profile_img"
          width="50"
          height="50"
        />
      </div>
    </div>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="link"
      onclick={() => {
        fs.launchTask({
          id: crypto.randomUUID(),
          label: "File_Explorer",
          taskStatus: "running",
          windowStatus: "inview",
          pinnedToTaskbar: false,
          programId: "File_Explorer",
          meta: {
            folder_path: "C:/Libraries/Documents",
          },
        });
      }}
    >
      Documents
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="link"
      onclick={() => {
        fs.launchTask({
          id: crypto.randomUUID(),
          label: "File_Explorer",
          taskStatus: "running",
          windowStatus: "inview",
          pinnedToTaskbar: false,
          programId: "File_Explorer",
          meta: {
            folder_path: "C:/Libraries/Pictures",
          },
        });
      }}
    >
      Pictures
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="link"
      onclick={() => {
        fs.launchTask({
          id: crypto.randomUUID(),
          label: "File_Explorer",
          taskStatus: "running",
          windowStatus: "inview",
          pinnedToTaskbar: false,
          programId: "File_Explorer",
          meta: {
            folder_path: "C:/Libraries/Music",
          },
        });
      }}
    >
      Music
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="link has-line"
      onclick={() => {
        fs.launchTask({
          id: crypto.randomUUID(),
          label: "File_Explorer",
          taskStatus: "running",
          windowStatus: "inview",
          pinnedToTaskbar: false,
          programId: "File_Explorer",
          meta: {
            folder_path: "C:",
          },
        });
      }}
    >
      Computer
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="link"
      onclick={() => {
        fs.launchTask({
          id: crypto.randomUUID(),
          label: "File_Explorer",
          taskStatus: "running",
          windowStatus: "inview",
          pinnedToTaskbar: false,
          programId: "File_Explorer",
          meta: {
            folder_path: "C:/Control Panel",
          },
        });
      }}
    >
      Control Panel
    </div>
    <div class="link">Default Programs</div>
    <div class="link">Help and Support</div>
    <div class="button-group">
      <div class="button">Shut down</div>
      <div class="button button-ext">
        <i class="fa fa-caret-right"> </i>
      </div>
    </div>
  </div>
</div>

<style>
  :root {
    --font: 9pt "Segoe UI", "SegoeUI", "Noto Sans", sans-serif;
    --button-gradient: linear-gradient(
      to bottom,
      var(--button-face) 45%,
      var(--button-shade-light) 45%,
      var(--button-shade-dark)
    );
    --button-border: 1px solid;
    --button-border-color: #8e8f8f;
    --button-border-color-hovered: #3c7fb1;
    --border-radius: 3px;
    --button-shadow: inset 0 0 0 1px #fffc;
  }

  #start-menu {
    visibility: inherit;
    font-family:
      Segoe UI,
      sans-serif;
    --window-color: rgba(170, 209, 251, 0.65);
    user-select: none;
    z-index: 99;
    position: absolute;
    bottom: 40px;
    display: flex;
    height: 411px;
    font-size: 9pt;
    padding: 7px;
    border: 1px solid #555;
    border-radius: 8px 8px 0 0;
    box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.3333333333);
    background: linear-gradient(
      rgba(0, 0, 0, 0.3333333333),
      rgba(0, 0, 0, 0.5333333333) 15% 60%,
      rgba(0, 0, 0, 0.1333333333)
    );
    backdrop-filter: blur(4px);
    background-color: var(--window-color);
  }

  #start-menu .programs {
    background: #fff;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.6666666667);
    -webkit-box-shadow: 0 0 0 1px hsla(0, 0%, 100%, 0.3333333333);
    box-shadow: 0 0 0 1px hsla(0, 0%, 100%, 0.3333333333);
    width: 247px;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
  }

  #start-menu .programs-list {
    padding: 2px;
    height: 80%;
    overflow: auto;
    font-size: 9pt;
  }

  .program {
    box-sizing: border-box;
    width: 100%;
    position: relative;
    z-index: 1;
    background: var(--icon) no-repeat 3px/18px;
    border-radius: 3px;
    padding: 6px;
    border: 1px solid transparent;
    padding-left: 28px;
    text-align: left;
  }

  .program::before {
    content: "";
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    z-index: -1;
    position: absolute;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    opacity: 1;
    border-radius: 3px;
    border: 0px solid #7da2ce;
    box-shadow: inset 0 0 0 1px #fff;
    -webkit-box-shadow: inset 0 0 0 1px #fff;
  }

  .program.featured {
    height: 12.5%;
    background: var(--icon) no-repeat 3px/28px;
    padding-left: 45px;
  }

  .program.featured:hover::before {
    border: 1px solid #7da2ce;
    background:
      var(--icon) no-repeat 2px/28px,
      linear-gradient(180deg, #ddecfd, #c2dcfd) no-repeat 0;
  }

  .program:not(.featured):hover {
    border: 1px solid #7da2ce;
    background:
      var(--icon) no-repeat 3px/18px,
      linear-gradient(180deg, #ddecfd, #c2dcfd) no-repeat 0;
  }

  #start-menu .extra {
    position: absolute;
    bottom: 0px;
    display: flex;
    flex-direction: column;
    justify-items: center;
    font-size: 12px;
  }

  .extra .programs-nav {
    user-select: none;
    display: flex;
    align-items: center;
    position: relative;
    margin: -2px 3px 3px 3px;
    border: 1px solid transparent;
    border-radius: 3px;
    padding: 6px 0 6px 36px;
  }

  .extra .programs-nav::before {
    left: 5px;
    width: 50px;
    height: auto;
    line-height: 1;
    font-size: 16px;
    position: absolute;
    color: currentColor;
    content: "\23F5";
  }

  .extra .programs-nav:hover {
    border-radius: 3px;
    border: 1px solid #7da2ce;
    transition: border-color 0.3s;
    box-shadow: inset 0 0 0 1px #fff;
    -webkit-box-shadow: inset 0 0 0 1px #fff;
    border-color: var(--button-border-color-hovered);
    background: linear-gradient(180deg, #ddecfd, #c2dcfd) no-repeat 0;
  }

  .extra .program-search {
    user-select: none;
    box-shadow: inset 0 2px 3px #d6e0ef;
    padding: 8px 10px;
  }

  /* Startmenu link section */
  /* 	https://win7simu.visnalize.com/img/guest.1a7eab2b.webp */
  #start-menu .links {
    user-select: none;
    font-size: 9pt;
    width: 140px;
    color: #fff;
    box-sizing: border-box;
    position: relative;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    padding: 40px 1px 2px 7px;
  }

  .links .account {
    color: #fff;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    border-radius: 3px;
    border: 1px solid transparent;
    position: absolute;
    top: -45px;
    min-width: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 0px;
  }

  .account > .img.no-name {
    margin: 0;
    padding: 13px;
    user-select: none;
    display: inline-flex;
    filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.5333333333)) contrast(1.3);
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: contain;
    background-image: url("/img/account_profile_ring.webp");
  }

  .account .img {
    border-radius: 3px;
    margin: auto;
    align-self: center;
    filter: contrast(0.7);
  }

  /* Supposed to happen on hover of link */
  .links .link {
    /* -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-box-pack: center;
    -webkit-box-flex: 1; */
    font-size: 9pt;
    color: #fff;
    user-select: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    height: 35px;
    position: relative;
    /* transition: all 0.15s; */
    padding: 3px 5px;
    margin: 2px 0;
    border-radius: 3px;
  }

  .links .link.has-line {
    margin-bottom: 6px;
  }

  .links .link.has-line::after {
    -webkit-box-shadow:
      inset 0 1px 0 rgba(0, 0, 0, 0.1333333333),
      inset 0 -1px 0 hsla(0, 0%, 100%, 0.1333333333);
    box-shadow:
      inset 0 1px 0 rgba(0, 0, 0, 0.1333333333),
      inset 0 -1px 0 hsla(0, 0%, 100%, 0.1333333333);
    width: calc(100% - 5px);
    height: 3px;
    position: absolute;
    bottom: -5px;
    content: "";
  }

  #start-menu .link:not(:last-child):hover {
    background-image: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.1019607843),
        hsla(0, 0%, 100%, 0.2) 40%,
        hsla(0, 0%, 100%, 0.2) 60%,
        rgba(0, 0, 0, 0.1019607843)
      ),
      linear-gradient(
        180deg,
        hsla(0, 0%, 100%, 0.2),
        hsla(0, 0%, 100%, 0.1019607843) 48%,
        rgba(0, 0, 0, 0.4) 50%,
        transparent 98%
      );
    border: 1px solid rgba(0, 0, 0, 0.6666666667);
    -webkit-box-shadow:
      inset 0 0 0 1px hsla(0, 0%, 100%, 0.3333333333),
      0 0 0 1px hsla(0, 0%, 100%, 0.2);
    box-shadow:
      inset 0 0 0 1px hsla(0, 0%, 100%, 0.3333333333),
      0 0 0 1px hsla(0, 0%, 100%, 0.2);
  }

  .links .button-group {
    user-select: none;
    display: flex;
    color: currentColor;
    text-align: center;
    margin: 30px 0 0 3px;
  }

  .button-group .button {
    text-align: center;
    user-select: none;
    color: #fff;
    padding: 6px;
    background: linear-gradient(
      180deg,
      hsla(0, 0%, 100%, 0.5019607843),
      hsla(0, 0%, 100%, 0.2) 40%,
      rgba(39, 71, 86, 0.5019607843) 50%,
      rgba(39, 71, 86, 0.1019607843) 90%,
      hsla(0, 0%, 100%, 0.5019607843)
    );
  }

  .button-group > .button:first-child {
    min-width: 50px;
    -webkit-box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.6666666667);
    border: 1px solid rgba(0, 0, 0, 0.4666666667);
    border-radius: 3px 0 0 3px;
    box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.6666666667);
  }

  .button-group > .button:last-child {
    border-left: none;
    border-radius: 0 3px 3px 0;
    border: 1px solid rgba(0, 0, 0, 0.4666666667);
    -webkit-box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.6666666667);
    box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.6666666667);
  }

  .button-ext {
    min-width: 12px;
    position: relative;
  }

  .button-ext > i {
    text-shadow:
      0 0 1px #000,
      0 0 2px #000,
      0 0 2px #000,
      0 0 2px #000;
  }

  .fa {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .fa-caret-right:before {
    content: "\23F5";
  }
</style>
