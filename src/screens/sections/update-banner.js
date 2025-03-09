import {
  conditional as c,
  node as n,
} from '@doars/staark'
import { translate as t } from '../../data/translations.js'

export const updateBanner = (
  state,
) => c(state.appUpdateAvailable, [
  n('button', {
    click: () => window.location.reload(),
  }, t(state, 'banner-update_now')),

  n('div', {
    class: 'margin',
  }),
])
