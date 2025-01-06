import { getContext, setContext } from "svelte";
import type { WindowProps } from ".";

const WINDOW_CONTEXT_KEY = Symbol("Window_State");

class WindowState {
  isFullscreen = $state(false);
  showBarMenu = $state(false);
  disableResize = $state(false);
  position: WindowProps["placement"] = { x: 0, y: 0 };
  windowUi: HTMLElement | null = $state(null);

  // Explorer
  isAddressFocused = $state(false);
  searchBar: HTMLElement | null = $state(null);
}

export function setWindowContext() {
  return setContext(WINDOW_CONTEXT_KEY, new WindowState());
}

export function getWindowContext() {
  return getContext<ReturnType<typeof setWindowContext>>(WINDOW_CONTEXT_KEY);
}
