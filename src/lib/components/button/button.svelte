<script lang="ts">
  import { cva } from "class-variance-authority";
  import type { ButtonProps } from ".";

  // Define the button styles using CVA
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

  let {
    children,
    size = "md",
    type = "button",
    disabled = false,
    variant = "default",
    ...rest
  }: ButtonProps = $props();
</script>

<button {...rest} {type} class={buttonVariants({ variant, size })} {disabled}>
  {@render children?.()}
</button>
