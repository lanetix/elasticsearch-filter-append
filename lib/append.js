var isArray = require('lodash.isarray')
var clone = require('lodash.clone')

module.exports = function (filter, filters) {
  if (filter.bool) {
    if (filter.bool.must) {
      var must = filter.bool.must

      if (isArray(must)) {
        must.push({
          bool: {
            should: filters
          }
        })
      } else {
        filter.bool.must = [
          must, {
            bool: {
              should: filters
            }
          }
        ]
      }
    } else if (filter.bool.should) {
      var should = clone(filter)

      filter.bool = {
        must: [
          should, {
            bool: {
              should: filters
            }
          }
        ]
      }
    } else {
      throw new Error('invalid bool filter')
    }
  }
}
