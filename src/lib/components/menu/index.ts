import PopupMenu from "./menu.svelte";
import BarMenu from "./bar-menu.svelte";

type MenuProps = {
  label: string;
  icon?: string;
  subMenu?: MenuProps[];
  hasDivider?: "has-divider" | null;
  isDisabled?: boolean;
  onclick?: () => void;
};

// <Menu>
//     <MenuGroup>
//         <MenuItem>Sort by</MenuItem>
//     </MenuGroup>
//     <MenuItem>Paste as</MenuItem>
// </Menu>

export { PopupMenu as ContextMenu, type MenuProps, BarMenu };
