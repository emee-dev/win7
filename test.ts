class UndoRedo {
  //   private operations = $state<string[]>([]);
  //   private currentValue = $state<string | null>(null);
  private operations: string[] = [];
  private currentValue: string | null = null;

  peek() {
    return this.currentValue;
  }

  append(args: string) {
    // Make sure currentValue is always at the end of operations array
    // To avoid confusing undo redo(s)

    let currentItemIndex = this.operations.indexOf(this.currentValue as string);

    // If current item is not the last item and it exists in the operations array
    if (
      this.operations.at(-1) !== this.currentValue &&
      currentItemIndex !== -1
    ) {
      let updateItems = this.operations.slice(0, currentItemIndex);
      updateItems.push(args);

      this.operations = updateItems;
      this.currentValue = args;

      return;
    }

    this.operations.push(args);
    this.currentValue = args;
  }

  forward() {
    let itemIndex = this.operations.indexOf(this.currentValue as string);

    let nextValue = this.operations?.at(itemIndex + 1);

    // Update current value
    this.currentValue = nextValue as string;
  }

  rewind() {
    let itemIndex = this.operations.indexOf(this.currentValue as string);

    if (!itemIndex || itemIndex === -1) {
      return;
    }

    let previousValue = this.operations.at(itemIndex - 1);

    // Update current value
    this.currentValue = previousValue as string;
  }

  // TODO check if currentItem is at start -> [0....] of operations array
  isRewindPossible() {}

  // TODO check if currentItem is at end of operations array
  isForwardPossible() {}
}

const ac = new UndoRedo();

ac.append("/C:");
console.log("Normal 1: ", ac.peek());

ac.append("/Users");
console.log("Normal 2: ", ac.peek());

ac.rewind();
console.log("Exp '/C:':- ", ac.peek());

ac.forward();
console.log("Exp '/Users:':- ", ac.peek());
