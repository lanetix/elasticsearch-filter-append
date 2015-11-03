var append = require('./append')

module.exports = function (search, filters) {
  append(search, search.filter, filters)
}
