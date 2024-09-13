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
  let count = 0;

  const arraySorted = quickSort(array);

  const term = token.match(/\w+/g)[0];

  while (first <= last) {
    const middle = Math.floor((first + last) / 2);
    const termElement = arraySorted[middle].match(/\w+/g)[0];
    if (term === termElement) {
      count += 1;
    }
    if (term < termElement) {
      last = middle - 1;
    } else {
      first = middle + 1;
    }
  }
  return count;
}

function search(docs, token) {
  if (!docs.length) return [];
  const result = [];
  for (let i = 0; i < docs.length; i += 1) {
    const element = docs[i];

    const count = binarySearch(element.text.split(' '), token);
    if (count) {
      result.push({ count, id: element.id });
    }
  }

  return result.sort((a, b) => (a.count > b.count ? -1 : 1)).map((el) => el.id);
}

// const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
// const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
// const doc3 = { id: 'doc3', text: "I'm your shooter." };
// const docs = [doc1, doc2, doc3];

// console.log(search(docs, 'shoot'));

export default search;
