var isArray = require('lodash.isarray')

module.exports = function (filter, filters) {
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
  }
}
