var filterStrategy = require('./filter')
var filteredQueryStrategy = require('./filtered-query')
var queryStrategy = require('./query')

function isFilteredQuery (queryClause) {
  return !!(queryClause.query && queryClause.query.filtered)
}

function isQuery (queryClause) {
  return !!queryClause.query
}

module.exports = function (queryClause) {
  if (isFilteredQuery(queryClause)) {
    return filteredQueryStrategy
  } else if (isQuery(queryClause)) {
    return queryStrategy
  } else {
    return filterStrategy
  }
}
