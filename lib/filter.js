var append = require('./append')

module.exports = function (queryClause, filters) {
  append(queryClause, queryClause.filter, filters)
}
