import {
  conditional as c,
  node as n,
} from '@doars/staark'

import { SCREENS } from '../data/screens.js'
import { translate as t } from '../data/translations.js'

import { setScreen } from '../utilities/screen.js'

const handleClarification = (
  _,
  state,
) => {
  setScreen(state, SCREENS.clarification)
}

const handleComprehension = (
  _,
  state,
) => {
  setScreen(state, SCREENS.comprehension)
}

const handleConversation = (
  _,
  state,
) => {
  setScreen(state, SCREENS.conversation)
}

const handleReading = (
  _,
  state,
) => {
  setScreen(state, SCREENS.reading)
}

const handleRewrite = (
  _,
  state,
) => {
  setScreen(state, SCREENS.rewrite)
}

const handleStory = (
  _,
  state,
) => {
  setScreen(state, SCREENS.story)
}

const handleVocabulary = (
  _,
  state,
) => {
  setScreen(state, SCREENS.vocabulary)
}

const handleOptions = (
  _,
  state,
) => {
  setScreen(state, SCREENS.options)
}

const handleMigrate = (
  _,
  state,
) => {
  setScreen(state, SCREENS.migrate)
}

export const overview = (
  state,
) => [
    n('p', [
      n('b', t(state, 'greeting')),
      n('br'),
      ...c(
        state.statisticComprehensionActivity > 0
        || state.statisticConversationActivity > 0
        || state.statisticClarificationActivity > 0
        || state.statisticReadingActivity > 0
        || state.statisticStoryActivity > 0
        || state.statisticVocabularyActivity > 0,
        t(state, 'statistics-activity_per_category'),
        t(state, 'statistics-no_activity'),
      ),
    ]),
    n('p', [
      ...c(
        state.statisticCurrentActivityStreak > 1
        && (
          (new Date(state.statisticLastActivityOn)).toISOString().slice(0, 10) === (new Date()).toISOString().slice(0, 10)
          || (new Date(state.statisticLastActivityOn)).toISOString().slice(0, 10) === (new Date(new Date().setDate(new Date().getDate() - 1))).toISOString().slice(0, 10)
        ),
        [
          ...c(
            (new Date(state.statisticLastActivityOn)).toISOString().slice(0, 10) === (new Date()).toISOString().slice(0, 10),
            t(state, 'statistics-extended_activity_streak'),
            t(state, 'statistics-current_activity_streak'),
          ),
          ...c(
            state.statisticLongestActivityStreak > state.statisticCurrentActivityStreak,
            ' ' + t(state, 'statistics-longest_activity_streak'),
          ),
        ],
        [
          t(state, 'statistics-no_activity_streak'),
          ...c(
            state.statisticLongestActivityStreak > 1,
            ' ' + t(state, 'statistics-longest_activity_streak'),
          ),
        ]
      ),
      ' ' + t(state, 'overview-intro'),
    ]),

    n('div', {
      class: 'vertical-layout',
    }, [
      n('button', {
        class: 'card',
        click: handleReading,
        type: 'button',
      }, [
        n('span', {
          class: 'icon',
        }, '📖'),
        n('b', t(state, 'overview-reading-title')),
        n('br'),
        t(state, 'overview-reading-description'),
      ]),

      n('button', {
        class: 'card',
        click: handleComprehension,
        type: 'button',
      }, [
        n('span', {
          class: 'icon',
        }, '🖊️'),
        n('b', t(state, 'overview-comprehension-title')),
        n('br'),
        t(state, 'overview-comprehension-description'),
      ]),

      n('button', {
        class: 'card',
        click: handleVocabulary,
        type: 'button',
      }, [
        n('span', {
          class: 'icon',
        }, '🔎'),
        n('b', t(state, 'overview-vocabulary-title')),
        n('br'),
        t(state, 'overview-vocabulary-description'),
      ]),

      n('button', {
        class: 'card',
        click: handleRewrite,
        type: 'button',
      }, [
        n('span', {
          class: 'icon',
        }, '🤖'),
        n('b', t(state, 'overview-rewrite-title')),
        n('br'),
        t(state, 'overview-rewrite-description'),
      ]),

      n('button', {
        class: 'card',
        click: handleConversation,
        type: 'button',
      }, [
        n('span', {
          class: 'icon',
        }, '💬'),
        n('b', t(state, 'overview-conversation-title')),
        n('br'),
        t(state, 'overview-conversation-description'),
      ]),

      n('button', {
        class: 'card',
        click: handleStory,
        type: 'button',
      }, [
        n('span', {
          class: 'icon',
        }, '🎭'),
        n('b', t(state, 'overview-story-title')),
        n('br'),
        t(state, 'overview-story-description'),
      ]),

      n('button', {
        class: 'card',
        click: handleClarification,
        type: 'button',
      }, [
        n('span', {
          class: 'icon',
        }, '🙋'),
        n('b', t(state, 'overview-clarification-title')),
        n('br'),
        t(state, 'overview-clarification-description'),
      ]),

      n('div', {
        class: 'margin',
      }),

      n('button', {
        class: 'card',
        click: handleOptions,
        type: 'button',
      }, [
        n('span', {
          class: 'icon',
        }, '⚙️'),
        n('b', t(state, 'overview-options-title')),
        n('br'),
        t(state, 'overview-options-description'),
      ]),

      n('button', {
        class: 'card',
        click: handleMigrate,
        type: 'button',
      }, [
        n('span', {
          class: 'icon',
        }, '💾'),
        n('b', t(state, 'overview-migrate-title')),
        n('br'),
        t(state, 'overview-migrate-description'),
      ]),
    ]),

    n('p', {
      class: 'text-right',
    }, n('a', {
      href: 'https://rondekker.com/',
      target: '_blank',
      rel: 'noopener me',
    }, t(state, 'credits-link').replace('{%name%}', 'Ron Dekker')))
  ]
