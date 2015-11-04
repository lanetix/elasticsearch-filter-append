# Elasticsearch Filter Append

Append additional filters to filters, queries, and filtered queries.

# Why?

This library exists primarily for security reasons. Imagine you're accepting a user generated filter but would
like to tack on security trimming to input. A user could submit an arbitrary filter that opens up the flood gates
and allows them to see *EVERYTHING*. You could ensure the user only views their information by appending an extra security
filter to their input; trimming their results on the fly.

## `methods`

### `constructor(queryClause)`

- `queryClause` - An [elasticsearch query (DSL) clause](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)

```js
var FilterBuilder = require('elasticsearch-filter-append')

var queryClause = {
  filter: {
    term: {
      name: 'Atlanta, GA'
    }
  }
}

var builder = new FilterBuilder(queryClause)
```

### `append(filter1, filter2, filter3....filterN|Array)`

`append` supports variable arguments or an `Array` as input:

```js
var FilterBuilder = require('elasticsearch-filter-append')

var queryClause = {
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

var builder = new FilterBuilder(queryClause)

builder.append(filter1, filter2)
```

**OR**

```js
var FilterBuilder = require('elasticsearch-filter-append')

var queryClause = {
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

var builder = new FilterBuilder(queryClause)

builder.append(filters)
```

The set of filters provided will be converted to an instance of a `should` filter. That means at least one of the condtitions
provided must evaluate to true. You can apply as many groups of conditions as you like. For example, to represent

`(cond1 OR cond2) AND (cond3)`

You could call `append` as follows:

```
var secureQueryClause = builder.append(filter1, filter2).append(filter3).toQueryClause()
```

Yes, did I mention that `append` also supports chaining? :wink:

### `toQueryClause()`

`toQueryClause` is very straightforward. It unwraps the accumulated filter. It should be called subsequent to calls to
`append`. `append` will take the latest state of the query clause into account while chaining. For example,
you could go from a query, to a filtered query with a `should` filter, to a filtered query with a `must` filter.
Once you have a query clause, you can forward the final payload off to elasticsearch:

```
var elasticsearch = require('elasticsearch')
var FilterBuilder = require('elasticsearch-filter-append')

var queryClause = {
  filter: {
    term: {
      name: 'Atlanta, GA'
    }
  }
}

var filter = {
  term: {
    name: 'Wimberly'
  }
}

var builder = new FilterBuilder(queryClause)

builder.append(filter)

```

## `bool must filter - array`

### `sample`

```js
var FilterBuilder = require('elasticsearch-filter-append')

var queryClause = {
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

var builder = new FilterBuilder(queryClause)

builder.append(filter)
```

### `Δδ`

`builder.toQueryClause()`

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

var queryClause = {
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

var builder = new FilterBuilder(queryClause)

builder.append(filter)
```

### `Δδ`

`builder.toQueryClause()`

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

var queryClause = {
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

var builder = new FilterBuilder(queryClause)

builder.append(filter)
```

### `Δδ`

`builder.toQueryClause()`

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

var queryClause = {
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

var builder = new FilterBuilder(queryClause)

builder.append(filter)
```

### `Δδ`

`builder.toQueryClause()`

```js
{
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

var queryClause = {
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

var builder = new FilterBuilder(queryClause)

builder.append(filter)
```
### `Δδ`

`builder.toQueryClause()`

```js
{
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

var queryClause = {
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

var builder = new FilterBuilder(queryClause)

builder.append(filter)
```

### `Δδ`

`builder.toQueryClause()`

```js
{
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

var queryClause = {
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

var builder = new FilterBuilder(queryClause)

builder.append(filter)
```

### `Δδ`

`builder.toQueryClause()`

```js
{
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

var queryClause = {
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

var builder = new FilterBuilder(queryClause)

builder.append(filter)
```

### `Δδ`

`builder.toQueryClause()`

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

var queryClause = {
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

var builder = new FilterBuilder(queryClause)

builder.append(filter)
```

### `Δδ`

`builder.toQueryClause()`

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
