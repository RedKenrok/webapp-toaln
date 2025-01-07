import { create } from '@doars/vroagn'
import { cloneRecursive } from '../utilities/clone.js'
import { createSingleton } from '../utilities/singleton.js'

const _createMessage = createSingleton(
  () => create({
    credentials: 'same-origin',
    domain: 'https://api.anthropic.com',
    method: 'post',
    mode: 'cors',
    path: '/v1/messages',
    headers: {
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'anthropic-dangerous-direct-browser-access': 'true',
      'anthropic-version': '2023-06-01',
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
  messages = cloneRecursive(messages)
  if (instructions) {
    messages.unshift({
      role: 'user',
      content: instructions,
    })
  }

  return _createMessage()({
    headers: {
      'x-api-key': state.apiCredentials,
    },
    body: {
      model: state.apiModel,
      messages: messages,
      system: context,
    },
  }).then(([error, response, result]) => {
    if (!error) {
      result = {
        role: 'assistant',
        content: result?.content?.[0].text,
      }
    }
    return [error, response, result]
  })
}

const _getModels = createSingleton(
  () => create({
    credentials: 'same-origin',
    domain: 'https://api.anthropic.com',
    mode: 'cors',
    path: '/v1/models',
    headers: {
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'anthropic-dangerous-direct-browser-access': 'true',
      'anthropic-version': '2023-06-01',
    },
  }),
)
export const getModels = (
  state,
) => {
  return _getModels()({
    headers: {
      'x-api-key': state.apiCredentials,
    },
  }).then(([error, response, result]) => {
    if (!error) {
      result.data = result.data.map(item => {
        return {
          ...item,
          name: item.display_name,
        }
      })
    }
    return [error, response, result]
  })
}