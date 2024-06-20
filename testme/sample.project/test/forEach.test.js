import assert from "assert";
import forEach from "../index.js";

let numbers;
beforeEach(() => {
  numbers = [1, 2, 3];
});

it("must sum an array", () => {
  let total = 0;
  forEach(numbers, (value) => {
    total += value;
  });
  assert.strictEqual(total, 6);
});

it("beforeEach is run each time", () => {
  assert.strictEqual(numbers.length, 3);
});
