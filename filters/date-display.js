module.exports = (date) =>
  new Date(date).toLocaleDateString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
