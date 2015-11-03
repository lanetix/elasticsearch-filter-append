# Elasticsearch Filter Append

Append additional filters to filters, queries, and filtered queries.

# Why?

This library exists primarily for security reasons. Imagine you're accepting a user generated filter but would
like to tack on security trimming to input. A user could submit an arbitrary filter that opens up the flood gates
and allows them to see *EVERYTHING*. You could ensure the user only views their information by appending an extra security
filter to their input; trimming their results on the fly.

## `methods`

### `constructor(search)`

- `search` - An [elasticsearch query (DSL) clause](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)

```js
var FilterBuilder = require('elasticsearch-filter-append')

var search = {
  from: 99,
  filter: {
    term: {
      name: 'Atlanta, GA'
    }
  }
}

var builder = new FilterBuilder(search)
```

### `append(filter1, filter2, filter3....filterN|Array)`

`append` supports variable arguments or an `Array` as input:

```js
var FilterBuilder = require('elasticsearch-filter-append')

var search = {
  from: 99,
  filter: {
    term: {
      name: 'Atlanta, GA'
    }
  }
}

var filter1 = {
  term: {
    name: 'Wimberly'
  }
}

var filter2 = {
  term: {
    name: 'Antwan'
  }
}

var builder = new FilterBuilder(search)

builder.append(filter1, filter2)
```

**OR**

```js
var FilterBuilder = require('elasticsearch-filter-append')

var search = {
  from: 99,
  filter: {
    term: {
      name: 'Atlanta, GA'
    }
  }
}

var filter1 = {
  term: {
    name: 'Wimberly'
  }
}

var filter2 = {
  term: {
    name: 'Antwan'
  }
}

var filters = [filter1, filter2]

var builder = new FilterBuilder(search)

builder.append(filters)
```

The set of filters provided will be converted to an instance of a `should` filter. That means at least one of the condtitions
provided must evaluate to true. You can apply as many groups of conditions as you like. For example, to represent

`(cond1 OR cond2) AND (cond3)`

You could call `append` as follows:

```
var secureSearch = builder.append(filter1, filter2).append(filter3).toSearch()
```

Yes, did I mention that `append` also supports chaining? :wink:

### `toSearch()`

`toSearch` is very straightforward. It unwraps the accumulated filter. It should be called subsequent to calls to
`append`. `append` will leave any part of your search that does not affect filtering intact. So paging, etc. will
be preserved. `append` will also take the latest state of the search/filter into account while chaining. For example,
you could go from a query, to a filtered query with a `should` filter, to a filtered query with a `must` filter.

## `bool must filter - array`

### `sample`

```js
var FilterBuilder = require('elasticsearch-filter-append')

var search = {
  filter: {
    bool: {
      must: [
        {
          bool: {
            should: [
              {
                term: {
                  name: 'Professor Pythonesque'
                }
              },
              {
                term: {
                  name: 'Abraham Lost In San Francisco'
                }
              }
            ]
          }
        }
      ]
    }
  }
}

var filter = {
  term: {
    name: 'Antwan Atkins'
  }
}

var builder = new FilterBuilder(search)

builder.append(filter)
```

### `Δδ`

`builder.toSearch()`

```js
{
  filter: {
    bool: {
      must: [
        {
          bool: {
            should: [
              {
                term: {
                  name: 'Professor Pythonesque'
                }
              },
              {
                term: {
                  name: 'Abraham Lost In San Francisco'
                }
              }
            ]
          }
        },
        {
          bool: {
            should: [
              {
                term: {
                  name: 'Antwan Atkins'
                }
              }
            ]
          }
        }
      ]
    }
  }
}
```

## `bool must filter - object`

### `sample`

```js
var FilterBuilder = require('elasticsearch-filter-append')

var search = {
  filter: {
    bool: {
      must: {
        term: {
          name: 'Antwan Atkins'
        }
      }
    }
  }
}

var filter = {
  term: {
    name: 'Antwan Atkins'
  }
}

var builder = new FilterBuilder(search)

builder.append(filter)
```

### `Δδ`

`builder.toSearch()`

