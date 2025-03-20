import { promises as fs, existsSync } from 'fs'
import http from 'http'
import path from 'path'
import url from 'url'

const getMimeType = function (
  filePath,
) {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case '.html':
    case '.htm':
      return 'text/html'
    case '.js':
      return 'application/javascript'
    case '.css':
      return 'text/css'
    case '.json':
      return 'application/json'
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.gif':
      return 'image/gif'
    case '.svg':
      return 'image/svg+xml'
    case '.pdf':
      return 'application/pdf'
    case '.txt':
      return 'text/plain'
    case '.xml':
      return 'application/xml'
    case '.zip':
      return 'application/zip'
    case '.mp3':
      return 'audio/mpeg'
    case '.mp4':
      return 'video/mp4'
    case '.wav':
      return 'audio/wav'
    case '.ogg':
      return 'audio/ogg'
    case '.webm':
      return 'video/webm'
    case '.ico':
      return 'image/x-icon'
    case '.ttf':
      return 'font/ttf'
    case '.otf':
      return 'font/otf'
    case '.woff':
      return 'font/woff'
    case '.woff2':
      return 'font/woff2'
    default:
      return 'application/octet-stream'
  }
}

const getFile = async function (
  filePath,
) {
  try {
    if (!existsSync(filePath)) {
      return [404, new Error('Not Found'), null]
    }

    let stats = await fs.stat(filePath)
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }

    const data = await fs.readFile(filePath)
    return [200, null, data]
  } catch (error) {
    return [500, error, null]
  }
}

const serve = function (
  options = {},
) {
  const { port, directory } = Object.assign({
    port: 3000,
    directory: process.cwd(),
  }, options)
  const server = http.createServer(
    async (
      request,
      response,
    ) => {
      const parsedUrl = url.parse(request.url)
      let pathname = decodeURIComponent(parsedUrl.pathname)
      let filePath = path.join(directory, pathname)

      const [status, error, data] = await getFile(filePath)
      if (error) {
        if (status === 404) {
          response.statusCode = 404
          response.end('404 Not Found')

          console.log('GET 404: ' + filePath)
        } else {
          response.statusCode = 500
          response.end('500 Internal Server Error')

          console.log('GET 500: ' + filePath + ' (' + error.toString() + ')')
        }
      } else if (status === 200) {
        response.statusCode = 200
        response.setHeader('Content-Type', getMimeType(filePath))
        response.end(data)

        console.log('GET 200: ' + filePath)
      }
    },
  )

  server.listen(port, () => {
    console.log('Server running on port: ' + port)
  })
}

serve({
  directory: 'docs',
})
