export type ValidOperators = "+" | "/" | "*" | "-";

export const combineNumbers = (
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
