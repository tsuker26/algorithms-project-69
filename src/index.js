function quickSort(array, comparator = (a, b) => (a < b ? -1 : 1)) {
  if (array.length <= 1) return array;

  const pivotIndex = Math.floor(Math.random() * array.length);

  const pivot = array[pivotIndex];

  const less = [];
  const great = [];

  for (let i = 0; i < array.length; i += 1) {
    // eslint-disable-next-line no-continue
    if (i === pivotIndex) continue;
    if (comparator(array[i], pivot) < 0) {
      less.push(array[i]);
    } else {
      great.push(array[i]);
    }
  }

  return [...quickSort(less, comparator), pivot, ...quickSort(great, comparator)];
}

function binarySearch(array, token) {
  let first = 0;
  let last = array.length - 1;

  const arraySorted = quickSort(array);

  while (first <= last) {
    const middle = Math.floor((first + last) / 2);
    const term = arraySorted[middle];
    if (token === term) {
      return true;
    }
    if (token < term) {
      last = middle - 1;
    } else {
      first = middle + 1;
    }
  }
  return false;
}

function search(docs, query) {
  const queryWords = query.toLowerCase().split(/\s+/);
  const index = {};

  docs.forEach((doc) => {
    const textWords = doc.text.toLowerCase().split(/\s+/);

    // eslint-disable-next-line no-restricted-syntax
    for (const word of queryWords) {
      if (binarySearch(textWords, word)) {
        if (index[word]) {
          index[word].push(doc.id);
        } else {
          index[word] = [doc.id];
        }
      }
    }
  });

  return index;
}

// const doc1 = { id: 'doc1', text: 'some text' };
// const doc2 = { id: 'doc2', text: 'some text too' };
// const docs = [doc1, doc2];

// const result = search(docs, 'some text too');
// console.log(result);
// const index = {
//   some: ['doc1', 'doc2'],
//   text: ['doc1', 'doc2'],
//   too: ['doc2'],
// };

export default search;
