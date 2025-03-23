import {
  conditional as c,
  node as n,
} from '@doars/staark'

import {
  APIS,
  getModels,
  isReady,
} from '../apis/apis.js'

import {
  getLanguageFromLocale,
  LOCALE_CODES,
  PROFICIENCY_LEVEL_CODES,
  setLangAttribute,
} from '../data/locales.js'
import { SCREENS } from '../data/screens.js'
import {
  translate as t,
  TRANSLATABLE_CODES,
} from '../data/translations.js'

import { setScreen } from '../utilities/screen.js'

const handleSourceLanguage = (
  event,
  state,
) => {
  if (state.sourceLocale !== event.target.selectedOptions[0].value) {
    state.sourceLocale = event.target.selectedOptions[0].value
    state.sourceLanguage = getLanguageFromLocale(state.sourceLocale)
    setLangAttribute(state)
  }
}

const handleTargetLanguage = (
  event,
  state,
) => {
  if (state.targetLocale !== event.target.selectedOptions[0].value) {
    state.targetLocale = event.target.selectedOptions[0].value
    state.targetLanguage = getLanguageFromLocale(state.targetLocale)
  }
}

const handleProficiencyLevel = (
  event,
  state,
) => {
  if (state.proficiencyLevel !== event.target.selectedOptions[0].value) {
    state.proficiencyLevel = event.target.selectedOptions[0].value
  }
}

const handleNewTopic = (
  event,
  state,
) => {
  if (event.target.value) {
    state.topicsOfInterest.push(event.target.value)
  }
}

const handleApiProvider = (
  event,
  state,
) => {
  if (state.apiProvider !== event.target.selectedOptions[0].value) {
    state.apiProvider = event.target.selectedOptions[0].value
    state.apiCredentialsTested = false
  }
}

const handleApiCredentials = (
  event,
  state,
) => {
  if (state.apiCredentials !== event.target.value) {
    state.apiCredentials = event.target.value
  }
}

const handleApiCredentialsTest = (
  _event,
  state,
) => {
  state.apiCredentialsPending = true
  getModels(state)
    .then(([error, _response, result]) => {
      state.apiCredentialsPending = false

      if (error) {
        state.apiCredentialsTested = false
        state.apiCredentialsError = error.toString()
        state.apiModels = null
      } else {
        state.apiCredentialsTested = true
        state.apiCredentialsError = false
        state.apiModels = result
        state.apiModel ??= result?.data.length > 0 ? result.data[0].id : null
      }
    })
}

const handleApiModel = (
  event,
  state,
) => {
  if (state.apiModel !== event.target.selectedOptions[0].value) {
    state.apiModel = event.target.selectedOptions[0].value
  }
}

const handleNext = (
  _event,
  state,
) => {
  if (isReady(state)) {
    setScreen(state, SCREENS.overview)
  }
}

