# react-query-to-state
Mapping query string from the path to Component state seamlessly.

## Usage
```javascript
import React from 'react'
import queryToStateHOC from 'react-query-to-state'

class MyComponent extends React.Component {
  handleChange = (event) => {
    const { updateQueryState } = this.props
    updateQueryState({ name: event.target.value })
  }

  render () {
    const { query } = this.props
    const { name } = query

    return (
      <div>
        <span>{name}</span>
        <input onChange={this.handleChange} />
      </div>
    )
  }
}

const configs = {
  history,
  initState,
  validator,
  isReplace
}

export default queryToStateHOC(MyComponent, configs)
```
