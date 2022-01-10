// generate slug for tag
var slugModule = require('slug')
let memoizedSlugs = {}

module.exports = (string) => {
  if (string in memoizedSlugs) {
    return memoizedSlugs[string]
  } else {
    let slug = slugModule(string)
    memoizedSlugs[string] = slug
    return slug
  }
}
