import {
  build,
  context,
} from 'esbuild'

const isProduction = process.env.NODE_ENV === 'production'

const bundle = (
  ...builds
) => {
  // For production add additional builds.
  if (isProduction) {
    const buildCount = builds.length
    for (let i = 0; i < buildCount; i++) {
      const options = Object.assign({}, builds[i], {
        define: {
          'process.env.NODE_ENV': "'production'",
        },
        drop: [
          'console',
          'debugger',
        ],
        minify: true,
        sourcemap: false,
        target: [
          // Smaller size // Proxy object
          'chrome51', // 49
          'edge20', // 12
          'firefox53', // 39
          'ios11', // 10.2
          'safari11', // 10
        ],
      })

      // Append min suffix to file name for minified builds.
      const suffixes = []
      if (options.minify) {
        suffixes.push('min')
      }
      let filePath = options.outfile.split('.')
      filePath.splice(filePath.length - 1, 0, ...suffixes)
      options.outfile = filePath = filePath.join('.')

      builds.push(options)
    }
  }

  return Promise.all(
    builds.map(options => {
      if (
        !options.entryPoints
        || !options.outfile
      ) {
        console.warn('Bundle options are missing entryPoints or outfile properties.')
        return
      }

      options = Object.assign({
        bundle: true,
        format: 'esm',
        minify: false,
        platform: 'browser',
        sourcemap: true,
      }, options)

      if (!Array.isArray(options.entryPoints)) {
        options.entryPoints = [options.entryPoints,]
      }

      try {
        if (isProduction) {
          return build(options)
        } else {
          return context(options)
            .then(context => context.watch())
        }
      } catch (error) {
        console.warn('Error encountered during building.', error)
      }
    })
  )
}

await bundle({
  entryPoints: 'src/app.css',
  outfile: 'docs/app.css',
}, {
  format: 'iife',
  entryPoints: 'src/app.js',
  outfile: 'docs/app.js',
}, {
  entryPoints: 'src/sw.js',
  outfile: 'docs/sw.js',
})
