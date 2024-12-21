import type { MenuProps } from "@/components/context_menu";

export let menuItems: MenuProps[] = [
  {
    label: "View",
    onclick() {
      menuItems = menuItems.filter((item) => item.label !== "Paste");
    },
  },
  {
    label: "Sort by",
    subMenu: [
      {
        label: "Name",
      },
      {
        label: "Size",
      },
      {
        label: "Item type",
      },
      {
        label: "Date modified",
      },
    ],
  },
  {
    label: "Refresh",
    hasDivider: "has-divider",
  },
  {
    label: "Paste",
    isDisabled: true,
  },
  {
    label: "Paste shortcut",
    hasDivider: "has-divider",
    isDisabled: true,
  },
  // {
  //   icon: "https://img.icons8.com/color/18/000000/monitor--v1.png",
  //   label: "Screen resolution",
  // },
  // {
  //   icon: "https://img.icons8.com/color/18/000000/virtual-machine2.png",
  //   label: "Gadgets",
  // },
  // {
  //   icon: "https://img.icons8.com/color/18/000000/remote-desktop.png",
  //   label: "Personalize",
  // },
];
