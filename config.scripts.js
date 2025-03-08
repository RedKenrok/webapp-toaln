import build from './build_scripts/scripts.js'

const files = [{
  format: 'iife',
  from: 'src/app.js',
  to: 'docs/app.js',
}, {
  format: 'esm',
  from: 'src/sw.js',
  to: 'docs/sw.js',
}]

for (const file of files) {
  await build(file)
}