```js
{
  filter: {
    bool: {
      must: [
        {
          term: {
            name: 'Antwan Atkins'
          }
        },
        {
          bool: {
            should: [
              {
                term: {
                  name: 'Antwan Atkins'
                }
              }
            ]
          }
        }
      ]
    }
  }
}
```

## `bool should filter`

### `sample`

```js
var FilterBuilder = require('elasticsearch-filter-append')

var search = {
  filter: {
    bool: {
      should: [
        {
          bool: {
            must: {
              term: {
                name: 'Antwan Atkins'
              }
            }
          }
        },
        {
          bool: {
            must: {
              term: {
                name: 'J.Cole World'
              }
            }
          }
        }
      ]
    }
  }
}

var filter = {
  term: {
    name: 'Antwan Atkins'
  }
}

var builder = new FilterBuilder(search)

builder.append(filter)
```

### `Δδ`

`builder.toSearch()`

```js
{
  filter: {
    bool: {
      must: [
        {
          bool: {
            should: [
              {
                bool: {
                  must: {
                    term: {
                      name: 'Antwan Atkins'
                    }
                  }
                }
              },
              {
                bool: {
                  must: {
                    term: {
                      name: 'J.Cole World'
                    }
                  }
                }
              }
            ]
          }
        },
        {
          bool: {
            should: [
              {
                term: {
                  name: 'Antwan Atkins'
                }
              }
            ]
          }
        }
      ]
    }
  }
}
```

## `filtered query - bool must filter - array`

### `sample`

```js
var FilterBuilder = require('elasticsearch-filter-append')

var search = {
  fields: ['one'],
  query: {
    filtered: {
      query: {
        query_string: {
          query: '*I spy an @kyspy \\? \\* &*',
          default_operator: 'AND',
          fields: [
            'name',
            'first_name',
            'parent.name'
          ]
        }
      },
      filter: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  {
                    term: {
                      name: 'Professor Pythonesque'
                    }
                  },
                  {
                    term: {
                      name: 'Abraham Lost In San Francisco'
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    }
  }
}

var filter = {
  term: {
    name: 'Antwan Goes To School'
  }
}

var builder = new FilterBuilder(search)

builder.append(filter)
```

### `Δδ`

`builder.toSearch()`

```js
{
  fields: ['one'],
  query: {
    filtered: {
      query: {
        query_string: {
          query: '*I spy an @kyspy \\? \\* &*',
          default_operator: "AND",
          fields: [
            'name',
            'first_name',
            'parent.name'
          ]
        }
      },
      filter: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  {
                    term: {
                      name: 'Professor Pythonesque'
                    }
                  },
                  {
                    term: {
                      name: 'Abraham Lost In San Francisco'
                    }
                  }
                ]
              }
            },
            {
              bool: {
                should: [
                  {
                    term: {
                      name: 'Antwan Goes To School'
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    }
  }
}
```

## `filtered query - bool must filter - object`

### `sample`

```js
var FilterBuilder = require('elasticsearch-filter-append')

var search = {
  fields: ['one'],
  query: {
    filtered: {
      query: {
        query_string: {
          query: '*I spy an @kyspy \\? \\* &*',
          default_operator: 'AND',
          fields: [
            'name',
            'first_name',
            'parent.name'
          ]
        }
      },
      filter: {
        bool: {
          must: {
            term: {
              name: 'Antwan Atkins'
            }
          }
        }
      }
    }
  }
}

var filter = {
  term: {
    name: 'Antwan Goes To School'
  }
}

var builder = new FilterBuilder(search)

builder.append(filter)
```
### `Δδ`

`builder.toSearch()`

```js
{
  fields: ['one'],
  query: {
    filtered: {
      query: {
        query_string: {
          query: '*I spy an @kyspy \\? \\* &*',
          default_operator: "AND",
          fields: [
            'name',
            'first_name',
            'parent.name'
          ]
        }
      },
      filter: {
        bool: {
          must: [
            {
              term: {
                name: 'Antwan Atkins'
              }
            },
            {
              bool: {
                should: [
                  {
                    term: {
                      name: 'Antwan Goes To School'
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    }
  }
}
```

## `filtered query - bool should filter`

### `sample`

