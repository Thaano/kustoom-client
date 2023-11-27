const i18next = require('i18next');

const locales = ['en', 'fr'];
const resources = locales.reduce((acc, locale) => {
  acc[locale] = {
    translation: require(`../dictionaries/${locale}.json`),
  };
  return acc;
}, {});

i18next.init({
  resources,
});

export default i18next;
