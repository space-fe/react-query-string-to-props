import React from 'react'
import queryToStateHOC, { QueryPropTypes } from 'react-query-string-to-props'
import history from '../history'
import './style.css'

function Demo (props) {
  const changeString = (event) => {
    props.updateQueryState({
      searchStr: event.target.value
    })
  }

  const { searchStr } = props

  return (
    <div className='item'>
      <span>String: {searchStr}</span>
      <span>type: {typeof searchStr}</span>
      <input onChange={changeString} />
    </div>
  )
}

export default queryToStateHOC(Demo, {
  history,
  queryPropsConfig: {
    searchStr: QueryPropTypes.string
  },
  defaultQueryProps: {
    searchStr: 'search'
  },
  mapDefaultQueryPropsToUrlWhenMounted: true
})
