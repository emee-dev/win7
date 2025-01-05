function append(curr: string, str: string) {
  let operations = [
    "C:/Users/Guest/Desktop",
    "C:/Users/Guest/Downloads",
    "C:/Users/Guest/Documents",
    "C:/Users/Guest/Music",
    "C:/Users/Guest/Videos",
  ];

  let itemIndex = operations.indexOf(curr);

  // @ts-expect-error
  let itemLocation = operations.at(itemIndex);

  // @ts-expect-error
  // Check to be sure that currentValue is the last item in operations[]
  if (operations.length > itemIndex + 1 && operations.at(-1) !== itemLocation) {
    // Remove the excess values and construct a new array
    let tempArr = operations.slice(0, itemIndex + 1);
    tempArr.push(str);

    return tempArr;
  }

  operations.push(str);
  return operations;
}

// const currentValue = "C:/Users/Guest/Documents";
const currentValue = "C:/Users/Guest/Music";

console.log(
  "Operations",
  append(currentValue, "C:/Users/Guest/Private Videos") || "Not valid"
);
