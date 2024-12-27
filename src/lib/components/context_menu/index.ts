import type { Component, Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import Content from "./content_content.svelte";
import Trigger from "./content_trigger.svelte";
import Root from "./root.svelte";
import Win7BarMenu from "./win7_bar_menu.svelte";
import Win7ContextMenu from "./win7_context_menu.svelte";

type MenuProps = {
  label: string;
  icon?: string;
  subMenu?: MenuProps[];
  hasDivider?: "has-divider" | null;
  isDisabled?: boolean;
  onclick?: () => void;
};

type RootProps = Component<ContextProps, {}, "">;

export type ContextProps = SvelteHTMLElements["div"] & {
  menuItems: MenuProps[];
  children: Snippet<[]>;
};

export type TriggerProps = {
  children: Snippet<[]>;
  class?: string;
};
export const CONTEXT_ZINDEX = 10;

export type ContentProps = { children: Snippet<[]>; class?: string };

type RootWithDotNotation = RootProps & {
  Trigger: __sveltets_2_IsomorphicComponent<TriggerProps>;
  Content: __sveltets_2_IsomorphicComponent<ContentProps>;
};

// Assigning additional properties (Trigger and Content) to the Root component
// using dot notation. This approach is not officially supported by the Svelte
// library, which may result in missing or unsupported types.
const RootWithDotNotation: RootWithDotNotation = Root as any;

// @ts-expect-error Adding Trigger as a dot notation property on Root.
// This is a custom implementation, awaiting an official solution.
RootWithDotNotation.Trigger = Trigger;

// @ts-expect-error Adding Content as a dot notation property on Root.
// This is a custom implementation, awaiting an official solution.
RootWithDotNotation.Content = Content;

export {
  RootWithDotNotation as ContextMenu,
  Win7BarMenu,
  Win7ContextMenu,
  type MenuProps,
};
