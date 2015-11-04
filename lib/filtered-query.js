var append = require('./append')

module.exports = function (queryClause, filters) {
  append(queryClause.query.filtered, queryClause.query.filtered.filter, filters)
}
