# react-query-string-to-props
[![Build Status](https://travis-ci.org/space-fe/react-query-string-to-props.svg?branch=master)](https://travis-ci.org/space-fe/react-query-string-to-props)

Mapping query string from the path to Component props seamlessly.

## Installation
Use `npm`
```shell
npm install react-query-string-to-props
```
Use `yarn`
```shell
yarn add react-query-string-to-props
```

## Usage

### ES6 Class Component
```javascript
import React from 'react'
import queryToPropsHOC, { QueryPropTypes, ValidateTypes } from 'react-query-to-state'
import { createBrowserHistory } from 'history'

class Searcher extends React.Component {
  handleChange = (event) => {
    const { updateQueryState } = this.props
    updateQueryState({ searchStr: event.target.value })
  }

  render () {
    const { query } = this.props
    const { searchStr } = query

    return (
      <div>
        <span>{searchStr}</span>
        <input onChange={this.handleChange} />
      </div>
    )
  }
}

const config = {
  history: createBrowserHistory(),
  queryPropTypes: {
    searchStr: QueryPropTypes.string
  },
  defaultQueryProps: {
    searchStr: 'abcde'
  },
  validatorMap: {
    searchStr: [
      {
        type: ValidateTypes.regexp,
        value: /^abc/i
      }
    ]
  },
  replaceWhenChange: true,
  mapDefaultQueryPropsToUrlWhenMount: true
}

export default queryToPropsHOC(Searcher, config)
```

### Functional Component
```javascript
import React from 'react'
import { createBrowserHistory } from 'history'
import queryToPropsHOC, { QueryPropTypes, ValidateTypes } from 'react-query-to-state'

const Searcher = (props) => {
  const handleChange = (event) => {
    const { updateQueryState } = props
    updateQueryState({ searchStr: event.target.value })
  }

  const { query } = props
  const { searchStr } = query

  return (
    <div>
      <span>{searchStr}</span>
      <input onChange={handleChange} />
    </div>
  )
}

const config = {
  history: createBrowserHistory(),
  queryPropTypes: {
    searchStr: QueryPropTypes.string
  }
}

export default queryToPropsHOC(Searcher, config)
```

### Multiple Components in one page
```javascript
import React from 'react'
import { createBrowserHistory } from 'history'
import queryToPropsHOC, { QueryPropTypes, ValidateTypes } from 'react-query-to-state'

const history = createBrowserHistory(),

class Searcher extends React.Component {
  render () {
    const { searchStr1 } = this.props
    return <div>{searchStr1}</div>
  }
}

const FunctionalSearcher = (props) => {
  const { searchStr2 } = props
  return <div>{searchStr2}</div>
}

const config1 = {
  history,
  queryPropTypes: {
    searchStr1: QueryPropTypes.string
  },
  defaultQueryProps: {
    searchStr1: 'str1'
  },
  validatorMap: {
    searchStr1: [
      {
        type: ValidateTypes.range,
        value: ['aaa', 'bbb']
      }
    ]
  }
}

const config2 = {
  history,
  queryPropTypes: {
    searchStr2: QueryPropTypes.string
  },
  defaultQueryProps: {
    searchStr2: 'str2'
  },
  validatorMap: {
    searchStr2: [
      {
        type: ValidateTypes.function,
        value: (val) => {
          return val.startsWith('test')
        }
      }
    ]
  }
}

const SearcherQueryToStateComp = queryToPropsHOC(Searcher, config1)
const FunctionalSearcherQueryToStateComp = queryToPropsHOC(FunctionalSearcher, config2)

export default class App extends React.Component {
  render () {
    return <React.Fragment>
      <SearcherQueryToStateComp />
      <FunctionalSearcherQueryToStateComp />
    </React.Fragment>
  }
}
```

## Configuration
| Name           | Type      | Default | Description                                                                                                                                                                                                                             |
| -------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `history` | `object` |  | `Required`. History object, see [history](https://github.com/ReactTraining/history) for more information. |
| `replaceWhenChange` | `boolean` | `true` | `Optional`. If `true`, history.replace() will be called, or history.push() will be called when query is updated by component. |
| `mapDefaultQueryPropsToUrlWhenMount` | `boolean` | `false` | `Optional`. If `true`, default query props will be mapped to url when Component mounts. |
| `queryPropTypes` | `object` | | Only properties declared in the queryPropTypes object will be mapped from the path to Component props, and the declared types will be used to decode the query string to Component props. |
| `defaultQueryProps` | `object` | | Default query props, aka initial props. |
| `validatorMap` | `object` | | `Optional`. ValidatorMap is a dictionary of properties validators. The key is a property name, and the value is an array of validator for this property. |

### QueryPropTypes
- number
- string
- boolean
- array
- numericArray

### ValidatorMap
ValidatorMap is a dictionary of properties validators. The key is a property, and the value is an array of validator for this property.

`ValidateTypes`:
- range
- regexp
- function

```javascript
const validatorMap = {
  key1: [
    {
      type: ValidateTypes.range,
      value: ['aa', 'bb', 'cc']
    }
  ],
  key2: [
    {
      type: ValidateTypes.regexp,
      value: /^test/i
    },
    {
      type: ValidateTypes.function,
      value: val => {
        return val.endsWith('abc')
      }
    }
  ]
}
```
