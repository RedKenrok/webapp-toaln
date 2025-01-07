import { promises as fs, existsSync } from 'fs'
import { watch } from 'chokidar'

import Postcss from 'postcss'
import postcssNano from 'cssnano'
import postcssImport from 'postcss-import'
import postcssPresetEnv from 'postcss-preset-env'

import path from 'path'

export default async (
  options = {},
) => {
  // Setup build options with standard plugins.
  const buildsOptions = [Object.assign({
    map: false,
    minify: false,
    plugins: [
      postcssImport(),
    ],
  }, options)]

  for (let buildOptions of buildsOptions) {
    const build = async () => {
      // Retrieve the stylesheets.
      let stylesheet
      try {
        stylesheet = await fs.readFile(options.from, 'utf-8')
      } catch (error) {
        console.error('Unable to retrieve stylesheet from: ' + options.from)
        return
      }

      buildOptions = Object.assign({}, buildOptions)
      // Add additional plugins when running in production.
      if (process.env.NODE_ENV === 'production') {
        buildOptions.minify = true
        buildOptions.plugins = [
          ...buildOptions.plugins,
          postcssPresetEnv(),
          postcssNano(),
        ]
      } else {
        buildOptions.map = {
          annotation: true,
          inline: false,
          prev: false,
          sourcesContent: false,
        }
      }

      // Construct target file path.
      const suffixes = []
      if (process.env.NODE_ENV === 'production') {
        suffixes.push('min')
      }
      let filePath = buildOptions.to.split('.')
      filePath.splice(filePath.length - 1, 0, ...suffixes)
      buildOptions.to = filePath = filePath.join('.')


      let result = null
      try {
        const postcss = new Postcss(buildOptions.plugins)
        result = await postcss.process(stylesheet, buildOptions)
      } catch {
        console.warn('Error encountered during PostCSS transpiling.')
        return
      }

      // Write results to disk.
      const directoryPath = path.dirname(path.resolve(buildOptions.to))
      if (!existsSync(directoryPath)) {
        await fs.mkdir(directoryPath)
      }

      await fs.writeFile(buildOptions.to, result.css, 'utf-8')
      if (result.map) {
        await fs.writeFile(buildOptions.to + '.map', JSON.stringify(result.map), 'utf-8')
      }
    }

    // Build again on changes.
    if (process.env.NODE_ENV === 'production') {
      await build()
    } else {
      let extension = buildOptions.from.split('.')
      extension = extension[extension.length - 1]
      watch('./src/', {
        ignored: (path, stats) => stats?.isFile() && !path.endsWith('.css'),
      })
        .on('add', build)
        .on('change', build)
        .on('unlink', build)
    }
  }
}
