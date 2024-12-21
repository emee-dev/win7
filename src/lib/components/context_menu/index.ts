import Win7ContextMenu from "./win7_context_menu.svelte";
import Win7BarMenu from "./win7_bar_menu.svelte";
import Root from "./root.svelte";
import Par from "../../../routes/win7/Par.svelte";
import type { Component, Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

export type ContextPropsXRP = SvelteHTMLElements["div"] & {
  menuItems: MenuProps[];
  children: Snippet<[]>;
};

type RootDotNotation = Component<ContextPropsXRP, {}, "">;

export type ParProps = { foo: string; children: Snippet };

const RootWithDotNotation: RootDotNotation & {
  Par: __sveltets_2_IsomorphicComponent<ParProps>;
} = Root as any;

// @ts-expect-error this is cooked, wait for offical way to do this dot notation.
RootWithDotNotation.Par = Par;

type MenuProps = {
  label: string;
  icon?: string;
  subMenu?: MenuProps[];
  hasDivider?: "has-divider" | null;
  isDisabled?: boolean;
  onclick?: () => void;
};

// <ContextMenu>
//   <ContextMenu.Trigger>
//     <MenuItem>Sort by</MenuItem>
//   </ContextMenu.Trigger>
//   <ContextMenu.Content>Paste as</ContextMenu.Content>
// </ContextMenu>;

export {
  RootWithDotNotation as ContextMenu,
  // Root as ContextMenu,
  Win7ContextMenu,
  type MenuProps,
  Win7BarMenu,
};
