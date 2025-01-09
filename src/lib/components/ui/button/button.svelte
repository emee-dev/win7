<script lang="ts">
  import { cva } from "class-variance-authority";
  import type { ButtonProps } from ".";
  import { cn } from "@/utils";

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

<button
  {...rest}
  {type}
  class={cn(buttonVariants({ variant, size }))}
  {disabled}
>
  {@render children?.()}
</button>

<!-- svelte-ignore css_unused_selector -->
<style>
  /* This will help scope this button style to only this component */
  @import url("7.css/dist/7.css");
</style>
