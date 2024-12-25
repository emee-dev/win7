// let op = ["1", "0", "+", "4", "0", "*", "2"]; // ["12", "+", "4"]
// let op = ["50", "*", "2", "/", "2"]; // ["12", "+", "4"]

// Logic
// 1. Add each operation item to the array
// 2. After each assignment operation ["+", "-", "/", "*"],
// calculate res and assign the new value to the array.

// Operations
// ← deletes one char from the number input
// CE cancels or resets the number input to zero (0)
// C cancels every operation
// ± prepends plus or minus to the current chars in the number input
// √ calculates the square root of the current chars disregarding any previous opertion use: Math.sqrt(2);
// 1/x divides one using the current number in the number input

type ValidOperators = "+" | "/" | "*" | "-";

const evalResult = (str: string): number | "ERROR" => {
  try {
    return eval(str);
  } catch (error) {
    return "ERROR";
  }
};

let op = ["1", "+", "3", "2", "1", "+", "2", "/", "10"]; // ["1", "+", "32"];

const combineNumbers = (
  op: (string | ValidOperators)[]
): (string | ValidOperators)[] => {
  return op.reduce<(string | ValidOperators)[]>((acc, cur) => {
    const last = acc[acc.length - 1];

    if (!isNaN(Number(cur)) && !isNaN(Number(last))) {
      // If the current and last elements are numbers, concatenate them
      acc[acc.length - 1] = String(last) + String(cur);
    } else {
      // Otherwise, add the current element to the accumulator
      acc.push(cur);
    }

    return acc;
  }, []);
};

const calculation = combineNumbers(op).reduce((acc, curItem, index, arr) => {
  let operator = curItem as ValidOperators;

  if (operator === "+") {
    let nextItem = Number(arr[index + 1]);

    return (Number(acc) + nextItem).toString();
  }

  if (operator === "-") {
    let nextItem = Number(arr[index + 1]);

    return (Number(acc) - nextItem).toString();
  }

  if (operator === "/") {
    let nextItem = Number(arr[index + 1]);

    return (Number(acc) / nextItem).toString();
  }

  if (operator === "*") {
    let nextItem = Number(arr[index + 1]);

    return (Number(acc) * nextItem).toString();
  }

  return acc;
});

console.log("calculation", calculation);
