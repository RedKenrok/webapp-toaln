import {
  createMessage as createMessageOpenAI,
  getModels as getModelsOpenAI,
} from './open-ai.js'
import {
  createMessage as createMessageAnthropic,
  getModels as getModelsAnthropic,
} from './anthropic.js'

export const APIS = Object.freeze({
  open_ai: {
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
      && !model.id.match(/-(?:\d){4,}$$/)
  },
  anthropic: {
    code: 'anthropic',
    name: 'Anthropic',
    preferredModel: 'claude-3-5-haiku-20241022',
    preferredModelName: 'Claude 3.5 Haiku',
    requireCredentials: true,
    modelOptionsFilter: model =>
      ![
        '(old)',
      ].some(keyword => model.name.toLowerCase().includes(keyword))
  },
})

const callApi = (
  lookupTable,
  state,
  ...parameters
) => {
  let method = null
  if (state.apiCode) {
    method = lookupTable[state.apiCode]
  }
  if (method) {
    return method(state, ...parameters)
  }
  return Promise.resolve(
    [new Error('No api selected.'), null, null],
  )
}

export const createMessage = (
  state,
  messages,
  context = null,
  instructions = null,
) => callApi({
  [APIS.anthropic.code]: createMessageAnthropic,
  [APIS.open_ai.code]: createMessageOpenAI,
}, state, messages, context, instructions)

export const getModels = (
  state,
) => callApi({
  [APIS.anthropic.code]: getModelsAnthropic,
  [APIS.open_ai.code]: getModelsOpenAI,
}, state)
