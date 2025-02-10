import {
  conditional as c,
  node as n,
} from '@doars/staark'
import { translate as t } from '../data/translations.js'
import { SCREENS } from '../data/screens.js'

export const statistics = (
  state,
) => [
    n('p', [
      n('b', t(state, 'greeting')),
    ]),

    ...c(
      state.statisticComprehensionActivity > 1
      || state.statisticConversationActivity > 1
      || state.statisticClarificationActivity > 1
      || state.statisticVocabularyActivity > 1,
      n('p', t(state, 'statistics-activity_per_category')),
      n('p', t(state, 'statistics-no_activity')),
    ),

    n('p',
      c(
        state.statisticCurrentActivityStreak > 1
        && (new Date(state.statisticLastActivityOn)).toISOString().slice(0, 10) === (new Date()).toISOString().slice(0, 10),
        [
          t(state, 'statistics-current_activity_streak'),
          ...c(
            state.statisticLongestActivityStreak > state.statisticCurrentActivityStreak,
            t(state, 'statistics-longest_activity_streak'),
          ),
        ],
        [
          t(state, 'statistics-no_activity_streak'),
          ...c(
            state.statisticLongestActivityStreak > 1,
            t(state, 'statistics-longest_activity_streak'),
          ),
        ]
      ),
    ),

    n('button', {
      click: () => {
        state.screen = SCREENS.overview
      },
      type: 'button',
    }, t(state, 'button-go_back')),
  ]
