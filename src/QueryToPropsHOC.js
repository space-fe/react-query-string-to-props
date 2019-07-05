import React from 'react'
import onRouteChangedHOC from 'react-onroutechanged'
import queryString from 'query-string'
import { validateObject } from './utils/validate'
import { filterObjWithDefaultObj } from './utils/objectUtil'
import { decodeObj } from './utils/decode'

const queryToPropsHOC = (DecoratedComponent, config) => {
  const componentName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component'
  const isReactComponent = DecoratedComponent.prototype && DecoratedComponent.prototype.isReactComponent

  const {
    queryPropTypes,
    defaultQueryProps,
    validatorMap,
    history,
    replaceWhenChange = true,
    mapDefaultQueryPropsToUrlWhenMount = false
  } = config

  if (!history) {
    throw new Error('History object must be provided for configuration!')
  }

  if (!queryPropTypes || !Object.keys(queryPropTypes).length) {
    throw new Error('queryPropTypes must be provided for configuration!')
  }

  const defaultState = { ...defaultQueryProps }

  class queryToPropsComponent extends React.PureComponent {
    static displayName = `QueryToProp(${componentName})`

    state = { ...defaultState }

    __firstCallHandleRouteChanged = false

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

      replaceWhenChange ? history.replace(newPath) : history.push(newPath)
    }

    __updateState = (patches, callback) => {
      const newState = {
        ...this.state,
        ...patches
      }

      const validatedState = validateObject(newState, defaultState, validatorMap)
      this.__updateUrl(validatedState)

      this.setState({ ...validatedState }, () => {
        callback && callback()
      })
    }

    handleRouteChanged = (_, currLocation) => {
      this.currentLocation = currLocation

      const currentQueryObj = this.__getCurrentQueryObj()
      const filterKeys = Object.keys(queryPropTypes)
      const filterQueryObj = filterObjWithDefaultObj(currentQueryObj, defaultState, filterKeys)

      const decodedQueryObj = decodeObj(filterQueryObj, queryPropTypes)
      const validatedQueryObj = validateObject(decodedQueryObj, defaultState, validatorMap)
      this.setState({ ...validatedQueryObj })

      if (!this.__firstCallHandleRouteChanged && mapDefaultQueryPropsToUrlWhenMount) {
        this.__updateUrl(validatedQueryObj)
      }

      this.__firstCallHandleRouteChanged = true
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

  return onRouteChangedHOC(queryToPropsComponent, { mounted: true, onlyPathname: false })
}

export default queryToPropsHOC
