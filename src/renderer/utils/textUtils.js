const pluralizedWord = (word, number, plural) => {
  if (number === 1) {
    return word; // Singular form
  }
  return plural ? plural : word + 's'; // Plural form
};

export default pluralizedWord;
