const search = (docs, token) => {
  const term = token.split(' ').flatMap((query) => query.toLowerCase().match(/\w+/g));

  const sizes = {};
  const index = docs.reduce((acc, { id, text }) => {
    text.split(' ').forEach((word) => {
      const key = word.toLowerCase().match(/\w+/g);

      if (!acc[key]) {
        acc[key] = {
          docs: [],
          counter: {},
        };
      }

      if (!acc[key].docs.includes(id)) {
        acc[key].docs.push(id);
      }

      acc[key].counter[id] = (acc[key].counter[id] ?? 0) + 1;
    });

    sizes[id] = text.split(' ').length;

    return acc;
  }, {});

  const data = term.reduce((acc, key) => {
    if (!index[key]) {
      return acc;
    }

    const ids = index[key].docs;
    ids.forEach((id) => {
      acc[id] = (acc[id] ?? 0) + index[key].counter[id];
    });

    return acc;
  }, {});

  const all = Object.keys(sizes).length;
  const tfIdf = Object.entries(data).reduce((acc, [key, value]) => {
    const tf = value / sizes[key];
    const idf = Math.log(all) / Math.log(docs.length);
    acc[key] = Number((tf * (Number.isNaN(idf) ? 1 : idf)).toFixed(2));
    return acc;
  }, {});

  const result = Object.entries(tfIdf)
    .sort(([, a], [, b]) => b - a)
    .map(([id]) => id);

  return result;
};

export default search;
