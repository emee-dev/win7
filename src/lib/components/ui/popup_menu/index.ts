import type { IconProps } from "@/components/desktop/desktop_icons.svelte";
import Root from "./popup_menu.svelte";

type MenuProps<T = {}> = {
  label: string;
  icon?: string;
  subMenu?: MenuProps<T>[];
  hasDivider?: "has-divider" | null;
  isDisabled?: boolean;
  onclick?: (args: T) => void;
};

export { Root as Win7ContextMenu, type MenuProps };
