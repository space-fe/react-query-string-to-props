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

  changeNumericArray = () => {
    this.props.updateQueryState({
      numericArr: [
        getRandomNum(10, 1),
        getRandomNum(20, 1)
      ]
    })
  }

  changeStringArray = () => {
    this.props.updateQueryState({
      stringArr: [
        String(getRandomNum(10, 1)),
        String(getRandomNum(20, 1))
      ]
    })
  }

  changeBoolean = () => {
    this.props.updateQueryState({
      bool: !this.props.bool
    })
  }

  render () {
    const { num, inputStr, numericArr, stringArr, bool } = this.props

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
          <span>Numeric Array: {JSON.stringify(numericArr)}, item type: {typeof numericArr[0]}</span>
          <button onClick={this.changeNumericArray}>change array</button>
        </div>
        <div>
          <span>String Array: {JSON.stringify(stringArr)}, item type: {typeof stringArr[0]}</span>
          <button onClick={this.changeStringArray}>change array</button>
        </div>
        <div>
          <span>Boolean: {bool ? 'true' : 'false'}, type: {typeof bool}</span>
          <button onClick={this.changeBoolean}>change boolean</button>
        </div>
      </div>
    )
  }
}

export default queryToStateHOC(Demo, {
  history,
  queryPropTypes: {
    num: QueryPropTypes.number,
    inputStr: QueryPropTypes.string,
    numericArr: QueryPropTypes.numericArray,
    stringArr: QueryPropTypes.array,
    bool: QueryPropTypes.boolean
  },
  defaultQueryProps: {
    num: 123,
    inputStr: 'abc',
    numericArr: [1, 2],
    stringArr: ['1', '2'],
    bool: false
  }
})
