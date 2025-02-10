import { node as n } from '@doars/staark'
import { translate as t } from '../data/translations.js'
import { SCREENS } from '../data/screens.js'

export const overview = (
  state,
) => [
    n('p', [
      n('b', t(state, 'greeting')),
      n('br'),
      t(state, 'overview-intro'),
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

      // Story 🎭

      n('div', {
        class: 'margin',
      }),

      n('button', {
        class: 'card',
        click: () => {
          state.screen = SCREENS.statistics
        },
        type: 'button',
      }, [
        n('span', {
          class: 'icon',
        }, '📈'),
        n('b', t(state, 'overview-statistics-title')),
        n('br'),
        t(state, 'overview-statistics-description')
      ]),

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
