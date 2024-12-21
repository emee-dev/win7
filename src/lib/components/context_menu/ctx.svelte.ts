import { getContext, setContext } from "svelte";

type MenuProps = {
  label: string;
  icon?: string;
  subMenu?: MenuProps[];
  hasDivider?: "has-divider" | null;
  isDisabled?: boolean;
  onclick?: () => void;
};

const CONTEXT_MENU_KEY = Symbol("user");

class ContextMenuState {
  menuItems: MenuProps[] = $state([]);

  init(items: MenuProps[]) {
    this.menuItems = items;
  }
}

export function setContextState() {
  return setContext(CONTEXT_MENU_KEY, new ContextMenuState());
}

export function getContextState() {
  return getContext<ReturnType<typeof setContextState>>(CONTEXT_MENU_KEY);
}
