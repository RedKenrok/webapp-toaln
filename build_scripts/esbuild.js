import { build, context } from 'esbuild'

const run = async (
  options = {},
) => {
  // Ensure formats are set.
  const buildsOptions = [{
    minify: false,
  }]

  for (let buildOptions of buildsOptions) {
    // Setup build options.
    buildOptions = Object.assign({
      entryPoints: null,
      outfile: null,
      format: 'esm',

      bundle: true,
      minify: false,
      sourcemap: false,

      platform: 'browser',
      plugins: [],

      target: process.env.NODE_ENV === 'production' ? [
        // structuredClone. // ?? // Proxy object
        'chrome98', // 'chrome51', // 'chrome49',
        'edge98', // 'edge20', // edge12
        'firefox94', // 'firefox53', // 'firefox39',
        'ios15.4', // 'ios11', // 'ios10.2',
        'safari15.4', // 'safari11', // 'safari10',
      ] : [],
    }, options, buildOptions)
    if (process.env.NODE_ENV === 'production') {
      buildOptions.drop = [
        'console',
        'debugger',
      ]
      buildOptions.minify = true
    } else {
      buildOptions.sourcemap = true
    }

    // Re-assign from and to paths.
    if (buildOptions.from) {
      buildOptions.entryPoints = buildOptions.from
      delete buildOptions.from
    }
    if (buildOptions.to) {
      buildOptions.outfile = buildOptions.to
      delete buildOptions.to
    }

    // Setup file paths.
    if (!Array.isArray[buildOptions.entryPoints]) {
      buildOptions.entryPoints = [buildOptions.entryPoints]
    }

    // Construct target file path.
    const suffixes = []
    if (buildOptions.minify) {
      suffixes.push('min')
    }
    let filePath = buildOptions.outfile.split('.')
    filePath.splice(filePath.length - 1, 0, ...suffixes)
    buildOptions.outfile = filePath = filePath.join('.')

    if (process.env.NODE_ENV === 'production') {
      // Build library.
      try {
        await build(buildOptions)
      } catch {
        console.warn('Error encountered during ESBuild transpiling.')
        return
      }
    } else {
      try {
        await (await context(buildOptions)).watch()
      } catch {
        console.warn('Error encountered during ESBuild transpiling.')
        return
      }
    }
  }
}

export default async (
  files
) => {
  if (!Array.isArray(files)) {
    await run(files)
    return
  }

  for (const file of files) {
    await run(file)
  }
}
