
import {
  apiSettings as apiSettingsAnthropic,
  createMessage as createMessageAnthropic,
  getModels as getModelsAnthropic,
} from './anthropic.js'
import {
  apiSettings as apiSettingsDeepseek,
  createMessage as createMessageDeepseek,
  getModels as getModelsDeepseek,
} from './deepseek.js'
import {
  apiSettings as apiSettingsGoogle,
  createMessage as createMessageGoogle,
  getModels as getModelsGoogle,
} from './google.js'
import {
  apiSettings as apiSettingsOpenAI,
  createMessage as createMessageOpenAI,
  getModels as getModelsOpenAI,
} from './open-ai.js'

export const APIS = Object.freeze({
  anthropic: apiSettingsAnthropic,
  deepseek: apiSettingsDeepseek,
  google: apiSettingsGoogle,
  open_ai: apiSettingsOpenAI,
})

const callApi = (
  lookupTable,
  state,
  ...parameters
) => {
  let method = null
  if (state.apiProvider) {
    method = lookupTable[state.apiProvider]
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
  [APIS.deepseek.code]: createMessageDeepseek,
  [APIS.google.code]: createMessageGoogle,
  [APIS.open_ai.code]: createMessageOpenAI,
}, state, messages, context, instructions)

export const getModels = (
  state,
) => callApi({
  [APIS.anthropic.code]: getModelsAnthropic,
  [APIS.deepseek.code]: getModelsDeepseek,
  [APIS.google.code]: getModelsGoogle,
  [APIS.open_ai.code]: getModelsOpenAI,
}, state)

export const isReady = (
  state,
) => {
  return (
    state.apiProvider
    && APIS[state.apiProvider]
    && (
      !APIS[state.apiProvider]?.requireCredentials
      || state.apiCredentialsTested
    )
    && (state.apiModel ?? APIS[state.apiProvider].preferredModel)
    && state.apiModels?.data?.some(
      (model) => model.id === (state.apiModel ?? APIS[state.apiProvider].preferredModel)
    )
  )
}
