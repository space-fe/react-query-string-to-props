import React from 'react';
import onRouteChangedHOC from 'react-onroutechanged';
import queryString from 'query-string';
import { createBrowserHistory } from 'history';

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

var _validateMethods;

var validateTypes = {
  range: 'range',
  regexp: 'regexp',
  function: 'function'
};
var validateMethods = (_validateMethods = {}, _defineProperty(_validateMethods, validateTypes.range, function (value, validatorVal) {
  return validatorVal.includes(value);
}), _defineProperty(_validateMethods, validateTypes.regexp, function (value, validatorVal) {
  return validatorVal.test(value);
}), _defineProperty(_validateMethods, validateTypes.function, function (value, validatorVal) {
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

var booleanConverter = function booleanConverter(v) {
  return v === 'true' ? true : v === 'false' ? false : v;
};

var filterObjWithDefaultObj = function filterObjWithDefaultObj(obj, defaultObj) {
  return Object.entries(defaultObj).reduce(function (prev, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        defaultValue = _ref2[1];

    return Object.prototype.hasOwnProperty.call(obj, key) ? _objectSpread({}, prev, _defineProperty({}, key, booleanConverter(obj[key]))) : _objectSpread({}, prev, _defineProperty({}, key, defaultValue));
  }, {});
};

var queryToStateHOC = function queryToStateHOC(DecoratedComponent, config) {
  var componentName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';
  var isReactComponent = DecoratedComponent.prototype.isReactComponent;
  var initState = config.initState,
      validatorMap = config.validatorMap,
      _config$isReplace = config.isReplace,
      isReplace = _config$isReplace === void 0 ? true : _config$isReplace,
      _config$history = config.history,
      history = _config$history === void 0 ? createBrowserHistory() : _config$history;

  var defaultState = _objectSpread({}, initState);

  var queryToStateComponent =
  /*#__PURE__*/
  function (_React$PureComponent) {
    _inherits(queryToStateComponent, _React$PureComponent);

    function queryToStateComponent() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, queryToStateComponent);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(queryToStateComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "state", _objectSpread({}, initState));

      _defineProperty(_assertThisInitialized(_this), "currentLocation", null);

      _defineProperty(_assertThisInitialized(_this), "__getCurrentQueryObj", function () {
        return _this.currentLocation ? queryString.parse(_this.currentLocation.search, {
          arrayFormat: 'comma'
        }) : {};
      });

      _defineProperty(_assertThisInitialized(_this), "__getQueryStr", function (queryObj) {
        return queryString.stringify(queryObj, {
          arrayFormat: 'comma'
        });
      });

      _defineProperty(_assertThisInitialized(_this), "__updateUrl", function (validatedState) {
        var newQueryObj = _objectSpread({}, _this.__getCurrentQueryObj(), validatedState);

        var queryStr = _this.__getQueryStr(newQueryObj);

        var pathname = _this.currentLocation.pathname;
        var newPath = "".concat(pathname).concat(queryStr ? "?".concat(queryStr) : '');
        isReplace ? history.replace(newPath) : history.push(newPath);
      });

      _defineProperty(_assertThisInitialized(_this), "__updateState", function (patches, callback) {
        var newState = _objectSpread({}, _this.state, patches);

        var validatedState = validateObject(newState, initState, validatorMap);

        _this.__updateUrl(validatedState);

        _this.setState(_objectSpread({}, validatedState), function () {
          callback && callback();
        });
      });

      _defineProperty(_assertThisInitialized(_this), "handleRouteChanged", function (_, currLocation) {
        _this.currentLocation = currLocation;

        var currentQueryObj = _this.__getCurrentQueryObj();

        var filterQueryObj = filterObjWithDefaultObj(currentQueryObj, defaultState);
        var validatedQueryObj = validateObject(filterQueryObj, initState, validatorMap);

        _this.setState(_objectSpread({}, validatedQueryObj));
      });

      return _this;
    }

    _createClass(queryToStateComponent, [{
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

    return queryToStateComponent;
  }(React.PureComponent);

  _defineProperty(queryToStateComponent, "displayName", "QueryToState(".concat(componentName, ")"));

  return onRouteChangedHOC(queryToStateComponent, {
    mounted: true,
    onlyPathname: false
  });
};

export default queryToStateHOC;
