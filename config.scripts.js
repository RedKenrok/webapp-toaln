import build from './build_scripts/esbuild.js'

const files = [{
  format: 'iife',
  from: 'src/app.js',
  to: 'docs/app.js',
}]

for (const file of files) {
  await build(file)
}
