<script lang="ts">
  import { Button } from "@/components/ui/button";
  import { dropzone, type DropzoneParameter } from "@sveu/actions";
  // @ts-ignore
  import Plyr from "plyr";
  import "plyr/dist/plyr.css";
  import Dexie, { type EntityTable } from "dexie";
  import { useDropzone } from "@/hooks/Dropzone";
  import html2canvas from "html2canvas";
  import { Dialog, Label, Separator } from "bits-ui";
  import { fade } from "svelte/transition";
  // import {} from "svelt"
  import "7.css/dist/7.css";
  import { captureElement } from "@/components/ui/taskbar/utils";
  import { onMount } from "svelte";
  import { FolderDatabase } from "@/components/desktop/indexeddb";
  import * as ContextMenu from "$lib/components/ui/context-menu/index";
  import { menuItems } from "@/components/desktop/utils";
  import { Win7ContextMenu } from "@/components/ui/popup_menu";
  import { listItem } from "@/components/ui/popup_menu/popup_menu.svelte";
  import type { MenuProps } from "@/components/context_menu";

  let over_dropzone = $state(false);

  let files_data = $state<File[]>([]);

  function hover(data: CustomEvent<boolean>) {
    over_dropzone = data.detail;
  }

  function on_file_drop(data: CustomEvent<File[]>) {
    const files = data.detail;

    if (!files) {
      return;
    }

    let file = files[0];

    // const blob = new Blob([file], { type: file.type });
    // const blob = new Blob([file], { type: file.type" });

    // console.log("blob", URL.createObjectURL(blob));
    // console.log("file", file);

    files_data = files;
  }

  let imageUrl = $state<string | null>(null);

  // ++id, [parentDir+name],

  const testDexie = async () => {
    const db = new Dexie("UserFiles") as Dexie & {
      files: EntityTable<CustomData, "parentDir">;
    };

    db.version(1).stores({
      files: "[parentDir+name], parentDir",
    });

    // let args = { name: "Alice", age: 21 };

    // const blob = new Blob([JSON.stringify(args)], { type: "text/plain" });

    try {
      // await db.files.add({});

      const youngFriends = await db.files.where("age").below(30).toArray();

      alert(`My young friends: ${JSON.stringify(youngFriends)}`);
    } catch (e) {
      alert(`Oops: ${e}`);
    }
  };

  const getBlob = async () => {
    const db = new Dexie("FriendDatabase") as Dexie & {
      friends: EntityTable<Friend, "id">;
    };

    db.version(1).stores({
      friends: "++id, age, blob",
    });

    try {
      const payload = await db.friends.where("age").equals(21).toArray();
      // const payload = await db.friends.toArray();

      console.log("Blob", URL.createObjectURL(payload[0].blob as Blob));
    } catch (e) {
      console.log(e);
    }
  };

  let inputValue = $state("");
  let isChecked = $state(false);

  let db: FolderDatabase;

  onMount(() => {
    db = new FolderDatabase();
  });

  // Function to add a folder path
  async function addFolder(path: string): Promise<void> {
    try {
      if (isChecked) {
        let blob = new Blob([path], { type: "text/plain" });

        await db.folders.add({
          path,
          blob,
          type: "file",
          origin: "indexeddb",
        });
      } else {
        await db.folders.add({ path, type: "dir", origin: "indexeddb" });
      }

      // console.log(`Folder added: ${path}`);
    } catch (error) {
      if ((error as typeof Dexie.ModifyError).name === "ConstraintError") {
        console.error("This folder path already exists.");
      } else {
        console.error("Failed to add folder:", error);
      }
    }
  }

  async function getAllFolders(db: FolderDatabase): Promise<string[]> {
    try {
      const folders = await db.folders.toArray();

      console.log("folders", folders);
      // return folders.map((folder) => folder.path);
    } catch (error) {
      console.error("Failed to retrieve folders:", error);
      return [];
    }
  }

  // $inspect(files_data).with((t, v) => console.log("files", v));
  // $inspect(inputValue).with((t, v) => console.log("inputValue", v));

  let isOpen = $state(false);

  const onItemClick = (d: MenuProps) => {
    isOpen = !isOpen;
    console.log(d);
  };
</script>

<!-- style="background: green;" -->
<div class="h-[100px]" data-screenshot-id="123">
  <div class="flex items-center bg-red-100 w-fit">
    <input
      type="text"
      placeholder="Folder or file path"
      bind:value={inputValue}
    />

    <div class="bg-red-700">
      <input type="checkbox" id="example1" bind:checked={isChecked} />
      <label for="example1"> </label>
    </div>
  </div>

  <Button class="  ml-7" onclick={() => addFolder(inputValue)}
    >Store folder</Button
  >
  <Button class="  ml-7" onclick={() => getAllFolders()}>Read folders</Button>
</div>

<ContextMenu.Root
  open={isOpen}
  controlledOpen={isOpen}
  onOpenChange={(v) => (isOpen = v)}
>
  <ContextMenu.Trigger
    class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
  >
    Right click here
  </ContextMenu.Trigger>
  <ContextMenu.Content class="">
    <ul
      role="menu"
      style="width: 200px"
      class="can-hover select-none outline-none"
    >
      {#each menuItems as item (item.label)}
        {@render listItem(item, onItemClick)}
      {/each}
    </ul>
  </ContextMenu.Content>
</ContextMenu.Root>

<!-- svelte-ignore event_directive_deprecated -->
<div
  use:useDropzone
  onhover={hover}
  onfiles={on_file_drop}
  class="flex flex-col h-[80px] bg-green-400 mt-6 w-full min-h-200px justify-center items-center"
>
  <p>Custom Icon Dropzone</p>
</div>

<!-- <div class="flex flex-wrap justify-center items-center">
  {#each files_data as file}
    {#if file.name.endsWith(".png")}
      <img src={URL.createObjectURL(file)} alt="ahc" />
    {:else}
      <div class="flex flex-col justify-center items-center">
        <div>File Name: {file.name}</div>
        <div>File Size: {file.size}</div>
        <div>File Type: {file.type}</div>
        <div>
          File Last Modified: {new Intl.DateTimeFormat("en-US").format(
            file.last_modified
          )}
        </div>
      </div>
    {/if}
  {/each}
</div> -->

<style>
</style>
