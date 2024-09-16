const createReverseIndex = (engine) => {
  const words = engine.docs.reduce((acc, { text }) => [...acc, ...text.match(/[\w]+/g)], []);
  const uniqWords = [...new Set(words)];
  return uniqWords.reduce((acc, word) => {
    const result = engine.fixWord(word).map((element) => [element.id, element.relevant.count]);
    if (!result) {
      return acc;
    }
    return { ...acc, [word]: result };
  }, {});
};

export default class SearchEngine {
  constructor(docs) {
    this.docs = docs;
    this.reverseIndex = createReverseIndex(this);
  }

  fixWord(token) {
    return this.docs
      .map((doc) => {
        const result = doc.text.match(/[\w]+/g).filter((str) => token === str);
        return {
          ...doc,
          relevant: {
            words: new Set(result).size,
            count: result.length,
          },
        };
      })
      .filter(({ relevant }) => relevant.words !== 0);
  }

  search(token) {
    const term = token.match(/\w+/g);
    if (term === null) {
      return [];
    }
    const result = term.flatMap((word) => this.reverseIndex[word]).filter((el) => el !== undefined);
    if (!result) {
      return [];
    }
    return this.docs
      .map((doc) => {
        const docResult = result.filter(([id]) => doc.id === id);
        const wordsCount = docResult.length;
        const generalCount = docResult.reduce((acc, [, value]) => acc + value, 0);
        return {
          ...doc,
          relevant: {
            words: wordsCount,
            count: generalCount,
          },
        };
      })
      .filter(({ relevant }) => relevant.words !== 0)
      .sort((a, b) => {
        if (a.relevant.words === b.relevant.words) {
          return b.relevant.count - a.relevant.count;
        }
        return b.relevant.words - a.relevant.words;
      })
      .map((doc) => doc.id);
  }
}
