import { node as n } from '@doars/staark'

import {
  getLanguageFromLocale,
  LOCALE_CODES,
  PROFICIENCY_LEVEL_CODES,
} from '../data/locales.js'
import { SCREENS } from '../data/screens.js'

import { translate as t } from '../data/translations.js'
import {
  APIS,
  getModels,
} from '../apis/apis.js'

const isReady = (state) => {
  return (
    state.apiCode
    && APIS[state.apiCode]
    && (
      !APIS[state.apiCode].requireCredentials
      || state.apiCredentialsTested
    )
    && (state.apiModel ?? APIS[state.apiCode].preferredModel)
  )
}

export const options = (
  state,
) => [
    n('b', t(state, 'greeting')),

    n('label', {
      for: 'select_source_language',
    }, t(state, 'options-source_language')),
    n('select', {
      id: 'select_source_language',
      change: (event) => {
        if (state.sourceLocale !== event.target.selectedOptions[0].value) {
          state.sourceLocale = event.target.selectedOptions[0].value
          state.sourceLanguage = getLanguageFromLocale(state.sourceLocale)
        }
      },
    }, LOCALE_CODES.map(
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
    }, t(state, 'options-target_language')),
    n('select', {
      id: 'select_target_language',
      change: (event) => {
        if (state.targetLocale !== event.target.selectedOptions[0].value) {
          state.targetLocale = event.target.selectedOptions[0].value
          state.targetLanguage = getLanguageFromLocale(state.targetLocale)
        }
      },
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
    }, t(state, 'options-proficiency_leven')),
    n('select', {
      id: 'select_proficiency_level',
      change: (event) => {
        if (state.proficiencyLevel !== event.target.selectedOptions[0].value) {
          state.proficiencyLevel = event.target.selectedOptions[0].value
        }
      },
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
      n('p', t(state, 'proficiency_example-' + state.proficiencyLevel, state.targetLocale)),
    ),

    n('label', {
      for: 'input_topics_of_interest',
    }, t(state, 'options-topics_of_interest')),
    ...state.topicsOfInterest
      .filter(topic => topic)
      .map(
        (topic, index) => n('input', {
          change: (event) => {
            state.topicsOfInterest[index] = event.target.value
          },
          value: topic,
        })
      ),
    n('input', {
      keyup: (event) => {
        if (event.target.value) {
          state.topicsOfInterest.push(event.target.value)
        }
      },
      id: 'input_topics_of_interest',
    }),

    n('label', {
      for: 'select_api_code',
    }, t(state, 'options-api_code')),
    n('select', {
      id: 'select_api_code',
      change: (event) => {
        if (state.apiCode !== event.target.selectedOptions[0].value) {
          state.apiCode = event.target.selectedOptions[0].value
          state.apiCredentialsTested = false
        }
      },
    }, Object.keys(APIS).map(
      apiCode => n('option', {
        selected: (
          state.apiCode === apiCode
            ? 'selected'
            : false
        ),
        value: apiCode,
      }, APIS[apiCode].name),
    )),

    ...(
      APIS[state.apiCode].requireCredentials
        ? [
          n('label', {
            for: 'input-api_credentials',
          }, t(state, 'options-api_credentials')),
          n('textarea', {
            id: 'input-api_credentials',
            change: (event) => {
              state.apiCredentials = event.target.value
            },
            value: state.apiCredentials,
          }),
        ]
        : []
    ),

    n('button', {
      click: () => {
        state.apiCredentialsPending = true
        getModels(state)
          .then(([error, response, result]) => {
            state.apiCredentialsPending = false

            if (error) {
              state.apiCredentialsTested = false
              state.apiCredentialsError = error.toString()
              state.apiModels = null
            } else {
              state.apiCredentialsTested = true
              state.apiCredentialsError = false
              state.apiModels = result
            }
          })
      },
      type: 'button',
    }, [
      t(state, 'options-test_api_credentials'),
      n('span', {
        class: (
          state.apiCredentialsPending
            ? 'pending'
            : ''
        ),
      }),
    ]),

    ...(
      state.apiCredentialsError
        ? [n('p', state.apiCredentialsError)]
        : []
    ),

    ...(
      !state.apiCredentialsTested
        ? [n('p', t(state, 'options-api_credentials_untested')),]
        : [
          n('label', {
            for: 'select_api_model',
          }, t(state, 'options-api_credentials_tested').replace('{%preferredModel%}', APIS[state.apiCode].preferredModelName ?? APIS[state.apiCode].preferredModel)),
          n('select', {
            id: 'select_api_model',
            change: (event) => {
              if (state.apiModel !== event.target.selectedOptions[0].value) {
                state.apiModel = event.target.selectedOptions[0].value
              }
            },
          }, state.apiModels.data
            .filter(APIS[state.apiCode].modelOptionsFilter ?? (() => true))
            .sort((a, b) => a.id.localeCompare(b.id))
            .map(model => n('option', {
              selected: (
                (state.apiModel ?? APIS[state.apiCode].preferredModel) === model.id
                  ? 'selected'
                  : false
              ),
              value: model.id,
            }, model.name ?? model.id))
          ),
        ]
    ),

    n('button', {
      click: () => {
        if (isReady(state)) {
          state.screen = SCREENS.overview
        }
      },
      disabled: !isReady(state),
      type: 'button',
    }, t(state, 'button-go_back'))
  ]