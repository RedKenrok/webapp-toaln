import {
  mount,
  node as n,
} from '@doars/staark'

mount(
  document.body.appendChild(
    document.createElement('div'),
  ),
  (state) => n('div', [
    n('h1', 'Apps'),
    n('ul', state.apps
      .filter(
        app =>
          app.published
          || process.env.NODE_ENV !== 'production'
      )
      .map(
        app =>
          n('li', n('a', {
            href: (
              app.path
              + (
                process.env.NODE_ENV === 'production'
                  ? '/'
                  : '/develop.html'
              )
            ),
          }, app.title))
      )),
  ]),
  {
    apps: [{
      path: 'toaln',
      published: true,
      title: 'Toaln',
    }]
  },
)
