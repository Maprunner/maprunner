const Image = require('@11ty/eleventy-img')
const path = require('path')
const fs = require('fs')

;(async () => {
  const files = fs.readdirSync('./src/images')
  const format = 'jpg'
  for (const filename of files) {
    if (filename.substring(filename.length - 3) !== format) {
      continue
    }
    const src = './src/images/' + filename

    let metadata = await Image(src, {
      widths: [null],
      formats: ['jpeg'],
      outputDir: './dist/temp/',
      urlPath: '/images',
      dryRun: false,
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src)
        const name = path.basename(src, extension)
        // return `${name}-${width}w.${format}`
        return `${name}.${format}`
      },
    })

    console.log(metadata)
  }
})()
