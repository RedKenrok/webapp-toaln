import {
  conditional as c,
  node as n,
} from '@doars/staark'

import { setScreen } from '../utilities/screen.js'
import { SCREENS } from '../data/screens.js'
import { translate as t } from '../data/translations.js'

const EXCLUDED_KEYS = [
  'screen',

  'appUpdateAvailable',
  'migrateImportError',

  'apiCredentials',
  'apiCredentialsError',
  'apiCredentialsPending',
  'apiCredentialsTested',
]

const handleExport = (
  _,
  state,
) => {
  // Returns a stringified version of the state excluding certain keys.
  const filtered = {}
  for (const key in state) {
    if (!EXCLUDED_KEYS.includes(key)) {
      filtered[key] = state[key]
    }
  }

  // Triggers a file download with the exported state.
  const data = JSON.stringify(filtered)
  const blob = new Blob([data], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const downloadLink = document.createElement('a')
  downloadLink.href = url
  downloadLink.download = 'toaln_export-' + (new Date()).toISOString() + '.json'
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
  URL.revokeObjectURL(url)
}

// Reads the selected file and updates the state.
const handleImport = (
  _,
  state,
) => {
  const input = document.createElement('input')
  input.setAttribute('accept', 'application/json')
  input.setAttribute('hidden', true)
  input.setAttribute('type', 'file')
  input.addEventListener('change', (
    event,
  ) => {
    const file = event.target.files[0]

    if (file) {
      const reader = new FileReader()
      reader.addEventListener('error', () => {
        state.migrateImportError = 'Error reading file.'
      })
      reader.addEventListener('load', () => {
        try {
          const imported = JSON.parse(reader.result)
          // Remove excluded keys from the imported state.
          for (const key of EXCLUDED_KEYS) {
            delete imported[key]
          }
          Object.assign(state, imported)
          // Reset excluded keys back to default.
          for (const key of EXCLUDED_KEYS) {
            delete state[key]
          }
        } catch (error) {
          state.migrateImportError = error.toString()
        }
        location.reload()
      })
      reader.readAsText(file)
    }

    input.remove()

    setScreen(state, SCREENS.setup)
  })

  document.body.appendChild(input)
  input.click()
}

// Handles resetting of the state.
const handleReset = (
  _,
  state,
) => {
  if (!state.migrateReset) {
    state.migrateReset = true
    return
  }

  for (const key in state) {
    delete state[key]
  }
  location.reload()
}

const handleBack = (
  _,
  state,
) => {
  state.migrateReset = false
  setScreen(state, SCREENS.overview)
}

export const migrate = (
  state,
) => [
    n('b', t(state, 'greeting')),

    n('p', t(state, 'migrate-export')),
    n('button', {
      click: handleExport,
      type: 'button',
    }, t(state, 'migrate-export_button')),

    n('p', t(state, 'migrate-import')),
    n('button', {
      click: handleImport,
      type: 'button',
    }, t(state, 'migrate-import_button')),
    ...c(
      state.migrateImportError,
      n('p', {}, state.migrateImportError),
    ),

    n('p', t(state, 'migrate-reset')),
    n('button', {
      click: handleReset,
      type: 'button',
    }, c(
      state.migrateReset,
      t(state, 'migrate-reset_button-confirmation'),
      t(state, 'migrate-reset_button')
    )),

    n('button', {
      click: handleBack,
      type: 'button',
    }, t(state, 'button-go_back')),
  ]
