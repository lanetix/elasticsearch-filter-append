var builderStrategy = require('./lib/strategy')
var toArray = require('lodash.toarray')
var clone = require('lodash.clone')
var isArray = require('lodash.isarray')

function validateSearch (search) {
  if (!search) {
    throw new TypeError('search is required')
  }

  if (!search.filter && !search.query) {
    throw new Error('invalid search. one of search.filter or search.query is required.')
  }

  if (search.filter && search.query) {
    throw new Error('search.filter and search.query are mutually exclusive. use a filtered query to combine the two')
  }

  if (search.query && search.query.filtered && (!search.query.filtered.query || !search.query.filtered.filter)) {
    throw new Error('filtered queries require a filter and a query')
  }
}

function FilterBuilder (search) {
  validateSearch(search)

  this._search = clone(search)
}

FilterBuilder.prototype.append = function () {
  var strategy = builderStrategy(this._search)
  var filters = isArray(arguments[0]) && arguments.length === 1 ? arguments[0] : toArray(arguments)

  if (!filters.length) {
    throw new Error('a minimum of one filter is required')
  }

  strategy(this._search, filters)

  return this
}

FilterBuilder.prototype.toSearch = function () {
  return this._search
}

module.exports = FilterBuilder
