export const PROFICIENCY_LEVELS = Object.freeze({
  a1: 'a1',
  a2: 'a2',
  b1: 'b1',
  b2: 'b2',
  c1: 'c1',
  c2: 'c2',
})

export const PROFICIENCY_LEVEL_CODES = Object.keys(PROFICIENCY_LEVELS)

export const LOCALES = Object.freeze({
  da_dk: 'da_dk',
  de_de: 'de_de',
  en_gb: 'en_gb',
  nl_nl: 'nl_nl',
})

export const LOCALE_CODES = Object.keys(LOCALES)

export const getLanguageFromLocale = (
  localeCode
) => localeCode.split('_')[0].split('-')[0]

export const getPreferredLocale = (
) => (
  window.navigator.languages
    .map(
      (languageCode) =>
        languageCode.split('-').filter(
          (_, index) => index < 2
        ).join('-').replace('-', '_').toLowerCase())
    .reduce((preferredLanguage, languageCode) => {
      if (preferredLanguage) {
        return preferredLanguage
      }
      for (let i = 0; i < LOCALE_CODES.length; i++) {
        const possibleLanguage = LOCALE_CODES[i]
        if (languageCode === possibleLanguage) {
          return possibleLanguage
        }
        if (possibleLanguage.startsWith(languageCode + '_')) {
          return possibleLanguage
        }
      }
      return preferredLanguage
    }, null)
) ?? LOCALES.en_gb