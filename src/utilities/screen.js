import { SCREENS } from '../data/screens.js'

const screenOptions = Object.values(SCREENS)

export const setScreen = (
  state,
  screen,
) => {
  if (
    screen
    && state.screen !== screen
    && screenOptions.includes(screen)
  ) {
    // Only story history state if not originating from the setup.
    if (state.screen !== SCREENS.setup) {
      // Push the new screen state to the history API
      window.history.pushState({
        screen: screen,
      }, '', '?screen=' + screen)
    }

    state.screen = screen
  }
}

// Listen for history changes and update the screen accordingly.
export const handleHistory = (
  state,
) => {
  window.addEventListener('popstate', (
    event,
  ) => {
    const screen = (
      event.state
      && event.state.screen
    )
    // Don't allow the user to go back to the setup screen.
    if (screen === SCREENS.setup) {
      return false
    }

    if (
      screen
      && state.screen !== screen
      && screenOptions.includes(screen)
    ) {
      state.screen = screen
    }
  })
}
