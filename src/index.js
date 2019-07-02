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
    validatorMap,
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

    __updateUrl = (validatedState) => {
      const newQueryObj = {
        ...this.__getCurrentQueryObj(),
        ...validatedState
      }

      const queryStr = this.__getQueryStr(newQueryObj)
      const { pathname } = this.currentLocation
      const newPath = `${pathname}${queryStr ? `?${queryStr}` : ''}`

      isReplace ? history.replace(newPath) : history.push(newPath)
    }

    __updateState = (patches, callback) => {
      const newState = {
        ...this.state,
        ...patches
      }

      const validatedState = validateObject(newState, initState, validatorMap)
      this.__updateUrl(validatedState)

      this.setState({ ...validatedState }, () => {
        callback && callback()
      })
    }

    handleRouteChanged = (_, currLocation) => {
      this.currentLocation = currLocation

      const currentQueryObj = this.__getCurrentQueryObj()
      const filterQueryObj = filterObjWithDefaultObj(currentQueryObj, defaultState)

      const validatedQueryObj = validateObject(filterQueryObj, initState, validatorMap)
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

  return onRouteChangedHOC(queryToStateComponent, { mounted: true, onlyPathname: false })
}

export default queryToStateHOC
