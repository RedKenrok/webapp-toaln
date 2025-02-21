import { promises as fs, existsSync } from 'fs'
import { watch } from 'chokidar'
import { bundleAsync } from 'lightningcss'
import path from 'path'
import { targets } from './targets.js'

export default async (
  options = {},
) => {
  const build = async () => {
    try {
      const buildOptions = {
        filename: options.from,
        targets: targets,

        includeSources: false,
        minify: false,
        sourceMap: false,
      }
      if (process.env.NODE_ENV === 'production') {
        buildOptions.includeSources = true
        buildOptions.minify = true
        buildOptions.sourceMap = true
      }

      const result = await bundleAsync(buildOptions)

      // Construct target file path.
      const suffixes = []
      if (buildOptions.minify) {
        suffixes.push('min')
      }
      let filePath = options.to
      filePath = filePath.split('.')
      filePath.splice(filePath.length - 1, 0, ...suffixes)
      filePath = filePath.join('.')

      const directoryPath = path.dirname(path.resolve(filePath))
      if (!existsSync(directoryPath)) {
        await fs.mkdir(directoryPath, {
          recursive: true,
        })
      }

      await fs.writeFile(filePath, result.code, 'utf-8')
      if (
        process.env.NODE_ENV !== 'production'
        && result.map
      ) {
        await fs.writeFile(filePath + '.map', result.map.toString(), 'utf-8')
      }
    } catch (error) {
      console.error('Error during LightningCSS build:', error)
    }
  }

  if (process.env.NODE_ENV === 'production') {
    await build()
  } else {
    watch('./src/', {
      ignored: (filePath, stats) => (
        stats?.isFile()
        && !filePath.endsWith('.css')
      ),
    })
      .on('add', build)
      .on('change', build)
      .on('unlink', build)
  }
}
