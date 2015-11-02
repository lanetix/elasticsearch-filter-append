var FilterBuilder = require('../index')
var should = require('should')

describe('filter append', function() {
  it('should convert a query to a filtered query', function() {
    var search = {
      query: {
        query_string: {
          query: '*I spy an @kyspy \? \* &*',
          default_operator: 'AND',
          fields: ['name', 'first_name', 'workflow.owner.name']
        }
      }
    }

    var filter = {
      term: {
        name: "Antwan Atkins"
      }
    }

    var output = {
      query: {
        filtered: {
          query: search.query,
          filter: {
            bool: {
              should: [filter]
            }
          }
        }
      }
    }
    var builder = new FilterBuilder(search)

    builder.append(filter)

    should(builder.toSearch()).deepEqual(output)
  })
})
