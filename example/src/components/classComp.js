import React from 'react'
import queryToPropsHOC, { QueryPropTypes, ValidateTypes } from 'react-query-string-to-props'
import history from '../history'
import './style.css'

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
        getRandomNum(10, 1)
      ]
    })
  }

  changeStringArray = () => {
    this.props.updateQueryState({
      stringArr: [
        String(getRandomNum(10, 1))
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
        <div className='item'>
          <span>Number: {num}</span>
          <span>type: {typeof num}</span>
          <button onClick={this.changeNumber}>change number</button>
        </div>
        <div className='item'>
          <span>String: {inputStr}</span>
          <span>type: {typeof inputStr}</span>
          <input onChange={this.changeString} />
        </div>
        <div className='item'>
          <span>Numeric Array: {JSON.stringify(numericArr)}</span>
          <span>item type: {typeof numericArr[0]}</span>
          <button onClick={this.changeNumericArray}>change array</button>
        </div>
        <div className='item'>
          <span>String Array: {JSON.stringify(stringArr)}</span>
          <span>item type: {typeof stringArr[0]}</span>
          <button onClick={this.changeStringArray}>change array</button>
        </div>
        <div className='item'>
          <span>Boolean: {bool ? 'true' : 'false'}</span>
          <span>type: {typeof bool}</span>
          <button onClick={this.changeBoolean}>change boolean</button>
        </div>
      </div>
    )
  }
}

export default queryToPropsHOC(Demo, {
  history,
  queryPropsConfig: {
    num: QueryPropTypes.number,
    inputStr: QueryPropTypes.string,
    numericArr: QueryPropTypes.numericArray,
    stringArr: QueryPropTypes.array,
    bool: QueryPropTypes.boolean
  },
  defaultQueryProps: {
    num: 50,
    inputStr: 'abc',
    numericArr: [],
    stringArr: [],
    bool: false
  },
  validatorMap: {
    num: [
      {
        type: ValidateTypes.function,
        value: val => {
          return val >= 50
        }
      }
    ]
  }
})
