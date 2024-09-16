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

  const countMatches = (text) => {
    const textWords = text.toLowerCase().split(/\s+/);
    let matches = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const word of queryWords) {
      if (binarySearch(textWords, word)) {
        // eslint-disable-next-line no-plusplus
        matches++;
      }
    }

    return matches;
  };

  // eslint-disable-next-line array-callback-return
  const result = docs.reduce((acc, cur) => {
    const matches = countMatches(cur.text);

    if (matches > 0) {
      acc.push({ id: cur.id, matches });
    }

    return acc;
  }, []);

  return quickSort(result, (a, b) => (a.matches > b.matches ? -1 : 1)).map((el) => el.id);
}

// const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
// const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
// const doc3 = { id: 'doc3', text: "I'm your shooter." };
// const docs = [doc1, doc2, doc3];

// const result = search(docs, 'shoot at me');
// console.log(result); // ['doc2', 'doc1']

export default search;
