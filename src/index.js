function binarySearch(array, searchString) {
  let first = 0;
  let last = array.length - 1;

  while (first <= last) {
    const middle = Math.floor((last + first) / 2);
    if (array[middle] === searchString) return true;
    if (searchString < array[middle]) {
      last = middle - 1;
    } else {
      first = middle + 1;
    }
  }
  return false;
}

function search(docs, searchString) {
  if (!docs.length) return [];
  const result = [];
  for (let i = 0; i < docs.length; i += 1) {
    const element = docs[i];
    if (binarySearch(element.text.split(' '), searchString)) {
      result.push(element.id);
    }
  }

  return result;
}

export default search;
