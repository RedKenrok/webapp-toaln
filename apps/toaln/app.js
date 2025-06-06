import {
  mount,
  match as m,
  node as n,
} from '@doars/staark'

import { APIS } from '../../shared/apis/apis.js'
import {
  apiSettings as apiSettingsGoogle,
} from '../../shared/apis/google.js'

import {
  getPreferredLocale,
  LOCALES,
  PROFICIENCY_LEVELS,
  getLanguageFromLocale,
  setLangAttribute,
} from './data/locales.js'
import { SCREENS } from './data/screens.js'
import { STORAGE_KEY } from './data/state.js'

import { contextMenu } from './screens/sections/context-menu.js'
import { popupModal } from './screens/sections/popup-modal.js'
import { updateBanner } from './screens/sections/update-banner.js'
import { migrate } from './screens/migrate.js'
import { options } from './screens/options.js'
import { overview } from './screens/overview.js'
import { setup } from './screens/setup.js'

import { conversation } from './screens/conversation.js'
import { clarification } from './screens/clarification.js'
import { comprehension } from './screens/comprehension.js'
import { reading } from './screens/reading.js'
import { rewrite } from './screens/rewrite.js'
import { story } from './screens/story.js'
import { vocabulary } from './screens/vocabulary.js'

import { createIdentifier } from '../../shared/utilities/identifiers.js'
import { handleContextMenu } from './utilities/context-menu.js'
import { handleHistory } from './utilities/screen.js'
import { handleStartup } from './utilities/manifest.js'
import { handleUpdates } from '../../shared/utilities/sw.js'

const initialize = () => {
  const preferredLocale = getPreferredLocale()

  const [_update, _unmount, state] = mount(
    document.body.appendChild(
      document.createElement('div'),
    ),
    (state) => {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state),
      )

      return n('div', {
        class: 'screen',
      }, [
        ...updateBanner(state),
        ...m(state.screen, {
          [SCREENS.clarification]: () => clarification(state),
          [SCREENS.comprehension]: () => comprehension(state),
          [SCREENS.conversation]: () => conversation(state),
          [SCREENS.reading]: () => reading(state),
          [SCREENS.rewrite]: () => rewrite(state),
          [SCREENS.story]: () => story(state),
          [SCREENS.vocabulary]: () => vocabulary(state),

          [SCREENS.overview]: () => overview(state),
          [SCREENS.options]: () => options(state),
          [SCREENS.migrate]: () => migrate(state),
        }, () => setup(state)),
        ...popupModal(state),
        ...contextMenu(state),
      ])
    },
    Object.assign({
      screen: SCREENS.setup,
      userIdentifier: createIdentifier(),

      appUpdateAvailable: false,
      contextMenu: null,
      selection: null,
      popupModal: null,

      sourceLocale: preferredLocale,
      sourceLanguage: getLanguageFromLocale(preferredLocale),
      targetLocale: LOCALES.eng,
      targetLanguage: getLanguageFromLocale(LOCALES.eng),
      proficiencyLevel: PROFICIENCY_LEVELS.a1,
      topicsOfInterest: [],

      apiProvider: APIS.google.code,
      apiModel: apiSettingsGoogle.preferredModel,
      apiCredentials: null,
      apiCredentialsError: false,
      apiCredentialsPending: false,
      apiCredentialsTested: false,

      migrateImportError: false,
      migrateReset: false,

      statisticClarificationActivity: 0,
      statisticComprehensionActivity: 0,
      statisticConversationActivity: 0,
      statisticReadingActivity: 0,
      statisticRewriteActivity: 0,
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

      readingInput: '',
      readingError: false,
      readingPending: false,
      readingMessages: [],

      rewriteInput: '',
      rewriteError: false,
      rewritePending: false,
      rewriteMessages: [],

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
      window.localStorage.getItem(STORAGE_KEY)
        ? JSON.parse(
          window.localStorage.getItem(STORAGE_KEY)
        )
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

  setLangAttribute(state)

  handleContextMenu(state)
  handleHistory(state)
  handleStartup(state)
  handleUpdates(state)
}

// Check if dom content loaded event has already fired.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize)
} else {
  initialize()
}
