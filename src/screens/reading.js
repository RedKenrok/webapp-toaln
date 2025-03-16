import {
  conditional as c,
  node as n,
} from '@doars/staark'

import { createMessage } from '../apis/apis.js'

import { SCREENS } from '../data/screens.js'
import {
  translate as t,
} from '../data/translations.js'

import { setScreen } from '../utilities/screen.js'
import { onActivity } from '../utilities/streak.js'

const handleInput = (
  event,
  state,
) => {
  state.readingInput = event.target.value
}

const handleGenerate = (
  _,
  state,
) => {
  if (!state.readingPending) {
    state.readingError = false
    state.readingMessages = []
    state.readingPending = true

    let instructions = t(state, 'prompt-reading')
    if (
      state.readingInput &&
      state.readingInput.trim().length > 0
    ) {
      state.readingMessages.push({
        role: 'user',
        content: state.readingInput.trim(),
      })
      instructions += ' ' + t(state, 'prompt-reading-topic')
    }

    createMessage(
      state,
      state.readingMessages,
      t(state, 'prompt-context'),
      instructions,
    ).then(([error, _, result]) => {
      state.readingPending = false
      if (error) {
        state.readingError = error.toString()
        return
      }
      state.readingMessages.push(result)
      state.statisticReadingActivity++
      onActivity(state)
    })
  }
}

const handleReset = (
  _,
  state,
) => {
  state.readingError = false
  state.readingInput = ''
  state.readingMessages = []
  state.readingPending = false
  // TODO: Should reset the network requests properly.
}

const handleBack = (
  _,
  state,
) => {
  setScreen(state, SCREENS.overview)
}

export const reading = (
  state,
) => [
    n('p', [
      n('b', t(state, 'greeting')),
      n('br'),
      n('label', {
        for: 'input-topic',
      }, t(state, 'reading-intro')),
    ]),

    n('div', {
      class: 'messages',
    }, [
      ...c(
        state.readingMessages
        && state.readingMessages?.length > 0,
        state.readingMessages?.map(
          (message) => n('p', {
            class: 'message-' + message?.role,
          }, message?.content?.split('\n')
            ?.flatMap(
              (content, index, results) =>
                index === results.length - 1
                  ? [content]
                  : [content, n('br')]
            ),
          )
        ),
        n('textarea', {
          class: 'message-user',
          disabled: state.readingMessages?.length > 0,
          id: 'input-topic',
          input: handleInput,
          placeholder: t(state, 'reading-placeholder'),
        }, state.readingInput || ''),
      ),
    ]),

    ...c(
      state.readingError,
      n('p', state.readingError),
    ),

    ...c(
      state.readingPending,
      n('p', {
        class: 'pending',
      }),
    ),

    n('div', {
      class: 'row reverse',
    }, [
      ...c(
        state.readingPending
        || (
          state.readingMessages
          && state.readingMessages?.length === 0
        ),
        n('button', {
          click: handleGenerate,
          disabled: state.readingPending,
          type: 'button',
        }, t(state, 'button-generate')),
      ),

      ...c(
        state.readingPending
        || (
          state.readingMessages
          && state.readingMessages?.length > 0
        ),
        n('button', {
          type: 'button',
          click: handleReset,
        }, t(state, 'button-reset')),
      ),

      n('button', {
        click: handleBack,
        type: 'button'
      }, t(state, 'button-go_back'))
    ])
  ]
