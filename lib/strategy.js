var filterStrategy = require('./filter')
var filteredQueryStrategy = require('./filtered-query')
var queryStrategy = require('./query')

function isFilteredQuery (search) {
  return !!(search.query && search.query.filtered)
}

function isQuery (search) {
  return !!search.query
}

module.exports = function (search) {
  if (isFilteredQuery(search)) {
    return filteredQueryStrategy
  } else if (isQuery(search)) {
    return queryStrategy
  } else {
    return filterStrategy
  }
}
