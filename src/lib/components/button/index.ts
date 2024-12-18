import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLButtonAttributes } from "svelte/elements";
import Root from "./button.svelte";

const buttonVariants = cva("button", {
  variants: {
    variant: {
      default: "",
      active: "active",
      focused: "focused",
    },
    size: {
      sm: "",
      md: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

type ButtonProps = HTMLButtonAttributes & VariantProps<typeof buttonVariants>;

export { Root as Button, type ButtonProps };
