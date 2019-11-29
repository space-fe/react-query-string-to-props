import * as React from 'react'
import { History } from 'history'

type PropValue = number | string | boolean | string[] | number[]
type ValidatorValue = string[] | number[] | RegExp | ((val?: PropValue) => boolean)

interface IValidator {
  type: ValidateTypes
  value: ValidatorValue
}

interface IMap<T> {
  [key: string]: T
}

interface IConfig {
  history: History
  queryPropsConfig: IMap<QueryPropTypes>
  defaultQueryProps?: IMap<PropValue>
  validatorMap?: IMap<IValidator[]>
  replaceRouteWhenChange?: boolean
  mapDefaultQueryPropsToUrlWhenMounted?: boolean
}

declare function queryToPropsHOC<T>(DecoratedComponent: React.ComponentType, config: IConfig): React.ComponentType<T>

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

export { QueryPropTypes, ValidateTypes, IConfig }

export default queryToPropsHOC
