/* globals it, describe */

var FilterBuilder = require('../index')
var should = require('should')

describe('filter append', function () {
  it('should convert a query to a filtered query', function () {
    var queryClause = require('./scenarios/query.json').queryClause
    var filter = require('./scenarios/query.json').filter
    var output = require('./scenarios/query.json').output

    var builder = new FilterBuilder(queryClause)

    builder.append(filter)

    should(builder.toQueryClause()).deepEqual(output)
  })

  it('should convert a bool must filter with a single object to an array of filters', function () {
    var queryClause = require('./scenarios/bool-must-single-object.json').queryClause
    var filter = require('./scenarios/bool-must-single-object.json').filter
    var output = require('./scenarios/bool-must-single-object.json').output

    var builder = new FilterBuilder(queryClause)

    builder.append(filter)

    should(builder.toQueryClause()).deepEqual(output)
  })

  it('should convert a filtered query\'s bool must filter with a single object to an array of filters', function () {
    var queryClause = require('./scenarios/filtered-query-bool-must-single-object.json').queryClause
    var filter = require('./scenarios/filtered-query-bool-must-single-object.json').filter
    var output = require('./scenarios/filtered-query-bool-must-single-object.json').output

    var builder = new FilterBuilder(queryClause)

    builder.append(filter)

    should(builder.toQueryClause()).deepEqual(output)
  })

  it('should append directly to a bool must filter when it is an array of filters', function () {
    var queryClause = require('./scenarios/bool-must-array.json').queryClause
    var filter = require('./scenarios/bool-must-array.json').filter
    var output = require('./scenarios/bool-must-array.json').output

    var builder = new FilterBuilder(queryClause)

    builder.append(filter)

    should(builder.toQueryClause()).deepEqual(output)
  })

  it('should append directly to a filtered query\'s bool must filter when it is an array of filters', function () {
    var queryClause = require('./scenarios/filtered-query-bool-must-array.json').queryClause
    var filter = require('./scenarios/filtered-query-bool-must-array.json').filter
    var output = require('./scenarios/filtered-query-bool-must-array.json').output

    var builder = new FilterBuilder(queryClause)

    builder.append(filter)

    should(builder.toQueryClause()).deepEqual(output)
  })

  it('should convert a bool should filter to a must filter', function () {
    var queryClause = require('./scenarios/bool-should.json').queryClause
    var filter = require('./scenarios/bool-should.json').filter
    var output = require('./scenarios/bool-should.json').output

    var builder = new FilterBuilder(queryClause)

    builder.append(filter)

    should(builder.toQueryClause()).deepEqual(output)
  })

  it('should convert a filtered querie\'s bool should filter to a must filter', function () {
    var queryClause = require('./scenarios/filtered-query-bool-should.json').queryClause
    var filter = require('./scenarios/filtered-query-bool-should.json').filter
    var output = require('./scenarios/filtered-query-bool-should.json').output

    var builder = new FilterBuilder(queryClause)

    builder.append(filter)

    should(builder.toQueryClause()).deepEqual(output)
  })

  it('should convert a simple filter to a must filter', function () {
    var queryClause = require('./scenarios/simple-filter.json').queryClause
    var filter = require('./scenarios/simple-filter.json').filter
    var output = require('./scenarios/simple-filter.json').output

    var builder = new FilterBuilder(queryClause)

    builder.append(filter)

    should(builder.toQueryClause()).deepEqual(output)
  })

  it('should convert a filtered query\'s simple filter to a must filter', function () {
    var queryClause = require('./scenarios/filtered-query-simple-filter.json').queryClause
    var filter = require('./scenarios/filtered-query-simple-filter.json').filter
    var output = require('./scenarios/filtered-query-simple-filter.json').output

    var builder = new FilterBuilder(queryClause)

    builder.append(filter)

    should(builder.toQueryClause()).deepEqual(output)
  })

  it('should support appending an array of filters', function () {
    var queryClause = require('./scenarios/simple-filter.json').queryClause
    var filter = require('./scenarios/simple-filter.json').filter
    var output = require('./scenarios/simple-filter.json').output

    var builder = new FilterBuilder(queryClause)

    builder.append([filter])

    should(builder.toQueryClause()).deepEqual(output)
  })

  it('should throw if no filters are provided', function () {
    var queryClause = {
      filter: {}
    }

    var builder = new FilterBuilder(queryClause)
    var append = function () { builder.append() }

    should(append).throw()
  })

  it('should throw if an invalid bool filter is provided', function () {
    var queryClause = {
      filter: {
        bool: {
          fredoSanta: 'Chi-Raq'
        }
      }
    }

    var builder = new FilterBuilder(queryClause)
    var append = function () { builder.append({}) }

    should(append).throw()
  })

  it('should throw if.queryClause is not provided', function () {
    var builder = function () { return new FilterBuilder(undefined) }

    should(builder).throw()
  })

  it('should throw if a query and filter are not provided', function () {
    var builder = function () { return new FilterBuilder({}) }

    should(builder).throw()
  })

  it('should throw if a filtered query does not contain a filter', function () {
    var queryClause = {
      query: {
        filtered: {
          query: {}
        }
      }
    }

    var builder = function () { return new FilterBuilder(queryClause) }

    should(builder).throw()
  })

  it('should throw if a filtered query does not contain a query', function () {
    var queryClause = {
      query: {
        filtered: {
          filter: {}
        }
      }
    }

    var builder = function () { return new FilterBuilder(queryClause) }

    should(builder).throw()
  })

  it('should support chaining', function () {
    var queryClause = require('./scenarios/query-chaining.json').queryClause
    var filter = require('./scenarios/query-chaining.json').filter
    var output = require('./scenarios/query-chaining.json').output

    var builder = new FilterBuilder(queryClause)

    builder.append(filter).append(filter)

    should(builder.toQueryClause()).deepEqual(output)
  })
})
