if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register((
    process.env.NODE_ENV === 'production'
      ? './sw.min.js'
      : './sw.js'
  ), {
    scope: './',
  })
}

export const notifyOnUpdate = (
  state,
) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener(
      'message',
      event => {
        switch (event?.data?.type) {
          case 'cacheUpdate':
            state.appUpdateAvailable = true
            break
        }
      },
    )
  }
}
