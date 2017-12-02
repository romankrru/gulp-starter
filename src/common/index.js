console.log('hello')

const arr = [1, 2, 3];

console.log(...arr)

function allAdd() {
  return Array.from(arguments).map((a) => a + 2);
}