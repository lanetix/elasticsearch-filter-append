var builderStrategy = require('./lib/strategy')
var toArray = require('lodash.toarray')
var clone = require('lodash.clone')
var isArray = require('lodash.isarray')

function validateQueryClause (queryClause) {
  if (!queryClause) {
    throw new TypeError('queryClause is required')
  }

  if (!queryClause.filter && !queryClause.query) {
    throw new Error('invalid queryClause. one of queryClause.filter or queryClause.query is required.')
  }

  if (queryClause.query && queryClause.query.filtered && (!queryClause.query.filtered.query || !queryClause.query.filtered.filter)) {
    throw new Error('filtered queries require a filter and a query')
  }
}

function FilterBuilder (queryClause) {
  validateQueryClause(queryClause)

  this._queryClause = clone(queryClause)
}

FilterBuilder.prototype.append = function () {
  var strategy = builderStrategy(this._queryClause)
  var filters = isArray(arguments[0]) && arguments.length === 1 ? arguments[0] : toArray(arguments)

  if (!filters.length) {
    throw new Error('a minimum of one filter is required')
  }

  strategy(this._queryClause, filters)

  return this
}

FilterBuilder.prototype.toQueryClause = function () {
  return this._queryClause
}

module.exports = FilterBuilder
