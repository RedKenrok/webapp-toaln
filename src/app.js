import {
  mount,
  match as m,
  node as n,
} from '@doars/staark'

import { APIS } from './apis/apis.js'
import {
  apiSettings as apiSettingsGoogle,
} from './apis/google.js'
import {
  getPreferredLocale,
  LOCALES,
  PROFICIENCY_LEVELS,
  getLanguageFromLocale,
} from './data/locales.js'
import { SCREENS } from './data/screens.js'

import { options } from './screens/options.js'
import { overview } from './screens/overview.js'
import { setup } from './screens/setup.js'

import { conversation } from './screens/conversation.js'
import { clarification } from './screens/clarification.js'
import { comprehension } from './screens/comprehension.js'
import { story } from './screens/story.js'
import { vocabulary } from './screens/vocabulary.js'

import { createIdentifier } from './utilities/identifiers.js'

const STATE_KEY = 'toaln:state'

const preferredLocale = getPreferredLocale()

mount(
  document.getElementById('app'),
  (state) => {
    localStorage.setItem(STATE_KEY, JSON.stringify(state))
    document.documentElement.setAttribute('lang', state.sourceLocale)

    return n('div', {
      class: 'screen',
    }, m(state.screen, {
      [SCREENS.options]: () => options(state),
      [SCREENS.overview]: () => overview(state),

      [SCREENS.clarification]: () => clarification(state),
      [SCREENS.comprehension]: () => comprehension(state),
      [SCREENS.conversation]: () => conversation(state),
      [SCREENS.story]: () => story(state),
      [SCREENS.vocabulary]: () => vocabulary(state),
    }, () => setup(state)))
  },
  Object.assign({
    screen: SCREENS.setup,

    userIdentifier: createIdentifier(),
    sourceLocale: preferredLocale,
    sourceLanguage: getLanguageFromLocale(preferredLocale),
    targetLocale: LOCALES.eng,
    targetLanguage: getLanguageFromLocale(LOCALES.eng),
    proficiencyLevel: PROFICIENCY_LEVELS.a1,
    topicsOfInterest: [],

    apiCode: APIS.google.code,
    apiModel: apiSettingsGoogle.preferredModel,
    apiCredentials: null,
    apiCredentialsError: false,
    apiCredentialsTested: false,
    apiCredentialsPending: false,

    statisticComprehensionActivity: 0,
    statisticConversationActivity: 0,
    statisticClarificationActivity: 0,
    statisticStoryActivity: 0,
    statisticVocabularyActivity: 0,
    statisticLastActivityOn: null,
    statisticCurrentActivityStreak: 0,
    statisticLongestActivityStreak: 0,

    clarificationInput: '',
    clarificationError: false,
    clarificationPending: false,
    clarificationMessages: [],

    comprehensionInput: '',
    comprehensionReviewed: false,
    comprehensionError: false,
    comprehensionPending: false,
    comprehensionMessages: [],

    conversationInput: '',
    conversationStopped: false,
    conversationError: false,
    conversationPending: false,
    conversationMessages: [],

    storyInput: '',
    storyReviewed: false,
    storyError: false,
    storyPending: false,
    storyMessages: [],

    vocabularyInput: '',
    vocabularyReviewed: false,
    vocabularyError: false,
    vocabularyPending: false,
    vocabularyMessages: [],
  }, (
    localStorage.getItem(STATE_KEY)
      ? JSON.parse(localStorage.getItem(STATE_KEY))
      : {}
  ))
)
