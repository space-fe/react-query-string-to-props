import React from 'react';
import onRouteChangedHOC from 'react-onroutechanged';
import queryString from 'query-string';
import deepEqual from 'fast-deep-equal';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var ValidateTypes = {
  range: 'range',
  regexp: 'regexp',
  function: 'function'
};

var _validateMethods;
var validateMethods = (_validateMethods = {}, _defineProperty(_validateMethods, ValidateTypes.range, function (value, validatorVal) {
  return validatorVal.includes(value);
}), _defineProperty(_validateMethods, ValidateTypes.regexp, function (value, validatorVal) {
  return validatorVal.test(value);
}), _defineProperty(_validateMethods, ValidateTypes.function, function (value, validatorVal) {
  return validatorVal(value);
}), _validateMethods);

var validateObject = function validateObject(obj, defaultObj, validator) {
  var result = _objectSpread({}, obj);

  var defaultValidator = _objectSpread({}, validator);

  Object.entries(defaultValidator).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        validators = _ref2[1];

    var keyValue = obj[key];
    var validateResult = Array(validators.length).fill(true);
    validators.forEach(function (_ref3, index) {
      var type = _ref3.type,
          validatorVal = _ref3.value;
      var validateMethod = validateMethods[type];
      validateResult[index] = validateMethod ? validateMethod(keyValue, validatorVal) : false;
    });
    var hasInvalidValidation = validateResult.filter(function (item) {
      return !item;
    }).length;
    result[key] = hasInvalidValidation ? defaultObj[key] : obj[key];
  });
  return result;
};

var filterObjWithDefaultObj = function filterObjWithDefaultObj(obj, defaultObj) {
  var filterKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return filterKeys.reduce(function (prev, key) {
    return Object.prototype.hasOwnProperty.call(obj, key) ? _objectSpread({}, prev, _defineProperty({}, key, obj[key])) : _objectSpread({}, prev, _defineProperty({}, key, defaultObj[key]));
  }, {});
};

var QueryPropTypes = {
  number: 'number',
  string: 'string',
  array: 'array',
  boolean: 'boolean',
  numericArray: 'numericArray'
};

var _Decoders;
var decodeBoolean = function decodeBoolean(boolStr) {
  return boolStr === 'true' ? true : boolStr === 'false' ? false : boolStr;
};
var decodeNumber = function decodeNumber(numStr) {
  if (numStr === null) {
    return undefined;
  }

  var result = parseFloat(numStr);

  if (isNaN(result)) {
    return undefined;
  }

  return result;
};
var decodeString = function decodeString(str) {
  if (str == null) {
    return undefined;
  }

  return String(str);
};
var decodeNumericArray = function decodeNumericArray() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if (!arr) {
    return [];
  } else if (!Array.isArray(arr)) {
    return [decodeNumber(arr)];
  }

  return arr.map(function (item) {
    return decodeNumber(item);
  });
};
var decodeArray = function decodeArray() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if (!arr) {
    return [];
  } else if (!Array.isArray(arr)) {
    return [arr];
  }

  return arr;
};
var Decoders = (_Decoders = {}, _defineProperty(_Decoders, QueryPropTypes.boolean, decodeBoolean), _defineProperty(_Decoders, QueryPropTypes.number, decodeNumber), _defineProperty(_Decoders, QueryPropTypes.string, decodeString), _defineProperty(_Decoders, QueryPropTypes.numericArray, decodeNumericArray), _defineProperty(_Decoders, QueryPropTypes.array, decodeArray), _Decoders);
var decode = function decode(type, encodedValue, defaultValue) {
  if (typeof type === 'function') {
    return type(encodedValue);
  } else if (Decoders[type]) {
    return Decoders[type](encodedValue);
  }

  return encodedValue;
};
var decodeObj = function decodeObj(obj, objTypes) {
  return Object.entries(obj).reduce(function (prev, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    return _objectSpread({}, prev, _defineProperty({}, key, decode(objTypes[key], value)));
  }, {});
};

