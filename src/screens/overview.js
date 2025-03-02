import {
  conditional as c,
  node as n,
} from '@doars/staark'
import { translate as t } from '../data/translations.js'
import { SCREENS } from '../data/screens.js'

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
        click: () => {
          state.screen = SCREENS.comprehension
        },
        type: 'button',
      }, [
        n('span', {
          class: 'icon',
        }, '📖'),
        n('b', t(state, 'overview-comprehension-title')),
        n('br'),
        t(state, 'overview-comprehension-description'),
      ]),

      n('button', {
        class: 'card',
        click: () => {
          state.screen = SCREENS.vocabulary
        },
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
        click: () => {
          state.screen = SCREENS.conversation
        },
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
        click: () => {
          state.screen = SCREENS.story
        },
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
        click: () => {
          state.screen = SCREENS.clarification
        },
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
        click: () => {
          state.screen = SCREENS.options
        },
        type: 'button',
      }, [
        n('span', {
          class: 'icon',
        }, '⚙️'),
        n('b', t(state, 'overview-options-title')),
        n('br'),
        t(state, 'overview-options-description')
      ]),

      n('p', {
        class: 'text-right',
      }, n('a', {
        href: 'https://rondekker.com/',
        target: '_blank',
        rel: 'noopener me',
      }, t(state, 'credits-link').replace('{%name%}', 'Ron Dekker')))
    ]),
  ]
