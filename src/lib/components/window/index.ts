import type { Snippet } from "svelte";
import Root from "./window.svelte";

type WindowProps = {
  children: Snippet<[]>;
  title: string;
  showBarMenu: boolean;
};

export { Root as Window, type WindowProps };
