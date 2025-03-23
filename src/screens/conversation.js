import {
  conditional as c,
  node as n,
} from '@doars/staark'

import { createMessage } from '../apis/apis.js'

import { SCREENS } from '../data/screens.js'
import { translate as t } from '../data/translations.js'

import {
  randomBool,
  randomItem,
} from '../utilities/random.js'
import { setScreen } from '../utilities/screen.js'
import { onActivity } from '../utilities/streak.js'

const handleReply = (
  _event,
  state,
) => {
  if (
    !state.conversationPending
    && state.conversationInput
    && state.conversationInput.trim().length > 0
  ) {
    state.conversationError = false
    state.conversationPending = true
    state.conversationMessages.push({
      role: 'user',
      content: state.conversationInput.trim(),
    })
    state.conversationInput = ''
    createMessage(
      state,
      state.conversationMessages,
      t(state, 'prompt-context'),
      t(state, 'prompt-conversation-follow_up'),
    ).then(([error, _response, result]) => {
      state.conversationPending = false
      if (error) {
        state.conversationError = error.toString()
        const message = state.conversationMessages.pop()
        state.conversationInput = message.content
        return
      }
      if (result.content.trim().endsWith('STOP')) {
        state.conversationStopped = true
      }
      state.conversationMessages.push(result)
      state.statisticConversationActivity++
      onActivity(state)
    })
  }
}

const handleGenerate = (
  _event,
  state,
) => {
  if (!state.conversationPending) {
    state.conversationError = false
    state.conversationMessages = []
    state.conversationPending = true
    createMessage(
      state,
      [],
      t(state, 'prompt-context'),
      t(state, 'prompt-conversation') + (
        randomBool(10)
          ? t(state, 'prompt-topic')
            .replace('{%topic%}', randomItem(
              state.topicsOfInterest.filter(topic => topic)
            ))
          : ''
      ),
    ).then(([error, _response, result]) => {
      state.conversationPending = false
      if (error) {
        state.conversationError = error.toString()
        return
      }
      state.conversationMessages.push(result)
    })
  }
}

const handleReset = (
  _event,
  state,
) => {
  state.conversationError = false
  state.conversationMessages = []
  state.conversationPending = false
  state.conversationStopped = false
  // TODO: Should reset the network requests properly.
}

const handleBack = (
  _event,
  state,
) => {
  setScreen(state, SCREENS.overview)
}

const handleInput = (
  event,
  state
) => {
  state.conversationInput = event.target.value
}

export const conversation = (
  state,
) => [
    n('p', [
      n('b', t(state, 'greeting')),
      n('br'),
      t(state, 'conversation-intro'),
    ]),

    ...c(
      state.conversationMessages
      && state.conversationMessages.length > 0,
      n('div', {
        class: 'messages',
      }, state.conversationMessages.map(
        (message) => n('p', {
          class: 'message-' + message?.role
        }, message?.content?.split('\n')?.flatMap(
          (content, index, results) =>
            index === results.length - 1 ? [content] : [content, n('br')]
        )),
      )),
    ),

    ...c(
      state.conversationError,
      n('p', state.conversationError),
    ),

    ...c(
      state.conversationPending,
      n('p', {
        class: 'pending',
      }),
      c(
        state.conversationMessages
        && state.conversationMessages.length > 0,
        n('textarea', {
          class: 'message-user',
          id: 'input-question',
          keyup: handleInput,
        }, state.conversationInput),
      ),
    ),

    n('div', {
      class: 'row reverse',
    }, [
      ...c(
        state.conversationMessages
        && state.conversationMessages.length > 0
        && !state.conversationStopped,
        n('button', {
          disabled: (
            state.conversationPending
            || !state.conversationInput
            || state.conversationInput.trim().length === 0
          ),
          type: 'button',
          click: handleReply,
        }, t(state, 'button-reply')),
        n('button', {
          disabled: state.conversationPending,
          type: 'button',
          click: handleGenerate,
        }, t(state, 'button-generate')),
      ),

      ...c(
        state.conversationPending
        || (
          state.conversationMessages
          && state.conversationMessages.length > 0
        ),
        n('button', {
          click: handleReset,
          type: 'button',
        }, t(state, 'button-reset')),
      ),

      n('button', {
        click: handleBack,
        type: 'button',
      }, t(state, 'button-go_back')),
    ])
  ]
