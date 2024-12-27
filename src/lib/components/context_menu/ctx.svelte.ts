import { getContext, setContext } from "svelte";
import type { Action } from "svelte/action";

type MenuProps = {
  label: string;
  icon?: string;
  subMenu?: MenuProps[];
  hasDivider?: "has-divider" | null;
  isDisabled?: boolean;
  onclick?: () => void;
};

const CONTEXT_MENU_KEY = Symbol("CONTEXT_MENU");

type Dimensions = Action<
  HTMLElement,
  undefined,
  {
    onclick_outside: (e: CustomEvent) => void;
  }
>;

type OnContextMenu = MouseEvent & { currentTarget: EventTarget };

class ContextMenuState {
  menuItems: MenuProps[] = $state([]);

  // Cursor position during right click
  pos = $state({ x: 0, y: 0 });

  // Dimensions of the context menu
  menu = $state({ h: 0, w: 0 });

  // State for context-menu visibility
  showMenu = $state(false);

  browser = $state({ h: 0, w: 0 });

  context_content = $state(false);
  context_trigger = $state(false);

  initContent() {
    this.context_content = true;
  }

  initTrigger() {
    this.context_trigger = true;
  }

  init(items: MenuProps[]) {
    this.menuItems = items;
  }

  handleClickOutside() {
    this.showMenu = false;
  }

  handleRightClick(ev: OnContextMenu) {
    ev.preventDefault();
    ev.stopPropagation();

    this.showMenu = true;

    this.browser.w = window.innerWidth;
    this.browser.h = window.innerHeight;

    // Set initial cursor position
    this.pos.x = ev.clientX;
    this.pos.y = ev.clientY;

    const { h, w } = this.menu;
    const { x, y } = this.pos;
    const { h: browserH, w: browserW } = this.browser;

    // Adjust position if context menu overflows
    this.pos.x = browserW - x < w ? x - w : x;
    this.pos.y = browserH - y < h ? y - h : y;
  }

  updateMenuDimensions: Dimensions = (node: HTMLElement) => {
    // Update context menu dimensions
    this.menu.h = node.offsetHeight;
    this.menu.w = node.offsetWidth;

    const handleClick = (event: any) => {
      if (node && !node.contains(event.target) && !event.defaultPrevented) {
        node.dispatchEvent(new CustomEvent("click_outside", node as any));
      }
    };

    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  };
}

export function setContextMenu() {
  return setContext(CONTEXT_MENU_KEY, new ContextMenuState());
}

export function getContextMenu() {
  return getContext<ReturnType<typeof setContextMenu>>(CONTEXT_MENU_KEY);
}
