function quickSort(array) {
  if (array.length <= 1) return array;

  const pivotIndex = Math.floor(Math.random() * array.length);

  const pivot = array[pivotIndex];

  const less = [];
  const great = [];

  for (let i = 0; i < array.length; i += 1) {
    // eslint-disable-next-line no-continue
    if (i === pivotIndex) continue;
    if (array[i] < pivot) {
      less.push(array[i]);
    } else {
      great.push(array[i]);
    }
  }

  return [...quickSort(less), pivot, ...quickSort(great)];
}

function binarySearch(array, token) {
  let first = 0;
  let last = array.length - 1;

  const arraySorted = quickSort(array);

  const term = token.match(/\w+/g)[0];

  while (first <= last) {
    const middle = Math.floor((first + last) / 2);
    const termElement = arraySorted[middle].match(/\w+/g)[0];

    if (term === termElement) {
      return true;
    }
    if (term < termElement) {
      last = middle - 1;
    } else {
      first = middle + 1;
    }
  }
  return false;
}

function search(docs, token) {
  if (!docs.length) return [];
  const result = [];
  for (let i = 0; i < docs.length; i += 1) {
    const element = docs[i];
    if (binarySearch(element.text.split(' '), token)) {
      result.push(element.id);
    }
  }

  return result;
}

const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
const docs = [doc1];

console.log(search(docs, 'pint')); // ['doc1']
console.log(search(docs, 'pint!')); // ['doc1']

export default search;
