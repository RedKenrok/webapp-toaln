import build from './build_scripts/postcss.js'

const files = [{
  from: 'src/app.css',
  to: 'dst/app.css',
}]

for (const file of files) {
  await build(file)
}
