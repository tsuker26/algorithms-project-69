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

// function binarySearch(array, token) {
//   let first = 0;
//   let last = array.length - 1;

//   const arraySorted = quickSort(array);

//   while (first <= last) {
//     const middle = Math.floor((first + last) / 2);
//     const term = arraySorted[middle];
//     if (token === term) {
//       return true;
//     }
//     if (token < term) {
//       last = middle - 1;
//     } else {
//       first = middle + 1;
//     }
//   }
//   return false;
// }

function searchWord(array, token) {
  let count = 0;

  for (let i = 0; i < array.length; i += 1) {
    if (array[i] === token) {
      count += 1;
    }
  }

  return count;
}

function search(docs, query) {
  const queryWords = query.toLowerCase().split(/\s+/);
  const index = {};

  docs.forEach((doc) => {
    const textWords = doc.text.toLowerCase().split(/\s+/);

    // eslint-disable-next-line no-restricted-syntax
    for (const word of queryWords) {
      const count = searchWord(textWords, word);

      // eslint-disable-next-line no-continue
      if (!count) continue;

      if (index[word]) {
        // eslint-disable-next-line max-len
        index[word].push({ id: doc.id, tf: count / textWords.length });
      } else {
        index[word] = [{ id: doc.id, tf: count / textWords.length }];
      }
    }
  });

  // eslint-disable-next-line array-callback-return, no-unused-vars, arrow-body-style
  const indexArray = Object.entries(index).map(([word, items]) => {
    return {
      [`${word}`]: items.map((doc) => ({ ...doc, tfIdf: doc.tf * Math.log(docs.length / items.length) })),
    };
  });
  const resultIndex = {};
  const result = [];

  indexArray.forEach((item) => {
    // eslint-disable-next-line max-len
    resultIndex[Object.keys(item)] = item[Object.keys(item)].reduce((acc, cur) => acc + cur.tfIdf, 0);
  });

  docs.forEach((doc) => {
    const textWordsResult = doc.text.toLowerCase().split(/\s+/);
    const queryWordsResult = Object.keys(resultIndex);
    textWordsResult.forEach((textWord) => {
      queryWordsResult.forEach((queryWord) => {
        if (textWord === queryWord) {
          const findDoc = result.find((f) => f.id === doc.id);
          if (findDoc) {
            findDoc.tfIdf += resultIndex[queryWord];
          } else {
            result.push({ id: doc.id, tfIdf: resultIndex[queryWord] });
          }
        }
      });
    });
  });

  return quickSort(result, (a, b) => (a.tfIdf > b.tfIdf ? -1 : 1)).map((el) => el.id);
}

const doc1 = { id: 'doc1', text: 'some text some' };
const doc2 = { id: 'doc2', text: 'some  text too' };
const doc3 = { id: 'doc3', text: 'too' };
const docs = [doc1, doc2, doc3];

const result = search(docs, 'some text too');
console.log(result);
// const index = {
//   some: ['doc1', 'doc2'],
//   text: ['doc1', 'doc2'],
//   too: ['doc2'],
// };

export default search;
