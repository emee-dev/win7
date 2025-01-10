import { getContext, setContext } from "svelte";

class History {
  private operations: string[] = $state<string[]>([]);
  private currentValue: string | null = $state<string | null>(null);
  private canRewind: boolean = $state<boolean>(false);
  private canForward: boolean = $state<boolean>(false);

  private updateRewindAndForwardStates() {
    const currentIndex = this.operations.lastIndexOf(
      this.currentValue as string
    );

    this.canRewind = currentIndex > 0;
    this.canForward =
      currentIndex >= 0 && currentIndex < this.operations.length - 1;
  }

  peek() {
    return this.currentValue;
  }

  getHistory() {
    return this.operations;
  }

  append(nextValue: string) {
    const operations = this.operations;
    const currentValue = this.currentValue as string;
    const itemIndex = operations.lastIndexOf(currentValue);

    // Check to be sure that currentValue is the last item in operations[]
    if (
      operations.length > itemIndex + 1 &&
      operations.at(-1) !== operations.at(itemIndex)
    ) {
      this.operations = operations.slice(0, itemIndex + 1);
    }

    this.operations.push(nextValue);
    this.currentValue = nextValue;
    this.updateRewindAndForwardStates();

    return this.currentValue;
  }

  forward() {
    const currentIndex = this.operations.lastIndexOf(
      this.currentValue as string
    );

    if (
      this.canForward &&
      currentIndex >= 0 &&
      currentIndex < this.operations.length - 1
    ) {
      this.currentValue = this.operations[currentIndex + 1];
      this.updateRewindAndForwardStates();
    }
  }

  rewind() {
    const currentIndex = this.operations.lastIndexOf(
      this.currentValue as string
    );
    if (this.canRewind && currentIndex > 0) {
      this.currentValue = this.operations[currentIndex - 1];
      this.updateRewindAndForwardStates();
    }
  }

  isRewindPossible(): boolean {
    return this.canRewind;
  }

  isForwardPossible(): boolean {
    return this.canForward;
  }
}

const HISTORY_KEY = Symbol("history");

export function setHistory() {
  return setContext(HISTORY_KEY, new History());
}

export function getHistory() {
  return getContext<ReturnType<typeof setHistory>>(HISTORY_KEY);
}
