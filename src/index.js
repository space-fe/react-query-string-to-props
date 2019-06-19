import React from 'react'
import onRouteChangedHOC from 'react-onroutechanged'
import queryString from 'query-string'
import { createBrowserHistory } from 'history'
import { validateObject, filterObjWithDefaultObj } from './utils'

const queryToStateHOC = (DecoratedComponent, config) => {
  const componentName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component'

  const {
    initState,
    validator,
    isReplace = true,
    history = createBrowserHistory()
  } = config
  const defaultState = { ...initState }

  class queryToStateComponent extends React.PureComponent {
    static displayName = `QueryToState(${componentName})`

    state = { ...initState }
    currentLocation = null

    __getCurrentQueryObj = () => {
      return this.currentLocation
        ? queryString.parse(this.currentLocation.search, { arrayFormat: 'comma' })
        : {}
    }

    __getQueryStr = (queryObj) => {
      return queryString.stringify(queryObj, { arrayFormat: 'comma' })
    }

    __updateState = (patches, callback) => {
      const newState = {
        ...this.state,
        ...patches
      }

      const { pathname } = this.currentLocation

      const validatedState = validateObject(newState, initState, validator)
      const newQueryObj = Object.assign(this.__getCurrentQueryObj(), validatedState)

      const query = this.__getQueryStr(newQueryObj)
      const newPath = `${pathname}${Object.keys(validatedState).length === 0 ? '' : `?${query}`}`

      isReplace ? history.replace(newPath) : history.push(newPath)

      this.setState({ ...validatedState }, () => {
        callback && callback()
      })
    }

    handleRouteChanged = (_, currLocation) => {
      this.currentLocation = currLocation

      const currentQueryObj = this.__getCurrentQueryObj()
      const filterQueryObj = filterObjWithDefaultObj(currentQueryObj, defaultState)

      const validatedQueryObj = validateObject(filterQueryObj, initState, validator)
      this.setState({ ...validatedQueryObj })
    }

    render () {
      return <DecoratedComponent
        {...this.props}
        {...this.state}
        updateQueryState={this.__updateState}
      />
    }
  }

  return onRouteChangedHOC(queryToStateComponent, true, false)
}

export default queryToStateHOC
