<script lang="ts">
  let text = `Svelte is a UI framework that uses a compiler to let you write
breathtakingly concise components that do minimal work in the browser, using
languages you already know — HTML, CSS and JavaScript. It’s a love letter to
web development. But don’t take our word for it. Developers consistently
rank Svelte as the framework they’re most excited about using.`.trim();




</script>

<div
  class="h-[calc(100%_-_28px)] overflow-hidden px-1 min-h-full [&>*]:min-w-[375px]"
>
  <textarea
    spellcheck="false"
    class="h-full pt-1 text-balance has-scrollbar flex-1 w-full"
    bind:value={text}
  ></textarea>
</div>

<style>
  textarea {
    overflow: auto;
    overflow-y: scroll;
    font:
      normal 13px "Lucida Console",
      Monaco,
      Courier,
      Monospace;
    resize: none; /* Disable resizing if not needed */
    padding: 0; /* Remove padding */
    margin: 0; /* Remove extra spacing */
    line-height: 1.5; /* Ensure even line height */
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
