var isArray = require('lodash.isarray')
var clone = require('lodash.clone')

function appendToMustFilter (filter, filters) {
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
}

function appendToShouldFilter (filter, filters) {
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
}

function appendToSimpleFilter (parent, filter, filters) {
  parent.filter = {
    bool: {
      must: [
        filter, {
          bool: {
            should: filters
          }
        }
      ]
    }
  }
}

module.exports = function (parent, filter, filters) {
  if (filter.bool) {
    if (filter.bool.must) {
      appendToMustFilter(filter, filters)
    } else if (filter.bool.should) {
      appendToShouldFilter(filter, filters)
    } else {
      throw new Error('invalid bool filter')
    }
  } else {
    appendToSimpleFilter(parent, filter, filters)
  }
}
