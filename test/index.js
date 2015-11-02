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
})
