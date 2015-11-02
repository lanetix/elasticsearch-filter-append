module.exports = function(search, filters) {
  var query = search.query

  search.query = {
    filtered: {
      query: query,
      filter: {
        bool: {
          should: filters
        }
      }
    }
  }
}
