import build from './build_scripts/styles.js'

const files = [{
  from: 'src/app.css',
  to: 'docs/app.css',
}]

for (const file of files) {
  await build(file)
}
