# react-query-to-state
Mapping query string from the path to Component state seamlessly.

## Usage
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
    searchStr: ''
  },
  validator: {
    searchStr: {
      type: 'regexp',
      value: /^abc/i
    }
  },
  isReplace: true
}

export default queryToStateHOC(Searcher, config)
```
