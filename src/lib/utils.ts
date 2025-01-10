import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO remember to fix zindex issues
export const zIndex = {
  desktopIcons: 10, // Icons on the desktop
  taskbar: 20, // The taskbar at the bottom
  startMenuPopup: 30,
  contextMenu: 40,
  inactiveWindow: 50,
  activeWindow: 60, // Active window (highest among windows)
  dialog: 70, // Dialog boxes (e.g., "Are you sure?" popups)
  tooltip: 80, // Tooltips that hover over items
  systemNotification: 90, // System notifications or toast popups
};
