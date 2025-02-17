import {
  apiSettings as apiSettingsOpenAI,
  createMessage as createMessageOpenAI,
  getModels as getModelsOpenAI,
} from './open-ai.js'
import {
  apiSettings as apiSettingsAnthropic,
  createMessage as createMessageAnthropic,
  getModels as getModelsAnthropic,
} from './anthropic.js'

export const APIS = Object.freeze({
  open_ai: apiSettingsOpenAI,
  anthropic: apiSettingsAnthropic,
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
