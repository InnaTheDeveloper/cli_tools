export default function forEach(arr, fn) {
  for (let element of arr) {
    fn(element);
  }
}

console.log("hi");
