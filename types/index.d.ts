import * as React from 'react'
import { History } from 'history'

declare function queryToPropsHOC<T>(
  DecoratedComponent: React.ComponentType,
  config: {
    history: History
    queryPropsConfig: {
      [key: string]: number | string | boolean | string[] | number[]
    }
    defaultQueryProps?: object
    validatorMap?: {
      [key: string]: []
    }
    replaceRouteWhenChange?: boolean
    mapDefaultQueryPropsToUrlWhenMounted?: boolean
  }
): React.ComponentType<T>

declare type QueryPropTypesType = {
  number: string
  string: string
  array: string
  boolean: string
  numericArray: string
}

declare type ValidateTypesType = {
  range: string
  regexp: string
  function: string
}

declare const QueryPropTypes: QueryPropTypesType
declare const ValidateTypes: ValidateTypesType

export {
  QueryPropTypes,
  ValidateTypes
}

export default queryToPropsHOC
