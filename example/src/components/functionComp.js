import React from 'react'
// import queryToStateHOC, { QueryPropTypes } from 'react-query-string-to-props'
import queryToStateHOC, { QueryPropTypes } from '../src'
import history from '../history'
import './style.css'

function Demo (props) {
  const changeString = (event) => {
    props.updateQueryState({
      searchStr: event.target.value
    })
  }

  const { searchStr } = props

  React.useEffect(() => {
    console.log('functional component effect props => ', props)
  }, [props.search])

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
