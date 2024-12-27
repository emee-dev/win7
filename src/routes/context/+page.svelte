<script>
  import { ContextMenu, Win7ContextMenu } from "@/components/context_menu";
  import Trigger from "@/components/context_menu/content_trigger.svelte";
</script>

<div class="w-screen h-screen">
  <ContextMenu menuItems={[{ label: "Icon rename" }]} class="p-10 abcolz">
    <ContextMenu.Trigger class="bg-red-200 p-10">
      <ContextMenu.Content>
        <Win7ContextMenu />
        <div class="h-16 w-16 mb-10">Context Content</div>
      </ContextMenu.Content>
    </ContextMenu.Trigger>
  </ContextMenu>
</div>
