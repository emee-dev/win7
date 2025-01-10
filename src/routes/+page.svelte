<script lang="ts">
  const disclaimers = [
    "1. This project is a simple recreation of the popular windows 7, It is not an exact copy. ",
    "2. This project uses some of Svelte 5 features. Such as $state, $effect, $props etc.",
    "3. It is not affiliated with Microsoft Corporation svelte.",
    "4. Do not expect much from it. But you will propably like it.",
  ];

  interface SectionProps {
    title: string;
    items: string[];
    listType?: "disc" | "decimal" | "none";
  }
</script>

{#snippet section({ title, items, listType = "disc" }: SectionProps)}
  <section
    class="bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-[#FF3E00]"
  >
    <h2 class="text-2xl font-bold mb-4">{title}</h2>
    <ul class={`list-${listType} list-inside`}>
      {#each items as item}
        <li class="mb-2">
          {listType === "none" ? "✨ " : ""}
          {item}
        </li>
      {/each}
    </ul>
  </section>
{/snippet}

<div
  class="h-screen bg-gray-900 text-gray-100 p-8 font-serif relative overflow-hidden"
>
  <header class="text-center mb-8">
    <h1 class="text-4xl font-bold mb-2">🎃 Svelte 5 Runes🧙‍♂️</h1>
    <p class="text-xl">Exploring the secrets of the new enchanted syntax</p>
  </header>

  <div class="">
    <main class="grid grid-cols-1 place-items-center pt-6 mb-8">
      {@render section({
        title: "📜 Disclaimers",
        items: disclaimers,
      })}
    </main>
  </div>

  <footer class="text-center mt-8 h-full">
    <button class="mb-4 decoration-yellow-300">
      <a data-sveltekit-preload-code="viewport" href="/win7" class="underline underline-offset-4"> Surprise Me.</a> 👈
    </button>

    <p>Created with 🖤 and a sprinkle of magic dust</p>
  </footer>
</div>
