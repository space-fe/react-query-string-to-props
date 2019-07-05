import React from 'react'
import queryToStateHOC, { QueryPropTypes } from 'react-query-string-to-props'
import history from '../history'

function Demo (props) {
  const changeString = (event) => {
    props.updateQueryState({
      searchStr: event.target.value
    })
  }

  const { searchStr } = props

  return (
    <div>
      <span>String: {searchStr}, type: {typeof searchStr}</span>
      <input onChange={changeString} />
    </div>
  )
}

export default queryToStateHOC(Demo, {
  history,
  queryPropTypes: {
    searchStr: QueryPropTypes.string
  },
  defaultQueryProps: {
    searchStr: 'search'
  },
  mapDefaultQueryPropsToUrlWhenMount: true
})
