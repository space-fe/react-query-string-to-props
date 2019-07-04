import React from 'react'
import queryToStateHOC, { QueryPropTypes } from '../src'
import history from '../history'

const getRandomNum = (maxNum, minNum) => {
  return Math.floor(Math.random() * maxNum) + minNum
}

class Demo extends React.PureComponent {
  changeNumber = () => {
    this.props.updateQueryState({
      num: getRandomNum(100, 1)
    })
  }

  changeString = (event) => {
    this.props.updateQueryState({
      inputStr: event.target.value
    })
  }

  changeArray = () => {
    this.props.updateQueryState({
      arr: [
        getRandomNum(10, 1),
        getRandomNum(20, 1)
      ]
    })
  }

  render () {
    const { num, inputStr, arr } = this.props

    return (
      <div>
        <div>
          <span>Number: {num}, type: {typeof num}</span>
          <button onClick={this.changeNumber}>change number</button>
        </div>
        <div>
          <span>String: {inputStr}, type: {typeof inputStr}</span>
          <input onChange={this.changeString} />
        </div>
        <div>
          <span>Array: {JSON.stringify(arr)}</span>
          <button onClick={this.changeArray}>change array</button>
        </div>
      </div>
    )
  }
}

export default queryToStateHOC(Demo, {
  history,
  queryPropTypes: {
    num: QueryPropTypes.number,
    inputStr: QueryPropTypes.string
  },
  defaultQueryProps: {
    num: 123,
    inputStr: 'abc',
    arr: [1, 2]
  },
})
