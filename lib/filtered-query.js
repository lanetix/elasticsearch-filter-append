var append = require('./append')

module.exports = function (search, filters) {
  append(search.query.filtered, search.query.filtered.filter, filters)
}
