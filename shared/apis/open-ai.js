import { create } from '@doars/vroagn'
import { cloneRecursive } from '../utilities/clone.js'
import { callOnce } from '../utilities/singleton.js'

export const apiSettings = Object.freeze({
  code: 'open_ai',
  name: 'OpenAI',
  preferredModel: 'gpt-4.1-mini',
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
    && !model.id.match(/-(?:\d){4}$/)
    && !model.id.match(/-(?:\d){4}-(?:\d){2}-(?:\d){2}$/)
})

const _createMessage = callOnce(
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
  // Use 'system' role for OpenAI API models that contain '4o' or '3.5'.
  const appRole = (
    (state.apiModel ?? apiSettings.preferredModel).toLowerCase().match(/4o|3\.5/)
      ? 'system'
      : 'developer'
  )

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
      model: state.apiModel ?? apiSettings.preferredModel,
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

const _getModels = callOnce(
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
