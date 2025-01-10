import Root from "./bar_menu.svelte";

type MenuProps = {
  label: string;
  icon?: string;
  subMenu?: MenuProps[];
  isDisabled?: boolean;
  onclick?: () => void;
};

export { Root as Win7BarMenu, type MenuProps };
