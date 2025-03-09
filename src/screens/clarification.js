import { conditional as c, node as n } from '@doars/staark'
import { translate as t } from '../data/translations.js'
import { SCREENS } from '../data/screens.js'
import { createMessage } from '../apis/apis.js'
import { setScreen } from '../utilities/screen.js'

export const clarification = (
  state,
) => [
    n('p', [
      n('b', t(state, 'greeting')),
      n('br'),
      n('label', {
        for: 'input-question',
      }, t(state, 'clarification-intro')),
    ]),

    ...c(
      state.clarificationMessages
      && state.clarificationMessages.length > 0,
      n('div', {
        class: 'messages',
      }, state.clarificationMessages.map(
        (message) => n('p', {
          class: 'message-' + message?.role
        }, message?.content?.split('\n')?.flatMap(
          (content, index, results) =>
            index === results.length - 1 ? [content] : [content, n('br')]
        )),
      )),
    ),

    ...c(
      state.clarificationError,
      n('p', state.clarificationError),
    ),

    ...c(
      state.clarificationPending,
      n('p', {
        class: 'pending',
      }),
      n('textarea', {
        class: 'message-user',
        id: 'input-question',
        placeholder: t(state, 'clarification-placeholder'),
        keyup: (event) => {
          state.clarificationInput = event.target.value
        },
      }, state.clarificationInput),
    ),

    n('div', {
      class: 'row reverse',
    }, [
      n('button', {
        disabled: (
          state.clarificationPending
          || !state.clarificationInput
          || state.clarificationInput.trim().length === 0
        ),
        type: 'button',
        click: () => {
          if (
            !state.clarificationPending
            && state.clarificationInput
            && state.clarificationInput.trim().length > 0
          ) {
            state.clarificationError = false
            state.clarificationPending = true
            state.clarificationMessages.push({
              role: 'user',
              content: state.clarificationInput.trim(),
            })
            state.clarificationInput = ''
            createMessage(
              state,
              state.clarificationMessages,
              t(state, 'prompt-context'),
              t(state, 'prompt-clarification'),
            ).then(([error, response, result]) => {
              state.clarificationPending = false
              if (error) {
                state.clarificationError = error.toString()
                const message = state.clarificationMessages.pop()
                state.clarificationInput = message.content
                return
              }
              state.clarificationMessages.push(result)
              state.statisticClarificationActivity++
              onActivity(state)
            })
          }
        },
      }, t(state, 'button-ask')),

      ...c(
        state.clarificationPending
        || (
          state.clarificationMessages
          && state.clarificationMessages.length > 0
        ),
        n('button', {
          type: 'button',
          click: () => {
            state.clarificationError = false
            state.clarificationMessages = []
            state.clarificationPending = false
            // TODO: Should reset the network requests properly.
          },
        }, t(state, 'button-reset')),
      ),

      n('button', {
        type: 'button',
        click: () => {
          setScreen(state, SCREENS.overview)
        },
      }, t(state, 'button-go_back')),
    ])
  ]
