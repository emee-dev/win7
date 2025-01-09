import { dropzone, type DropzoneParameter } from "@sveu/actions";
import type { Action } from "svelte/action";

type UseDropzone = Action<
  HTMLElement,
  // (data: DropzoneParameter) => void | undefined,
  unknown,
  {
    onhover?: (e: CustomEvent<boolean>) => void;
    onfiles?: (e: CustomEvent<File[]>) => void;
  }
>;

// @ts-expect-error
const useDropzone: UseDropzone = (node: HTMLElement, fs) => dropzone(node, fs);

export { useDropzone, type DropzoneParameter };
