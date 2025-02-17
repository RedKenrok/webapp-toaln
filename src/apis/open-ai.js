import { create } from '@doars/vroagn'
import { cloneRecursive } from '../utilities/clone.js'
import { createSingleton } from '../utilities/singleton.js'

export const apiSettings = Object.freeze({
  code: 'open_ai',
  name: 'OpenAI',
  preferredModel: 'gpt-4o-mini',
  requireCredentials: true,
  modelOptionsFilter: model =>
    ![
      'babbage-',
      'dall-e-',
      'davinci-',
      'embedding-',
      'moderation-',
      'tts-',
      'whisper-',
    ].some(keyword => model.id.toLowerCase().includes(keyword))
    && !model.id.match(/-(?:\d){4,}-(?:\d){2,}-(?:\d){2,}$/)
    && !model.id.match(/-(?:\d){4,}$/)
})

const _createMessage = createSingleton(
  () => create({
    method: 'post',
    domain: 'https://api.openai.com',
    path: '/v1/chat/completions',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }),
)
export const createMessage = (
  state,
  messages,
  context = null,
  instructions = null,
) => {
  const appRole = (
    state.apiModel.toLowerCase().includes('o1')
      ? 'developer'
      : 'system'
  )
  // Clone messages.
  messages = cloneRecursive(messages)

  const prependAppRole = (
    message,
  ) => {
    if (message) {
      if (
        messages.length > 0
        && messages[0].role === appRole
      ) {
        messages[0].content = message + ' ' + messages[0].content
      } else {
        messages.unshift({
          role: appRole,
          content: message,
        })
      }
    }
  }
  prependAppRole(instructions)
  // Check context afterwards so the instructions come after the context.
  prependAppRole(context)

  return _createMessage()({
    headers: {
      Authorization: 'Bearer ' + state.apiCredentials,
    },
    body: {
      model: state.apiModel,
      messages: messages,
      user: state.userIdentifier,
    },
  }).then(([error, response, result]) => {
    if (!error) {
      result = result?.choices?.[0]?.message
    }
    return [error, response, result]
  })
}

const _getModels = createSingleton(
  () => create({
    domain: 'https://api.openai.com',
    path: '/v1/models',
    headers: {
      'Accept': 'application/json',
    },
  }),
)
export const getModels = (
  state,
) => _getModels()({
  headers: {
    Authorization: 'Bearer ' + state.apiCredentials,
  },
})
