import React from 'react'
import onRouteChangedHOC from 'react-onroutechanged'
import queryString from 'query-string'
import { createBrowserHistory } from 'history'
import { validateObject } from './utils/validate'
import { filterObjWithDefaultObj } from './utils/objectUtil'

const queryToStateHOC = (DecoratedComponent, config) => {
  const componentName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component'
  const isReactComponent = DecoratedComponent.prototype.isReactComponent

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

      const validatedState = validateObject(newState, initState, validator)
      const newQueryObj = Object.assign(this.__getCurrentQueryObj(), validatedState)
      const queryStr = this.__getQueryStr(newQueryObj)
      const { pathname } = this.currentLocation

      const newPath = `${pathname}${Object.keys(validatedState).length === 0 ? '' : `?${queryStr}`}`
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
      const { ...props } = this.props

      if (isReactComponent) {
        props.ref = ref => { this.instanceRef = ref }
      }

      return <DecoratedComponent
        {...props}
        {...this.state}
        updateQueryState={this.__updateState}
      />
    }
  }

  return onRouteChangedHOC(queryToStateComponent, true, false)
}

export default queryToStateHOC
