import React from 'react'
import queryString from 'query-string'
import queryToStateHOC from '../src/index'
import cases from 'jest-in-case'

const getLocation = (pathname, search) => {
  return {
    pathname,
    search: queryString.stringify(search)
  }
}
const l1 = getLocation('/page')
const l2 = getLocation('/page', { searchStr: 'str1', searchStr2: 'str2', name: 'mo' })

cases('test queryToStateHOC', opts => {
  const { config1, config2, locationChangingPath, updates = [], expectedStates } = opts
  const [ updates1, updates2 ] = updates
  const [ expectedState1, expectedState2 ] = expectedStates

  class Searcher extends React.Component {
    handleChange = (event) => {
      const { updateQueryState } = this.props
      updateQueryState({ searchStr1: event.target.value })
    }

    render () {
      const { searchStr1 } = this.props

      return (
        <div>
          <span>{searchStr1}</span>
          <input onChange={this.handleChange} />
        </div>
      )
    }
  }

  const FunctionalSearcher = (props) => {
    const handleChange = (event) => {
      const { updateQueryState } = props
      updateQueryState({ searchStr2: event.target.value })
    }

    const { searchStr2 } = props

    return (
      <div>
        <span>{searchStr2}</span>
        <input onChange={handleChange} />
      </div>
    )
  }

  const SearcherQueryToStateComp = queryToStateHOC(Searcher, config1)
  const FunctionalSearcherQueryToStateComp = queryToStateHOC(FunctionalSearcher, config2)

  class App extends React.Component {
    render () {
      return (
        <React.Fragment>
          <SearcherQueryToStateComp
            ref={ref => { this.qRef = ref }}
          />
          <FunctionalSearcherQueryToStateComp
            ref={ref => { this.fRef = ref }}
          />
        </React.Fragment>
      )
    }
  }

  const comp = mount(<App />)
  const instance = comp.instance()
  const instance1 = instance.qRef
  const instance2 = instance.fRef

  locationChangingPath.reduce((prevLocation, currLocation) => {
    instance1.handleRouteChanged(prevLocation, currLocation)
    instance2.handleRouteChanged(prevLocation, currLocation)
    return currLocation
  }, null)

  const mockFn1 = jest.fn(() => {
    return instance1.state
  })

  const mockFn2 = jest.fn(() => {
    return instance2.state
  })

  let result1 = mockFn1()
  let result2 = mockFn2()

  if (updates1) {
    instance1.__updateState({ ...updates1 }, () => {
      result1 = instance1.state
    })
  }

  if (updates2) {
    instance2.__updateState({ ...updates2 }, () => {
      result2 = instance2.state
    })
  }

  console.log('mockFn1() => ', mockFn1())
  console.log('mockFn2() => ', mockFn2())
  expect(result1).toEqual(expectedState1)
  expect(result2).toEqual(expectedState2)
}, [
  {
    name: 'When route changes',
    config1: {
      initState: {
        searchStr1: 'initstr1'
      },
      validator: {
        searchStr1: [
          { type: 'regexp', value: /(\w)+/i }
        ]
      },
      isReplace: false
    },
    config2: {
      initState: {
        searchStr2: 'initstr2'
      },
      validator: {
        searchStr1: [
          { type: 'regexp', value: /(\w)+/i }
        ]
      }
    },
    locationChangingPath: [l1, l2],
    expectedStates: [
      { searchStr1: 'initstr1' },
      { searchStr2: 'str2' }
    ]
  },
  {
    name: 'When updates',
    config1: {
      initState: {
        searchStr1: 'initstr1'
      },
      validator: {
        searchStr1: [
          { type: 'regexp', value: /(\w)+/i }
        ]
      },
      isReplace: false
    },
    config2: {
      initState: {
        searchStr2: 'initstr2'
      },
      validator: {
        searchStr1: [
          { type: 'regexp', value: /(\w)+/i }
        ]
      }
    },
    locationChangingPath: [l1],
    updates: [
      { searchStr1: 'aaa' },
      { searchStr2: 'bbb' }
    ],
    expectedStates: [
      { searchStr1: 'aaa' },
      { searchStr2: 'bbb' }
    ]
  },
  {
    name: 'When updates',
    config1: {
      initState: {
        searchStr1: 'initstr1'
      },
      validator: {
        searchStr1: [
          { type: 'regexp', value: /^test/i }
        ]
      },
      isReplace: false
    },
    config2: {
      initState: {
        searchStr2: 'initstr2'
      },
      validator: {
        searchStr1: [
          { type: 'regexp', value: /^test/i }
        ]
      }
    },
    locationChangingPath: [l1, l2],
    updates: [
      { searchStr1: 'aaa' },
      { searchStr2: 'bbb' }
    ],
    expectedStates: [
      { searchStr1: 'initstr1' },
      { searchStr2: 'bbb' }
    ]
  }
])
