# react-query-to-state
[![Build Status](https://travis-ci.org/space-fe/react-query-to-state.svg?branch=master)](https://travis-ci.org/space-fe/react-query-to-state)

Mapping query string from the path to Component state seamlessly.

## Installation
Use `npm`
```shell
npm install react-query-to-state
```
Use `yarn`
```shell
yarn add react-query-to-state
```

## Usage

### ES6 Class Component
```javascript
import React from 'react'
import queryToStateHOC from 'react-query-to-state'
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
  history: createBrowserHistory(),  // optional
  initState: {
    searchStr: 'abcde'
  },
  validatorMap: {
    searchStr: [
      {
        type: 'regexp',
        value: /^abc/i
      }
    ]
  },
  isReplace: true
}

export default queryToStateHOC(Searcher, config)
```

### Functional Component
```javascript
import React from 'react'
import queryToStateHOC from 'react-query-to-state'

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
  initState: {
    searchStr: ''
  }
}

export default queryToStateHOC(Searcher, config)
```

### Multiple Components in one page
```javascript
import React from 'react'
import queryToStateHOC from 'react-query-to-state'

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
  initState: {
    searchStr1: 'str1'
  },
  validatorMap: {
    searchStr1: [
      {
        type: 'range',
        value: ['aaa', 'bbb']
      }
    ]
  }
}

const config2 = {
  initState: {
    searchStr2: 'str2'
  },
  validatorMap: {
    searchStr2: [
      {
        type: 'function',
        value: (val) => {
          return val.startsWith('test')
        }
      }
    ]
  }
}

const SearcherQueryToStateComp = queryToStateHOC(Searcher, config1)
const FunctionalSearcherQueryToStateComp = queryToStateHOC(FunctionalSearcher, config2)

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
| `history` | `object` | createBrowserHistory() | `Optional`. History object, see [history](https://github.com/ReactTraining/history) for more information. |
| `isReplace` | `boolean` | `true` | `Optional`. If `true`, history.replace() will be called, or history.push() will be called when queryState is updated by component. |
| `initState` | `object` | | Only properties declared in the initState object will be mapped from the path to Component state. |
| `validatorMap` | `object` | | `Optional`. ValidatorMap is a dictionary of properties validators. The key is a property name, and the value is an array of validator for this property. |

### ValidatorMap
ValidatorMap is a dictionary of properties validators. The key is a property, and the value is an array of validator for this property.

`validateTypes`:
- range
- regexp
- function

```javascript
const validatorMap = {
  key1: [
    {
      type: 'range',
      value: ['aa', 'bb', 'cc']
    }
  ],
  key2: [
    {
      type: 'regexp',
      value: /^test/i
    },
    {
      type: 'function',
      value: val => {
        return val.endsWith('abc')
      }
    }
  ]
}
```
