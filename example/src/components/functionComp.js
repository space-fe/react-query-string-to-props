import React from 'react'
import queryToStateHOC, { QueryPropTypes } from 'react-query-string-to-props'
// import queryToStateHOC, { QueryPropTypes } from '../src'
import history from '../history'
import './style.css'

const getRandomNum = (maxNum, minNum) => {
  return Math.floor(Math.random() * maxNum) + minNum
}

function Demo (props) {
  const changeString = (event) => {
    props.updateQueryState({
      searchStr: event.target.value
    })
  }

  const changeNumber = () => {
    props.updateQueryState({
      fnNum: getRandomNum(5, 1)
    })
  }

  const { searchStr, fnNum } = props

  React.useEffect(() => {
    console.log('functional component effect props => ', props)
  }, [props.search, props.fnNum])

  return (
    <>
      <div className='item'>
        <span>Number: {fnNum}</span>
        <span>type: {typeof fnNum}</span>
        <button onClick={changeNumber}>change number</button>
      </div>
      <div className='item'>
        <span>String: {searchStr}</span>
        <span>type: {typeof searchStr}</span>
        <input onChange={changeString} />
      </div>
    </>
  )
}

export default queryToStateHOC(Demo, {
  history,
  queryPropsConfig: {
    fnNum: QueryPropTypes.number,
    searchStr: QueryPropTypes.string
  },
  defaultQueryProps: {
    fnNum: 2,
    searchStr: 'search'
  },
  mapDefaultQueryPropsToUrlWhenMounted: true
})
