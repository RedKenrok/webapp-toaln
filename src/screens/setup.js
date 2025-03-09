import {
  conditional as c,
  node as n,
} from '@doars/staark'

import {
  getLanguageFromLocale,
  LOCALE_CODES,
  PROFICIENCY_LEVEL_CODES,
} from '../data/locales.js'
import { SCREENS } from '../data/screens.js'

import {
  translate as t,
  TRANSLATABLE_CODES,
} from '../data/translations.js'
import {
  APIS,
  getModels,
  isReady,
} from '../apis/apis.js'
import { setScreen } from '../utilities/screen.js'

export const setup = (
  state,
) => [
    n('b', t(state, 'greeting')),

    n('label', {
      for: 'select_source_language',
    }, t(state, 'setup-source_language')),
    n('select', {
      id: 'select_source_language',
      change: (event) => {
        if (state.sourceLocale !== event.target.selectedOptions[0].value) {
          state.sourceLocale = event.target.selectedOptions[0].value
          state.sourceLanguage = getLanguageFromLocale(state.sourceLocale)
        }
      },
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
    }, t(state, 'setup-proficiency_level')),
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
          keyup: (event) => {
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
      keyup: (event) => {
        if (event.target.value) {
          state.topicsOfInterest.push(event.target.value)
        }
      },
      id: 'input_topics_of_interest',
    }),

    n('label', {
      for: 'select_api_code',
    }, t(state, 'setup-api_code')),
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

    ...c(
      APIS[state.apiCode]?.requireCredentials,
      [
        n('label', {
          for: 'input-api_credentials',
        }, t(state, 'setup-api_credentials')),
        n('input', {
          id: 'input-api_credentials',
          keyup: (event) => {
            if (state.apiCredentials !== event.target.value) {
              state.apiCredentials = event.target.value
            }
          },
          type: 'password',
          value: state.apiCredentials,
        }),
      ],
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
              state.apiModel ??= result?.data.length > 0 ? result.data[0].id : null
            }
          })
      },
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
        }, t(state, 'setup-api_credentials_tested').replace('{%preferredModel%}', APIS[state.apiCode]?.preferredModelName ?? APIS[state.apiCode]?.preferredModel)),
        n('select', {
          id: 'select_api_model',
          change: (event) => {
            if (state.apiModel !== event.target.selectedOptions[0].value) {
              state.apiModel = event.target.selectedOptions[0].value
            }
          },
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
            ?.filter(APIS[state.apiCode].modelOptionsFilter ?? (() => true))
            ?.sort((a, b) => a.id.localeCompare(b.id))
            ?.map(model => n('option', {
              selected: (
                (state.apiModel ?? APIS[state.apiCode].preferredModel) === model.id
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
      click: () => {
        if (isReady(state)) {
          setScreen(state, SCREENS.overview)
        }
      },
      disabled: !isReady(state),
      type: 'button',
    }, t(state, 'setup-next'))
  ]
