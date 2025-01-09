<script lang="ts">
  import Sparkle from "./Sparkle.svelte";

  const disclaimers = [
    "This project uses experimental Svelte 5 features.",
    "Runes are powerful magic. Use with caution!",
    "Not responsible for accidental transmutations.",
  ];

  const tutorials = [
    "Runes 101: Basic incantations",
    "Advanced Spell Casting with $derived",
    "Magical State Management",
  ];

  const apis = [
    "Potion API",
    "Spell Book REST API",
    "Magical Creatures GraphQL API",
  ];

  let showMagic = $state(false);

  interface SectionProps {
    title: string;
    items: string[];
    listType?: "disc" | "decimal" | "none";
  }

  $effect(() => {
    const timer = setTimeout(() => {
      showMagic = true;
    }, 1000);

    return () => clearTimeout(timer);
  });

  $effect(() => {
    if (showMagic) {
      console.log("The magic has been revealed!");
    }
  });
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
  class="min-h-screen bg-gray-900 text-gray-100 p-8 font-serif relative overflow-hidden"
>
  {#each Array.from({ length: 50 }).fill(50) as item}
    <Sparkle />
  {/each}

  <header class="text-center mb-8">
    <h1 class="text-4xl font-bold mb-2">
      🎃 Svelte 5 Runes: A Magical Journey 🧙‍♂️
    </h1>
    <p class="text-xl">Unveiling the secrets of the new enchanted syntax</p>
  </header>

  <div>
    {#if showMagic}
      <main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        class="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {@render section({
          title: "📜 Magical Disclaimers",
          items: disclaimers,
        })}

        {@render section({
          title: "📚 Spell Tutorials",
          items: tutorials,
          listType: "decimal",
        })}

        {@render section({
          title: "🔮 Mystical APIs",
          items: apis,
          listType: "none",
        })}
      </main>
    {/if}
  </div>

  <footer class="text-center mt-8">
    <p>Created with 🖤 and a sprinkle of magic dust</p>
  </footer>
</div>
