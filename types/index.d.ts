import * as React from 'react'
import { History } from 'history'

type PropValue = number | string | boolean | string[] | number[]
type ValidatorValue = string[] | number[] | RegExp | ((val?: PropValue) => boolean)

interface IValidator {
  type: ValidateTypes
  value: ValidatorValue
}

declare function queryToPropsHOC<T>(
  DecoratedComponent: React.ComponentType,
  config: {
    history: History
    queryPropsConfig: {
      [key: string]: QueryPropTypes
    }
    defaultQueryProps?: {
      [key: string]: PropValue
    },
    validatorMap?: {
      [key: string]: IValidator[]
    }
    replaceRouteWhenChange?: boolean
    mapDefaultQueryPropsToUrlWhenMounted?: boolean
  }
): React.ComponentType<T>

declare enum QueryPropTypes {
  number = 'number',
  string = 'string',
  array = 'array',
  boolean = 'boolean',
  numericArray = 'numericArray'
}

declare enum ValidateTypes {
  range = 'range',
  regexp = 'regexp',
  function = 'function'
}

export { QueryPropTypes, ValidateTypes }

export default queryToPropsHOC
