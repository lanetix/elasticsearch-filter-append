/* globals it, describe */

var FilterBuilder = require('../index')
var should = require('should')

describe('filter append', function () {
  it('should convert a query to a filtered query', function () {
    var search = require('./scenarios/query.json').search
    var filter = require('./scenarios/query.json').filter
    var output = require('./scenarios/query.json').output

    var builder = new FilterBuilder(search)

    builder.append(filter)

    should(builder.toSearch()).deepEqual(output)
  })

  it('should convert a bool must filter with a single object to an array of filters', function () {
    var search = require('./scenarios/bool-must-single-object.json').search
    var filter = require('./scenarios/bool-must-single-object.json').filter
    var output = require('./scenarios/bool-must-single-object.json').output

    var builder = new FilterBuilder(search)

    builder.append(filter)

    should(builder.toSearch()).deepEqual(output)
  })

  it('should append directly to a bool must filter when it is an array of filters', function () {
    var search = require('./scenarios/bool-must-array.json').search
    var filter = require('./scenarios/bool-must-array.json').filter
    var output = require('./scenarios/bool-must-array.json').output

    var builder = new FilterBuilder(search)

    builder.append(filter)

    should(builder.toSearch()).deepEqual(output)
  })

  it('should convert a bool should filter to a must filter', function () {
    var search = require('./scenarios/bool-should.json').search
    var filter = require('./scenarios/bool-should.json').filter
    var output = require('./scenarios/bool-should.json').output

    var builder = new FilterBuilder(search)

    builder.append(filter)

    should(builder.toSearch()).deepEqual(output)
  })

  it('should convert a simple filter to a must filter', function () {
    var search = require('./scenarios/simple-filter.json').search
    var filter = require('./scenarios/simple-filter.json').filter
    var output = require('./scenarios/simple-filter.json').output

    var builder = new FilterBuilder(search)

    builder.append(filter)

    should(builder.toSearch()).deepEqual(output)
  })

  it('should support appending an array of filters', function () {
    var search = require('./scenarios/simple-filter.json').search
    var filter = require('./scenarios/simple-filter.json').filter
    var output = require('./scenarios/simple-filter.json').output

    var builder = new FilterBuilder(search)

    builder.append([filter])

    should(builder.toSearch()).deepEqual(output)
  })

  it('should throw if an invalid bool filter is provided', function () {
    var search = {
      filter: {
        bool: {
          fredoSanta: 'Chi-Raq',
          should: undefined // hack around should.js populating this property
        }
      }
    }

    var builder = new FilterBuilder(search)
    var append = function () { builder.append({}) }

    should(append).throw()
  })

  it('should throw if search is not provided', function () {
    var builder = function () { return new FilterBuilder(undefined) }

    should(builder).throw()
  })

  it('should throw if a query and filter are not provided', function () {
    var builder = function () { return new FilterBuilder({}) }

    should(builder).throw()
  })

  it('should throw if a query and filter are provided', function () {
    var search = {
      query: {},
      filter: {}
    }

    var builder = function () { return new FilterBuilder(search) }

    should(builder).throw()
  })

  it('should throw if a filterd query does not contain a filter', function () {
    var search = {
      query: {
        filtered: {
          query: {}
        }
      }
    }

    var builder = function () { return new FilterBuilder(search) }

    should(builder).throw()
  })

  it('should throw if a filterd query does not contain a query', function () {
    var search = {
      query: {
        filtered: {
          filter: {}
        }
      }
    }

    var builder = function () { return new FilterBuilder(search) }

    should(builder).throw()
  })
})
