navigator.serviceWorker.register((
  process.env.NODE_ENV === 'production'
    ? './sw.min.js'
    : './sw.js'
), {
  scope: './',
});
