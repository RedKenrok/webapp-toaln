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

const handleInput = (
  event,
  state,
) => {
  state.comprehensionInput = event.target.value
}

const handleAnswer = (
  _event,
  state,
) => {
  if (
    !state.comprehensionPending &&
    state.comprehensionInput &&
    state.comprehensionInput.trim().length > 0
  ) {
    state.comprehensionError = false
    state.comprehensionPending = true
    state.comprehensionMessages.push({
      role: 'user',
      content: state.comprehensionInput.trim(),
    })
    state.comprehensionInput = ''
    createMessage(
      state,
      state.comprehensionMessages,
      t(state, 'prompt-context'),
      t(state, 'prompt-comprehension-follow_up'),
    ).then(([error, _response, result]) => {
      state.comprehensionPending = false
      if (error) {
        state.comprehensionError = error.toString()
        const message = state.comprehensionMessages.pop()
        state.comprehensionInput = message.content
        return
      }
      state.comprehensionMessages.push(result)
      state.statisticComprehensionActivity++
      onActivity(state)
    })
  }
}

const handleGenerate = (
  _event,
  state,
) => {
  if (!state.comprehensionPending) {
    state.comprehensionError = false
    state.comprehensionMessages = []
    state.comprehensionPending = true
    createMessage(
      state,
      [],
      t(state, 'prompt-context'),
      t(state, 'prompt-comprehension') + (
        randomBool(10)
          ? t(state, 'prompt-topic')
            .replace('{%topic%}', randomItem(
              state.topicsOfInterest.filter(topic => topic)
            ))
          : ''
      ),
    ).then(([error, _response, result]) => {
      state.comprehensionPending = false
      if (error) {
        state.comprehensionError = error.toString()
        return
      }
      state.comprehensionMessages.push(result)
    })
  }
}

const handleReset = (
  _event,
  state,
) => {
  state.comprehensionError = false
  state.comprehensionInput = ''
  state.comprehensionMessages = []
  state.comprehensionPending = false
}

const handleBack = (
  _event,
  state,
) => {
  setScreen(state, SCREENS.overview)
}

export const comprehension = (
  state,
) => [
    n('p', [
      n('b', t(state, 'greeting')),
      n('br'),
      t(state, 'comprehension-intro'),
    ]),

    ...c(
      state.comprehensionMessages
      && state.comprehensionMessages.length > 0,
      n('div', {
        class: 'messages',
      }, state.comprehensionMessages.map(
        (message) => n('p', {
          class: 'message-' + message?.role,
        }, message?.content?.split('\n')
          ?.flatMap(
            (content, index, results) =>
              index === results.length - 1
                ? [content]
                : [content, n('br')]
          ),
        ),
      )),
    ),

    ...c(
      state.comprehensionError,
      n('p', state.comprehensionError),
    ),

    ...c(
      state.comprehensionPending,
      n('p', {
        class: 'pending',
      }),
      c(
        state.comprehensionMessages
        && state.comprehensionMessages.length > 0
        && state.comprehensionMessages.length < 3,
        n('textarea', {
          class: 'message-user',
          id: 'input-question',
          keyup: handleInput,
        }, state.comprehensionInput),
      ),
    ),

    n('div', {
      class: 'row reverse',
    }, [
      ...c(
        state.comprehensionMessages
        && state.comprehensionMessages.length > 0
        && state.comprehensionMessages.length < 3,
        n('button', {
          disabled: (
            state.comprehensionPending
            || !state.comprehensionInput
            || state.comprehensionInput.trim().length === 0
          ),
          type: 'button',
          click: handleAnswer,
        }, t(state, 'button-answer')),
        n('button', {
          disabled: state.comprehensionPending,
          type: 'button',
          click: handleGenerate,
        }, t(state, 'button-generate')),
      ),

      ...c(
        state.comprehensionPending
        || (
          state.comprehensionMessages
          && state.comprehensionMessages.length > 0
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
