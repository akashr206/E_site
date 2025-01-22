const { findProducts } = require('../services/search');
const natural = require('natural');
const wordnet = new natural.WordNet();

const getSynonyms = (word) => {
  return new Promise((resolve, reject) => {
    wordnet.lookup(word, (results) => {
      if (results.length > 0) {
        const synonyms = results.flatMap((result) => result.synonyms);
        resolve([...new Set(synonyms)]);
      } else {
        resolve([]);
      }
    });
  });
};

const expandQueryWithWordNet = async (query) => {
  const words = query.split(" ");
  const synonymPromises = words.map((word) => getSynonyms(word));
  const synonymsArray = await Promise.all(synonymPromises);

  const expandedWords = words.flatMap((word, idx) => [word, ...synonymsArray[idx]]);
  return [...new Set(expandedWords)].join(" "); 
};

const searchProducts = async (req, res) => {
  const { query } = req.query;

  const expandedQuery = await expandQueryWithWordNet(query);

  const searchedProducts = await findProducts(expandedQuery);
  res.status(200).json(searchedProducts);
};

module.exports = { searchProducts };