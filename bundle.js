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
        define: {
          'process.env.NODE_ENV': "'development'",
        },
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
  entryPoints: 'apps/home/app.css',
  outfile: 'docs/app.css',
}, {
  entryPoints: 'apps/home/app.js',
  outfile: 'docs/app.js',
}, {
  entryPoints: 'apps/schrievn/app.css',
  outfile: 'docs/schrievn/app.css',
}, {
  format: 'iife',
  entryPoints: 'apps/schrievn/app.js',
  outfile: 'docs/schrievn/app.js',
}, {
  entryPoints: 'apps/schrievn/sw.js',
  outfile: 'docs/schrievn/sw.js',
}, {
  entryPoints: 'apps/toaln/app.css',
  outfile: 'docs/toaln/app.css',
}, {
  format: 'iife',
  entryPoints: 'apps/toaln/app.js',
  outfile: 'docs/toaln/app.js',
}, {
  entryPoints: 'apps/toaln/sw.js',
  outfile: 'docs/toaln/sw.js',
})
