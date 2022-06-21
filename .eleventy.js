module.exports = (config) => {
  const siteSettings = require('./src/globals/site.json')
  const pluginSafeExternalLinks = require('eleventy-plugin-safe-external-links')
  const eleventyNavigationPlugin = require('@11ty/eleventy-navigation')
  const sprintdata = require('./src/globals/sprintdata.json')
  const excerpt = require('eleventy-plugin-excerpt')
  const Image = require('@11ty/eleventy-img')
  const path = require('path')

  function sprintResultShortcode(year, race) {
    let html = '<div class="result-table">'
    let data = sprintdata.filter(
      (res) =>
        parseInt(res.year, 10) === year &&
        res.race === race &&
        (parseInt(res.pos, 10) < 7 || res.country === 'GBR')
    )
    for (let i = 0; i < data.length; i += 1) {
      switch (data[i].pos) {
        case '1':
        case '2':
        case '3':
          html += `<div><img src="/images/flags/${data[i].pos}.svg"></div>`
          break
        default:
          html += `<div>${data[i].pos}</div>`
      }
      html += `<div>${data[i].name}</div><div>${data[i].country}</div><div><img src="/images/flags/${data[i].country}.png"></div>`
      html += `<div>${data[i].time}</div ><div>${data[i].down}%</div>`
    }

    html += '</div>'
    return html
  }

  async function bannerShortcode(filename, alt, sizes) {
    const src = './src/images/' + filename
    let metadata = await Image(src, {
      widths: [380, 768, 1280],
      formats: ['webp', 'jpeg'],
      outputDir: './src/images/',
      urlPath: '/images',
      dryRun: false,
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src)
        const name = path.basename(src, extension)
        return `${name}-${width}w.${format}`
      },
    })

    let imageAttributes = {
      alt,
      sizes,
    }

    return Image.generateHTML(metadata, imageAttributes)
  }

  async function imageShortcode(filename, alt, sizes) {
    const src = './src/images/' + filename
    let metadata = await Image(src, {
      widths: [null],
      formats: ['webp', 'jpeg'],
      outputDir: './src/images/',
      urlPath: '/images',
      dryRun: false,
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src)
        const name = path.basename(src, extension)
        return `${name}-${width}w.${format}`
      },
    })

    let imageAttributes = {
      alt,
      sizes,
      // loading: 'lazy',
      // decoding: 'async',
    }

    return Image.generateHTML(metadata, imageAttributes)
  }

  config.addNunjucksAsyncShortcode('banner', bannerShortcode)
  config.addNunjucksAsyncShortcode('image', imageShortcode)
  config.addShortcode('sprintResult', sprintResultShortcode)

  config.addFilter('dateDisplay', require('./filters/date-display.js'))
  config.addFilter('slugifyTag', require('./filters/slugify-tag.js'))
  config.addPlugin(eleventyNavigationPlugin)
  config.addPlugin(excerpt, {
    excerptSeparator: '<!--more-->',
  })
  config.addPlugin(pluginSafeExternalLinks, {
    pattern: 'https{0,1}://', // RegExp pattern for external links
    noopener: true, // Whether to include noopener
    noreferrer: false, // Whether to include noreferrer
    files: [
      // What output file extensions to work on
      '.html',
    ],
  })

  config.addShortcode('currentYear', function () {
    return new Date().getFullYear().toString()
  })

  config.addPassthroughCopy({ public: './' })
  config.addPassthroughCopy('src/images')
  config.addPassthroughCopy('src/fonts')
  config.addPassthroughCopy('src/data')
  config.addPassthroughCopy('src/resources')

  config.setBrowserSyncConfig({
    files: ['dist/**/*'],
    open: true,
  })

  config.setDataDeepMerge(true)

  config.addCollection('frontposts', function (collectionApi) {
    // get posts to show on front page
    return collectionApi.getFilteredByTag('frontpost').sort(function (a, b) {
      return a.data.order - b.data.order
    })
  })

  config.addCollection('tags', function (collectionApi) {
    let tagsCollection = new Map()
    let max = 0

    collectionApi.getAll().forEach(function (item) {
      if ('tags' in item.data) {
        for (const tag of item.data.tags) {
          if (tag !== 'post' && tag !== 'article' && tag !== 'frontpost') {
            let number = (tagsCollection.get(tag) || 0) + 1
            max = Math.max(max, number)
            tagsCollection.set(tag, number)
          }
        }
      }
    })

    const minLog = Math.log(1)
    const maxLog = Math.log(max)

    const tags = []
    tagsCollection.forEach((number, tag) => {
      let factor = (Math.log(number) - minLog) / (maxLog - minLog)
      let newTag = {
        tag: tag,
        number: number,
        factor: factor,
        step: Math.ceil(factor * 4) + 1,
      }

      tags.push(newTag)
    })

    tags.sort((a, b) => {
      return a.tag.localeCompare(b.tag, 'en', { ignorePunctuation: true })
    })

    return tags
  })

  return {
    pathPrefix: siteSettings.baseUrl,
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
      layouts: 'includes/layouts',
      data: 'globals',
    },
    passthroughFileCopy: true,
  }
}
