import {
  conditional as c,
  node as n,
} from '@doars/staark'

import { createMessage } from '../apis/apis.js'

import { SCREENS } from '../data/screens.js'
import { translate as t } from '../data/translations.js'

import { setScreen } from '../utilities/screen.js'
import { onActivity } from '../utilities/streak.js'

const handleInput = (
  event,
  state,
) => {
  state.rewriteInput = event.target.value
}

const handleRewrite = (
  _event,
  state,
) => {
  if (!state.rewritePending) {
    state.rewriteError = false
    state.rewriteMessages = [{
      role: 'user',
      content: state.rewriteInput.trim(),
    }]
    state.rewritePending = true

    createMessage(
      state,
      state.rewriteMessages,
      t(state, 'prompt-context'),
      t(state, 'prompt-rewrite'),
    ).then(([error, _response, result]) => {
      state.rewritePending = false
      if (error) {
        state.rewriteError = error.toString()
        return
      }
      state.rewriteMessages.push(result)
      state.statisticRewriteActivity++
      onActivity(state)
    })
  }
}

const handleReset = (
  _event,
  state,
) => {
  state.rewriteError = false
  state.rewriteInput = ''
  state.rewriteMessages = []
  state.rewritePending = false
  // TODO: Reset network requests if needed.
}

const handleBack = (
  _event,
  state,
) => {
  setScreen(state, SCREENS.overview)
}

export const rewrite = (
  state,
) => [
    n('p', [
      n('b', t(state, 'greeting')),
      n('br'),
      n('label', {
        for: 'input-text',
      }, t(state, 'rewrite-intro')),
    ]),

    n('div', {
      class: 'messages',
    }, [
      ...c(
        state.rewriteMessages
        && state.rewriteMessages.length > 0,
        state.rewriteMessages.map((message) =>
          n('p', {
            class: 'message-' + message.role,
          }, message.content.split('\n')
            .flatMap((content, index, results) =>
              index === results.length - 1
                ? [content]
                : [content, n('br')]
            )
          )
        ),
        n('textarea', {
          class: 'message-user',
          disabled:
            state.rewriteMessages
            && state.rewriteMessages.length > 0,
          id: 'input-text',
          input: handleInput,
          placeholder: t(state, 'rewrite-placeholder'),
        }, state.rewriteInput),
      ),
    ]),

    ...c(
      state.rewriteError,
      n('p', state.rewriteError),
    ),

    ...c(
      state.rewritePending,
      n('p', {
        class: 'pending',
      }),
    ),

    n('div', {
      class: 'row reverse',
    }, [
      ...c(
        state.rewritePending
        || (
          state.rewriteMessages
          && state.rewriteMessages.length === 0
        ),
        n('button', {
          click: handleRewrite,
          disabled: (
            state.rewritePending
            || state.rewriteInput.trim().length === 0
          ),
          type: 'button',
        }, t(state, 'button-rewrite')),
      ),

      ...c(
        state.rewritePending
        || (
          state.rewriteMessages
          && state.rewriteMessages.length > 0
        ),
        n('button', {
          type: 'button',
          click: handleReset,
        }, t(state, 'button-reset')),
      ),

      n('button', {
        click: handleBack,
        type: 'button',
      }, t(state, 'button-go_back')),
    ]),
  ]
