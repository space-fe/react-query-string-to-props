import React from 'react'
import { createBrowserHistory } from 'history'
import queryString from 'query-string'
import queryToStateHOC, { QueryPropTypes, ValidateTypes } from '../src/index'
import cases from 'jest-in-case'

const history = createBrowserHistory()

const getLocation = (pathname, search) => {
  return {
    pathname,
    search: queryString.stringify(search)
  }
}
const l1 = getLocation('/page')
const l2 = getLocation('/page', { searchStr1: 'l2-str1', searchStr2: 'l2-str2' })
const l3 = getLocation('/page', { searchStr1: 'l3-str1', searchStr2: 'l3-str2', name: 'momo' })

cases('test queryToPropsHOC', opts => {
  const { config1, config2, locationChangingPath, updates = [], expectedStates } = opts
  const [ updates1, updates2 ] = updates
  const [ expectedState1, expectedState2 ] = expectedStates

  class Searcher extends React.Component {
    render () {
      const { searchStr1 } = this.props
      return <div>{searchStr1}</div>
    }
  }

  const FunctionalSearcher = (props) => {
    const { searchStr2 } = props
    return <div>{searchStr2}</div>
  }

  config1.history = history
  config2.history = history
  const SearcherQueryToStateComp = queryToStateHOC(Searcher, config1)
  const FunctionalSearcherQueryToStateComp = queryToStateHOC(FunctionalSearcher, config2)

  class App extends React.Component {
    render () {
      return <React.Fragment>
        <SearcherQueryToStateComp ref={ref => { this.qRef = ref }} />
        <FunctionalSearcherQueryToStateComp ref={ref => { this.fRef = ref }} />
      </React.Fragment>
    }
  }

  const comp = mount(<App />)
  const instance = comp.instance()
  const instance1 = instance.qRef
  const instance2 = instance.fRef

  locationChangingPath && locationChangingPath.reduce((prevLocation, currLocation) => {
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

  expect(result1).toEqual(expectedState1)
  expect(result2).toEqual(expectedState2)
}, [
  {
    name: 'When route changes, and state updates',
    config1: {
      queryPropsConfig: {
        searchStr1: QueryPropTypes.string
      },
      defaultQueryProps: {
        searchStr1: 'initstr1'
      },
      validatorMap: {
        searchStr1: [
          { type: ValidateTypes.regexp, value: /(\w)+/i }
        ]
      },
      replaceRouteWhenChange: false
    },
    config2: {
      queryPropsConfig: {
        searchStr2: QueryPropTypes.string
      },
      defaultQueryProps: {
        searchStr2: 'initstr2'
      }
    },
    locationChangingPath: [l1, l2],
    expectedStates: [
      { searchStr1: 'l2-str1' },
      { searchStr2: 'l2-str2' }
    ]
  },
  {
    name: 'When state updates, and no route changes',
    config1: {
      queryPropsConfig: {
        searchStr1: QueryPropTypes.string
      },
      defaultQueryProps: {
        searchStr1: 'initstr1'
      },
      validatorMap: {
        searchStr1: [
          { type: ValidateTypes.regexp, value: /(\w)+/i }
        ]
      }
    },
    config2: {
      queryPropsConfig: {
        searchStr2: QueryPropTypes.string
      },
      defaultQueryProps: {
        searchStr2: 'initstr2'
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
    name: 'When state updates, and route changes',
    config1: {
      queryPropsConfig: {
        searchStr1: QueryPropTypes.string
      },
      defaultQueryProps: {
        searchStr1: 'initstr1'
      },
      validatorMap: {
        searchStr1: [
          { type: ValidateTypes.regexp, value: /^test/i }
        ]
      },
      replaceRouteWhenChange: false
    },
    config2: {
      queryPropsConfig: {
        searchStr2: QueryPropTypes.string
      },
      defaultQueryProps: {
        searchStr2: 'initstr2'
      },
      validatorMap: {
        searchStr1: [
          { type: ValidateTypes.regexp, value: /^test/i }
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
  },
  {
    name: 'When location search string changes',
    config1: {
      queryPropsConfig: {
        searchStr1: QueryPropTypes.string
      },
      defaultQueryProps: {
        searchStr1: 'initstr1'
      }
    },
    config2: {
      queryPropsConfig: {
        searchStr2: QueryPropTypes.string,
        name: QueryPropTypes.string
      },
      defaultQueryProps: {
        searchStr2: 'initstr2',
        name: 'mo'
      }
    },
    locationChangingPath: [l2, l3],
    expectedStates: [
      { searchStr1: 'l3-str1' },
      { searchStr2: 'l3-str2', name: 'momo' }
    ]
  },
  {
    name: 'When there is no route changes',
    config1: {
      queryPropsConfig: {
        searchStr1: QueryPropTypes.string
      },
      defaultQueryProps: {
        searchStr1: 'initstr1'
      }
    },
    config2: {
      queryPropsConfig: {
        searchStr2: QueryPropTypes.string
      },
      defaultQueryProps: {
        searchStr2: 'initstr2'
      }
    },
    expectedStates: [
      { searchStr1: 'initstr1' },
      { searchStr2: 'initstr2' }
    ]
  },
  {
    name: 'When there is no route changes and mapDefaultQueryPropsToUrlWhenMounted=true',
    config1: {
      queryPropsConfig: {
        searchStr1: QueryPropTypes.string
      },
      defaultQueryProps: {
        searchStr1: 'initstr1'
      },
      mapDefaultQueryPropsToUrlWhenMounted: true
    },
    config2: {
      queryPropsConfig: {
        searchStr2: QueryPropTypes.string
      },
      defaultQueryProps: {
        searchStr2: 'initstr2'
      },
      mapDefaultQueryPropsToUrlWhenMounted: true
    },
    expectedStates: [
      { searchStr1: 'initstr1' },
      { searchStr2: 'initstr2' }
    ]
  }
])
