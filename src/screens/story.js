import {
  conditional as c,
  node as n,
} from '@doars/staark'
import { translate as t } from '../data/translations.js'
import { SCREENS } from '../data/screens.js'
import { createMessage } from '../apis/apis.js'
import { onActivity } from '../utilities/streak.js'
import {
  randomBool,
  randomItem,
} from '../utilities/random.js'

export const story = (
  state,
) => [
    n('p', [
      n('b', t(state, 'greeting')),
      n('br'),
      t(state, 'story-intro'),
    ]),

    ...c(
      state.storyMessages
      && state.storyMessages.length > 0,
      n('div', {
        class: 'messages',
      }, state.storyMessages.map(
        (message) => n('p', {
          class: 'message-' + message.role
        }, message.content.split('\n').flatMap(
          (content, index, results) =>
            index === results.length - 1 ? [content] : [content, n('br')]
        )),
      )),
    ),

    ...c(
      state.storyError,
      n('p', state.storyError),
    ),

    ...c(
      state.storyPending,
      n('p', {
        class: 'pending',
      }),
      c(
        state.storyMessages
        && state.storyMessages.length > 0,
        n('textarea', {
          class: 'message-user',
          id: 'input-question',
          keyup: (event) => {
            state.storyInput = event.target.value
          },
        }, state.storyInput),
      ),
    ),

    n('div', {
      class: 'row reverse',
    }, [
      ...c(
        state.storyMessages
        && state.storyMessages.length > 0
        && !state.storyStopped,
        n('button', {
          disabled: (
            state.storyPending
            || !state.storyInput
            || state.storyInput.trim().length === 0
          ),
          type: 'button',
          click: () => {
            if (
              !state.storyPending
              && state.storyInput
              && state.storyInput.trim().length > 0
            ) {
              state.storyError = false
              state.storyPending = true
              state.storyMessages.push({
                role: 'user',
                content: state.storyInput.trim(),
              })
              state.storyInput = ''
              createMessage(
                state,
                state.storyMessages,
                t(state, 'prompt-context'),
                t(state, 'prompt-story-follow_up'),
              ).then(([error, response, result]) => {
                state.storyPending = false
                if (error) {
                  state.storyError = error.toString()
                  const message = state.storyMessages.pop()
                  state.storyInput = message.content
                  return
                }
                if (result.content.endsWith('STOP')) {
                  state.storyStopped = true
                }
                state.storyMessages.push(result)
                state.statisticStoryActivity++
                onActivity(state)
              })
            }
          },
        }, t(state, 'button-reply')),
        n('button', {
          disabled: state.storyPending,
          type: 'button',
          click: () => {
            if (!state.storyPending) {
              state.storyError = false
              state.storyMessages = []
              state.storyPending = true
              createMessage(
                state,
                [],
                t(state, 'prompt-context'),
                t(state, 'prompt-story') + (
                  randomBool(10)
                    ? t(state, 'prompt-topic')
                      .replace('{%topic%}', randomItem(
                        state.topicsOfInterest.filter(topic => topic)
                      ))
                    : ''
                ),
              ).then(([error, response, result]) => {
                state.storyPending = false
                if (error) {
                  state.storyError = error.toString()
                  return
                }
                state.storyMessages.push(result)
              })
            }
          },
        }, t(state, 'button-generate')),
      ),

      ...c(
        state.storyPending
        || (
          state.storyMessages
          && state.storyMessages.length > 0
        ),
        n('button', {
          click: () => {
            state.storyError = false
            state.storyMessages = []
            state.storyPending = false
            state.storyStopped = false
            // TODO: Should reset the network requests properly.
          },
          type: 'button',
        }, t(state, 'button-reset')),
      ),

      n('button', {
        click: () => {
          state.screen = SCREENS.overview
        },
        type: 'button',
      }, t(state, 'button-go_back')),
    ])
  ]
