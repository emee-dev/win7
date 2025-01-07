<script lang="ts">
  import { cva } from "class-variance-authority";
  import type { ButtonProps } from ".";
  import "7.css/dist/7.scoped.css";

  // Define the button styles using CVA
  const buttonVariants = cva("button win7", {
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

<div class="win7">
  <button {...rest} {type} class={buttonVariants({ variant, size })} {disabled}>
    {@render children?.()}
  </button>
</div>

<style></style>
