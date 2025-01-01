import Root from "./popup_menu.svelte";

type MenuProps = {
  label: string;
  icon?: string;
  subMenu?: MenuProps[];
  hasDivider?: "has-divider" | null;
  isDisabled?: boolean;
  onclick?: () => void;
};

export { Root as Win7ContextMenu, type MenuProps };
