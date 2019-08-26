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
    history,
    queryPropsConfig,
    defaultQueryProps,
    validatorMap,
    replaceRouteWhenChange = true,
    mapDefaultQueryPropsToUrlWhenMounted = false
  } = config

  if (!history) {
    throw new Error('History object must be provided for configuration!')
  }

  if (!queryPropsConfig || !Object.keys(queryPropsConfig).length) {
    throw new Error('queryPropsConfig must be provided for configuration!')
  }

  const defaultState = { ...defaultQueryProps }

  class queryToPropsComponent extends React.PureComponent {
    static displayName = `QueryToProp(${componentName})`

    constructor (props) {
      super(props)
      this.__firstCallHandleRouteChanged = false

      const validatedQueryObj = this.__getValidatedQueryObj()
      this.state = { ...defaultState, ...validatedQueryObj }
    }

    __getCurrentQueryObj = () => {
      const { location } = this.props

      return location
        ? queryString.parse(location.search, { arrayFormat: 'comma' })
        : {}
    }

    __getQueryStr = (queryObj) => {
      return queryString.stringify(queryObj, { arrayFormat: 'comma' })
    }

    __getValidatedQueryObj = () => {
      const currentQueryObj = this.__getCurrentQueryObj()

      const filterKeys = Object.keys(queryPropsConfig)
      const filterQueryObj = filterObjWithDefaultObj(currentQueryObj, defaultState, filterKeys)

      const decodedQueryObj = decodeObj(filterQueryObj, queryPropsConfig)
      const validatedQueryObj = validateObject(decodedQueryObj, defaultState, validatorMap)

      return validatedQueryObj
    }

    __updateUrl = (validatedState) => {
      const newQueryObj = {
        ...this.__getCurrentQueryObj(),
        ...validatedState
      }

      const queryStr = this.__getQueryStr(newQueryObj)
      const { pathname } = this.props.location
      const newPath = `${pathname}${queryStr ? `?${queryStr}` : ''}`

      replaceRouteWhenChange ? history.replace(newPath) : history.push(newPath)
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
      const validatedQueryObj = this.__getValidatedQueryObj()
      this.setState({ ...validatedQueryObj })

      if (!this.__firstCallHandleRouteChanged && mapDefaultQueryPropsToUrlWhenMounted) {
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
