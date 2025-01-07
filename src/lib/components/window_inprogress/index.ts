import type { Component, Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import Content from "./window_content.svelte";
import Head from "./window_head.svelte";
import ExplorerHead from "./window_explorer_head.svelte";
import MinimizeBtn from "./btns/window_minimize_btn.svelte";
import ResizeBtn from "./btns/window_resize_btn.svelte";
import CloseBtn from "./btns/window_close_btn.svelte";
import Root from "./root.svelte";

type Placement = {
  x: number;
  y: number;
};

type InteractJsModifiers = {
  min?: { width: number; height: number };
  max?: { width: number; height: number };
};

type WindowProps = {
  windowId: string;
  showBarMenu?: boolean;
  disableResize?: boolean;
  placement: Placement;
  children: Snippet<[]>;
  interactjs?: InteractJsModifiers;
} & SvelteHTMLElements["div"];

type RootProps = Component<WindowProps, {}, "placement">;

export type HeadProps = {
  children: Snippet<[]>;
  class?: string;
  icon: string;
  title?: string;
};

export type ExplorerHeadProps = {
  // children: Snippet<[]>;

  minimize?: Snippet<[]>;
  restore?: Snippet<[]>;
  close?: Snippet<[]>;

  class?: string;
  icon: string;
  title?: string;
};

export type ContentProps = {
  children: Snippet<[]>;
  /**
   * It is the parent of `wrapperClass`
   */
  parentClass?: string;
  /**
   * It houses the contents of `<Window.Content />`
   */
  wrapperClass?: string;
};

export type MinimizeBtnProps = {
  class?: string;
  onminimize?: () => void;
};

export type ResizeBtnProps = {
  class?: string;
  onresize?: () => void;
};

export type CloseBtnProps = {
  class?: string;
  onclose?: () => void;
};

type RootWithDotNotationProps = RootProps & {
  Head: __sveltets_2_IsomorphicComponent<HeadProps>;
  ExplorerHead: __sveltets_2_IsomorphicComponent<ExplorerHeadProps>;
  Content: __sveltets_2_IsomorphicComponent<ContentProps>;
  MinimizeBtn: __sveltets_2_IsomorphicComponent<MinimizeBtnProps>;
  ResizeBtn: __sveltets_2_IsomorphicComponent<ResizeBtnProps>;
  CloseBtn: __sveltets_2_IsomorphicComponent<CloseBtnProps>;
};

// Assigning additional properties (Trigger and Content) to the Root component
// using dot notation. This approach is not officially supported by the Svelte
// library, which may result in missing or unsupported types.
const RootWithDotNotation: RootWithDotNotationProps = Root as any;

// @ts-expect-error Adding Trigger as a dot notation property on Root.
// This is a custom implementation, awaiting an official solution.
RootWithDotNotation.Head = Head;

// @ts-expect-error
RootWithDotNotation.Content = Content;

// @ts-expect-error
RootWithDotNotation.MinimizeBtn = MinimizeBtn;

// @ts-expect-error
RootWithDotNotation.ResizeBtn = ResizeBtn;

// @ts-expect-error
RootWithDotNotation.CloseBtn = CloseBtn;

// @ts-expect-error
RootWithDotNotation.ExplorerHead = ExplorerHead;

export { RootWithDotNotation as Window, type WindowProps };
