// TODO: Should register sw.min.js in production builds.
navigator.serviceWorker.register('sw.js', {
  scope: '/',
});
