import {
  conditional as c,
  node as n,
} from '@doars/staark'

import { createMessage } from '../apis/apis.js'

import { translate as t } from '../data/translations.js'
import { SCREENS } from '../data/screens.js'

import { onActivity } from '../utilities/streak.js'
import { setScreen } from '../utilities/screen.js'

const handleInput = (
  event,
  state,
) => {
  state.vocabularyInput = event.target.value
}

const handleAnswer = (
  _event,
  state,
) => {
  if (
    !state.vocabularyPending
    && state.vocabularyInput
    && state.vocabularyInput.trim().length > 0
  ) {
    state.vocabularyError = false
    state.vocabularyPending = true
    state.vocabularyMessages.push({
      role: 'user',
      content: state.vocabularyInput.trim(),
    })
    state.vocabularyInput = ''
    createMessage(
      state,
      state.vocabularyMessages,
      t(state, 'prompt-context'),
      t(state, 'prompt-vocabulary-follow_up'),
    ).then(([error, _response, result]) => {
      state.vocabularyPending = false
      if (error) {
        state.vocabularyError = error.toString()
        const message = state.vocabularyMessages.pop()
        state.vocabularyInput = message.content
        return
      }
      state.vocabularyMessages.push(result)
      state.statisticVocabularyActivity++
      onActivity(state)
    })
  }
}

const handleGenerate = (
  _event,
  state,
) => {
  if (!state.vocabularyPending) {
    state.vocabularyError = false
    state.vocabularyMessages = []
    state.vocabularyPending = true
    createMessage(
      state,
      [],
      t(state, 'prompt-context'),
      t(state, 'prompt-vocabulary'),
    ).then(([error, _response, result]) => {
      state.vocabularyPending = false
      if (error) {
        state.vocabularyError = error.toString()
        return
      }
      state.vocabularyMessages.push(result)
    })
  }
}

const handleReset = (
  _event,
  state,
) => {
  state.vocabularyError = false
  state.vocabularyMessages = []
  state.vocabularyPending = false
  // TODO: Should reset the network requests properly.
}

const handleBack = (
  _event,
  state,
) => {
  setScreen(state, SCREENS.overview)
}

export const vocabulary = (
  state,
) => [
    n('p', [
      n('b', t(state, 'greeting')),
      n('br'),
      t(state, 'vocabulary-intro'),
    ]),

    ...c(
      state.vocabularyMessages
      && state.vocabularyMessages.length > 0,
      n('div', {
        class: 'messages'
      }, state.vocabularyMessages.map((message) =>
        n('p', {
          class: 'message-' + message?.role
        }, message?.content?.split('\n')
          ?.flatMap((content, index, results) =>
            index === results.length - 1
              ? [content]
              : [content, n('br')]
          ),
        ),
      )),
    ),

    ...c(
      state.vocabularyError,
      n('p', state.vocabularyError),
    ),

    ...c(
      state.vocabularyPending,
      n('p', {
        class: 'pending',
      }),
      c(
        state.vocabularyMessages
        && state.vocabularyMessages.length > 0
        && state.vocabularyMessages.length < 3,
        n(
          'textarea',
          {
            class: 'message-user',
            id: 'input-question',
            keyup: handleInput,
          },
          state.vocabularyInput
        )
      )
    ),

    n('div', {
      class: 'row reverse',
    }, [
      ...c(
        state.vocabularyMessages
        && state.vocabularyMessages.length > 0
        && state.vocabularyMessages.length < 3,
        n('button', {
          disabled:
            state.vocabularyPending
            || !state.vocabularyInput
            || state.vocabularyInput.trim().length === 0,
          type: 'button',
          click: handleAnswer,
        }, t(state, 'button-answer')),
        n('button', {
          disabled: state.vocabularyPending,
          type: 'button',
          click: handleGenerate,
        }, t(state, 'button-generate'))
      ),

      ...c(
        state.vocabularyPending
        || (
          state.vocabularyMessages
          && state.vocabularyMessages.length > 0
        ),
        n('button', {
          click: handleReset,
          type: 'button',
        }, t(state, 'button-reset'))
      ),

      n('button', {
        click: handleBack,
        type: 'button',
      }, t(state, 'button-go_back')),
    ]),
  ]
