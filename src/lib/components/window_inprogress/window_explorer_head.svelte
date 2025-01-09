<script lang="ts">
  import { getHistory } from "@/apps/File_Explorer/undoRedo.svelte";
  import { type ExplorerHeadProps } from ".";
  import { NOT_SELECTABLE } from "../selecto";
  import { getWindowContext } from "./ctx.svelte";
  import Icon from "svelte-awesome";
  import arrowLeft from "svelte-awesome/icons/arrowLeft";
  import arrowRight from "svelte-awesome/icons/arrowRight";
  import { mediaAssets } from "@/const";

  let controls: HTMLElement;
  const ctx = getWindowContext();
  const history = getHistory();

  // We need the drag handle to take most of the space.
  let dragAreaAndControlsWidth = $state(0);

  let {
    // children,
    icon,
    title,
    class: className,
    minimize,
    restore,
    close,
  }: ExplorerHeadProps = $props();

  $effect(() => {
    if (!controls) return;

    let childNodes = controls.children;

    if (childNodes.length === 2) {
      dragAreaAndControlsWidth = 90;
    }

    if (childNodes.length === 3) {
      dragAreaAndControlsWidth = 120;
    }
  });

  type OnFocus = FocusEvent & { currentTarget: EventTarget & HTMLInputElement };

  const resetCursor = (ev: OnFocus) => {
    const val = ev?.currentTarget?.value;
    ev.currentTarget.value = "";
    ev.currentTarget.value = val;
  };
</script>

<div
  class="drag-handle h-6 w-full absolute top-0 z-30"
  style="pointer-events: none;"
>
  <div
    class={`active-drag-area h-full w-[calc(100%-${dragAreaAndControlsWidth}px)] absolute left-0 ${NOT_SELECTABLE}`}
    style="pointer-events: auto;"
  ></div>
</div>

{#snippet breadCrumbs(history: ReturnType<typeof getHistory>)}
  {@const breadCrumbs =
    history.peek() === null ? [] : history.peek()!.split("/")}

  {#if breadCrumbs.length > 0}
    {#each breadCrumbs as item}
      <span class="first:ml-[5px] m-0 text-[13px] tracking-tight">{item}</span>
    {/each}
  {:else}
    <span class="first:ml-[5px] m-0 text-[13px] tracking-tight">C:</span>
  {/if}
{/snippet}

<div class="title-bar flex flex-col px-2 gap-y-1">
  <div class="flex justify-between w-full">
    <div class="title-bar-text flex gap-x-2">
      <img
        src={icon}
        alt="Img for {title}"
        class="size-4 bg-transparent object-fill"
      />
      {title}
    </div>

    <div class="title-bar-controls" bind:this={controls}>
      {@render minimize?.()}
      {@render restore?.()}
      {@render close?.()}
    </div>
  </div>

  <div class="h-[30px] w-full flex items-center">
    <!-- svelte-ignore a11y_consider_explicit_label, a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div class="navigation flex">
      <div
        class="button round mr-1 flex items-center justify-center {history.isRewindPossible()
          ? 'active'
          : ''}"
        onclick={() => {
          if (history.isRewindPossible()) {
            history.rewind();
          }
        }}
      >
        <Icon data={arrowLeft} scale={1.2} />
      </div>

      <div
        class="button round flex items-center justify-center {history.isForwardPossible()
          ? 'active'
          : ''}"
        onclick={() => {
          if (history.isForwardPossible()) {
            history.forward();
          }
        }}
      >
        <Icon data={arrowRight} scale={1.2} />
      </div>
    </div>

    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div
      class="flex-1 mr-1 h-[calc(100%-5px)] gap-x-1 flex items-center overflow-hidden"
    >
      {#if !ctx.isAddressFocused}
        <div
          class="addr w-[85%] icon pt-[3px] pr-0 pb-[3px] pl-[24px] overflow-scroll scrollbar-hide"
          style="--icon: url('{mediaAssets.MyComputerIcon}')"
          onclick={() => (ctx.isAddressFocused = true)}
        >
          {@render breadCrumbs(history)}
        </div>
      {:else}
        <form
          class="addr w-[85%] icon pt-[3px] pr-0 pb-[3px] pl-[24px]"
          style="--icon: url('{mediaAssets.MyComputerIcon}')"
          onsubmit={(e) => {
            e.preventDefault();

            const form = new FormData(e.currentTarget);

            const input = form.get("path") as string;

            if (!input) {
              return console.log("input is empty");
            }

            history.append(input.trim());
          }}
        >
          <input
            class="size-full bg-transparent outline-none border-none text-[13px] leading-4 tracking-wider font-medium"
            type="text"
            name="path"
            bind:this={ctx.searchBar}
            onfocus={resetCursor}
            autocomplete="off"
            value={history.peek()}
            onblur={() => (ctx.isAddressFocused = false)}
          />
        </form>
      {/if}

      <div
        class="addr max-w-[20px] icon pt-[3px] pr-0 pb-[3px] pl-[24px]"
        style="--icon: url('{mediaAssets.FileExplorerToggle}')"
        onclick={() => (ctx.isAddressFocused = !ctx.isAddressFocused)}
      ></div>
    </div>

    <!-- Search bar -->
    <div class="h-[calc(100%-5px)] flex-1 ml-auto max-w-[200px]">
      <div class="addr">
        <!-- class="bg-transparent h-full w-full" -->
        <input
          type="search"
          class="size-full bg-transparent outline-none border-none placeholder:text-neutral-700"
          placeholder="Search files"
        />
      </div>
    </div>
  </div>
</div>

<style>
  .navigation .button {
    user-select: none;
    outline: none;
    box-sizing: border-box;
    line-height: 1;
    margin-right: 0.25rem;
    padding: 6px;
    border: 0;
    box-shadow:
      inset 0 0 2px #fff,
      inset 0 1px 3px hsla(0, 0%, 100%, 0.6),
      0 1px 1px rgba(0, 0, 0, 0.8),
      -1px -1px 1px rgba(0, 0, 0, 0.2),
      1px -1px 1px rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    color: #ccc;
    pointer-events: auto;
  }

  .navigation .button.active {
    color: #fff;
    background:
      radial-gradient(
        60px 40px at center 95%,
        transparent 30%,
        rgba(0, 0, 0, 0.3) 40%,
        hsla(0, 0%, 100%, 0.5) 50%
      ),
      linear-gradient(0deg, #82dff3 5%, transparent 30%) #0365c8;
  }

  .navigation .button.active:active {
    transform: scale(0.9);
    transition: transform 0.1s ease;
  }

  /* Addr */
  .addr {
    white-space: nowrap;
    position: relative;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-grow: 1;
    align-items: center;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.6666666667);
    box-shadow:
      0 0 0 1px hsla(0, 0%, 100%, 0.4666666667),
      inset 0 0 0 1px #fff;
    background-color: hsla(0, 0%, 100%, 0.6666666667);
  }

  .addr.icon {
    background: var(--icon) no-repeat;
    background-size: 18px;
    background-position: 0;
    background-color: hsla(0, 0%, 100%, 0.6666666667);
  }

  .addr > span {
    height: 100%;
    display: flex;
    align-items: center;
    font-family:
      Segoe UI,
      sans-serif;
    position: relative;
  }

  .addr > span::before {
    content: "\23f5";
    display: inline-block;
    height: auto;
    margin-right: 2px;
    font-size: inherit;
    line-height: inherit;
    align-self: center;
  }
</style>