var queryToPropsHOC = function queryToPropsHOC(DecoratedComponent, config) {
  var componentName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';
  var isReactComponent = DecoratedComponent.prototype && DecoratedComponent.prototype.isReactComponent;
  var history = config.history,
      queryPropsConfig = config.queryPropsConfig,
      defaultQueryProps = config.defaultQueryProps,
      validatorMap = config.validatorMap,
      _config$replaceRouteW = config.replaceRouteWhenChange,
      replaceRouteWhenChange = _config$replaceRouteW === void 0 ? true : _config$replaceRouteW,
      _config$mapDefaultQue = config.mapDefaultQueryPropsToUrlWhenMounted,
      mapDefaultQueryPropsToUrlWhenMounted = _config$mapDefaultQue === void 0 ? false : _config$mapDefaultQue;

  if (!history) {
    throw new Error('History object must be provided for configuration!');
  }

  if (!queryPropsConfig || !Object.keys(queryPropsConfig).length) {
    throw new Error('queryPropsConfig must be provided for configuration!');
  }

  var defaultState = _objectSpread({}, defaultQueryProps);

  var queryToPropsComponent =
  /*#__PURE__*/
  function (_React$PureComponent) {
    _inherits(queryToPropsComponent, _React$PureComponent);

    function queryToPropsComponent(props) {
      var _this;

      _classCallCheck(this, queryToPropsComponent);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(queryToPropsComponent).call(this, props));

      _defineProperty(_assertThisInitialized(_this), "__getLocationQueryObj", function (location) {
        var currLocation = location || _this.currLocation;
        return currLocation ? queryString.parse(currLocation.search, {
          arrayFormat: 'comma'
        }) : {};
      });

      _defineProperty(_assertThisInitialized(_this), "__getQueryStr", function (queryObj) {
        return queryString.stringify(queryObj, {
          arrayFormat: 'comma'
        });
      });

      _defineProperty(_assertThisInitialized(_this), "__getValidatedQueryObj", function (location) {
        var currentQueryObj = _this.__getLocationQueryObj(location);

        var filterKeys = Object.keys(queryPropsConfig);
        var filterQueryObj = filterObjWithDefaultObj(currentQueryObj, defaultState, filterKeys);
        var decodedQueryObj = decodeObj(filterQueryObj, queryPropsConfig);
        var validatedQueryObj = validateObject(decodedQueryObj, defaultState, validatorMap);
        return validatedQueryObj;
      });

      _defineProperty(_assertThisInitialized(_this), "__updateUrl", function (validatedState) {
        var newQueryObj = _objectSpread({}, _this.__getLocationQueryObj(), validatedState);

        var queryStr = _this.__getQueryStr(newQueryObj);

        var pathname = _this.currLocation.pathname;
        var newPath = "".concat(pathname).concat(queryStr ? "?".concat(queryStr) : '');
        replaceRouteWhenChange ? history.replace(newPath) : history.push(newPath);
      });

      _defineProperty(_assertThisInitialized(_this), "__updateState", function (patches, callback) {
        var newState = _objectSpread({}, _this.state, patches);

        var validatedState = validateObject(newState, defaultState, validatorMap);

        _this.__updateUrl(validatedState); // this.currLocation has not been changed at this time


        var prevValidatedQueryObj = _this.__getValidatedQueryObj();

        if (!deepEqual(prevValidatedQueryObj, validatedState)) {
          _this.setState(_objectSpread({}, validatedState), function () {
            callback && callback(validatedState);
          });
        }
      });

      _defineProperty(_assertThisInitialized(_this), "handleRouteChanged", function (prevLocation, currLocation) {
        _this.currLocation = currLocation;

        var validatedQueryObj = _this.__getValidatedQueryObj(currLocation);

        _this.setState(_objectSpread({}, _this.state, validatedQueryObj));

        if (!_this.__firstCallHandleRouteChanged && mapDefaultQueryPropsToUrlWhenMounted) {
          _this.__updateUrl(validatedQueryObj);
        }

        _this.__firstCallHandleRouteChanged = true;
      });

      _this.__firstCallHandleRouteChanged = false;
      _this.currLocation = null;

      var _validatedQueryObj = _this.__getValidatedQueryObj(props.location);

      _this.state = _objectSpread({}, defaultState, _validatedQueryObj);
      return _this;
    }

    _createClass(queryToPropsComponent, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var props = _extends({}, this.props);

        if (isReactComponent) {
          props.ref = function (ref) {
            _this2.instanceRef = ref;
          };
        }

        return React.createElement(DecoratedComponent, _extends({}, props, this.state, {
          updateQueryState: this.__updateState
        }));
      }
    }]);

    return queryToPropsComponent;
  }(React.PureComponent);

  _defineProperty(queryToPropsComponent, "displayName", "QueryToProp(".concat(componentName, ")"));

  return onRouteChangedHOC(queryToPropsComponent, {
    mounted: true,
    onlyPathname: false
  });
};

export default queryToPropsHOC;
export { QueryPropTypes, ValidateTypes };
