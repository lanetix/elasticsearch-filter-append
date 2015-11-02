var append = require('./append')

module.exports = function (search, filters) {
  append(search.filter, filters)
}
