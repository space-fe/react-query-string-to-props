const booleanConverter = (v) => v === 'true'
  ? true
  : (
    v === 'false'
      ? false
      : v
  )

// const filterObjWithDefaultObj1 = (obj, defaultObj) => {
//   return Object.entries(defaultObj).reduce((prev, [key, defaultValue]) => {
//     return Object.prototype.hasOwnProperty.call(obj, key)
//       ? {
//         ...prev,
//         [key]: booleanConverter(obj[key])
//       }
//       : {
//         ...prev,
//         [key]: defaultValue
//       }
//   }, {})
// }

const filterObjWithDefaultObj = (obj, defaultObj, filterKeys = []) => {
  return filterKeys.reduce((prev, key) => {
    return Object.prototype.hasOwnProperty.call(obj, key)
      ? {
        ...prev,
        [key]: booleanConverter(obj[key])
      }
      : {
        ...prev,
        [key]: defaultObj[key]
      }
  }, {})
}

export { filterObjWithDefaultObj }
