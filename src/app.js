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

import { updateBanner } from './screens/sections/update-banner.js'
import { migrate } from './screens/migrate.js'
import { options } from './screens/options.js'
import { overview } from './screens/overview.js'
import { setup } from './screens/setup.js'

import { conversation } from './screens/conversation.js'
import { clarification } from './screens/clarification.js'
import { comprehension } from './screens/comprehension.js'
import { story } from './screens/story.js'
import { vocabulary } from './screens/vocabulary.js'

import { createIdentifier } from './utilities/identifiers.js'
import { handleStartup } from './utilities/manifest.js'
import { notifyOnUpdate } from './utilities/sw.js'
import { handleHistory } from './utilities/screen.js'

const STATE_KEY = 'toaln:state'

const preferredLocale = getPreferredLocale()

const [_update, _unmount, state] = mount(
  document.getElementById('app'),
  (state) => {
    localStorage.setItem(STATE_KEY, JSON.stringify(state))
    document.documentElement.setAttribute('lang', state.sourceLocale)

    return n('div', {
      class: 'screen',
    }, [
      ...updateBanner(state),
      ...m(state.screen, {
        [SCREENS.migrate]: () => migrate(state),
        [SCREENS.options]: () => options(state),
        [SCREENS.overview]: () => overview(state),

        [SCREENS.clarification]: () => clarification(state),
        [SCREENS.comprehension]: () => comprehension(state),
        [SCREENS.conversation]: () => conversation(state),
        [SCREENS.story]: () => story(state),
        [SCREENS.vocabulary]: () => vocabulary(state),
      }, () => setup(state)),
    ])
  },
  Object.assign({
    screen: SCREENS.setup,
    userIdentifier: createIdentifier(),

    appUpdateAvailable: false,

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
    apiCredentialsPending: false,
    apiCredentialsTested: false,

    migrateImportError: null,
    migrateReset: null,

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
  ), {
    // Ensure files updated is always reset after a full page refresh.
    appUpdateAvailable: false,
    apiCredentialsPending: false,

    clarificationPending: false,
    comprehensionPending: false,
    conversationPending: false,
    storyPending: false,
    vocabularyPending: false,
  })
)

notifyOnUpdate(state)
handleStartup(state)
handleHistory(state)
