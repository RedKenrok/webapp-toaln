import {
  mount,
  node as n,
} from '@doars/staark'

import { APIS } from './apis/apis.js'
import {
  getPreferredLocale,
  LOCALES,
  PROFICIENCY_LEVELS,
  getLanguageFromLocale,
} from './data/locales.js'
import { SCREENS } from './data/screens.js'

import { setup } from './screens/setup.js'
import { overview } from './screens/overview.js'
import { conversation } from './screens/conversation.js'
import { clarification } from './screens/clarification.js'
import { comprehension } from './screens/comprehension.js'
import { options } from './screens/options.js'
import { statistics } from './screens/statistics.js'

import { createIdentifier } from './utilities/identifiers.js'

const STATE_KEY = 'toaln:state'

const preferredLocale = getPreferredLocale()

mount(
  document.getElementById('app'),
  (state) => {
    localStorage.setItem(STATE_KEY, JSON.stringify(state))
    document.documentElement.setAttribute('lang', state.sourceLocale)

    console.log('state', state)

    let screen = null
    switch (state.screen) {
      default:
      case SCREENS.setup:
        screen = setup(state)
        break

      case SCREENS.overview:
        screen = overview(state)
        break

      case SCREENS.options:
        screen = options(state)
        break

      case SCREENS.statistics:
        screen = statistics(state)
        break

      case SCREENS.clarification:
        screen = clarification(state)
        break

      case SCREENS.comprehension:
        screen = comprehension(state)
        break

      case SCREENS.conversation:
        screen = conversation(state)
        break
    }

    return n('div', {
      class: 'screen',
    }, screen)
  },
  Object.assign({
    screen: SCREENS.setup,

    userIdentifier: createIdentifier(),
    sourceLocale: preferredLocale,
    sourceLanguage: getLanguageFromLocale(preferredLocale),
    targetLocale: LOCALES.en_gb,
    targetLanguage: getLanguageFromLocale(LOCALES.en_gb),
    proficiencyLevel: PROFICIENCY_LEVELS.a1,
    topicsOfInterest: [],

    apiCode: APIS.open_ai.code,
    apiModel: null,
    apiCredentials: null,
    apiCredentialsError: false,
    apiCredentialsTested: false,
    apiCredentialsPending: false,

    statisticComprehensionActivity: 0,
    statisticConversationActivity: 0,
    statisticClarificationActivity: 0,
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
  }, (
    localStorage.getItem(STATE_KEY)
      ? JSON.parse(localStorage.getItem(STATE_KEY))
      : {}
  ))
)