export const setup = (
  state,
) => [
    n('b', t(state, 'greeting')),

    n('label', {
      for: 'select_source_language',
    }, t(state, 'setup-source_language')),
    n('select', {
      id: 'select_source_language',
      change: handleSourceLanguage,
    }, TRANSLATABLE_CODES.map(
      localeCode => n('option', {
        selected: (
          state.sourceLocale === localeCode
            ? 'selected'
            : false
        ),
        value: localeCode,
      }, t(state, localeCode, localeCode))
    )),

    n('label', {
      for: 'select_target_language',
    }, t(state, 'setup-target_language')),
    n('select', {
      id: 'select_target_language',
      change: handleTargetLanguage,
    }, LOCALE_CODES.map(
      localeCode => n('option', {
        selected: (
          state.targetLocale === localeCode
            ? 'selected'
            : false
        ),
        value: localeCode,
      }, t(state, localeCode))
    )),

    n('label', {
      for: 'select_proficiency_level',
    }, t(state, 'setup-proficiency_level')),
    n('select', {
      id: 'select_proficiency_level',
      change: handleProficiencyLevel,
    }, PROFICIENCY_LEVEL_CODES.map(
      proficiencyLevel => n('option', {
        selected: (
          state.proficiencyLevel === proficiencyLevel
            ? 'selected'
            : false
        ),
        value: proficiencyLevel,
      }, t(state, 'proficiency_name-' + proficiencyLevel))
    )),

    n('ul',
      t(state, 'proficiency_description-' + state.proficiencyLevel)
        .map(text => n('li', text))
    ),
    n('blockquote',
      n('p', c(
        TRANSLATABLE_CODES.includes(state.targetLocale),
        t(state, 'proficiency_example-' + state.proficiencyLevel, state.targetLocale),
        t(state, 'proficiency_example-' + state.proficiencyLevel),
      )),
    ),

    n('label', {
      for: 'input_topics_of_interest',
    }, t(state, 'setup-topics_of_interest')),
    ...state.topicsOfInterest
      .map(
        (topic, index) => n('input', {
          keyup: (
            event,
          ) => {
            if (!event.target.value) {
              state.topicsOfInterest.splice(index, 1)
            } else {
              state.topicsOfInterest[index] = event.target.value
            }
          },
          value: topic,
        })
      ),
    n('input', {
      keyup: handleNewTopic,
      id: 'input_topics_of_interest',
    }),

    n('label', {
      for: 'select_api_provider',
    }, t(state, 'setup-api_provider')),
    n('select', {
      id: 'select_api_provider',
      change: handleApiProvider,
    }, Object.keys(APIS).map(
      apiProvider => n('option', {
        selected: (
          state.apiProvider === apiProvider
            ? 'selected'
            : false
        ),
        value: apiProvider,
      }, APIS[apiProvider].name),
    )),

    ...c(
      APIS[state.apiProvider]?.requireCredentials,
      [
        n('label', {
          for: 'input-api_credentials',
        }, t(state, 'setup-api_credentials')),
        n('input', {
          id: 'input-api_credentials',
          keyup: handleApiCredentials,
          type: 'password',
          value: state.apiCredentials,
        }),
      ],
    ),

    n('button', {
      click: handleApiCredentialsTest,
      type: 'button',
    }, [
      t(state, 'setup-test_api_credentials'),
      n('span', {
        class: (
          state.apiCredentialsPending
            ? 'pending'
            : ''
        ),
      }),
    ]),

    ...c(
      state.apiCredentialsError,
      [n('p', state.apiCredentialsError),],
    ),

    ...c(
      !state.apiCredentialsTested,
      [n('p', t(state, 'setup-api_credentials_untested')),],
      [
        n('label', {
          for: 'select_api_model',
        }, t(state, 'setup-api_credentials_tested').replace('{%preferredModel%}', APIS[state.apiProvider]?.preferredModelName ?? APIS[state.apiProvider]?.preferredModel)),
        n('select', {
          id: 'select_api_model',
          change: handleApiModel,
        }, [
          n('option', {
            disabled: true,
            selected: (
              !isReady(state)
                ? 'selected'
                : false
            ),
            value: null,
          }, t(state, 'select_an_option')),

          ...state.apiModels?.data
            ?.filter(APIS[state.apiProvider].modelOptionsFilter ?? (() => true))
            ?.sort((a, b) => a.id.localeCompare(b.id))
            ?.map(model => n('option', {
              selected: (
                (state.apiModel ?? APIS[state.apiProvider].preferredModel) === model.id
                  ? 'selected'
                  : false
              ),
              value: model.id,
            }, model.name ?? model.id))
          ?? []
        ]),
      ],
    ),

    ...c(
      isReady(state),
      [n('p', t(state, 'setup-outro')),],
    ),

    n('button', {
      click: handleNext,
      disabled: !isReady(state),
      type: 'button',
    }, t(state, 'setup-next'))
  ]