```js
var FilterBuilder = require('elasticsearch-filter-append')

var search = {
  fields: ['one'],
  query: {
    filtered: {
      query: {
        query_string: {
          query: '*I spy an @kyspy \\? \\* &*',
          default_operator: 'AND',
          fields: [
            'name',
            'first_name',
            'parent.name'
          ]
        }
      },
      filter: {
        bool: {
          should: [
            {
              bool: {
                must: {
                  term: {
                    name: 'Antwan Atkins'
                  }
                }
              }
            },
            {
              bool: {
                must: {
                  term: {
                    name: 'J.Cole World'
                  }
                }
              }
            }
          ]
        }
      }
    }
  }
}

var filter = {
  term: {
    name: 'Antwan Goes To School'
  }
}

var builder = new FilterBuilder(search)

builder.append(filter)
```

### `Δδ`

`builder.toSearch()`

```js
{
  fields: ['one'],
  query: {
    filtered: {
      query: {
        query_string: {
          query: '*I spy an @kyspy \\? \\* &*',
          default_operator: 'AND',
          fields: [
            'name',
            'first_name',
            'parent.name'
          ]
        }
      },
      filter: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  {
                    bool: {
                      must: {
                        term: {
                          name: 'Antwan Atkins'
                        }
                      }
                    }
                  },
                  {
                    bool: {
                      must: {
                        term: {
                          name: 'J.Cole World'
                        }
                      }
                    }
                  }
                ]
              }
            },
            {
              bool: {
                should: [
                  {
                    term: {
                      name: 'Antwan Goes To School'
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    }
  }
}
```

## `filtered query - simple filter`

### `sample`

```js
var FilterBuilder = require('elasticsearch-filter-append')

var search = {
  fields: ['one'],
  query: {
    filtered: {
      query: {
        query_string: {
          query: '*I spy an @kyspy \\? \\* &*',
          default_operator: 'AND',
          fields: [
            'name',
            'first_name',
            'parent.name'
          ]
        }
      },
      filter: {
        term: {
          name: 'Antwan Atkins'
        }
      }
    }
  }
}

var filter = {
  term: {
    name: 'Antwan Goes To School'
  }
}

var builder = new FilterBuilder(search)

builder.append(filter)
```

### `Δδ`

`builder.toSearch()`

```js
{
  fields: ['one'],
  query: {
    filtered: {
      query: {
        query_string: {
          query: '*I spy an @kyspy \\? \\* &*',
          default_operator: 'AND',
          fields: [
            'name',
            'first_name',
            'parent.name'
          ]
        }
      },
      filter: {
        bool: {
          must: [
            {
              term: {
                name: 'Antwan Atkins'
              }
            },
            {
              bool: {
                should: [
                  {
                    term: {
                      name: 'Antwan Goes To School'
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    }
  }
}
```

## `query`

### `sample`

```js
var FilterBuilder = require('elasticsearch-filter-append')

var search = {
  query: {
    query_string: {
      query: "*I spy an @kyspy \\? \\* &*",
      default_operator: "AND",
      fields: ['name', 'first_name', 'parent.name']
    }
  }
}

var filter = {
  term: {
    name: 'Antwan Atkins'
  }
}

var builder = new FilterBuilder(search)

builder.append(filter)
```

### `Δδ`

`builder.toSearch()`

```js
{
  query: {
    filtered: {
      query: {
        query_string: {
          query: '*I spy an @kyspy \\? \\* &*',
          default_operator: 'AND',
          fields: ['name', 'first_name', 'parent.name']
        }
      },
      filter: {
        bool: {
          should: [
            {
              term: {
                name: 'Antwan Atkins'
              }
            }
          ]
        }
      }
    }
  }
}
```

## `simple filter`

### `sample`

```js
var FilterBuilder = require('elasticsearch-filter-append')

var search = {
  filter: {
    term: {
      name: 'Antwan Atkins'
    }
  }
}

var filter = {
  term: {
    name: 'Antwan Atkins'
  }
}

var builder = new FilterBuilder(search)

builder.append(filter)
```

### `Δδ`

`builder.toSearch()`

```js
{
  filter: {
    bool: {
      must: [
        {
          term: {
            name: 'Antwan Atkins'
          }
        },
        {
          bool: {
            should: [
              {
                term: {
                  name: 'Antwan Atkins'
                }
              }
            ]
          }
        }
      ]
    }
  }
}
```
