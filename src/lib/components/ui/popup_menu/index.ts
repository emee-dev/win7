import type { IconProps } from "@/components/desktop/desktop_icons.svelte";
import Root from "./popup_menu.svelte";

type MenuProps = {
  label: string;
  icon?: string;
  subMenu?: MenuProps[];
  hasDivider?: "has-divider" | null;
  isDisabled?: boolean;
  onclick?: (args: IconProps) => void;
};

export { Root as Win7ContextMenu, type MenuProps };
