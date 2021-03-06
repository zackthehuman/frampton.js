(function() {
/*globals Frampton:true */
var define, require;
var global = this;

/**

This loader code is taken from the guys over at Ember
https://github.com/emberjs/ember.js/

Copyright (c) 2015 Yehuda Katz, Tom Dale and Ember.js contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
(function() {

  if (typeof Frampton === 'undefined') {
    Frampton = {};
  };

  if (typeof Frampton.__loader === 'undefined') {

    var registry = {};
    var seen = {};

    define = function(name, deps, callback) {

      var value = {};

      if (!callback) {
        value.deps = [];
        value.callback = deps;
      } else {
        value.deps = deps;
        value.callback = callback;
      }

      registry[name] = value;
    };

    require = function(name) {
      return internalRequire(name, null);
    };

    function internalRequire(name, referrerName) {

      var exports = seen[name];
      var module = {};

      if (exports !== undefined) {
        return exports;
      }

      exports = {};
      module.exports = exports;

      if (!registry[name]) {
        if (referrerName) {
          throw new Error('Could not find module ' + name + ' required by: ' + referrerName);
        } else {
          throw new Error('Could not find module ' + name);
        }
      }

      var mod = registry[name];
      var deps = mod.deps;
      var callback = mod.callback;
      var reified = [];
      var len = deps.length;
      var i = 0;

      for (; i<len; i++) {
        if (deps[i] === 'exports') {
          reified.push(exports);
        } else if (deps[i] === 'module') {
          reified.push(module);
        } else {
          reified.push(internalRequire(resolve(deps[i], name), name));
        }
      }

      callback.apply(this, reified);

      seen[name] = (reified[1] && reified[1].exports) ? reified[1].exports : reified[0];

      return seen[name];
    };

    function resolve(child, name) {

      if (child.charAt(0) !== '.') {
        return child;
      }

      var parts = child.split('/');
      var parentBase = name.split('/').slice(0, -1);
      var len = parts.length;
      var i = 0;

      for (; i < len; i++) {

        var part = parts[i];

        if (part === '..') {
          parentBase.pop();
        } else if (part === '.') {
          continue;
        } else {
          parentBase.push(part);
        }
      }

      return parentBase.join('/');
    }

    Frampton.__loader = {
      define: define,
      require: require,
      registry: registry
    };

  } else {
    define = Frampton.__loader.define;
    require = Frampton.__loader.require;
  }

}());

define('frampton-data', ['frampton/namespace', 'frampton-data/task/create', 'frampton-data/task/sync', 'frampton-data/task/delay', 'frampton-data/task/fail', 'frampton-data/task/never', 'frampton-data/task/sequence', 'frampton-data/task/succeed', 'frampton-data/task/when', 'frampton-data/task/batch', 'frampton-data/task/execute', 'frampton-data/union/create', 'frampton-data/record/create', 'frampton-data/maybe/create', 'frampton-data/maybe/just', 'frampton-data/maybe/nothing', 'frampton-data/result/success', 'frampton-data/result/failure', 'frampton-data/result/from_throwable'], function (_namespace, _create, _sync, _delay, _fail, _never, _sequence, _succeed, _when, _batch, _execute, _create3, _create5, _create7, _just, _nothing, _success, _failure, _from_throwable) {
  'use strict';

  var _namespace2 = _interopRequireDefault(_namespace);

  var _create2 = _interopRequireDefault(_create);

  var _sync2 = _interopRequireDefault(_sync);

  var _delay2 = _interopRequireDefault(_delay);

  var _fail2 = _interopRequireDefault(_fail);

  var _never2 = _interopRequireDefault(_never);

  var _sequence2 = _interopRequireDefault(_sequence);

  var _succeed2 = _interopRequireDefault(_succeed);

  var _when2 = _interopRequireDefault(_when);

  var _batch2 = _interopRequireDefault(_batch);

  var _execute2 = _interopRequireDefault(_execute);

  var _create4 = _interopRequireDefault(_create3);

  var _create6 = _interopRequireDefault(_create5);

  var _just2 = _interopRequireDefault(_just);

  var _nothing2 = _interopRequireDefault(_nothing);

  var _success2 = _interopRequireDefault(_success);

  var _failure2 = _interopRequireDefault(_failure);

  var _from_throwable2 = _interopRequireDefault(_from_throwable);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name Data
   * @namespace
   * @memberof Frampton
   */
  _namespace2.default.Data = {};

  /**
   * @name Task
   * @memberof Frampton.Data
   * @class A data type for wrapping impure computations
   * @constructor does not be called by the user.
   */
  _namespace2.default.Data.Task = {};
  _namespace2.default.Data.Task.delay = _delay2.default;
  _namespace2.default.Data.Task.create = _create2.default;
  _namespace2.default.Data.Task.sync = _sync2.default;
  _namespace2.default.Data.Task.fail = _fail2.default;
  _namespace2.default.Data.Task.succeed = _succeed2.default;
  _namespace2.default.Data.Task.never = _never2.default;
  _namespace2.default.Data.Task.sequence = _sequence2.default;
  _namespace2.default.Data.Task.when = _when2.default;
  _namespace2.default.Data.Task.batch = _batch2.default;
  _namespace2.default.Data.Task.execute = _execute2.default;

  /**
   * @name Union
   * @memberof Frampton.Data
   * @class
   */
  _namespace2.default.Data.Union = {};
  _namespace2.default.Data.Union.create = _create4.default;

  /**
   * @name Record
   * @memberof Frampton.Data
   * @class
   */
  _namespace2.default.Data.Record = {};
  _namespace2.default.Data.Record.create = _create6.default;

  /**
   * @name Maybe
   * @memberof Frampton.Data
   * @class
   */
  _namespace2.default.Data.Maybe = {};
  _namespace2.default.Data.Maybe.create = _create7.createMaybe;
  _namespace2.default.Data.Maybe.Just = _just2.default;
  _namespace2.default.Data.Maybe.Nothing = _nothing2.default;

  /**
   * @name Result
   * @memberof Frampton.Data
   * @class
   */
  _namespace2.default.Data.Result = {};
  _namespace2.default.Data.Result.fromThrowable = _from_throwable2.default;
  _namespace2.default.Data.Result.Success = _success2.default;
  _namespace2.default.Data.Result.Failure = _failure2.default;
});
define('frampton-data/maybe/create', ['exports', 'frampton-utils/is_something', 'frampton-utils/is_function', 'frampton-utils/of_value', 'frampton-utils/is_equal'], function (exports, _is_something, _is_function, _of_value, _is_equal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NothingType = exports.JustType = exports.createMaybe = undefined;

  var _is_something2 = _interopRequireDefault(_is_something);

  var _is_function2 = _interopRequireDefault(_is_function);

  var _of_value2 = _interopRequireDefault(_of_value);

  var _is_equal2 = _interopRequireDefault(_is_equal);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function create(val) {
    if ((0, _is_something2.default)(val)) {
      return new Just(val);
    } else {
      return new Nothing();
    }
  }

  /**
   * @name Maybe
   * @class
   * @abstract
   * @private
   * @memberof Frampton.Data
   */
  function Maybe() {}

  /**
   * @name toString
   * @method
   * @memberof Frampton.Data.Mabye#
   * @returns {String}
   */
  Maybe.prototype.toString = function () {
    return 'Just(' + this._value + ')';
  };

  /**
   * join :: Maybe (a -> b) -> Maybe a -> Maybe b
   *
   * Applies the function in one maybe to the value of another.
   *
   * @name join
   * @method
   * @memberof Frampton.Data.Maybe#
   * @param {Frampton.Data.Maybe} mb
   * @returns {Frampton.Data.Maybe}
   */
  Maybe.prototype.ap = function (mb) {
    return create(this._value(mb._value));
  };

  /**
   * join :: Maybe (Maybe a) -> Maybe a
   *
   * Takes a nested Maybe and removes one level of nesting.
   *
   * @name join
   * @method
   * @memberof Frampton.Data.Maybe#
   * @returns {Frampton.Data.Maybe}
   */
  Maybe.prototype.join = function () {
    return this.get();
  };

  /**
   * @name fork
   * @method
   * @memberof Frampton.Data.Maybe#
   * @param {Function} justFn Function to call with value of Just
   * @param {Function} nothingFn Function to call with value of Nothing
   * @returns {*} The return value of the matching function
   */
  Maybe.prototype.fork = function (justFn, _) {
    return justFn(this._value);
  };

  /**
   * map :: Maybe a -> (a -> b) -> Maybe b
   *
   * Transforms the value of a Maybe with the given function.
   *
   * @name map
   * @method
   * @memberof Frampton.Data.Maybe#
   * @param {Function} mapping Function used to map value of Maybe
   * @returns {Frampton.Data.Maybe}
   */
  Maybe.prototype.map = function (mapping) {
    var mappingFn = (0, _is_function2.default)(mapping) ? mapping : (0, _of_value2.default)(mapping);
    return create(mappingFn(this._value));
  };

  /**
   * chain :: Maybe a -> (a -> Maybe b) -> Maybe b
   *
   * Takes the value of a Maybe and gives it to a function that returns a new Maybe.
   *
   * @name chain
   * @method
   * @memberof Frampton.Data.Maybe#
   * @param {Function} mapping Function used to create new Maybe
   * @returns {Frampton.Data.Maybe}
   */
  Maybe.prototype.chain = function (mapping) {
    return this.map(mapping).join();
  };

  /**
   * filter :: Maybe a -> (a -> Boolean) -> Maybe a
   *
   * Turns a Just into a Nothing if the predicate returns false
   *
   * @name filter
   * @method
   * @memberof Frampton.Data.Maybe#
   * @param {Function} predicate Function used to test value
   * @returns {Frampton.Data.Maybe}
   */
  Maybe.prototype.filter = function (predicate) {
    var filterFn = (0, _is_function2.default)(predicate) ? predicate : (0, _is_equal2.default)(predicate);
    if (filterFn(this._value)) {
      return new Just(this._value);
    } else {
      return new Nothing();
    }
  };

  /**
   * get :: Maybe a -> a
   *
   * Extract the value from a Maybe
   *
   * @name get
   * @method
   * @memberof Frampton.Data.Maybe#
   * @returns {*}
   */
  Maybe.prototype.get = function () {
    return this._value;
  };

  /**
   * getOrElse :: Maybe a -> a -> a
   *
   * @name getOrElse
   * @method
   * @memberof Frampton.Data.Maybe#
   * @returns {*}
   */
  Maybe.prototype.getOrElse = function (_) {
    return this._value;
  };

  /**
   * isNothing :: Maybe a -> Boolean
   *
   * @name isNothing
   * @method
   * @memberof Frampton.Data.Maybe#
   * @returns {Boolean}
   */
  Maybe.prototype.isNothing = function () {
    return false;
  };

  /**
   * isJust :: Maybe a -> Boolean
   *
   * @name isJust
   * @method
   * @memberof Frampton.Data.Maybe#
   * @returns {Boolean}
   */
  Maybe.prototype.isJust = function () {
    return false;
  };

  /**
   * @name Just
   * @class
   * @extends Frampton.Data.Maybe
   */
  function Just(val) {
    this._value = val;
  }

  Just.prototype = new Maybe();

  Just.prototype.isJust = function () {
    return true;
  };

  /**
   * @name Nothing
   * @class
   * @extends Frampton.Data.Maybe
   */
  function Nothing() {}

  Nothing.prototype = new Maybe();

  Nothing.prototype.toString = function () {
    return 'Nothing';
  };

  Nothing.prototype.fork = function (_, nothingFn) {
    return nothingFn();
  };

  Nothing.prototype.join = function () {
    return new Nothing();
  };

  Nothing.prototype.map = function (_) {
    return new Nothing();
  };

  Nothing.prototype.filter = function (_) {
    return new Nothing();
  };

  Nothing.prototype.ap = function (_) {
    return new Nothing();
  };

  Nothing.prototype.chain = function (_) {
    return new Nothing();
  };

  Nothing.prototype.get = function () {
    throw new Error('Cannot get the value of a Nothing');
  };

  Nothing.prototype.getOrElse = function (val) {
    return val;
  };

  Nothing.prototype.isNothing = function () {
    return true;
  };

  var createMaybe = exports.createMaybe = create;

  var JustType = exports.JustType = Just;

  var NothingType = exports.NothingType = Nothing;
});
define('frampton-data/maybe/just', ['exports', 'frampton-data/maybe/create'], function (exports, _create) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = create_just;
  function create_just(val) {
    return new _create.JustType(val);
  }
});
define('frampton-data/maybe/nothing', ['exports', 'frampton-data/maybe/create'], function (exports, _create) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = create_nothing;
  function create_nothing() {
    return new _create.NothingType();
  }
});
define('frampton-data/record/create', ['exports', 'frampton/namespace', 'frampton-utils/guid', 'frampton-utils/warn', 'frampton-object/merge', 'frampton-object/keys', 'frampton-object/map', 'frampton-object/reduce'], function (exports, _namespace, _guid, _warn, _merge, _keys, _map, _reduce) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = create_record;

  var _namespace2 = _interopRequireDefault(_namespace);

  var _guid2 = _interopRequireDefault(_guid);

  var _warn2 = _interopRequireDefault(_warn);

  var _merge2 = _interopRequireDefault(_merge);

  var _keys2 = _interopRequireDefault(_keys);

  var _map2 = _interopRequireDefault(_map);

  var _reduce2 = _interopRequireDefault(_reduce);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var blacklist = ['_id', '_props', 'ctor', 'keys', 'get', 'set', 'update', 'data'];

  function validateData(props, data) {
    if (!_namespace2.default.isProd()) {
      for (var prop in data) {
        if (props.indexOf(prop) === -1) {
          throw new TypeError('Frampton.Data.Record received unknown key: ' + prop);
        }
      }
    }
  }

  function makeRecord(data, id, props) {

    var model = {};
    model.ctor = 'Frampton.Data.Record';

    // private
    model._id = id;
    model._props = props;

    /**
     * @name data
     * @memberof Frampton.Data.Record#
     * @returns {Object}
     */
    model.data = function () {
      return Object.freeze(data);
    };

    /**
     * @name keys
     * @memberof Frampton.Data.Record#
     * @returns {Array}
     */
    model.keys = function () {
      return Object.freeze(props);
    };

    /**
     * @name update
     * @memberof Frampton.Data.Record#
     * @param {Object} update
     * @returns {Object}
     */
    model.update = function (update) {
      // In dev mode verify object properties
      validateData(props, update);
      return create_record((0, _merge2.default)(data, update), id, props);
    };

    /**
     * @name set
     * @memberof Frampton.Data.Record#
     * @param {String} key
     * @param {*} value
     * @returns {Frampont.Data.Record}
     */
    model.set = function (key, value) {
      var update = {};
      update[key] = value;
      return model.update(update);
    };

    /**
     * @name map
     * @memberof Frampton.Data.Record#
     * @method
     * @param {Function} mapping
     * @returns {Frampton.Data.Record}
     */
    model.map = function (mapping) {
      var update = (0, _map2.default)(mapping, data);
      return create_record((0, _merge2.default)(data, update), id, props);
    };

    /**
     * @name reduce
     * @memberof Frampton.Data.Record#
     * @method
     * @param {Function} mapping
     * @param {*} initial
     * @returns {Frampton.Data.Record}
     */
    model.reduce = function (mapping, initial) {
      return (0, _reduce2.default)(mapping, initial, data);
    };

    for (var i = 0; i < props.length; i++) {
      var key = props[i];
      var value = data[key];
      if (blacklist.indexOf(key) === -1) {
        model[key] = value;
      } else {
        (0, _warn2.default)('Frampton.Data.Record received a protected key: ' + key);
      }
    }

    return Object.freeze(model);
  }

  function create_record(data) {
    return makeRecord(data, (0, _guid2.default)(), (0, _keys2.default)(data));
  }
});
define('frampton-data/result/failure', ['exports', 'frampton-data/result/result'], function (exports, _result) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = failure;
  function failure(err) {
    return new _result.FailureType(err);
  }
});
define('frampton-data/result/from_throwable', ['exports', 'frampton-utils/curry_n', 'frampton-data/result/success', 'frampton-data/result/failure'], function (exports, _curry_n, _success, _failure) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = from_throwable;

  var _curry_n2 = _interopRequireDefault(_curry_n);

  var _success2 = _interopRequireDefault(_success);

  var _failure2 = _interopRequireDefault(_failure);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function from_throwable(fn) {
    var arity = fn.length;
    return (0, _curry_n2.default)(arity, function () {
      try {
        return (0, _success2.default)(fn.apply(undefined, arguments));
      } catch (e) {
        return (0, _failure2.default)(e.message);
      }
    });
  }
});
define('frampton-data/result/result', ['exports', 'frampton-utils/of_value', 'frampton-utils/is_equal', 'frampton-utils/is_function'], function (exports, _of_value, _is_equal, _is_function) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.FailureType = exports.SuccessType = undefined;

  var _of_value2 = _interopRequireDefault(_of_value);

  var _is_equal2 = _interopRequireDefault(_is_equal);

  var _is_function2 = _interopRequireDefault(_is_function);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name Result
   * @class
   * @abstract
   * @memberof Frampton.Data
   */
  function Result() {}

  /**
   * Provides a string representation of this Result
   *
   * @name toString
   * @method
   * @override
   * @memberof Frampton.Data.Result#
   * @returns {String}
   */
  Result.prototype.toString = function () {
    return 'Success(' + this._value + ')';
  };

  /**
   * Maps the successful value of a Result. Failures are returned unaltered.
   *
   * @name map
   * @method
   * @memberof Frampton.Data.Result#
   * @param {Function} mapping Function used to map successful value
   * @returns {Frampton.Data.Result}
   */
  Result.prototype.map = function (mapping) {
    var mappingFn = (0, _is_function2.default)(mapping) ? mapping : (0, _of_value2.default)(mapping);
    return new Success(mappingFn(this._value));
  };

  /**
   * Maps the failed value of a Result. Successes are returned unaltered.
   *
   * @name mapFailure
   * @method
   * @memberof Frampton.Data.Result#
   * @param {Function} mapping Function used to map failed value
   * @returns {Frampton.Data.Result}
   */
  Result.prototype.mapFailure = function (_) {
    return new Success(this._value);
  };

  /**
   * Filters successful values. If the predicate fails the success becomes a failure.
   *
   * @name filter
   * @method
   * @memberof Frampton.Data.Result#
   * @param {Function} predicate Function to test successful values
   * @returns {Frampton.Data.Result}
   */
  Result.prototype.filter = function (predicate) {
    var filterFn = (0, _is_function2.default)(predicate) ? predicate : (0, _is_equal2.default)(predicate);
    if (filterFn(this._value)) {
      return new Success(this._value);
    } else {
      return new Failure(this._value);
    }
  };

  /**
   * Handle the value in a Result. Given two functions it will call the appropriate one
   * with the value of this Result and return the return value of that function.
   *
   * @name fork
   * @method
   * @memberof Frampton.Data.Result#
   * @param {Function} success Function to call for Successes
   * @param {Function} failure Function to call for Failures
   * @returns {*} The result of the given callback function
   */
  Result.prototype.fork = function (success, _) {
    return success(this._value);
  };

  /**
   * Is this Result a Success?
   *
   * @name isSuccess
   * @method
   * @memberof Frampton.Data.Result#
   * @returns {Boolean}
   */
  Result.prototype.isSuccess = function () {
    return false;
  };

  /**
   * Is this Result a Failure?
   *
   * @name isFailure
   * @method
   * @memberof Frampton.Data.Result#
   * @returns {Boolean}
   */
  Result.prototype.isFailure = function () {
    return false;
  };

  function Success(val) {
    this._value = val;
  }

  Success.prototype = new Result();

  Success.prototype.isSuccess = function () {
    return true;
  };

  function Failure(err) {
    this._value = err;
  }

  Failure.prototype = new Result();

  Failure.prototype.toString = function () {
    return 'Failure(' + this._value + ')';
  };

  Failure.prototype.map = function (_) {
    return new Failure(this._value);
  };

  Failure.prototype.mapFailure = function (mapping) {
    var mappingFn = (0, _is_function2.default)(mapping) ? mapping : (0, _of_value2.default)(mapping);
    return new Failure(mappingFn(this._value));
  };

  Failure.prototype.filter = function (_) {
    return new Failure(this._value);
  };

  Failure.prototype.fork = function (_, failure) {
    return failure(this._value);
  };

  Failure.prototype.isFailure = function () {
    return true;
  };

  var SuccessType = exports.SuccessType = Success;

  var FailureType = exports.FailureType = Failure;
});
define('frampton-data/result/success', ['exports', 'frampton-data/result/result'], function (exports, _result) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = success;
  function success(val) {
    return new _result.SuccessType(val);
  }
});
define('frampton-data/task/batch', ['exports', 'frampton-data/task/create'], function (exports, _create) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = batch;

  var _create2 = _interopRequireDefault(_create);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function batch() {
    for (var _len = arguments.length, list = Array(_len), _key = 0; _key < _len; _key++) {
      list[_key] = arguments[_key];
    }

    return (0, _create2.default)(function (sinks) {
      var len = list.length;
      for (var i = 0; i < len; i++) {
        list[i].run(sinks);
      }
    });
  }
});
define('frampton-data/task/create', ['exports', 'frampton-utils/immediate', 'frampton-utils/is_function', 'frampton-utils/noop', 'frampton-utils/of_value', 'frampton-utils/is_equal', 'frampton-data/task/valid_sinks'], function (exports, _immediate, _is_function, _noop, _of_value, _is_equal, _valid_sinks) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Task = undefined;
  exports.default = create_task;

  var _immediate2 = _interopRequireDefault(_immediate);

  var _is_function2 = _interopRequireDefault(_is_function);

  var _noop2 = _interopRequireDefault(_noop);

  var _of_value2 = _interopRequireDefault(_of_value);

  var _is_equal2 = _interopRequireDefault(_is_equal);

  var _valid_sinks2 = _interopRequireDefault(_valid_sinks);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Task = exports.Task = function () {
    function Task(computation) {
      _classCallCheck(this, Task);

      this.fn = computation;
    }

    /**
     * Takes a hash of functions to call based on the resolution of the Task and runs the computation
     * contained within this Task.
     *
     * The sinks object should be of the form:
     * {
     *   reject : (err) => {},
     *   resolve : (val) => {},
     *   progress : (prog) => {}
     * }
     *
     * Each function is used by the contained computation to update us on the state of the running
     * computation.
     *
     * @name run
     * @method
     * @memberof Frampton.Data.Task#
     * @param {Object} sinks
     * @param {Function} sinks.reject - The function to call on failure.
     * @param {Function} sinks.resolve - The function to call on success.
     * @param {Function} sinks.progress - The function to call on progress.
     */


    _createClass(Task, [{
      key: 'run',
      value: function run(sinks) {
        var _this = this;

        (0, _immediate2.default)(function () {
          try {
            _this.fn((0, _valid_sinks2.default)(sinks));
          } catch (e) {
            sinks.reject(e);
          }
        });
      }

      /**
       * of(return) :: a -> Success a
       *
       * Returns a Task that always resolves with the given value.
       *
       * @name of
       * @method
       * @memberof Frampton.Data.Task#
       * @param {*} val - Value to resolve task with
       * @returns {Frampton.Data.Task}
       */

    }, {
      key: 'of',
      value: function of(val) {
        return new Task(function (sinks) {
          sinks.resolve(val);
        });
      }

      /**
       * join :: Task x (Task x a) -> Task x a
       *
       * Takes a nested Task and removes one level of nesting.
       *
       * @name join
       * @method
       * @memberof Frampton.Data.Task#
       * @returns {Frampton.Data.Task}
       */

    }, {
      key: 'join',
      value: function join() {
        var source = this;
        return new Task(function (sinks) {
          source.run({
            reject: sinks.reject,
            resolve: function resolve(val) {
              val.run(sinks);
            },
            progress: _noop2.default
          });
        });
      }

      /**
       * concat(>>) :: Task x a -> Task x b -> Task x b
       *
       * Runs one task after another, discarding the return value of the first.
       *
       * @name concat
       * @method
       * @memberof Frampton.Data.Task#
       * @param {Frampton.Data.Task} task - Task to run after this task
       * @returns {Frampton.Data.Task}
       */

    }, {
      key: 'concat',
      value: function concat(task) {
        var source = this;
        return new Task(function (sinks) {
          source.run({
            reject: sinks.reject,
            resolve: function resolve(val) {
              task.run(sinks);
            },
            progress: _noop2.default
          });
        });
      }

      /**
       * chain(>>=) :: Task x a -> (a -> Task x b) -> Task x b
       *
       * Maps the return value of one Task to another Task, chaining two Tasks together.
       *
       * @name chain
       * @method
       * @memberof Frampton.Data.Task#
       * @param {Function} mapping - Function to map the return value of this Task to another Task.
       * @returns {Frampton.Data.Task}
       */

    }, {
      key: 'chain',
      value: function chain(mapping) {
        return this.map(mapping).join();
      }

      /**
       * ap(<*>) :: Task x (a -> b) -> Task x a -> Task x b
       *
       * @name ap
       * @method
       * @memberof Frampton.Data.Task#
       * @param {Frampton.Data.Task} task
       * @returns {Frampton.Data.Task}
       */

    }, {
      key: 'ap',
      value: function ap(task) {
        return this.chain(function (fn) {
          return task.map(fn);
        });
      }

      /**
       * recover :: Task x a -> (x -> b) -> Task x b
       *
       * Used to map a reject to a resolve.
       *
       * @name recover
       * @method
       * @memberof Frampton.Data.Task#
       * @param {Function} mapping
       * @returns {Frampton.Data.Task}
       */

    }, {
      key: 'recover',
      value: function recover(mapping) {
        var source = this;
        return new Task(function (sinks) {
          source.run({
            reject: function reject(err) {
              sinks.resolve(mapping(err));
            },
            resolve: sinks.resolve,
            progress: sinks.progress
          });
        });
      }

      /**
       * default :: Task x a -> b -> Task x b
       *
       * Returns the given value as a resolve in case of a reject.
       *
       * @name default
       * @method
       * @memberof Frampton.Data.Task#
       * @param {*} val - A value to map errors to
       * @returns {Frampton.Data.Task}
       */

    }, {
      key: 'default',
      value: function _default(val) {
        return this.recover(function () {
          return val;
        });
      }

      /**
       * progress :: Task x a -> (a -> b) -> Task x b
       *
       * Maps progress branch to resolution branch
       *
       * @name progress
       * @method
       * @memberof Frampton.Data.Task#
       * @param {Function} mapping
       * @returns {Frampton.Data.Task}
       */

    }, {
      key: 'progress',
      value: function progress(mapping) {
        var source = this;
        var mappingFn = (0, _is_function2.default)(mapping) ? mapping : (0, _of_value2.default)(mapping);
        return new Task(function (sinks) {
          source.run({
            reject: sinks.reject,
            resolve: sinks.resolve,
            progress: function progress(val) {
              sinks.resolve(mappingFn(val));
            }
          });
        });
      }

      /**
       * map :: Task x a -> (a -> b) -> Task x b
       *
       * @name map
       * @method
       * @memberof Frampton.Data.Task#
       * @param {Function} mapping
       * @returns {Frampton.Data.Task}
       */

    }, {
      key: 'map',
      value: function map(mapping) {
        var source = this;
        var mappingFn = (0, _is_function2.default)(mapping) ? mapping : (0, _of_value2.default)(mapping);
        return new Task(function (sinks) {
          source.run({
            reject: sinks.reject,
            resolve: function resolve(val) {
              sinks.resolve(mappingFn(val));
            },
            progress: sinks.progress
          });
        });
      }

      /**
       * success :: Task x a -> (a -> b) -> Task x b
       *
       * A symantic alias for Task.prototype.map
       *
       * @name success
       * @method
       * @memberof Frampton.Data.Task#
       * @param {Function} mapping - The function to map the resolve value.
       * @returns {Frampton.Data.Task}
       */

    }, {
      key: 'success',
      value: function success(mapping) {
        return this.map(mapping);
      }

      /**
       * filter :: Task x a -> (a -> b) -> Task x b
       *
       * @name filter
       * @method
       * @memberof Frampton.Data.Task#
       * @param {Function} predicate - The function to filter the resolve value.
       * @returns {Frampton.Data.Task}
       */

    }, {
      key: 'filter',
      value: function filter(predicate) {
        var source = this;
        var filterFn = (0, _is_function2.default)(predicate) ? predicate : (0, _is_equal2.default)(predicate);
        return new Task(function (sinks) {
          source.run({
            reject: sinks.reject,
            resolve: function resolve(val) {
              if (filterFn(val)) {
                sinks.resolve(val);
              } else {
                sinks.reject(val);
              }
            },
            progress: sinks.progress
          });
        });
      }

      /**
       * validate :: Task x a -> (a -> b) -> Task x b
       *
       * A symantic alias for filter. Used to validate the return value of a Task. It the given
       * predicate returns false a resolve is turned into a reject.
       *
       * @name validate
       * @method
       * @memberof Frampton.Data.Task#
       * @param {Function} predicate - The function to validate the resolve value.
       * @returns {Frampton.Data.Task}
       */

    }, {
      key: 'validate',
      value: function validate(predicate) {
        return this.filter(predicate);
      }
    }]);

    return Task;
  }();

  /**
   * Method for creating new Tasks. This method should be used instead of calling the Task
   * constructor directly.
   *
   * @name create
   * @method
   * @memberof Frampton.Data.Task
   * @param {Function} computation - The function the Task should execute
   * @returns {Frampton.Data.Task}
   */
  function create_task(computation) {
    return new Task(computation);
  }
});
define('frampton-data/task/delay', ['exports', 'frampton-data/task/create', 'frampton-utils/curry_n'], function (exports, _create, _curry_n) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _create2 = _interopRequireDefault(_create);

  var _curry_n2 = _interopRequireDefault(_curry_n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function delay(time, val) {
    return (0, _create2.default)(function (sinks) {
      setTimeout(function () {
        sinks.resolve(val);
      }, time);
    });
  });
});
define('frampton-data/task/execute', ['exports', 'frampton-utils/log', 'frampton-utils/warn'], function (exports, _log, _warn) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = execute;

  var _log2 = _interopRequireDefault(_log);

  var _warn2 = _interopRequireDefault(_warn);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * execute :: Signal Task x a -> Signal a -> ()
   *
   * Takes a Signal of Tasks to execute and a function to call with the resolve values
   * of those Tasks. Progress and reject values are ignored (logged to the console in dev mode).
   * It is suggested to use Tasks that have their reject and progress values mapped to reslove
   * values using the recover and progress methods on the Task prototype.
   *
   * @name execute
   * @memberof Frampton.Task
   * @static
   * @param {Frampton.Signals.Signal} tasks - Signal of Tasks to execute
   * @param {Function} value - A function to pass the resolve values to
   */
  function execute(tasks, value) {
    tasks.value(function (task) {
      task.run({
        reject: function reject(err) {
          (0, _warn2.default)('Error running task: ', err);
        },
        resolve: function resolve(val) {
          value(val);
        },
        progress: function progress(val) {
          (0, _log2.default)('Task progress: ', val);
        }
      });
    });
  }
});
define('frampton-data/task/fail', ['exports', 'frampton-data/task/create'], function (exports, _create) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = fail;

  var _create2 = _interopRequireDefault(_create);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * fail :: x -> Task x a
   *
   * Creates a Task that always fails with the given value.
   *
   * @name fail
   * @method
   * @memberof Frampton.Data.Task
   * @param {*} err - Value used as the return value of the reject branch.
   * @returns {Frampton.Data.Task}
   */
  function fail(err) {
    return (0, _create2.default)(function (sinks) {
      return sinks.reject(err);
    });
  }
});
define('frampton-data/task/never', ['exports', 'frampton-data/task/create'], function (exports, _create) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = never;

  var _create2 = _interopRequireDefault(_create);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * never :: Task x a
   *
   * Creates a Task that never resolves.
   *
   * @name never
   * @method
   * @memberof Frampton.Data.Task
   * @returns {Frampton.Data.Task}
   */
  function never() {
    return (0, _create2.default)(function () {});
  }
});
define("frampton-data/task/sequence", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = sequence;
  /**
   * sequence :: [Task x a] -> Task x a
   *
   * Creates a Task that runs the given Tasks in the order they are passed in. The new
   * Task will resolve when all of its parent Tasks have resolved. The resolve value of
   * the new Task is the resolve value of the last of its parents Tasks. The resolve
   * values for all other Tasks are discarded.
   *
   * @name sequence
   * @method
   * @memberof Frampton.Data.Task
   * @param {Frampton.Data.Task[]} tassk - The Tasks to wait for
   * @returns {Frampton.Data.Task}
   */
  function sequence() {
    for (var _len = arguments.length, tasks = Array(_len), _key = 0; _key < _len; _key++) {
      tasks[_key] = arguments[_key];
    }

    return tasks.reduce(function (acc, next) {
      return acc.concat(next);
    });
  }
});
define('frampton-data/task/succeed', ['exports', 'frampton-data/task/create'], function (exports, _create) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = succeed;

  var _create2 = _interopRequireDefault(_create);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * succeed :: a -> Task x a
   *
   * Creates a Task that always succeeds with the given value.
   *
   * @name succeed
   * @method
   * @memberof Frampton.Data.Task
   * @param {*} val - Value used as the return value of the resolve branch.
   * @returns {Frampton.Data.Task}
   */
  function succeed(val) {
    return (0, _create2.default)(function (sinks) {
      return sinks.resolve(val);
    });
  }
});
define('frampton-data/task/sync', ['exports', 'frampton-data/task/create', 'frampton-data/task/valid_sinks'], function (exports, _create, _valid_sinks) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SyncTask = undefined;
  exports.default = create_sync;

  var _valid_sinks2 = _interopRequireDefault(_valid_sinks);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var SyncTask = exports.SyncTask = function (_Task) {
    _inherits(SyncTask, _Task);

    function SyncTask(computation) {
      _classCallCheck(this, SyncTask);

      return _possibleConstructorReturn(this, (SyncTask.__proto__ || Object.getPrototypeOf(SyncTask)).call(this, computation));
    }

    /**
     * Takes a hash of functions to call based on the resolution of the Task and runs the computation
     * contained within this Task.
     *
     * The sinks object should be of the form:
     * {
     *   reject : (err) => {},
     *   resolve : (val) => {},
     *   progress : (prog) => {}
     * }
     *
     * Each function is used by the contained computation to update us on the state of the running
     * computation.
     *
     * @name run
     * @method
     * @memberof Frampton.Data.SyncTask#
     * @param {Object} sinks
     * @param {Function} sinks.reject - The function to call on failure.
     * @param {Function} sinks.resolve - The function to call on success.
     * @param {Function} sinks.progress - The function to call on progress.
     */


    _createClass(SyncTask, [{
      key: 'run',
      value: function run(sinks) {
        try {
          this.fn((0, _valid_sinks2.default)(sinks));
        } catch (e) {
          sinks.reject(e);
        }
      }
    }]);

    return SyncTask;
  }(_create.Task);

  function create_sync(computation) {
    return new SyncTask(computation);
  }
});
define('frampton-data/task/valid_sinks', ['exports', 'frampton-utils/noop'], function (exports, _noop) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = valid_sinks;

  var _noop2 = _interopRequireDefault(_noop);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name validSinks
   * @param {Object} sinks - Sinks to validate
   * @returns {Object} The validated sinks
   */
  function valid_sinks(sinks) {
    return {
      reject: sinks.reject || _noop2.default,
      resolve: sinks.resolve || _noop2.default,
      progress: sinks.progress || _noop2.default
    };
  }
});
define('frampton-data/task/when', ['exports', 'frampton-utils/log', 'frampton-utils/warn', 'frampton-data/task/create'], function (exports, _log, _warn, _create) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = when;

  var _log2 = _interopRequireDefault(_log);

  var _warn2 = _interopRequireDefault(_warn);

  var _create2 = _interopRequireDefault(_create);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function logError(err) {
    (0, _warn2.default)('error in task: ', err);
  }

  function logProgress(val) {
    (0, _log2.default)('progress in task: ', val);
  }

  /**
   * when :: [Task x a] -> Task x [a]
   *
   * Creates a Task that waits for each of the given Tasks to resolve before it resolves.
   * When it does resolve, it resolves with an Array containing the resolved values of each
   * of its parent Tasks. The Array contains the resolve values in the same order as the
   * order that the parent Tasks were passed in.
   *
   * @name when
   * @method
   * @memberof Frampton.Data.Task
   * @param {Frampton.Data.Task[]} tasks - The Tasks to wait for
   * @returns {Frampton.Data.Task}
   */
  function when() {
    for (var _len = arguments.length, tasks = Array(_len), _key = 0; _key < _len; _key++) {
      tasks[_key] = arguments[_key];
    }

    return (0, _create2.default)(function (sinks) {

      var valueArray = new Array(tasks.length);
      var len = tasks.length;
      var idx = 0;
      var count = 0;

      tasks.forEach(function (task) {
        var index = idx++;
        task.run({
          reject: function reject(err) {
            logError(err);
            count = count + 1;
            valueArray[index] = null;
            if (count === len) {
              sinks.resolve(valueArray);
            }
          },
          resolve: function resolve(val) {
            count = count + 1;
            valueArray[index] = val;
            if (count === len) {
              sinks.resolve(valueArray);
            }
          },

          progress: logProgress
        });
      });
    });
  }
});
define('frampton-data/union/create', ['exports', 'frampton-utils/curry_n', 'frampton-object/keys', 'frampton-data/union/utils/create_type', 'frampton-data/union/utils/case_of', 'frampton-data/union/utils/validate_types'], function (exports, _curry_n, _keys, _create_type, _case_of, _validate_types) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = create_union;

  var _curry_n2 = _interopRequireDefault(_curry_n);

  var _keys2 = _interopRequireDefault(_keys);

  var _create_type2 = _interopRequireDefault(_create_type);

  var _case_of2 = _interopRequireDefault(_case_of);

  var _validate_types2 = _interopRequireDefault(_validate_types);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
  
    const Action = Union({
      Foo : ['name', 'id'],
      Bar : ['id', 'description']
    });
  
    const foo = Action.Foo('test', 89);
  
   */

  /**
   * Creates constructors for each type described in config
   *
   * @name create
   * @memberof Frampton.Data.Union
   * @param {Object} values
   * @returns {Frampton.Data.Union}
   */
  function create_union(values) {
    var parent = {};
    var children = (0, _keys2.default)(values);
    (0, _validate_types2.default)(children);

    parent.ctor = 'Frampton.Data.Union';
    parent.children = children;
    parent.match = (0, _curry_n2.default)(3, _case_of2.default, parent);

    for (var name in values) {
      parent[name] = (0, _create_type2.default)(name, values[name]);
    }

    return Object.freeze(parent);
  }
});
define('frampton-data/union/utils/case_of', ['exports', 'frampton-utils/is_nothing', 'frampton-data/union/utils/validate_options', 'frampton-data/union/utils/get_match'], function (exports, _is_nothing, _validate_options, _get_match) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = case_of;

  var _is_nothing2 = _interopRequireDefault(_is_nothing);

  var _validate_options2 = _interopRequireDefault(_validate_options);

  var _get_match2 = _interopRequireDefault(_get_match);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  /**
   * @name caseOf
   * @memberof Frampton.Data.Union
   * @param {Object} parent
   * @param {Object} cases
   * @param {Frampton.Data.Union} child
   * @returns {*}
   */
  function case_of(parent, cases, child) {

    // Validate we have exhausitve pattern match
    (0, _validate_options2.default)(parent, cases);

    var match = (0, _get_match2.default)(child, cases);

    if ((0, _is_nothing2.default)(match)) {
      throw new Error('No match for value with name: ' + child.ctor);
    } else {
      // Destructure arguments for passing to callback
      return match.apply(undefined, _toConsumableArray(child._values));
    }
  }
});
define('frampton-data/union/utils/create_type', ['exports', 'frampton-utils/warn', 'frampton-utils/curry_n', 'frampton-utils/is_string', 'frampton-data/union/utils/to_string', 'frampton-data/union/utils/validate_names'], function (exports, _warn, _curry_n, _is_string, _to_string, _validate_names) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = create_type;

  var _warn2 = _interopRequireDefault(_warn);

  var _curry_n2 = _interopRequireDefault(_curry_n);

  var _is_string2 = _interopRequireDefault(_is_string);

  var _to_string2 = _interopRequireDefault(_to_string);

  var _validate_names2 = _interopRequireDefault(_validate_names);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name createType
   * @memberof Frampton.Data.Union
   * @param {String} name
   * @param {Object} fields
   * @returns {Function}
   */
  function create_type(name, fields) {

    (0, _validate_names2.default)(fields);
    var len = fields.length;

    return (0, _curry_n2.default)(len, function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var argLen = args.length;

      if (len !== argLen) {
        (0, _warn2.default)('Frampton.Data.Union.' + name + ' expected ' + len + ' arguments but received ' + argLen + '.');
      }

      var child = {};
      child.ctor = name;
      child.toString = _to_string2.default;
      child._values = args;
      child._keys = fields;

      for (var i = 0; i < argLen; i++) {
        var field = fields[i];
        if ((0, _is_string2.default)(field)) {
          child[field] = args[i];
        } else {
          (0, _warn2.default)('Frampton.Data.Union.' + name + ' received argument without associated field.');
        }
      }

      return Object.freeze(child);
    });
  }
});
define('frampton-data/union/utils/get_match', ['exports', 'frampton-utils/is_something', 'frampton-data/union/utils/wildcard'], function (exports, _is_something, _wildcard) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = get_match;

  var _is_something2 = _interopRequireDefault(_is_something);

  var _wildcard2 = _interopRequireDefault(_wildcard);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name getMatch
   * @memberof Frampton.Data.Union.Utils
   * @param {}
   * @param {}
   */
  function get_match(child, cases) {
    var match = cases[child.ctor];
    if ((0, _is_something2.default)(match)) {
      return match;
    } else {
      return cases[_wildcard2.default];
    }
  }
});
define('frampton-data/union/utils/to_string', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = to_string;
  function to_string() {
    var value = this._values.join(',');
    return 'Union.' + this.ctor + '(' + value + ')';
  }
});
define('frampton-data/union/utils/validate_names', ['exports', 'frampton-utils/is_array', 'frampton-data/union/utils/wildcard'], function (exports, _is_array, _wildcard) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = validate_names;

  var _is_array2 = _interopRequireDefault(_is_array);

  var _wildcard2 = _interopRequireDefault(_wildcard);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var blacklist = ['ctor', 'get', 'set', 'update'];

  function validate_names(names) {

    if (!(0, _is_array2.default)(names)) {
      throw new Error('Frampton.Data.Union must receive an array of fields for each type');
    }

    var len = names.length;
    for (var i = 0; i < len; i++) {
      var name = names[i];
      if (blacklist.indexOf(name) > -1 || name === _wildcard2.default) {
        throw new Error('Frampton.Data.Union recieved reserved field name ' + name);
      }
    }
  }
});
define('frampton-data/union/utils/validate_options', ['exports', 'frampton-utils/warn', 'frampton-data/union/utils/wildcard'], function (exports, _warn, _wildcard) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = validate_options;

  var _warn2 = _interopRequireDefault(_warn);

  var _wildcard2 = _interopRequireDefault(_wildcard);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function hasMatch(cases, child) {
    return cases.hasOwnProperty(_wildcard2.default) || cases.hasOwnProperty(child);
  }

  function validate_options(parent, cases) {
    var children = parent.children;
    var len = children.length;
    for (var i = 0; i < len; i++) {
      var child = children[i];
      if (!hasMatch(cases, child)) {
        (0, _warn2.default)('Non-exhaustive pattern match for case: ' + child);
      }
    }
  }
});
define('frampton-data/union/utils/validate_types', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = validate_types;
  var blacklist = ['ctor', 'children', 'caseOf', 'match'];

  function validate_types(types) {
    var len = types.length;
    for (var i = 0; i < len; i++) {
      var name = types[i];
      if (blacklist.indexOf(name) !== -1) {
        throw new Error('Frampton.Data.Union received a protected key: ' + name);
      }
    }
  }
});
define('frampton-data/union/utils/wildcard', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = 'Otherwise';
});
define('frampton-events', ['frampton/namespace', 'frampton-events/on_event', 'frampton-events/on_selector', 'frampton-events/contains', 'frampton-events/event_target', 'frampton-events/event_value', 'frampton-events/get_position', 'frampton-events/get_position_relative', 'frampton-events/has_selector', 'frampton-events/contains_selector', 'frampton-events/selector_contains', 'frampton-events/closest_to_event', 'frampton-events/prevent_default'], function (_namespace, _on_event, _on_selector, _contains, _event_target, _event_value, _get_position, _get_position_relative, _has_selector, _contains_selector, _selector_contains, _closest_to_event, _prevent_default) {
  'use strict';

  var _namespace2 = _interopRequireDefault(_namespace);

  var _on_event2 = _interopRequireDefault(_on_event);

  var _on_selector2 = _interopRequireDefault(_on_selector);

  var _contains2 = _interopRequireDefault(_contains);

  var _event_target2 = _interopRequireDefault(_event_target);

  var _event_value2 = _interopRequireDefault(_event_value);

  var _get_position2 = _interopRequireDefault(_get_position);

  var _get_position_relative2 = _interopRequireDefault(_get_position_relative);

  var _has_selector2 = _interopRequireDefault(_has_selector);

  var _contains_selector2 = _interopRequireDefault(_contains_selector);

  var _selector_contains2 = _interopRequireDefault(_selector_contains);

  var _closest_to_event2 = _interopRequireDefault(_closest_to_event);

  var _prevent_default2 = _interopRequireDefault(_prevent_default);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name Events
   * @namespace
   * @memberof Frampton
   */
  _namespace2.default.Events = {};
  _namespace2.default.Events.onEvent = _on_event2.default;
  _namespace2.default.Events.onSelector = _on_selector2.default;
  _namespace2.default.Events.contains = _contains2.default;
  _namespace2.default.Events.eventTarget = _event_target2.default;
  _namespace2.default.Events.eventValue = _event_value2.default;
  _namespace2.default.Events.hasSelector = _has_selector2.default;
  _namespace2.default.Events.containsSelector = _contains_selector2.default;
  _namespace2.default.Events.selectorContains = _selector_contains2.default;
  _namespace2.default.Events.getPosition = _get_position2.default;
  _namespace2.default.Events.getPositionRelative = _get_position_relative2.default;
  _namespace2.default.Events.closestToEvent = _closest_to_event2.default;
  _namespace2.default.Events.preventDefault = _prevent_default2.default;
});
define('frampton-events/closest_to_event', ['exports', 'frampton-utils/curry', 'frampton-utils/compose', 'frampton-style/closest', 'frampton-events/event_target'], function (exports, _curry, _compose, _closest, _event_target) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _compose2 = _interopRequireDefault(_compose);

  var _closest2 = _interopRequireDefault(_closest);

  var _event_target2 = _interopRequireDefault(_event_target);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function closest_to_event(selector, evt) {
    return (0, _compose2.default)((0, _closest2.default)(selector), _event_target2.default)(evt);
  });
});
define('frampton-events/contains', ['exports', 'frampton-utils/curry', 'frampton-utils/compose', 'frampton-html/contains', 'frampton-events/event_target'], function (exports, _curry, _compose, _contains, _event_target) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _compose2 = _interopRequireDefault(_compose);

  var _contains2 = _interopRequireDefault(_contains);

  var _event_target2 = _interopRequireDefault(_event_target);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function curried_contains(element, evt) {
    return (0, _compose2.default)((0, _contains2.default)(element), _event_target2.default)(evt);
  });
});
define('frampton-events/contains_selector', ['exports', 'frampton-utils/curry', 'frampton-utils/compose', 'frampton-style/contains', 'frampton-events/event_target'], function (exports, _curry, _compose, _contains, _event_target) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _compose2 = _interopRequireDefault(_compose);

  var _contains2 = _interopRequireDefault(_contains);

  var _event_target2 = _interopRequireDefault(_event_target);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function contains_selector(selector, evt) {
    return (0, _compose2.default)((0, _contains2.default)(selector), _event_target2.default)(evt);
  });
});
define('frampton-events/document_cache', ['exports', 'frampton-events/simple_cache'], function (exports, _simple_cache) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _simple_cache2 = _interopRequireDefault(_simple_cache);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _simple_cache2.default)();
});
define('frampton-events/event_dispatcher', ['exports', 'frampton-utils/assert', 'frampton-utils/is_function', 'frampton-utils/is_defined', 'frampton-utils/lazy', 'frampton-events/event_map'], function (exports, _assert, _is_function, _is_defined, _lazy, _event_map) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.removeListener = exports.addListener = undefined;

  var _assert2 = _interopRequireDefault(_assert);

  var _is_function2 = _interopRequireDefault(_is_function);

  var _is_defined2 = _interopRequireDefault(_is_defined);

  var _lazy2 = _interopRequireDefault(_lazy);

  var _event_map2 = _interopRequireDefault(_event_map);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // get dom event -> filter -> return stream
  function addDomEvent(name, node, callback) {
    node.addEventListener(name, callback, !_event_map2.default[name].bubbles);
  }

  function addCustomEvent(name, target, callback) {
    var listen = (0, _is_function2.default)(target.addEventListener) ? target.addEventListener : (0, _is_function2.default)(target.on) ? target.on : null;

    (0, _assert2.default)('Frampton.Events.addListener received an unknown type as target', (0, _is_function2.default)(listen));

    listen.call(target, name, callback);
  }

  function removeDomEvent(name, node, callback) {
    node.removeEventListener(name, callback, !_event_map2.default[name].bubbles);
  }

  function removeCustomEvent(name, target, callback) {
    var remove = (0, _is_function2.default)(target.removeEventListener) ? target.removeEventListener : (0, _is_function2.default)(target.off) ? target.off : null;

    (0, _assert2.default)('Frampton.Events.removeListener received an unknown type as target', (0, _is_function2.default)(remove));

    remove.call(target, name, callback);
  }

  var addListener = exports.addListener = function addListener(eventName, target, callback) {
    if ((0, _is_defined2.default)(_event_map2.default[eventName]) && (0, _is_function2.default)(target.addEventListener)) {
      addDomEvent(eventName, target, callback);
    } else {
      addCustomEvent(eventName, target, callback);
    }

    return (0, _lazy2.default)(removeListener, [eventName, target, callback]);
  };

  var removeListener = exports.removeListener = function removeListener(eventName, target, callback) {
    if ((0, _is_defined2.default)(_event_map2.default[eventName]) && (0, _is_function2.default)(target.removeEventListener)) {
      removeDomEvent(eventName, target, callback);
    } else {
      removeCustomEvent(eventName, target, callback);
    }
  };
});
define("frampton-events/event_map", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {

    abort: {
      bubbles: true,
      signal: null
    },

    blur: {
      bubbles: false,
      signal: null
    },

    change: {
      bubbles: true,
      signal: null
    },

    click: {
      bubbles: true,
      signal: null
    },

    error: {
      bubbles: true,
      signal: null
    },

    focus: {
      bubbles: false,
      signal: null
    },

    focusin: {
      bubbles: true,
      signal: null
    },

    focusout: {
      bubbles: true,
      signal: null
    },

    input: {
      bubbles: true,
      signal: null
    },

    keyup: {
      bubbles: true,
      signal: null
    },

    keydown: {
      bubbles: true,
      signal: null
    },

    keypress: {
      bubbles: true,
      signal: null
    },

    load: {
      bubbles: true,
      signal: null
    },

    mousedown: {
      bubbles: true,
      signal: null
    },

    mouseup: {
      bubbles: true,
      signal: null
    },

    mousemove: {
      bubbles: true,
      signal: null
    },

    mouseenter: {
      bubbles: false,
      signal: null
    },

    mouseleave: {
      bubbles: false,
      signal: null
    },

    mouseover: {
      bubbles: true,
      signal: null
    },

    mouseout: {
      bubbles: true,
      signal: null
    },

    touchstart: {
      bubbles: true,
      signal: null
    },

    touchend: {
      bubbles: true,
      signal: null
    },

    touchcancel: {
      bubbles: true,
      signal: null
    },

    touchleave: {
      bubbles: true,
      signal: null
    },

    touchmove: {
      bubbles: true,
      signal: null
    },

    submit: {
      bubbles: true,
      signal: null
    },

    animationstart: {
      bubbles: true,
      signal: null
    },

    animationend: {
      bubbles: true,
      signal: null
    },

    animationiteration: {
      bubbles: true,
      signal: null
    },

    transitionend: {
      bubbles: true,
      signal: null
    },

    drag: {
      bubbles: true,
      signal: null
    },

    drop: {
      bubbles: true,
      signal: null
    },

    dragstart: {
      bubbles: true,
      signal: null
    },

    dragend: {
      bubbles: true,
      signal: null
    },

    dragenter: {
      bubbles: true,
      signal: null
    },

    dragleave: {
      bubbles: true,
      signal: null
    },

    dragover: {
      bubbles: true,
      signal: null
    },

    scroll: {
      bubbles: true,
      signal: null
    },

    wheel: {
      bubbles: true,
      signal: null
    }
  };
});
define('frampton-events/event_supported', ['exports', 'frampton-utils/is_function', 'frampton-utils/memoize'], function (exports, _is_function, _memoize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _is_function2 = _interopRequireDefault(_is_function);

  var _memoize2 = _interopRequireDefault(_memoize);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var TAGNAMES = {
    select: 'input',
    change: 'input',
    submit: 'form',
    reset: 'form',
    error: 'img',
    load: 'img',
    abort: 'img'
  };

  /**
   * Tests whether a given event is supported by the current browser.
   *
   * @name eventSupported
   * @static
   * @private
   * @memberof Frampton.Events
   * @param {String} eventName The name of the event to test
   * @returns {Boolean} Is the event supported
   */
  exports.default = (0, _memoize2.default)(function event_supported(eventName) {
    var el = document.createElement(TAGNAMES[eventName] || 'div');
    eventName = 'on' + eventName;
    var isSupported = eventName in el;
    if (!isSupported) {
      el.setAttribute(eventName, 'return;');
      isSupported = (0, _is_function2.default)(el[eventName]);
    }
    el = null;
    return !!isSupported;
  });
});
define("frampton-events/event_target", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = event_target;
  /**
   * eventTarget :: DomEvent -> Object
   *
   * @name eventTarget
   * @memberof Frampton.Events
   * @static
   * @param {Object} evt
   * @returns {Object} The target value of the event object, usually a DomNode
   */
  function event_target(evt) {
    return evt.target;
  }
});
define('frampton-events/event_value', ['exports', 'frampton-utils/compose', 'frampton-html/element_value', 'frampton-events/event_target'], function (exports, _compose, _element_value, _event_target) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _compose2 = _interopRequireDefault(_compose);

  var _element_value2 = _interopRequireDefault(_element_value);

  var _event_target2 = _interopRequireDefault(_event_target);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _compose2.default)(_element_value2.default, _event_target2.default);
});
define('frampton-events/get_document_signal', ['exports', 'frampton-events/document_cache', 'frampton-events/get_event_signal'], function (exports, _document_cache, _get_event_signal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = get_document_signal;

  var _document_cache2 = _interopRequireDefault(_document_cache);

  var _get_event_signal2 = _interopRequireDefault(_get_event_signal);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name getDocumentSignal
   * @memberof Frampton.Events
   * @static
   * @private
   * @param {String} name Event name to look up
   * @returns {Frampton.Signal.Signal}
   */
  function get_document_signal(name) {
    return (0, _document_cache2.default)(name, function () {
      return (0, _get_event_signal2.default)(name, document);
    });
  }
});
define('frampton-events/get_event_signal', ['exports', 'frampton-utils/is_empty', 'frampton-signal/create', 'frampton-events/event_dispatcher'], function (exports, _is_empty, _create, _event_dispatcher) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = get_event_signal;

  var _is_empty2 = _interopRequireDefault(_is_empty);

  var _create2 = _interopRequireDefault(_create);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function get_event_signal(name, target) {
    var parts = name.split(' ').filter(function (val) {
      return !(0, _is_empty2.default)(val);
    });
    var len = parts.length;
    var sigs = [];
    for (var i = 0; i < len; i++) {
      var sig = (0, _create2.default)();
      (0, _event_dispatcher.addListener)(parts[i], target, sig.push);
      sigs.push(sig);
    }
    return (0, _create.mergeMany)(sigs);
  }
});
define("frampton-events/get_position", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = get_position;
  /**
   * getPosition :: DomEvent -> [Number, Number]
   *
   * @name getPosition
   * @memberof Frampton.Events
   * @static
   * @param {Object} evt
   * @returns {Array} A pair where the 0 index is the x coord and the 1 index is the y coord
   */
  function get_position(evt) {

    var posx = 0;
    var posy = 0;
    var body = document.body;
    var documentElement = document.documentElement;

    if (evt.pageX || evt.pageY) {
      posx = evt.pageX;
      posy = evt.pageY;
    } else if (evt.clientX || evt.clientY) {
      posx = evt.clientX + body.scrollLeft + documentElement.scrollLeft;
      posy = evt.clientY + body.scrollTop + documentElement.scrollTop;
    }

    return [posx, posy];
  }
});
define('frampton-events/get_position_relative', ['exports', 'frampton-utils/curry', 'frampton-events/get_position'], function (exports, _curry, _get_position) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _get_position2 = _interopRequireDefault(_get_position);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function get_position_relative(node, evt) {

    var position = (0, _get_position2.default)(evt);

    var rect = node.getBoundingClientRect();
    var rel_x = rect.left + document.body.scrollLeft + document.documentElement.scrollLeft;
    var rel_y = rect.top + document.body.scrollTop + document.documentElement.scrollTop;

    var pos_x = position[0] - Math.round(rel_x) - node.clientLeft;
    var pos_y = position[1] - Math.round(rel_y) - node.clientTop;

    return [pos_x, pos_y];
  });
});
define('frampton-events/has_selector', ['exports', 'frampton-utils/curry', 'frampton-utils/compose', 'frampton-style/matches', 'frampton-events/event_target'], function (exports, _curry, _compose, _matches, _event_target) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _compose2 = _interopRequireDefault(_compose);

  var _matches2 = _interopRequireDefault(_matches);

  var _event_target2 = _interopRequireDefault(_event_target);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function has_selector(selector, evt) {
    return (0, _compose2.default)((0, _matches2.default)(selector), _event_target2.default)(evt);
  });
});
define('frampton-events/on_event', ['exports', 'frampton-utils/is_function', 'frampton-utils/is_nothing', 'frampton-events/contains', 'frampton-events/event_map', 'frampton-events/get_document_signal', 'frampton-events/get_event_signal'], function (exports, _is_function, _is_nothing, _contains, _event_map, _get_document_signal, _get_event_signal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = on_event;

  var _is_function2 = _interopRequireDefault(_is_function);

  var _is_nothing2 = _interopRequireDefault(_is_nothing);

  var _contains2 = _interopRequireDefault(_contains);

  var _event_map2 = _interopRequireDefault(_event_map);

  var _get_document_signal2 = _interopRequireDefault(_get_document_signal);

  var _get_event_signal2 = _interopRequireDefault(_get_event_signal);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * onEvent :: String -> Dom -> Signal Event
   *
   * @name onEvent
   * @memberof Frampton.Events
   * @static
   * @param {String} eventName Name of event to listen for
   * @param {Object} target    Object on which to listen for event
   * @returns {Frampton.Signal.Signal} A Signal of all occurances of the given event on the given object
   */
  function on_event(eventName, target) {
    if (_event_map2.default[eventName] && ((0, _is_nothing2.default)(target) || (0, _is_function2.default)(target.addEventListener))) {
      if ((0, _is_nothing2.default)(target)) {
        return (0, _get_document_signal2.default)(eventName);
      } else {
        return (0, _get_document_signal2.default)(eventName).filter((0, _contains2.default)(target));
      }
    } else {
      return (0, _get_event_signal2.default)(eventName, target);
    }
  }
});
define('frampton-events/on_selector', ['exports', 'frampton-utils/is_something', 'frampton-utils/is_string', 'frampton-utils/is_empty', 'frampton-events/closest_to_event', 'frampton-events/selector_contains', 'frampton-events/event_map', 'frampton-events/get_document_signal', 'frampton-events/selector_cache'], function (exports, _is_something, _is_string, _is_empty, _closest_to_event, _selector_contains, _event_map, _get_document_signal, _selector_cache) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _is_something2 = _interopRequireDefault(_is_something);

  var _is_string2 = _interopRequireDefault(_is_string);

  var _is_empty2 = _interopRequireDefault(_is_empty);

  var _closest_to_event2 = _interopRequireDefault(_closest_to_event);

  var _selector_contains2 = _interopRequireDefault(_selector_contains);

  var _event_map2 = _interopRequireDefault(_event_map);

  var _get_document_signal2 = _interopRequireDefault(_get_document_signal);

  var _selector_cache2 = _interopRequireDefault(_selector_cache);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function validateEventName(name) {
    var parts = name.split(' ').filter(function (val) {
      return !(0, _is_empty2.default)(val);
    });
    var len = parts.length;
    for (var i = 0; i < len; i++) {
      if (!(0, _is_something2.default)(_event_map2.default[parts[i]])) {
        return false;
      }
    }
    return true;
  }

  function mouseEnterSelector(selector) {
    var previousElement = null;
    return (0, _get_document_signal2.default)('mouseover').filter(function (evt) {
      var current = (0, _closest_to_event2.default)(selector, evt);
      if ((0, _is_something2.default)(current) && current !== previousElement) {
        previousElement = current;
        return true;
      } else {
        return false;
      }
    });
  }

  function mouseLeaveSelector(selector) {
    var previousElement = null;
    return (0, _get_document_signal2.default)('mouseleave').filter(function (evt) {
      var current = (0, _closest_to_event2.default)(selector, evt);
      if ((0, _is_something2.default)(current) && current !== previousElement) {
        previousElement = current;
        return true;
      } else if ((0, _is_something2.default)(current)) {
        previousElement = current;
        return false;
      } else {
        return false;
      }
    });
  }

  /**
   * onSelector :: String -> String -> Signal Event
   *
   * @name onSelector
   * @memberof Frampton.Events
   * @static
   * @param {String} eventName Name of event to listen for
   * @param {String} selector  Selector to filter events by
   * @returns {Frampton.Signal.Signal} A Signal of all occurances of the given event within given selector
   */
  function onSelector(eventName, selector) {
    if (validateEventName(eventName) && (0, _is_string2.default)(selector)) {
      return (0, _selector_cache2.default)(eventName + ' | ' + selector, function () {
        if (eventName === 'mouseenter') {
          return mouseEnterSelector(selector);
        } else if (eventName === 'mouseleave') {
          return mouseLeaveSelector(selector);
        } else {
          return (0, _get_document_signal2.default)(eventName).filter(function (evt) {
            return (0, _selector_contains2.default)(selector, evt);
          });
        }
      });
    } else {
      throw new Error('Frampton.Events.onSelector given unexpected arguments name: ' + eventName + ', selector: ' + selector);
    }
  }

  exports.default = onSelector;
});
define('frampton-events/once', ['exports', 'frampton-events/listen'], function (exports, _listen) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = once;
  function once(eventName, target) {
    return (0, _listen.listen)(eventName, target).take(1);
  }
});
define('frampton-events/prevent_default', ['exports', 'frampton-utils/is_function', 'frampton-utils/is_object'], function (exports, _is_function, _is_object) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (evt) {
    if ((0, _is_object2.default)(evt) && (0, _is_function2.default)(evt.preventDefault) && (0, _is_function2.default)(evt.stopPropagation)) {
      evt.preventDefault();
      evt.stopPropagation();
    }
    return evt;
  };

  var _is_function2 = _interopRequireDefault(_is_function);

  var _is_object2 = _interopRequireDefault(_is_object);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});
define('frampton-events/selector_cache', ['exports', 'frampton-events/simple_cache'], function (exports, _simple_cache) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _simple_cache2 = _interopRequireDefault(_simple_cache);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _simple_cache2.default)();
});
define('frampton-events/selector_contains', ['exports', 'frampton-utils/curry', 'frampton-utils/is_something', 'frampton-events/closest_to_event'], function (exports, _curry, _is_something, _closest_to_event) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _is_something2 = _interopRequireDefault(_is_something);

  var _closest_to_event2 = _interopRequireDefault(_closest_to_event);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function selector_contains(selector, evt) {
    return (0, _is_something2.default)((0, _closest_to_event2.default)(selector, evt));
  });
});
define('frampton-events/simple_cache', ['exports', 'frampton-utils/is_nothing'], function (exports, _is_nothing) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {

    var store = {};

    return function (name, fn) {
      if ((0, _is_nothing2.default)(store[name])) {
        store[name] = fn();
      }
      return store[name];
    };
  };

  var _is_nothing2 = _interopRequireDefault(_is_nothing);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});
define('frampton-html', ['frampton/namespace', 'frampton-html/attribute', 'frampton-html/contains', 'frampton-html/data', 'frampton-html/element_value', 'frampton-html/set_html'], function (_namespace, _attribute, _contains, _data, _element_value, _set_html) {
  'use strict';

  var _namespace2 = _interopRequireDefault(_namespace);

  var _attribute2 = _interopRequireDefault(_attribute);

  var _contains2 = _interopRequireDefault(_contains);

  var _data2 = _interopRequireDefault(_data);

  var _element_value2 = _interopRequireDefault(_element_value);

  var _set_html2 = _interopRequireDefault(_set_html);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name Html
   * @namespace
   * @memberof Frampton
   */
  _namespace2.default.Html = {};
  _namespace2.default.Html.attribute = _attribute2.default;
  _namespace2.default.Html.contains = _contains2.default;
  _namespace2.default.Html.elementValue = _element_value2.default;
  _namespace2.default.Html.data = _data2.default;
  _namespace2.default.Html.set = _set_html2.default;
});
define('frampton-html/attribute', ['exports', 'frampton-utils/curry_n'], function (exports, _curry_n) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function (name, element) {
    return element.getAttribute(name);
  });
});
define('frampton-html/contains', ['exports', 'frampton-utils/curry', 'frampton-utils/is_function'], function (exports, _curry, _is_function) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _is_function2 = _interopRequireDefault(_is_function);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function (parent, child) {
    if (parent === child) {
      return true;
    } else if ((0, _is_function2.default)(parent.contains)) {
      return parent.contains(child);
    } else {
      while (child = child.parentNode) {
        if (parent === child) {
          return true;
        }
        return false;
      }
    }
  });
});
define('frampton-html/data', ['exports', 'frampton-utils/curry', 'frampton-html/attribute'], function (exports, _curry, _attribute) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _attribute2 = _interopRequireDefault(_attribute);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function (name, element) {
    return (0, _attribute2.default)('data-' + name, element);
  });
});
define("frampton-html/element_value", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = element_value;
  /**
   * elementValue :: Object -> Any
   *
   * @name elementValue
   * @method
   * @memberof Frampton.Html
   * @param {Object} element
   * @returns {*}
   */
  function element_value(element) {
    return element.value || null;
  }
});
define("frampton-html/remove", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = remove;
  function remove(element) {
    var parent = element.parentNode;
    parent.removeChild(element);
  }
});
define('frampton-html/set_html', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function (element, html) {
    element.innerHTML = html;
  });
});
define('frampton-list', ['frampton/namespace', 'frampton-list/add', 'frampton-list/append', 'frampton-list/at', 'frampton-list/contains', 'frampton-list/copy', 'frampton-list/diff', 'frampton-list/drop', 'frampton-list/each', 'frampton-list/filter', 'frampton-list/find', 'frampton-list/first', 'frampton-list/foldl', 'frampton-list/foldr', 'frampton-list/init', 'frampton-list/last', 'frampton-list/length', 'frampton-list/max', 'frampton-list/min', 'frampton-list/prepend', 'frampton-list/product', 'frampton-list/remove', 'frampton-list/remove_index', 'frampton-list/replace', 'frampton-list/replace_index', 'frampton-list/reverse', 'frampton-list/second', 'frampton-list/split', 'frampton-list/sum', 'frampton-list/tail', 'frampton-list/take', 'frampton-list/third', 'frampton-list/zip'], function (_namespace, _add, _append, _at, _contains, _copy, _diff, _drop, _each, _filter, _find, _first, _foldl, _foldr, _init, _last, _length, _max, _min, _prepend, _product, _remove, _remove_index, _replace, _replace_index, _reverse, _second, _split, _sum, _tail, _take, _third, _zip) {
  'use strict';

  var _namespace2 = _interopRequireDefault(_namespace);

  var _add2 = _interopRequireDefault(_add);

  var _append2 = _interopRequireDefault(_append);

  var _at2 = _interopRequireDefault(_at);

  var _contains2 = _interopRequireDefault(_contains);

  var _copy2 = _interopRequireDefault(_copy);

  var _diff2 = _interopRequireDefault(_diff);

  var _drop2 = _interopRequireDefault(_drop);

  var _each2 = _interopRequireDefault(_each);

  var _filter2 = _interopRequireDefault(_filter);

  var _find2 = _interopRequireDefault(_find);

  var _first2 = _interopRequireDefault(_first);

  var _foldl2 = _interopRequireDefault(_foldl);

  var _foldr2 = _interopRequireDefault(_foldr);

  var _init2 = _interopRequireDefault(_init);

  var _last2 = _interopRequireDefault(_last);

  var _length2 = _interopRequireDefault(_length);

  var _max2 = _interopRequireDefault(_max);

  var _min2 = _interopRequireDefault(_min);

  var _prepend2 = _interopRequireDefault(_prepend);

  var _product2 = _interopRequireDefault(_product);

  var _remove2 = _interopRequireDefault(_remove);

  var _remove_index2 = _interopRequireDefault(_remove_index);

  var _replace2 = _interopRequireDefault(_replace);

  var _replace_index2 = _interopRequireDefault(_replace_index);

  var _reverse2 = _interopRequireDefault(_reverse);

  var _second2 = _interopRequireDefault(_second);

  var _split2 = _interopRequireDefault(_split);

  var _sum2 = _interopRequireDefault(_sum);

  var _tail2 = _interopRequireDefault(_tail);

  var _take2 = _interopRequireDefault(_take);

  var _third2 = _interopRequireDefault(_third);

  var _zip2 = _interopRequireDefault(_zip);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name List
   * @namespace
   * @memberof Frampton
   */
  _namespace2.default.List = {};
  _namespace2.default.List.add = _add2.default;
  _namespace2.default.List.append = _append2.default;
  _namespace2.default.List.at = _at2.default;
  _namespace2.default.List.contains = _contains2.default;
  _namespace2.default.List.copy = _copy2.default;
  _namespace2.default.List.diff = _diff2.default;
  _namespace2.default.List.drop = _drop2.default;
  _namespace2.default.List.each = _each2.default;
  _namespace2.default.List.filter = _filter2.default;
  _namespace2.default.List.find = _find2.default;
  _namespace2.default.List.first = _first2.default;
  _namespace2.default.List.foldl = _foldl2.default;
  _namespace2.default.List.foldr = _foldr2.default;
  _namespace2.default.List.init = _init2.default;
  _namespace2.default.List.last = _last2.default;
  _namespace2.default.List.length = _length2.default;
  _namespace2.default.List.max = _max2.default;
  _namespace2.default.List.min = _min2.default;
  _namespace2.default.List.prepend = _prepend2.default;
  _namespace2.default.List.product = _product2.default;
  _namespace2.default.List.remove = _remove2.default;
  _namespace2.default.List.removeAt = _remove_index2.default;
  _namespace2.default.List.replace = _replace2.default;
  _namespace2.default.List.replaceAt = _replace_index2.default;
  _namespace2.default.List.reverse = _reverse2.default;
  _namespace2.default.List.second = _second2.default;
  _namespace2.default.List.split = _split2.default;
  _namespace2.default.List.sum = _sum2.default;
  _namespace2.default.List.tail = _tail2.default;
  _namespace2.default.List.take = _take2.default;
  _namespace2.default.List.third = _third2.default;
  _namespace2.default.List.zip = _zip2.default;
});
define('frampton-list/add', ['exports', 'frampton-utils/curry_n', 'frampton-list/contains', 'frampton-list/append'], function (exports, _curry_n, _contains, _append) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  var _contains2 = _interopRequireDefault(_contains);

  var _append2 = _interopRequireDefault(_append);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function add_to_list(xs, obj) {
    return !(0, _contains2.default)(xs, obj) ? (0, _append2.default)(xs, obj) : xs;
  });
});
define('frampton-list/append', ['exports', 'frampton-utils/curry_n'], function (exports, _curry_n) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  exports.default = (0, _curry_n2.default)(2, function (xs, obj) {
    return [].concat(_toConsumableArray(xs), [obj]);
  });
});
define('frampton-list/at', ['exports', 'frampton-utils/curry_n', 'frampton-utils/assert', 'frampton-utils/is_defined', 'frampton-utils/is_array'], function (exports, _curry_n, _assert, _is_defined, _is_array) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  var _assert2 = _interopRequireDefault(_assert);

  var _is_defined2 = _interopRequireDefault(_is_defined);

  var _is_array2 = _interopRequireDefault(_is_array);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function at(index, xs) {
    (0, _assert2.default)("Frampton.List.at recieved a non-array", (0, _is_array2.default)(xs));
    return (0, _is_defined2.default)(xs[index]) ? xs[index] : null;
  });
});
define('frampton-list/contains', ['exports', 'frampton-utils/curry_n'], function (exports, _curry_n) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function (xs, obj) {
    return xs.indexOf(obj) > -1;
  });
});
define('frampton-list/copy', ['exports', 'frampton-list/length'], function (exports, _length) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = copy;

  var _length2 = _interopRequireDefault(_length);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name copy
   * @method
   * @memberof Frampton.List
   */
  function copy(xs, begin, end) {

    var argLen = (0, _length2.default)(xs);
    var idx = 0;
    var arr;

    begin = begin || 0;
    end = end || argLen;
    var arrLen = end - begin;

    if (argLen > 0) {
      arr = new Array(arrLen);
      for (var i = begin; i < end; i++) {
        arr[idx++] = xs[i];
      }
    }

    return arr || [];
  }
});
define('frampton-list/diff', ['exports', 'frampton-utils/curry_n', 'frampton-list/contains', 'frampton-list/each'], function (exports, _curry_n, _contains, _each) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  var _contains2 = _interopRequireDefault(_contains);

  var _each2 = _interopRequireDefault(_each);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function curried_diff(xs, ys) {

    var diff = [];

    (0, _each2.default)(function (item) {
      if (!(0, _contains2.default)(ys, item)) {
        diff.push(item);
      }
    }, xs);

    return diff;
  });
});
define('frampton-list/drop', ['exports', 'frampton-utils/assert', 'frampton-utils/curry_n', 'frampton-utils/is_array', 'frampton-list/filter'], function (exports, _assert, _curry_n, _is_array, _filter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _assert2 = _interopRequireDefault(_assert);

  var _curry_n2 = _interopRequireDefault(_curry_n);

  var _is_array2 = _interopRequireDefault(_is_array);

  var _filter2 = _interopRequireDefault(_filter);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function curried_drop(n, xs) {
    (0, _assert2.default)("Frampton.List.drop recieved a non-array", (0, _is_array2.default)(xs));
    return (0, _filter2.default)(function (next) {
      if (n === 0) {
        return true;
      } else {
        n--;
      }
      return false;
    }, xs);
  });
});
define('frampton-list/each', ['exports', 'frampton-utils/curry_n'], function (exports, _curry_n) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function curried_each(fn, xs) {
    var len = xs.length;
    for (var i = 0; i < len; i++) {
      fn(xs[i], i);
    }
  });
});
define('frampton-list/filter', ['exports', 'frampton-utils/curry_n', 'frampton-list/length'], function (exports, _curry_n, _length) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  var _length2 = _interopRequireDefault(_length);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function filter(predicate, xs) {

    var len = (0, _length2.default)(xs);
    var newList = [];

    for (var i = 0; i < len; i++) {
      if (predicate(xs[i])) {
        newList.push(xs[i]);
      }
    }

    return newList;
  });
});
define('frampton-list/find', ['exports', 'frampton-utils/curry_n'], function (exports, _curry_n) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function (obj, xs) {
    return xs.indexOf(obj);
  });
});
define('frampton-list/first', ['exports', 'frampton-list/at'], function (exports, _at) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _at2 = _interopRequireDefault(_at);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _at2.default)(0);
});
define('frampton-list/foldl', ['exports', 'frampton-utils/assert', 'frampton-utils/curry_n', 'frampton-utils/is_array'], function (exports, _assert, _curry_n, _is_array) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _assert2 = _interopRequireDefault(_assert);

  var _curry_n2 = _interopRequireDefault(_curry_n);

  var _is_array2 = _interopRequireDefault(_is_array);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(3, function curried_foldl(fn, acc, xs) {
    (0, _assert2.default)("Frampton.List.foldl recieved a non-array", (0, _is_array2.default)(xs));
    var len = xs.length;
    for (var i = 0; i < len; i++) {
      acc = fn(acc, xs[i]);
    }
    return acc;
  });
});
define('frampton-list/foldr', ['exports', 'frampton-utils/assert', 'frampton-utils/curry_n', 'frampton-utils/is_array'], function (exports, _assert, _curry_n, _is_array) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _assert2 = _interopRequireDefault(_assert);

  var _curry_n2 = _interopRequireDefault(_curry_n);

  var _is_array2 = _interopRequireDefault(_is_array);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(3, function curried_foldr(fn, acc, xs) {
    (0, _assert2.default)("Frampton.List.foldr recieved a non-array", (0, _is_array2.default)(xs));
    var len = xs.length;
    while (len--) {
      acc = fn(acc, xs[len]);
    }
    return acc;
  });
});
define('frampton-list/init', ['exports', 'frampton-utils/assert', 'frampton-utils/is_array'], function (exports, _assert, _is_array) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = init;

  var _assert2 = _interopRequireDefault(_assert);

  var _is_array2 = _interopRequireDefault(_is_array);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name init
   * @method
   * @memberof Frampton.List
   */
  function init(xs) {
    (0, _assert2.default)("Frampton.List.init recieved a non-array", (0, _is_array2.default)(xs));
    switch (xs.length) {

      case 0:
        return [];

      default:
        return xs.slice(0, xs.length - 1);
    }
  }
});
define('frampton-list/last', ['exports', 'frampton-utils/assert', 'frampton-utils/is_array'], function (exports, _assert, _is_array) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = last;

  var _assert2 = _interopRequireDefault(_assert);

  var _is_array2 = _interopRequireDefault(_is_array);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name last
   * @method
   * @memberof Frampton.List
   */
  function last(xs) {
    (0, _assert2.default)("Frampton.List.last recieved a non-array", (0, _is_array2.default)(xs));
    switch (xs.length) {

      case 0:
        return null;

      default:
        return xs[xs.length - 1];
    }
  }
});
define('frampton-list/length', ['exports', 'frampton-utils/is_something', 'frampton-utils/is_defined'], function (exports, _is_something, _is_defined) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = length;

  var _is_something2 = _interopRequireDefault(_is_something);

  var _is_defined2 = _interopRequireDefault(_is_defined);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name length
   * @method
   * @memberof Frampton.List
   */
  function length(xs) {
    return (0, _is_something2.default)(xs) && (0, _is_defined2.default)(xs.length) ? xs.length : 0;
  }
});
define('frampton-list/max', ['exports', 'frampton-list/foldl', 'frampton-utils/is_nothing'], function (exports, _foldl, _is_nothing) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = maximum;

  var _foldl2 = _interopRequireDefault(_foldl);

  var _is_nothing2 = _interopRequireDefault(_is_nothing);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name maximum
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   */
  function maximum(xs) {
    return (0, _foldl2.default)(function (acc, next) {
      if ((0, _is_nothing2.default)(acc) || next > acc) {
        acc = next;
      }
      return acc;
    }, null, xs);
  }
});
define('frampton-list/min', ['exports', 'frampton-list/foldl', 'frampton-utils/is_nothing'], function (exports, _foldl, _is_nothing) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = min;

  var _foldl2 = _interopRequireDefault(_foldl);

  var _is_nothing2 = _interopRequireDefault(_is_nothing);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name min
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   */
  function min(xs) {
    return (0, _foldl2.default)(function (acc, next) {
      if ((0, _is_nothing2.default)(acc) || next < acc) {
        acc = next;
      }
      return acc;
    }, null, xs);
  }
});
define('frampton-list/prepend', ['exports', 'frampton-utils/curry_n'], function (exports, _curry_n) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  exports.default = (0, _curry_n2.default)(2, function (obj, xs) {
    return [obj].concat(_toConsumableArray(xs));
  });
});
define('frampton-list/product', ['exports', 'frampton-list/foldl'], function (exports, _foldl) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = product;

  var _foldl2 = _interopRequireDefault(_foldl);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name product
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   */
  function product(xs) {
    return (0, _foldl2.default)(function (acc, next) {
      return acc * next;
    }, 1, xs);
  }
});
define('frampton-list/remove', ['exports', 'frampton-utils/curry_n', 'frampton-list/filter'], function (exports, _curry_n, _filter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  var _filter2 = _interopRequireDefault(_filter);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function curried_remove(obj, xs) {
    return (0, _filter2.default)(function (next) {
      return next !== obj;
    }, xs);
  });
});
define('frampton-list/remove_index', ['exports', 'frampton-list/length'], function (exports, _length) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = remove_index;

  var _length2 = _interopRequireDefault(_length);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name removeIndex
   * @method
   * @memberof Frampton.List
   * @param {Number} index
   * @param {Array} xs
   * @returns {Array} A new array
   */
  function remove_index(index, xs) {

    var len = (0, _length2.default)(xs);
    var newList = [];

    for (var i = 0; i < len; i++) {
      if (i !== index) {
        newList.push(xs[i]);
      }
    }

    return newList;
  }
});
define('frampton-list/replace', ['exports', 'frampton-utils/curry_n', 'frampton-list/find', 'frampton-list/replace_index'], function (exports, _curry_n, _find, _replace_index) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  var _find2 = _interopRequireDefault(_find);

  var _replace_index2 = _interopRequireDefault(_replace_index);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function replace(oldObj, newObj, xs) {
    var index = (0, _find2.default)(oldObj, xs);
    if (index > -1) {
      return (0, _replace_index2.default)(index, newObj, xs);
    } else {
      return xs;
    }
  });
});
define('frampton-list/replace_index', ['exports', 'frampton-utils/curry_n', 'frampton-list/length'], function (exports, _curry_n, _length) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  var _length2 = _interopRequireDefault(_length);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function replace_index(index, obj, xs) {
    var len = (0, _length2.default)(xs);
    var newArray = new Array(len);
    for (var i = 0; i < len; i++) {
      if (i === index) {
        newArray[i] = obj;
      } else {
        newArray[i] = xs[i];
      }
    }
    return newArray;
  });
});
define('frampton-list/reverse', ['exports', 'frampton-list/foldr'], function (exports, _foldr) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = reverse;

  var _foldr2 = _interopRequireDefault(_foldr);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * reverse :: List a -> List a
   *
   * @name reverse
   * @method
   * @memberof Frampton.List
   */
  function reverse(xs) {
    return (0, _foldr2.default)(function (acc, next) {
      acc.push(next);
      return acc;
    }, [], xs);
  }
});
define('frampton-list/second', ['exports', 'frampton-list/at'], function (exports, _at) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _at2 = _interopRequireDefault(_at);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _at2.default)(1);
});
define('frampton-list/split', ['exports', 'frampton-utils/curry_n'], function (exports, _curry_n) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function split(n, xs) {
    var ys = [];
    var zs = [];
    var len = xs.length;

    for (var i = 0; i < len; i++) {
      if (i < n) {
        ys.push(xs[i]);
      } else {
        zs.push(xs[i]);
      }
    }

    return [ys, zs];
  });
});
define('frampton-list/sum', ['exports', 'frampton-list/foldl'], function (exports, _foldl) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = sum;

  var _foldl2 = _interopRequireDefault(_foldl);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * + sum :: Number a => List a -> a
   *
   * @name sum
   * @method
   * @memberof Frampton.List
   * @param {Array} xs
   */
  function sum(xs) {
    return (0, _foldl2.default)(function (acc, next) {
      return acc + next;
    }, 0, xs);
  }
});
define('frampton-list/tail', ['exports', 'frampton-utils/assert', 'frampton-utils/is_array'], function (exports, _assert, _is_array) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = tail;

  var _assert2 = _interopRequireDefault(_assert);

  var _is_array2 = _interopRequireDefault(_is_array);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name tail
   * @method
   * @memberof Frampton.List
   */
  function tail(xs) {
    (0, _assert2.default)("Frampton.List.tail recieved a non-array", (0, _is_array2.default)(xs));
    switch (xs.length) {
      case 0:
        return [];
      default:
        return xs.slice(1);
    }
  }
});
define('frampton-list/take', ['exports', 'frampton-utils/assert', 'frampton-utils/curry_n', 'frampton-utils/is_array', 'frampton-math/min'], function (exports, _assert, _curry_n, _is_array, _min) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _assert2 = _interopRequireDefault(_assert);

  var _curry_n2 = _interopRequireDefault(_curry_n);

  var _is_array2 = _interopRequireDefault(_is_array);

  var _min2 = _interopRequireDefault(_min);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function take(num, xs) {
    (0, _assert2.default)("Frampton.List.take recieved a non-array", (0, _is_array2.default)(xs));
    var newList = [];
    var len = (0, _min2.default)(xs.length, num);
    for (var i = 0; i < len; i++) {
      newList.push(xs[i]);
    }
    return newList;
  });
});
define('frampton-list/third', ['exports', 'frampton-list/at'], function (exports, _at) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _at2 = _interopRequireDefault(_at);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _at2.default)(2);
});
define('frampton-list/zip', ['exports', 'frampton-utils/curry_n'], function (exports, _curry_n) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function zip_array(xs, ys) {

    var xLen = xs.length;
    var yLen = ys.length;
    var len = xLen > yLen ? yLen : xLen;
    var zs = new Array(len);

    for (var i = 0; i < len; i++) {
      zs[i] = [xs[i], ys[i]];
    }

    return zs;
  });
});
define('frampton-math', ['frampton/namespace', 'frampton-math/add', 'frampton-math/subtract', 'frampton-math/multiply', 'frampton-math/divide', 'frampton-math/modulo', 'frampton-math/max', 'frampton-math/min'], function (_namespace, _add, _subtract, _multiply, _divide, _modulo, _max, _min) {
  'use strict';

  var _namespace2 = _interopRequireDefault(_namespace);

  var _add2 = _interopRequireDefault(_add);

  var _subtract2 = _interopRequireDefault(_subtract);

  var _multiply2 = _interopRequireDefault(_multiply);

  var _divide2 = _interopRequireDefault(_divide);

  var _modulo2 = _interopRequireDefault(_modulo);

  var _max2 = _interopRequireDefault(_max);

  var _min2 = _interopRequireDefault(_min);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name Math
   * @namespace
   * @memberof Frampton
   */
  _namespace2.default.Math = {};
  _namespace2.default.Math.add = _add2.default;
  _namespace2.default.Math.subtract = _subtract2.default;
  _namespace2.default.Math.multiply = _multiply2.default;
  _namespace2.default.Math.divide = _divide2.default;
  _namespace2.default.Math.modulo = _modulo2.default;
  _namespace2.default.Math.max = _max2.default;
  _namespace2.default.Math.min = _min2.default;
});
define('frampton-math/add', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function add(left, right) {
    return left + right;
  });
});
define('frampton-math/divide', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function divide(left, right) {
    return left / right;
  });
});
define('frampton-math/max', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function max(left, right) {
    return left > right ? left : right;
  });
});
define('frampton-math/min', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function min(left, right) {
    return left < right ? left : right;
  });
});
define('frampton-math/modulo', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function modulo(left, right) {
    return left % right;
  });
});
define('frampton-math/multiply', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function multiply(a, b) {
    return a * b;
  });
});
define('frampton-math/subtract', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function (left, right) {
    return left - right;
  });
});
define('frampton-object', ['frampton/namespace', 'frampton-object/as_list', 'frampton-object/copy', 'frampton-object/filter', 'frampton-object/for_each', 'frampton-object/get', 'frampton-object/keys', 'frampton-object/map', 'frampton-object/merge', 'frampton-object/reduce', 'frampton-object/set', 'frampton-object/update', 'frampton-object/values'], function (_namespace, _as_list, _copy, _filter, _for_each, _get, _keys, _map, _merge, _reduce, _set, _update, _values) {
  'use strict';

  var _namespace2 = _interopRequireDefault(_namespace);

  var _as_list2 = _interopRequireDefault(_as_list);

  var _copy2 = _interopRequireDefault(_copy);

  var _filter2 = _interopRequireDefault(_filter);

  var _for_each2 = _interopRequireDefault(_for_each);

  var _get2 = _interopRequireDefault(_get);

  var _keys2 = _interopRequireDefault(_keys);

  var _map2 = _interopRequireDefault(_map);

  var _merge2 = _interopRequireDefault(_merge);

  var _reduce2 = _interopRequireDefault(_reduce);

  var _set2 = _interopRequireDefault(_set);

  var _update2 = _interopRequireDefault(_update);

  var _values2 = _interopRequireDefault(_values);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name Object
   * @namespace
   * @memberof Frampton
   */
  _namespace2.default.Object = {};
  _namespace2.default.Object.asList = _as_list2.default;
  _namespace2.default.Object.copy = _copy2.default;
  _namespace2.default.Object.each = _for_each2.default;
  _namespace2.default.Object.filter = _filter2.default;
  _namespace2.default.Object.get = _get2.default;
  _namespace2.default.Object.keys = _keys2.default;
  _namespace2.default.Object.map = _map2.default;
  _namespace2.default.Object.merge = _merge2.default;
  _namespace2.default.Object.reduce = _reduce2.default;
  _namespace2.default.Object.set = _set2.default;
  _namespace2.default.Object.update = _update2.default;
  _namespace2.default.Object.values = _values2.default;
});
define('frampton-object/as_list', ['exports', 'frampton-object/reduce'], function (exports, _reduce) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = as_list;

  var _reduce2 = _interopRequireDefault(_reduce);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // as_list :: Object -> Array [String, *]
  /**
   * @name as_list
   * @method
   * @memberof Frampton.Record
   * @param {Object} obj Object to transform
   * @returns {Array}
   */
  function as_list(obj) {
    return (0, _reduce2.default)(function (acc, nextValue, nextKey) {
      acc.push([nextKey, nextValue]);
      return acc;
    }, [], obj);
  }
});
define('frampton-object/copy', ['exports', 'frampton-object/for_each'], function (exports, _for_each) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = copy_object;

  var _for_each2 = _interopRequireDefault(_for_each);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * copy :: Object -> Object
   *
   * @name copy
   * @method
   * @memberof Frampton.Object
   * @param {Object} obj object to copy
   * @returns {Object}
   */
  function copy_object(obj) {

    var newObj = {};

    (0, _for_each2.default)(function (value, key) {
      newObj[key] = value;
    }, obj);

    return newObj;
  }
});
define('frampton-object/filter', ['exports', 'frampton-utils/curry', 'frampton-object/for_each'], function (exports, _curry, _for_each) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _for_each2 = _interopRequireDefault(_for_each);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function curried_filter(predicate, obj) {

    var newObj = {};

    (0, _for_each2.default)(function (value, key) {
      if (predicate(value, key)) {
        newObj[key] = value;
      }
    }, obj);

    return newObj;
  });
});
define('frampton-object/for_each', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function curried_for_each(fn, obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        fn(obj[key], key);
      }
    }
  });
});
define('frampton-object/get', ['exports', 'frampton-utils/curry', 'frampton-utils/is_nothing', 'frampton-utils/is_string', 'frampton-utils/is_primitive'], function (exports, _curry, _is_nothing, _is_string, _is_primitive) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _is_nothing2 = _interopRequireDefault(_is_nothing);

  var _is_string2 = _interopRequireDefault(_is_string);

  var _is_primitive2 = _interopRequireDefault(_is_primitive);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }

  exports.default = (0, _curry2.default)(function get(prop, obj) {

    if ((0, _is_primitive2.default)(obj) || (0, _is_nothing2.default)(obj)) {
      return null;
    } else if ((0, _is_string2.default)(prop)) {
      var parts = (prop || '').split('.').filter(function (val) {
        return val.trim() !== '';
      });

      if (parts.length > 1) {
        var _parts = _toArray(parts),
            head = _parts[0],
            tail = _parts.slice(1);

        var sub = obj[head];
        return !(0, _is_primitive2.default)(sub) ? get(tail.join('.'), sub) : null;
      } else {
        return obj[parts[0]] || null;
      }
    } else {
      return obj[prop] || null;
    }
  });
});
define('frampton-object/keys', ['exports', 'frampton-utils/is_function'], function (exports, _is_function) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = keys;

  var _is_function2 = _interopRequireDefault(_is_function);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var hasOwnProp = Object.prototype.hasOwnProperty;

  function getKeys(obj) {
    var result = [];
    for (var key in obj) {
      if (hasOwnProp.call(obj, key)) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * @name keys
   * @method
   * @memberof Frampton.Object
   * @param {Object} obj Object whose keys to get
   * @returns {String[]}
   */
  function keys(obj) {
    if ((0, _is_function2.default)(Object.keys)) {
      return Object.keys(obj).filter(function (key) {
        return hasOwnProp.call(obj, key);
      });
    } else {
      return getKeys(obj);
    }
  }
});
define('frampton-object/map', ['exports', 'frampton-utils/curry', 'frampton-object/for_each'], function (exports, _curry, _for_each) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _for_each2 = _interopRequireDefault(_for_each);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function curried_map(fn, obj) {

    var newObj = {};

    (0, _for_each2.default)(function (value, key) {
      newObj[key] = fn(value, key);
    }, obj);

    return newObj;
  });
});
define('frampton-object/merge', ['exports', 'frampton-utils/curry', 'frampton-utils/extend'], function (exports, _curry, _extend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _extend2 = _interopRequireDefault(_extend);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function curried_merge(obj1, obj2) {
    return (0, _extend2.default)({}, obj1, obj2);
  });
});
define('frampton-object/reduce', ['exports', 'frampton-utils/curry', 'frampton-object/for_each'], function (exports, _curry, _for_each) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _for_each2 = _interopRequireDefault(_for_each);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function curried_reduce(fn, acc, obj) {

    (0, _for_each2.default)(function (value, key) {
      acc = fn(acc, value, key);
    }, obj);

    return acc;
  });
});
define('frampton-object/set', ['exports', 'frampton-utils/curry', 'frampton-utils/is_string', 'frampton-object/keys'], function (exports, _curry, _is_string, _keys) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _is_string2 = _interopRequireDefault(_is_string);

  var _keys2 = _interopRequireDefault(_keys);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }

  function setValue(prop, value, oldObj, newObj) {
    if (!(0, _is_string2.default)(prop)) {
      throw new Error('Property to set must be a string');
    } else {
      var _split$filter = (prop || '').split('.').filter(function (val) {
        return val.trim() !== '';
      }),
          _split$filter2 = _toArray(_split$filter),
          head = _split$filter2[0],
          tail = _split$filter2.slice(1);

      var keys = (0, _keys2.default)(oldObj);

      if (keys.indexOf(head) === -1) {
        keys.push(head);
      }

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key === head) {
          if (tail.length > 0) {
            var nextObj = oldObj[key] || {};
            newObj[key] = setValue(tail.join('.'), value, nextObj, {});
          } else {
            newObj[key] = value;
          }
        } else {
          newObj[key] = oldObj[key];
        }
      }
    }

    return newObj;
  }

  /**
   * set :: String -> Any -> Object -> Object
   *
   * @name set
   * @method
   * @memberof Frampton.Object
   * @param {String} key The key to update
   * @param {*} value The value to update to
   * @param {Object} obj The object to update
   * @returns {Object}
   */
  exports.default = (0, _curry2.default)(function set(prop, value, obj) {
    return setValue(prop, value, obj, {});
  });
});
define('frampton-object/update', ['exports', 'frampton-utils/is_object', 'frampton-object/keys'], function (exports, _is_object, _keys) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = update_object;

  var _is_object2 = _interopRequireDefault(_is_object);

  var _keys2 = _interopRequireDefault(_keys);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * update :: Object -> Object -> Object
   *
   * @name update
   * @method
   * @memberof Frampton.Object
   * @param {Object} base   object to copy
   * @param {Object} update object describing desired udpate
   * @returns {Object}
   */
  function update_object(base, update) {

    var newObj = {};
    var baseKeys = (0, _keys2.default)(base);
    var updateKeys = (0, _keys2.default)(update);

    for (var i = 0; i < updateKeys.length; i++) {
      var key = updateKeys[i];
      if (baseKeys.indexOf(key) === -1) {
        baseKeys.push(key);
      }
    }

    for (var _i = 0; _i < baseKeys.length; _i++) {
      var _key = baseKeys[_i];
      var baseValue = base[_key];
      var updateValue = update[_key];
      if ((0, _is_object2.default)(baseValue) && (0, _is_object2.default)(updateValue)) {
        newObj[_key] = update_object(baseValue, updateValue);
      } else if (updateValue !== undefined) {
        newObj[_key] = updateValue;
      } else {
        newObj[_key] = baseValue;
      }
    }

    return newObj;
  }
});
define('frampton-object/values', ['exports', 'frampton-utils/is_object'], function (exports, _is_object) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = values;

  var _is_object2 = _interopRequireDefault(_is_object);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var hasOwnProp = Object.prototype.hasOwnProperty;

  /**
   * @name values
   * @method
   * @memberof Frampton.Object
   * @param {Object} obj Object whose values to get
   * @returns {String[]}
   */
  function values(obj) {
    var result = [];
    if ((0, _is_object2.default)(obj)) {
      for (var key in obj) {
        if (hasOwnProp.call(obj, key)) {
          result.push(obj[key]);
        }
      }
    }
    return result;
  }
});
define('frampton-signal', ['frampton/namespace', 'frampton-signal/create', 'frampton-signal/stepper', 'frampton-signal/combine', 'frampton-signal/swap', 'frampton-signal/toggle', 'frampton-signal/is_signal', 'frampton-signal/forward'], function (_namespace, _create, _stepper, _combine, _swap, _toggle, _is_signal, _forward) {
  'use strict';

  var _namespace2 = _interopRequireDefault(_namespace);

  var _create2 = _interopRequireDefault(_create);

  var _stepper2 = _interopRequireDefault(_stepper);

  var _combine2 = _interopRequireDefault(_combine);

  var _swap2 = _interopRequireDefault(_swap);

  var _toggle2 = _interopRequireDefault(_toggle);

  var _is_signal2 = _interopRequireDefault(_is_signal);

  var _forward2 = _interopRequireDefault(_forward);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name Signal
   * @class
   * @memberof Frampton
   */
  _namespace2.default.Signal = {};
  _namespace2.default.Signal.create = _create2.default;
  _namespace2.default.Signal.stepper = _stepper2.default;
  _namespace2.default.Signal.combine = _combine2.default;
  _namespace2.default.Signal.merge = _create.mergeMany;
  _namespace2.default.Signal.swap = _swap2.default;
  _namespace2.default.Signal.toggle = _toggle2.default;
  _namespace2.default.Signal.isSignal = _is_signal2.default;
  _namespace2.default.Signal.forward = _forward2.default;
});
define('frampton-signal/combine', ['exports', 'frampton-signal/create'], function (exports, _create) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = combine;


  /**
   * Method to combine multiple Signals into one with a given mapping function. Values
   * of the Signals are passed to the mapping function in the same order they appear
   * in the array.
   *
   * @name combine
   * @method
   * @memberof Frampton.Signal
   * @param {Function} mapping - Function used to combine given Signals
   * @param {Frampton.Signal[]} parents - Array of Signals to combine
   * @returns {Frampton.Signal} A new Signal
   */
  function combine(mapping, parents) {
    return (0, _create.createSignal)(function (self) {
      self.push(mapping.apply(null, parents.map(function (parent) {
        return parent._value;
      })));
    }, parents);
  }
});
define('frampton-signal/create', ['exports', 'frampton-utils/guid', 'frampton-utils/is_defined', 'frampton-utils/is_promise', 'frampton-utils/is_function', 'frampton-utils/is_equal', 'frampton-utils/of_value', 'frampton-utils/noop', 'frampton-utils/log'], function (exports, _guid, _is_defined, _is_promise, _is_function, _is_equal, _of_value, _noop, _log) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.createSignal = createSignal;
  exports.mergeMany = mergeMany;
  exports.default = create;

  var _guid2 = _interopRequireDefault(_guid);

  var _is_defined2 = _interopRequireDefault(_is_defined);

  var _is_promise2 = _interopRequireDefault(_is_promise);

  var _is_function2 = _interopRequireDefault(_is_function);

  var _is_equal2 = _interopRequireDefault(_is_equal);

  var _of_value2 = _interopRequireDefault(_of_value);

  var _noop2 = _interopRequireDefault(_noop);

  var _log2 = _interopRequireDefault(_log);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // STATE
  var signalGraph = [];
  var updateQueue = [];
  var updateInProgress = false;

  // Removing duplicates from right->left ensures all of a node's dependencies have
  // been updated before the node is updated.
  function removeDuplicatesWeigthed(graph) {
    var temp = [];
    var i = graph.length - 1;
    for (; i >= 0; i--) {
      if (temp.indexOf(graph[i]) === -1) {
        temp.unshift(graph[i]);
      }
    }
    return temp;
  }

  // Build the initial graph by queuing children breadth first
  function buildRawGraph(sig) {
    var graph = [];
    return function addChildren(next) {
      var len = next._children.length;
      var i;
      for (i = 0; i < len; i++) {
        graph.push(next._children[i]);
      }
      for (i = 0; i < len; i++) {
        addChildren(next._children[i]);
      }
      return graph;
    }(sig);
  }

  function buildSignalGraph(sig) {
    return removeDuplicatesWeigthed(buildRawGraph(sig));
  }

  function finishUpdate() {
    var len = signalGraph.length;
    var sig = null;
    var i;
    for (i = 0; i < len; i++) {
      sig = signalGraph[i];
      sig._updater = null;
      sig._queued = false;
    }
    signalGraph.length = 0;
  }

  function runUpdate() {
    var numberOfNodes = signalGraph.length;
    var node = null;
    var i = 0;
    updateInProgress = true;
    for (i = 0; i < numberOfNodes; i++) {
      node = signalGraph[i];
      if (node._queued) {
        node._update(node);
      }
    }
    finishUpdate();
    updateInProgress = false;
  }

  function markChildren(sig) {
    var len = sig._children.length;
    var child = null;
    var i;
    for (i = 0; i < len; i++) {
      child = sig._children[i];
      child._updater = sig;
      child._queued = true;
    }
  }

  function notInGraph(sig) {
    return signalGraph.indexOf(sig) === -1;
  }

  function scheduleUpdate(sig, val) {
    updateQueue.push({
      signal: sig,
      value: val
    });
  }

  function checkUpdateQueue() {
    var update;
    if (updateQueue.length > 0) {
      update = updateQueue.shift();
      updateValue(update.signal, update.value);
    }
  }

  function updateValue(sig, val) {
    if ((0, _is_promise2.default)(val)) {
      val.then(sig.push);
    } else {
      sig._value = val;
      sig._hasValue = true;
      markChildren(sig);
      if (!updateInProgress) {
        signalGraph = buildSignalGraph(sig);
        runUpdate();
        checkUpdateQueue();
      } else if (notInGraph(sig)) {
        scheduleUpdate(sig, val);
      }
    }
  }

  function toString() {
    return 'Signal(' + this._value + ')';
  }

  /**
   * @name merge
   * @method
   * @memberof Frampton.Signal.Signal#
   * @param {Frampton.Signal.Signal} sig2
   * @returns {Frampton.Signal.Signal}
   */
  function merge(sig2) {
    var sig1 = this;
    return mergeMany([sig1, sig2]);
  }

  /**
   * ap(<*>) :: Signal (a -> b) -> Signal a -> Signal b
   *
   * @name ap
   * @method
   * @memberof Frampton.Signal.Signal#
   * @param {Frampton.Signal.Signal} arg
   * @returns {Frampton.Signal.Signal}
   */
  function ap(arg) {
    var parent = this;
    var initial = parent._hasValue && arg._hasValue ? parent._value(arg._value) : undefined;
    return createSignal(function (self) {
      self.push(parent._value(arg._value));
    }, [parent], initial);
  }

  /**
   * @name sample
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Frampton.Signal.Signal} tag
   * @returns {Frampton.Signal.Signal}
   */
  function sample(tag) {
    var parent = this;
    return createSignal(function (self) {
      self.push(tag._value);
    }, [parent], tag._value);
  }

  /**
   * @name take
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Number} limit
   * @returns {Frampton.Signal.Signal}
   */
  function take(limit) {
    var parent = this;
    return createSignal(function (self) {
      if (limit-- > 0) {
        self.push(parent._value);
      } else {
        self.close();
      }
    }, [parent]);
  }

  /**
   * Like reduce on Arrays, this method is used to reduce all values of a Signal down to a
   * single value using the given function.
   *
   * The function recieves arguments in the order of (accumulator, next value). The function
   * returns a new value that will then be the new accumulator for the next interation.
   *
   * @name fold
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Function} fn
   * @param {Function} initial
   * @returns {Frampton.Signal.Signal}
   */
  function fold(fn, initial) {
    var parent = this;
    return createSignal(function (self) {
      self.push(fn(self._value, parent._value));
    }, [parent], initial);
  }

  /**
   * Return the values of these signals as a tuple
   *
   * @name zip
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Frampton.Signal.Signal} sig
   * @returns {Frampton.Signal.Signal}
   */
  function zip(sig) {
    var parent = this;
    var initial = [parent._value, sig._value];
    return createSignal(function (self) {
      self.push([parent._value, sig._value]);
    }, [parent], initial);
  }

  /**
   * Remove values from the Signal based on the given predicate function. If a function is not
   * given then filter will use strict equals with the value given to test new values on the
   * Signal.
   *
   * @name filter
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {*} predicate - Usually a function to test values of the Signal
   * @returns {Frampton.Signal.Signal}
   */
  function filter(predicate) {
    var parent = this;
    var filterFn = (0, _is_function2.default)(predicate) ? predicate : (0, _is_equal2.default)(predicate);
    var initial = parent._hasValue && filterFn(parent._value) ? parent._value : undefined;
    return createSignal(function (self) {
      if (filterFn(parent._value)) {
        self.push(parent._value);
      }
    }, [parent], initial);
  }

  /**
   * @name filterPrevious
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Function} predicate - A binary function to test the previous value against the current
   *                               value to decide if you want to keep the new value.
   * @returns {Frampton.Signal.Signal}
   */
  function filterPrevious(predicate) {
    var parent = this;
    var initial = parent._hasValue ? parent._value : undefined;
    return createSignal(function (self) {
      if (predicate(self._value, parent._value)) {
        self.push(parent._value);
      }
    }, [parent], initial);
  }

  /**
   * @name and
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Frampton.Signal.Signal} predicate - A Signal that must be truthy for values on this Signal
   *                                             to continue.
   * @returns {Frampton.Signal.Signal}
   */
  function and(predicate) {
    var parent = this;
    var initial = parent._hasValue && predicate._value ? parent._value : undefined;
    return createSignal(function (self) {
      if (predicate._value) {
        self.push(parent._value);
      }
    }, [parent], initial);
  }

  /**
   * @name not
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Frampton.Signal.Signal} predicate - A Signal that must be falsy for values on this Signal
   *                                             to continue.
   * @returns {Frampton.Signal.Signal}
   */
  function not(predicate) {
    var parent = this;
    var initial = parent._hasValue && !predicate._value ? parent._value : undefined;
    return createSignal(function (self) {
      if (!predicate._value) {
        self.push(parent.value);
      }
    }, [parent], initial);
  }

  /**
   * @name map
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {*} mapping - A function or value to map the signal with. If a function, the value
   *                        on the parent signal will be passed to the function and the signal will
   *                        be mapped to the return value of the function. If a value, the value of
   *                        the parent signal will be replaced with the value.
   * @returns {Frampton.Signal.Signal} A new signal with mapped values
   */
  function map(mapping) {
    var parent = this;
    var mappingFn = (0, _is_function2.default)(mapping) ? mapping : (0, _of_value2.default)(mapping);
    var initial = parent._hasValue ? mappingFn(parent._value) : undefined;
    return createSignal(function (self) {
      self.push(mappingFn(parent._value));
    }, [parent], initial);
  }

  /**
   * @name debounce
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Number} delay - Milliseconds to debounce the signal
   * @returns {Frampton.Signal.Signal}
   */
  function debounce(delay) {
    var parent = this;
    var timer = null;
    return createSignal(function (self) {
      if (!timer) {
        timer = setTimeout(function () {
          self.push(parent._value);
          timer = null;
        }, delay || 10);
      }
    }, [parent], parent._value);
  }

  /**
   * @name delay
   * @method
   * @private
   * @memberof Frampton.Signal.Signal#
   * @param {Number} time - Milliseconds to delay values of this Signal.
   * @returns {Frampton.Signal.Signal}
   */
  function delay(time) {
    var parent = this;
    return createSignal(function (self) {
      (function (saved) {
        setTimeout(function () {
          self.push(saved);
        }, time);
      })(parent._value);
    }, [parent], parent._value);
  }

  /**
   * dropRepeats :: Signal a -> Signal a
   *
   * Uses strict equals to drop repeated values from the parent signal.
   *
   * @name dropRepeats
   * @method
   * @memberof Frampton.Signal.Signal#
   * @returns {Frampton.Signal.Signal}
   */
  function dropRepeats() {
    return this.filterPrevious(function (prev, next) {
      return prev !== next;
    });
  }

  /**
   * Calls the given function when this signal updates. This function will call for the first
   * time the next time the Signal updates. If there is a current value on the Signal it is
   * ignored. If you are interested in the current value of the Signal use either the value or
   * changes method.
   *
   * @name next
   * @method
   * @memberof Frampton.Signal.Signal#
   * @param {Function} fn - The function to call
   * @returns {Frampton.Signal.Signal}
   */
  function next(fn) {
    var parent = this;
    return createSignal(function (self) {
      fn(parent._value);
    }, [parent]);
  }

  /**
   * Calls the given function when this Signal has a value. The function is called immediately
   * if this Signal already has a value, then is called again each time this Signal updates.
   *
   * @name value
   * @method
   * @memberof Frampton.Signal.Signal#
   * @param {Function} fn - The function to call
   * @returns {Frampton.Signal.Signal}
   */
  function value(fn) {
    var parent = this;
    var child = createSignal(function (self) {
      fn(parent._value);
    }, [parent], parent._value);

    if (child._hasValue) {
      fn(child._value);
    }

    return child;
  }

  /**
   * Works just like the value method, just repeated values are dropped.
   *
   * @name changes
   * @method
   * @memberof Frampton.Signal.Signal#
   * @param {Function} fn - The function to call
   * @returns {Frampton.Signal.Signal}
   */
  function changes(fn) {
    return this.dropRepeats().value(fn);
  }

  /**
   * Removes the Signal from the Signal graph.
   *
   * @name close
   * @method
   * @memberof Frampton.Signal.Signal#
   */
  function close() {

    var sig = this;

    sig._children.forEach(function (child) {
      child._parents = child._parents.filter(function (parent) {
        return parent._id !== sig._id;
      });
    });

    sig._parents.forEach(function (parent) {
      parent._children = parent._children.filter(function (child) {
        return child._id !== sig._id;
      });
    });

    sig._children.length = 0;
    sig._parents.length = 0;
  }

  /**
   * Logs the values of a given signal to the console.
   *
   * @name logValue
   * @method
   * @memberof Frampton.Signal.Signal#
   * @returns {Frampton.Signal.Signal}
   */
  function logValue(msg) {
    var parent = this;
    return createSignal(function (self) {
      if (msg) {
        (0, _log2.default)(msg, parent._value);
      } else {
        (0, _log2.default)(parent._value);
      }
      self.push(parent._value);
    }, [parent], parent._value);
  }

  /**
   * @name createSignal
   * @memberof Frampton.Signal
   * @method
   * @private
   * @param {function}                 update  - Function to call when this signal updates
   * @param {Frampton.Signal.Signal[]} parents - List of signals this signal depends on
   * @param {*}                        initial - Initial value for this signal
   * @returns {Frampton.Signal.Signal}
   */
  function createSignal(update, parents, initial) {

    var signal = {};

    signal.push = function (val) {
      updateValue(signal, val);
    };

    signal.get = function () {
      return signal._value;
    };

    // Constructor
    signal.ctor = 'Frampton.Signal';

    // Private
    signal._id = (0, _guid2.default)();
    signal._value = initial;
    signal._hasValue = (0, _is_defined2.default)(initial);
    signal._queued = false;
    signal._updater = null;
    signal._parents = parents || [];
    signal._children = [];
    signal._update = update || _noop2.default;

    // Public
    signal.debounce = debounce;
    signal.delay = delay;
    signal.ap = ap;
    signal.merge = merge;
    signal.zip = zip;
    signal.map = map;
    signal.filter = filter;
    signal.filterPrevious = filterPrevious;
    signal.and = and;
    signal.not = not;
    signal.fold = fold;
    signal.sample = sample;
    signal.take = take;
    signal.dropRepeats = dropRepeats;
    signal.log = logValue;
    signal.next = next;
    signal.value = value;
    signal.changes = changes;
    signal.close = close;
    signal.toString = toString;

    for (var i = 0; i < signal._parents.length; i++) {
      signal._parents[i]._children.push(signal);
    }

    return Object.seal(signal);
  }

  /**
   * @name mergeMany
   * @memberof Frampton.Signal
   * @method
   * @param {Frampton.Signal.Signal[]} parents - Signals to merge
   */
  function mergeMany(parents) {
    var initial = parents.length > 0 ? parents[0]._value : undefined;
    return createSignal(function (self) {
      self.push(self._updater._value);
    }, parents, initial);
  }

  /**
   * Used to create new instances of Frampton.Signal. This should be used instead of calling
   * the Signal constructor directly.
   *
   * @name create
   * @memberof Frampton.Signal
   * @method
   * @param {*} [initial] - Initial value for this signal
   * @returns {Frampton.Signal}
   */
  function create(initial) {
    return createSignal(null, null, initial);
  }
});
define("frampton-signal/forward", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = forward;
  /**
   * @name forward
   * @memberof Frampton.Signal
   * @param {Frampton.Signal#} sig
   * @param {Function} mapping
   * @returns {Frampton.Signal#}
   */
  function forward(sig, mapping) {
    return function (val) {
      sig.push(mapping(val));
    };
  }
});
define('frampton-signal/is_signal', ['exports', 'frampton-utils/is_function', 'frampton-utils/is_string'], function (exports, _is_function, _is_string) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_signal;

  var _is_function2 = _interopRequireDefault(_is_function);

  var _is_string2 = _interopRequireDefault(_is_string);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function is_signal(obj) {
    return (0, _is_function2.default)(obj) && (0, _is_string2.default)(obj.ctor) && obj.ctor === 'Frampton.Signal';
  }
});
define('frampton-signal/stepper', ['exports', 'frampton-utils/curry', 'frampton-signal/create'], function (exports, _curry, _create) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _create2 = _interopRequireDefault(_create);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function (initial, updater) {
    var sig = (0, _create2.default)(initial);
    return sig.merge(updater.dropRepeats());
  });
});
define('frampton-signal/swap', ['exports', 'frampton-utils/curry', 'frampton-signal/stepper'], function (exports, _curry, _stepper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _stepper2 = _interopRequireDefault(_stepper);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function toggle(sig1, sig2) {
    return (0, _stepper2.default)(false, sig1.map(true).merge(sig2.map(false)));
  });
});
define('frampton-signal/toggle', ['exports', 'frampton-utils/assert', 'frampton-utils/curry', 'frampton-utils/is_boolean', 'frampton-signal/create'], function (exports, _assert, _curry, _is_boolean, _create) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _assert2 = _interopRequireDefault(_assert);

  var _curry2 = _interopRequireDefault(_curry);

  var _is_boolean2 = _interopRequireDefault(_is_boolean);

  var _create2 = _interopRequireDefault(_create);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function (initial, updater) {
    (0, _assert2.default)('Frampton.Signal.toggle must be initialized with a Boolean', (0, _is_boolean2.default)(initial));
    var sig = (0, _create2.default)(initial);
    var current = initial;
    return sig.merge(updater.map(function () {
      current = !current;
      return current;
    }));
  });
});
define('frampton-string', ['frampton/namespace', 'frampton-string/capitalize', 'frampton-string/contains', 'frampton-string/dash_to_camel', 'frampton-string/ends_with', 'frampton-string/is_empty', 'frampton-string/join', 'frampton-string/length', 'frampton-string/lines', 'frampton-string/normalize_newline', 'frampton-string/replace', 'frampton-string/split', 'frampton-string/starts_with', 'frampton-string/trim', 'frampton-string/words'], function (_namespace, _capitalize, _contains, _dash_to_camel, _ends_with, _is_empty, _join, _length, _lines, _normalize_newline, _replace, _split, _starts_with, _trim, _words) {
  'use strict';

  var _namespace2 = _interopRequireDefault(_namespace);

  var _capitalize2 = _interopRequireDefault(_capitalize);

  var _contains2 = _interopRequireDefault(_contains);

  var _dash_to_camel2 = _interopRequireDefault(_dash_to_camel);

  var _ends_with2 = _interopRequireDefault(_ends_with);

  var _is_empty2 = _interopRequireDefault(_is_empty);

  var _join2 = _interopRequireDefault(_join);

  var _length2 = _interopRequireDefault(_length);

  var _lines2 = _interopRequireDefault(_lines);

  var _normalize_newline2 = _interopRequireDefault(_normalize_newline);

  var _replace2 = _interopRequireDefault(_replace);

  var _split2 = _interopRequireDefault(_split);

  var _starts_with2 = _interopRequireDefault(_starts_with);

  var _trim2 = _interopRequireDefault(_trim);

  var _words2 = _interopRequireDefault(_words);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name String
   * @namespace
   * @memberof Frampton
   */
  _namespace2.default.String = {};
  _namespace2.default.String.capitalize = _capitalize2.default;
  _namespace2.default.String.contains = _contains2.default;
  _namespace2.default.String.dashToCamel = _dash_to_camel2.default;
  _namespace2.default.String.endsWith = _ends_with2.default;
  _namespace2.default.String.isEmpty = _is_empty2.default;
  _namespace2.default.String.join = _join2.default;
  _namespace2.default.String.length = _length2.default;
  _namespace2.default.String.lines = _lines2.default;
  _namespace2.default.String.normalizeNewline = _normalize_newline2.default;
  _namespace2.default.String.replace = _replace2.default;
  _namespace2.default.String.split = _split2.default;
  _namespace2.default.String.startsWith = _starts_with2.default;
  _namespace2.default.String.trim = _trim2.default;
  _namespace2.default.String.words = _words2.default;
});
define("frampton-string/capitalize", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = capitalize;
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});
define('frampton-string/contains', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function contains(sub, str) {
    return str.indexOf(sub) > -1;
  });
});
define("frampton-string/dash_to_camel", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = dash_to_camel;
  function dash_to_camel(str) {
    return str.replace(/-([a-z])/g, function (m, w) {
      return w.toUpperCase();
    });
  }
});
define('frampton-string/ends_with', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function ends_with(sub, str) {
    return str.length >= sub.length && str.lastIndexOf(sub) === str.length - sub.length;
  });
});
define('frampton-string/is_empty', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_empty;
  function is_empty(str) {
    return str.trim() === '';
  }
});
define('frampton-string/join', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function join(sep, strs) {
    return strs.join(sep);
  });
});
define('frampton-string/length', ['exports', 'frampton-utils/is_something', 'frampton-utils/is_defined', 'frampton-string/normalize_newline'], function (exports, _is_something, _is_defined, _normalize_newline) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = length;

  var _is_something2 = _interopRequireDefault(_is_something);

  var _is_defined2 = _interopRequireDefault(_is_defined);

  var _normalize_newline2 = _interopRequireDefault(_normalize_newline);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name length
   * @memberof Frampton.String
   * @static
   * @param {String}
   * @returns {Number}
   */
  function length(str) {
    return (0, _is_something2.default)(str) && (0, _is_defined2.default)(str.length) ? (0, _normalize_newline2.default)(str).length : 0;
  }
});
define("frampton-string/lines", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = lines;
  // lines :: String -> Array String
  function lines(str) {
    return str.split(/\r\n|\r|\n/g);
  }
});
define('frampton-string/normalize_newline', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = normalize_newline;
  /**
   * Returns a string with newlines normalized to \n. Windows machines will use
   * \r\n for newlines which can lead to irregularities when dealing with strings
   *
   * @name normalizeNewline
   * @memberof Frampton.String
   * @static
   * @param {String} str
   * @returns {String}
   */
  function normalize_newline(str) {
    return str.replace(/\r\n/g, '\n');
  }
});
define('frampton-string/replace', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function replace(newSubStr, oldSubStr, str) {
    return str.replace(oldSubStr, newSubStr);
  });
});
define('frampton-string/split', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function join(sep, str) {
    return str.split(sep);
  });
});
define('frampton-string/starts_with', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function starts_with(sub, str) {
    return str.indexOf(sub) === 0;
  });
});
define("frampton-string/trim", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = trim;
  function trim(str) {
    return str.trim();
  }
});
define("frampton-string/words", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = words;
  // words :: String -> Array String
  function words(str) {
    return str.trim().split(/\s+/g);
  }
});
define('frampton-style', ['frampton/namespace', 'frampton-style/add_class', 'frampton-style/apply_styles', 'frampton-style/closest', 'frampton-style/contains', 'frampton-style/current_value', 'frampton-style/has_class', 'frampton-style/matches', 'frampton-style/remove_class', 'frampton-style/remove_style', 'frampton-style/remove_styles', 'frampton-style/selector_contains', 'frampton-style/set_style', 'frampton-style/supported', 'frampton-style/supported_props'], function (_namespace, _add_class, _apply_styles, _closest, _contains, _current_value, _has_class, _matches, _remove_class, _remove_style, _remove_styles, _selector_contains, _set_style, _supported, _supported_props) {
  'use strict';

  var _namespace2 = _interopRequireDefault(_namespace);

  var _add_class2 = _interopRequireDefault(_add_class);

  var _apply_styles2 = _interopRequireDefault(_apply_styles);

  var _closest2 = _interopRequireDefault(_closest);

  var _contains2 = _interopRequireDefault(_contains);

  var _current_value2 = _interopRequireDefault(_current_value);

  var _has_class2 = _interopRequireDefault(_has_class);

  var _matches2 = _interopRequireDefault(_matches);

  var _remove_class2 = _interopRequireDefault(_remove_class);

  var _remove_style2 = _interopRequireDefault(_remove_style);

  var _remove_styles2 = _interopRequireDefault(_remove_styles);

  var _selector_contains2 = _interopRequireDefault(_selector_contains);

  var _set_style2 = _interopRequireDefault(_set_style);

  var _supported2 = _interopRequireDefault(_supported);

  var _supported_props2 = _interopRequireDefault(_supported_props);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name Style
   * @namespace
   * @memberof Frampton
   */
  _namespace2.default.Style = {};
  _namespace2.default.Style.addClass = _add_class2.default;
  _namespace2.default.Style.applyStyles = _apply_styles2.default;
  _namespace2.default.Style.closest = _closest2.default;
  _namespace2.default.Style.contains = _contains2.default;
  _namespace2.default.Style.current = _current_value2.default;
  _namespace2.default.Style.hasClass = _has_class2.default;
  _namespace2.default.Style.matches = _matches2.default;
  _namespace2.default.Style.removeClass = _remove_class2.default;
  _namespace2.default.Style.removeStyle = _remove_style2.default;
  _namespace2.default.Style.removeStyles = _remove_styles2.default;
  _namespace2.default.Style.selectorContains = _selector_contains2.default;
  _namespace2.default.Style.setStyle = _set_style2.default;
  _namespace2.default.Style.supported = _supported2.default;
  _namespace2.default.Style.supportedProps = _supported_props2.default;
});
define('frampton-style/add_class', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function add_class(element, name) {
    element.classList.add(name);
  });
});
define('frampton-style/apply_styles', ['exports', 'frampton-utils/curry', 'frampton-utils/is_something', 'frampton-style/remove_style', 'frampton-style/set_style'], function (exports, _curry, _is_something, _remove_style, _set_style) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _is_something2 = _interopRequireDefault(_is_something);

  var _remove_style2 = _interopRequireDefault(_remove_style);

  var _set_style2 = _interopRequireDefault(_set_style);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function apply_styles(element, props) {
    for (var key in props) {
      var value = props[key];
      if ((0, _is_something2.default)(value)) {
        (0, _set_style2.default)(element, key, value);
      } else {
        (0, _remove_style2.default)(element, key, value);
      }
    }
  });
});
define('frampton-style/closest', ['exports', 'frampton-utils/curry', 'frampton-style/matches'], function (exports, _curry, _matches) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _matches2 = _interopRequireDefault(_matches);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function closest(selector, element) {

    while (element) {
      if ((0, _matches2.default)(selector, element)) {
        break;
      }
      element = element.parentElement;
    }

    return element || null;
  });
});
define('frampton-style/contains', ['exports', 'frampton-utils/curry', 'frampton-style/matches'], function (exports, _curry, _matches) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _matches2 = _interopRequireDefault(_matches);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function contains(selector, element) {
    return (0, _matches2.default)(selector, element) || element.querySelectorAll(selector).length > 0;
  });
});
define('frampton-style/current_value', ['exports', 'frampton-utils/curry', 'frampton-style/supported'], function (exports, _curry, _supported) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _supported2 = _interopRequireDefault(_supported);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var style = window.getComputedStyle;

  /**
   * current :: DomNode -> String -> String
   *
   * @name currentValue
   * @method
   * @memberof Frampton.Style
   * @param {Object} element DomNode whose property to check
   * @param {String} prop    Name of property to check
   * @returns {String} String representation of current property value
   */
  exports.default = (0, _curry2.default)(function current_value(element, prop) {
    return style(element).getPropertyValue((0, _supported2.default)(prop));
  });
});
define('frampton-style/has_class', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function has_class(name, element) {
    return element.classList.contains(name);
  });
});
define('frampton-style/matches', ['exports', 'frampton-utils/curry', 'frampton-utils/is_function'], function (exports, _curry, _is_function) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _is_function2 = _interopRequireDefault(_is_function);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function matches(selector, element) {

    if ((0, _is_function2.default)(element.matches)) {
      return element.matches(selector);
    } else {
      var elementList = document.querySelectorAll(selector);
      var i = 0;

      while (elementList[i] && elementList[i] !== element) {
        i++;
      }

      return elementList[i] ? true : false;
    }
  });
});
define('frampton-style/remove_class', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function remove_class(element, name) {
    element.classList.remove(name);
  });
});
define('frampton-style/remove_style', ['exports', 'frampton-utils/curry', 'frampton-style/supported'], function (exports, _curry, _supported) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _supported2 = _interopRequireDefault(_supported);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function remove_style(element, key) {
    element.style.removeProperty((0, _supported2.default)(key));
  });
});
define('frampton-style/remove_styles', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function remove_styles(element, props) {
    for (var key in props) {
      element.style.removeProperty(key);
    }
  });
});
define('frampton-style/selector_contains', ['exports', 'frampton-utils/curry', 'frampton-html/contains'], function (exports, _curry, _contains) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _contains2 = _interopRequireDefault(_contains);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function selector_contains(selector, element) {

    var elementList = document.querySelectorAll(selector);
    var i = 0;

    while (elementList[i] && !(0, _contains2.default)(elementList[i], element)) {
      i++;
    }

    return elementList[i] ? true : false;
  });
});
define('frampton-style/set_style', ['exports', 'frampton-utils/curry', 'frampton-style/supported'], function (exports, _curry, _supported) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _supported2 = _interopRequireDefault(_supported);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function set_style(element, key, value) {
    element.style.setProperty((0, _supported2.default)(key), value, '');
  });
});
define('frampton-style/supported', ['exports', 'frampton-utils/memoize', 'frampton-style/supported_by_element'], function (exports, _memoize, _supported_by_element) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _memoize2 = _interopRequireDefault(_memoize);

  var _supported_by_element2 = _interopRequireDefault(_supported_by_element);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _memoize2.default)((0, _supported_by_element2.default)(document.createElement('div')));
});
define('frampton-style/supported_by_element', ['exports', 'frampton-utils/curry', 'frampton-utils/is_something', 'frampton-string/capitalize', 'frampton-string/dash_to_camel'], function (exports, _curry, _is_something, _capitalize, _dash_to_camel) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _is_something2 = _interopRequireDefault(_is_something);

  var _capitalize2 = _interopRequireDefault(_capitalize);

  var _dash_to_camel2 = _interopRequireDefault(_dash_to_camel);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var vendors = {
    'webkit': 'webkit',
    'Webkit': 'webkit',
    'Moz': 'moz',
    'ms': 'ms',
    'Ms': 'ms'
  };

  /**
   * @name supportedByElement
   * @method
   * @memberof Frampton.Style
   * @param {Object} element
   * @param {String} prop
   * @returns {String}
   */
  exports.default = (0, _curry2.default)(function supported_by_element(element, prop) {

    var camelProp = (0, _dash_to_camel2.default)(prop);

    if ((0, _is_something2.default)(element.style[camelProp])) {
      return prop;
    }

    for (var key in vendors) {
      var propToCheck = key + (0, _capitalize2.default)(camelProp);
      if ((0, _is_something2.default)(element.style[propToCheck])) {
        return ('-' + vendors[key] + '-' + prop).toLowerCase();
      }
    }

    return null;
  });
});
define('frampton-style/supported_props', ['exports', 'frampton-utils/warn', 'frampton-style/supported'], function (exports, _warn, _supported) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = supported_props;

  var _warn2 = _interopRequireDefault(_warn);

  var _supported2 = _interopRequireDefault(_supported);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name supportedProps
   * @method
   * @memberof Frampton.Style
   * @param {Object} props
   * @returns {Object}
   */
  function supported_props(props) {
    var obj = {};
    var temp;
    for (var key in props) {
      temp = (0, _supported2.default)(key);
      if (temp) {
        obj[(0, _supported2.default)(key)] = props[key];
      } else {
        (0, _warn2.default)('style prop ' + key + ' is not supported by this browser');
      }
    }
    return obj;
  }
});
define('frampton-utils', ['frampton/namespace', 'frampton-utils/always', 'frampton-utils/apply', 'frampton-utils/assert', 'frampton-utils/compose', 'frampton-utils/curry', 'frampton-utils/curry_n', 'frampton-utils/equal', 'frampton-utils/error', 'frampton-utils/extend', 'frampton-utils/flip_args', 'frampton-utils/has_length', 'frampton-utils/has_prop', 'frampton-utils/identity', 'frampton-utils/immediate', 'frampton-utils/is_array', 'frampton-utils/is_boolean', 'frampton-utils/is_defined', 'frampton-utils/is_empty', 'frampton-utils/is_equal', 'frampton-utils/is_false', 'frampton-utils/is_function', 'frampton-utils/is_node', 'frampton-utils/is_nothing', 'frampton-utils/is_null', 'frampton-utils/is_number', 'frampton-utils/is_numeric', 'frampton-utils/is_object', 'frampton-utils/is_primitive', 'frampton-utils/is_promise', 'frampton-utils/is_something', 'frampton-utils/is_string', 'frampton-utils/is_true', 'frampton-utils/is_undefined', 'frampton-utils/is_value', 'frampton-utils/lazy', 'frampton-utils/log', 'frampton-utils/memoize', 'frampton-utils/noop', 'frampton-utils/not', 'frampton-utils/of_value', 'frampton-utils/once', 'frampton-utils/warn'], function (_namespace, _always, _apply, _assert, _compose, _curry, _curry_n, _equal, _error, _extend, _flip_args, _has_length, _has_prop, _identity, _immediate, _is_array, _is_boolean, _is_defined, _is_empty, _is_equal, _is_false, _is_function, _is_node, _is_nothing, _is_null, _is_number, _is_numeric, _is_object, _is_primitive, _is_promise, _is_something, _is_string, _is_true, _is_undefined, _is_value, _lazy, _log, _memoize, _noop, _not, _of_value, _once, _warn) {
  'use strict';

  var _namespace2 = _interopRequireDefault(_namespace);

  var _always2 = _interopRequireDefault(_always);

  var _apply2 = _interopRequireDefault(_apply);

  var _assert2 = _interopRequireDefault(_assert);

  var _compose2 = _interopRequireDefault(_compose);

  var _curry2 = _interopRequireDefault(_curry);

  var _curry_n2 = _interopRequireDefault(_curry_n);

  var _equal2 = _interopRequireDefault(_equal);

  var _error2 = _interopRequireDefault(_error);

  var _extend2 = _interopRequireDefault(_extend);

  var _flip_args2 = _interopRequireDefault(_flip_args);

  var _has_length2 = _interopRequireDefault(_has_length);

  var _has_prop2 = _interopRequireDefault(_has_prop);

  var _identity2 = _interopRequireDefault(_identity);

  var _immediate2 = _interopRequireDefault(_immediate);

  var _is_array2 = _interopRequireDefault(_is_array);

  var _is_boolean2 = _interopRequireDefault(_is_boolean);

  var _is_defined2 = _interopRequireDefault(_is_defined);

  var _is_empty2 = _interopRequireDefault(_is_empty);

  var _is_equal2 = _interopRequireDefault(_is_equal);

  var _is_false2 = _interopRequireDefault(_is_false);

  var _is_function2 = _interopRequireDefault(_is_function);

  var _is_node2 = _interopRequireDefault(_is_node);

  var _is_nothing2 = _interopRequireDefault(_is_nothing);

  var _is_null2 = _interopRequireDefault(_is_null);

  var _is_number2 = _interopRequireDefault(_is_number);

  var _is_numeric2 = _interopRequireDefault(_is_numeric);

  var _is_object2 = _interopRequireDefault(_is_object);

  var _is_primitive2 = _interopRequireDefault(_is_primitive);

  var _is_promise2 = _interopRequireDefault(_is_promise);

  var _is_something2 = _interopRequireDefault(_is_something);

  var _is_string2 = _interopRequireDefault(_is_string);

  var _is_true2 = _interopRequireDefault(_is_true);

  var _is_undefined2 = _interopRequireDefault(_is_undefined);

  var _is_value2 = _interopRequireDefault(_is_value);

  var _lazy2 = _interopRequireDefault(_lazy);

  var _log2 = _interopRequireDefault(_log);

  var _memoize2 = _interopRequireDefault(_memoize);

  var _noop2 = _interopRequireDefault(_noop);

  var _not2 = _interopRequireDefault(_not);

  var _of_value2 = _interopRequireDefault(_of_value);

  var _once2 = _interopRequireDefault(_once);

  var _warn2 = _interopRequireDefault(_warn);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name Utils
   * @namespace
   * @memberof Frampton
   */
  _namespace2.default.Utils = {};
  _namespace2.default.Utils.always = _always2.default;
  _namespace2.default.Utils.apply = _apply2.default;
  _namespace2.default.Utils.assert = _assert2.default;
  _namespace2.default.Utils.compose = _compose2.default;
  _namespace2.default.Utils.curry = _curry2.default;
  _namespace2.default.Utils.curryN = _curry_n2.default;
  _namespace2.default.Utils.equal = _equal2.default;
  _namespace2.default.Utils.error = _error2.default;
  _namespace2.default.Utils.extend = _extend2.default;
  _namespace2.default.Utils.flip = _flip_args2.default;
  _namespace2.default.Utils.hasLength = _has_length2.default;
  _namespace2.default.Utils.hasProp = _has_prop2.default;
  _namespace2.default.Utils.identity = _identity2.default;
  _namespace2.default.Utils.immediate = _immediate2.default;
  _namespace2.default.Utils.isArray = _is_array2.default;
  _namespace2.default.Utils.isBoolean = _is_boolean2.default;
  _namespace2.default.Utils.isDefined = _is_defined2.default;
  _namespace2.default.Utils.isEmpty = _is_empty2.default;
  _namespace2.default.Utils.isEqual = _is_equal2.default;
  _namespace2.default.Utils.isFalse = _is_false2.default;
  _namespace2.default.Utils.isFunction = _is_function2.default;
  _namespace2.default.Utils.isNode = _is_node2.default;
  _namespace2.default.Utils.isNothing = _is_nothing2.default;
  _namespace2.default.Utils.isNull = _is_null2.default;
  _namespace2.default.Utils.isNumber = _is_number2.default;
  _namespace2.default.Utils.isNumeric = _is_numeric2.default;
  _namespace2.default.Utils.isObject = _is_object2.default;
  _namespace2.default.Utils.isPrimitive = _is_primitive2.default;
  _namespace2.default.Utils.isPromise = _is_promise2.default;
  _namespace2.default.Utils.isSomething = _is_something2.default;
  _namespace2.default.Utils.isString = _is_string2.default;
  _namespace2.default.Utils.isTrue = _is_true2.default;
  _namespace2.default.Utils.isUndefined = _is_undefined2.default;
  _namespace2.default.Utils.isValue = _is_value2.default;
  _namespace2.default.Utils.lazy = _lazy2.default;
  _namespace2.default.Utils.log = _log2.default;
  _namespace2.default.Utils.memoize = _memoize2.default;
  _namespace2.default.Utils.noop = _noop2.default;
  _namespace2.default.Utils.not = _not2.default;
  _namespace2.default.Utils.ofValue = _of_value2.default;
  _namespace2.default.Utils.once = _once2.default;
  _namespace2.default.Utils.warn = _warn2.default;
});
define('frampton-utils/always', ['exports', 'frampton-utils/curry_n'], function (exports, _curry_n) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function always(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var value;
    return function () {
      if (value === undefined) {
        value = fn.apply(undefined, args);
      }
      return value;
    };
  });
});
define("frampton-utils/apply", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = apply;
  /**
   * Takes a function and warps it to be called at a later time.
   *
   * @name apply
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn      The function to wrap.
   * @param {Object}   thisArg Context in which to apply function.
   */
  function apply(fn) {
    return fn.call(null);
  }
});
define('frampton-utils/assert', ['exports', 'frampton/namespace'], function (exports, _namespace) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = assert;

  var _namespace2 = _interopRequireDefault(_namespace);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * Occassionally we need to blow things up if something isn't right.
   *
   * @name assert
   * @method
   * @memberof Frampton.Utils
   * @param {String} msg  - Message to throw with error.
   * @param {Boolean} cond - A condition that evaluates to a Boolean. If false, an error is thrown.
   */
  function assert(msg, cond) {
    if (!_namespace2.default.isProd() && !cond) {
      throw new Error(msg || 'An error occured'); // Boom!
    }
  }
});
define('frampton-utils/compose', ['exports', 'frampton-utils/assert', 'frampton-list/foldr', 'frampton-list/first'], function (exports, _assert, _foldr, _first) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = compose;

  var _assert2 = _interopRequireDefault(_assert);

  var _foldr2 = _interopRequireDefault(_foldr);

  var _first2 = _interopRequireDefault(_first);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  /**
   * Compose takes any number of functions and returns a function that when
   * executed will call the passed functions in order, passing the return of
   * each function to the next function in the execution order.
   *
   * @name compose
   * @memberof Frampton.Utils
   * @method
   * @param {function} functions - Any number of function used to build the composition.
   * @returns {function} A new function that runs each of the given functions in succession
   */
  function compose() {
    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }

    (0, _assert2.default)("Compose did not receive any arguments. You can't compose nothing.", fns.length > 0);
    return function composition() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return (0, _first2.default)((0, _foldr2.default)(function (args, fn) {
        return [fn.apply(undefined, _toConsumableArray(args))];
      }, args, fns));
    };
  }
});
define('frampton-utils/curry', ['exports', 'frampton-utils/curry_n'], function (exports, _curry_n) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = curry;

  var _curry_n2 = _interopRequireDefault(_curry_n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * Takes a function and returns a new function that will wait to execute the original
   * function until it has received all of its arguments. Each time the function is called
   * without receiving all of its arguments it will return a new function waiting for the
   * remaining arguments.
   *
   * @name curry
   * @memberof Frampton.Utils
   * @method
   * @param {Function} curry - Function to curry.
   * @returns {Function} A curried version of the function passed in.
   */
  function curry(fn) {
    return (0, _curry_n2.default)(fn.length, fn);
  }
});
define('frampton-utils/curry_n', ['exports', 'frampton-utils/assert', 'frampton-utils/is_function'], function (exports, _assert, _is_function) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = curry_n;

  var _assert2 = _interopRequireDefault(_assert);

  var _is_function2 = _interopRequireDefault(_is_function);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  /**
   * Takes a function and returns a new function that will wait to execute the original
   * function until it has received all of its arguments. Each time the function is called
   * without receiving all of its arguments it will return a new function waiting for the
   * remaining arguments.
   *
   * @name curryN
   * @memberof Frampton.Utils
   * @method
   * @param {Number} arity - Number of arguments for function
   * @param {Function} fn - Function to curry.
   * @returns {Function} A curried version of the function passed in.
   */
  function curry_n(arity, fn) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    (0, _assert2.default)('Argument passed to curry is not a function', (0, _is_function2.default)(fn));

    return function curried() {
      for (var _len2 = arguments.length, args2 = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args2[_key2] = arguments[_key2];
      }

      // an array of arguments for this instance of the curried function
      var locals = args.concat(args2);

      // If we have all the arguments, apply the function and return result
      if (locals.length >= arity) {
        return fn.apply(undefined, _toConsumableArray(locals));

        // If we don't have all the arguments, return a new function that awaits remaining arguments
      } else {
        return curry_n.apply(null, [arity, fn].concat(locals));
      }
    };
  }
});
define('frampton-utils/equal', ['exports', 'frampton-utils/is_object', 'frampton-utils/is_array'], function (exports, _is_object, _is_array) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = deep_equal;

  var _is_object2 = _interopRequireDefault(_is_object);

  var _is_array2 = _interopRequireDefault(_is_array);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * equal :: Object -> Object -> Boolean
   *
   * @name equal
   * @memberof Frampton.Utils
   * @method
   * @param {*} obj1
   * @param {*} obj2
   * @returns {Boolean}
   */
  function deep_equal(obj1, obj2) {

    var depth = 0;
    var original1 = obj1;
    var original2 = obj2;

    function _equal(obj1, obj2) {

      depth++;

      if (
      // If we're dealing with a circular reference, return reference equality.
      !(depth > 1 && original1 === obj1 && original2 === obj2) && ((0, _is_object2.default)(obj1) || (0, _is_array2.default)(obj1)) && ((0, _is_object2.default)(obj2) || (0, _is_array2.default)(obj2))) {

        for (var key in obj1) {
          if (!obj2 || !_equal(obj1[key], obj2[key])) {
            return false;
          }
        }

        return true;
      } else {
        return obj1 === obj2;
      }
    }

    return _equal(obj1, obj2);
  }
});
define('frampton-utils/error', ['exports', 'frampton/namespace', 'frampton-utils/is_something'], function (exports, _namespace, _is_something) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = error;

  var _namespace2 = _interopRequireDefault(_namespace);

  var _is_something2 = _interopRequireDefault(_is_something);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function error(msg, data) {

    if (_namespace2.default.isDev()) {

      if ((0, _is_something2.default)(console.error)) {
        if ((0, _is_something2.default)(data)) {
          console.error(msg, data);
        } else {
          console.error(msg);
        }
      } else if ((0, _is_something2.default)(console.log)) {
        if ((0, _is_something2.default)(data)) {
          console.log('Error: ' + msg, data);
        } else {
          console.log('Error: ' + msg);
        }
      }
    }

    return msg;
  }
});
define('frampton-utils/extend', ['exports', 'frampton-list/foldl'], function (exports, _foldl) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = extend;

  var _foldl2 = _interopRequireDefault(_foldl);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * Extends one object with one or more other objects
   *
   * @name extend
   * @memberof Frampton.Utils
   * @method
   * @param {Object} base
   * @param {Object} args
   * @returns {Object}
   */
  function extend(base) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return (0, _foldl2.default)(function (acc, next) {
      for (var key in next) {
        if (next.hasOwnProperty(key)) {
          acc[key] = next[key];
        }
      }
      return acc;
    }, base, args);
  }
});
define("frampton-utils/flip_args", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = flip_args;
  function flip_args(fn) {
    return function flipped(a, b) {
      return fn(b, a);
    };
  }
});
define('frampton-utils/guid', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = guid;
  var id = 0;

  function guid() {
    id += 1;
    return 'fr-id-' + id;
  }
});
define('frampton-utils/has_length', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function has_length(len, obj) {
    return obj && obj.length && obj.length >= len ? true : false;
  });
});
define('frampton-utils/has_prop', ['exports', 'frampton-utils/curry', 'frampton-object/get', 'frampton-utils/is_something'], function (exports, _curry, _get, _is_something) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  var _get2 = _interopRequireDefault(_get);

  var _is_something2 = _interopRequireDefault(_is_something);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function has_prop(prop, obj) {
    return (0, _is_something2.default)((0, _get2.default)(prop, obj));
  });
});
define("frampton-utils/identity", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = identity;
  /**
   * identity :: a -> a
   *
   * @name identity
   * @method
   * @memberof Frampton.Utils
   * @param {*} x
   * @returns {*}
   */
  function identity(x) {
    return x;
  }
});
define("frampton-utils/immediate", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = immediate;
  /**
   * immediate :: Function -> ()
   *
   * @name immediate
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn
   * @param {Object}   [context]
   */
  function immediate(fn, context) {
    setTimeout(fn.bind(context || null), 0);
  }
});
define("frampton-utils/is_array", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_array;
  /**
   * Returns a boolean telling us if a given object is an array
   *
   * @name isArray
   * @method
   * @memberof Frampton.Utils
   * @param {Object} arr
   * @returns {Boolean}
   */
  function is_array(arr) {
    return Array.isArray ? Array.isArray(arr) : Object.prototype.toString.call(arr) === "[object Array]";
  }
});
define('frampton-utils/is_boolean', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_boolean;
  /**
   * Returns a boolean telling us if a given value is a boolean
   *
   * @name isBoolean
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  function is_boolean(obj) {
    return typeof obj === 'boolean';
  }
});
define('frampton-utils/is_defined', ['exports', 'frampton-utils/is_undefined'], function (exports, _is_undefined) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_defined;

  var _is_undefined2 = _interopRequireDefault(_is_undefined);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * Returns a boolean telling us if a given value is defined
   *
   * @name isDefined
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  function is_defined(obj) {
    return !(0, _is_undefined2.default)(obj);
  }
});
define('frampton-utils/is_empty', ['exports', 'frampton-utils/is_nothing'], function (exports, _is_nothing) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_empty;

  var _is_nothing2 = _interopRequireDefault(_is_nothing);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * Returns a boolean telling us if a given value doesn't exist or has length 0
   *
   * @name isEmpty
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  function is_empty(obj) {
    return (0, _is_nothing2.default)(obj) || !obj.length || 0 === obj.length;
  }
});
define('frampton-utils/is_equal', ['exports', 'frampton-utils/curry'], function (exports, _curry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry2 = _interopRequireDefault(_curry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry2.default)(function is_equal(a, b) {
    return a === b;
  });
});
define("frampton-utils/is_false", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_false;
  /**
   * isFalse :: a -> Boolean
   *
   * @name isFalse
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  function is_false(obj) {
    return obj === false;
  }
});
define('frampton-utils/is_function', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_function;
  /**
   * Returns true/false is the object a fucntion
   *
   * @name isFunction
   * @method
   * @memberof Frampton.Utils
   * @param {*} fn
   * @returns {Boolean}
   */
  function is_function(fn) {
    return typeof fn === 'function';
  }
});
define('frampton-utils/is_node', ['exports', 'frampton-utils/is_something', 'frampton-utils/is_object', 'frampton-utils/is_defined'], function (exports, _is_something, _is_object, _is_defined) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_node;

  var _is_something2 = _interopRequireDefault(_is_something);

  var _is_object2 = _interopRequireDefault(_is_object);

  var _is_defined2 = _interopRequireDefault(_is_defined);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * Returns true/false is the object a DomNode
   *
   * @name isNode
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  function is_node(obj) {
    return (0, _is_something2.default)(obj) && (0, _is_object2.default)(obj) && (0, _is_defined2.default)(obj.nodeType) && (0, _is_defined2.default)(obj.nodeName);
  }
});
define('frampton-utils/is_nothing', ['exports', 'frampton-utils/is_undefined', 'frampton-utils/is_null'], function (exports, _is_undefined, _is_null) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_nothing;

  var _is_undefined2 = _interopRequireDefault(_is_undefined);

  var _is_null2 = _interopRequireDefault(_is_null);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * Returns true/false is the object null or undefined
   *
   * @name isNothing
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  function is_nothing(obj) {
    return (0, _is_undefined2.default)(obj) || (0, _is_null2.default)(obj);
  }
});
define("frampton-utils/is_null", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_null;
  /**
   * Returns true/false is the object null
   *
   * @name isNull
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  function is_null(obj) {
    return obj === null;
  }
});
define('frampton-utils/is_number', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_number;
  /**
   * Returns true/false is the object a number
   *
   * @name isNumber
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  function is_number(obj) {
    return typeof obj === 'number';
  }
});
define("frampton-utils/is_numeric", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_numeric;
  function is_numeric(val) {
    return !isNaN(val);
  }
});
define('frampton-utils/is_object', ['exports', 'frampton-utils/is_something', 'frampton-utils/is_array'], function (exports, _is_something, _is_array) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isObject;

  var _is_something2 = _interopRequireDefault(_is_something);

  var _is_array2 = _interopRequireDefault(_is_array);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  /**
   * Returns true/false is the object a regular Object
   *
   * @name isObject
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  function isObject(obj) {
    return (0, _is_something2.default)(obj) && !(0, _is_array2.default)(obj) && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
  }
});
define('frampton-utils/is_primitive', ['exports', 'frampton-utils/is_number', 'frampton-utils/is_boolean', 'frampton-utils/is_string'], function (exports, _is_number, _is_boolean, _is_string) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_primitive;

  var _is_number2 = _interopRequireDefault(_is_number);

  var _is_boolean2 = _interopRequireDefault(_is_boolean);

  var _is_string2 = _interopRequireDefault(_is_string);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * Returns true/false is the value a primitive value
   *
   * @name isPrimitive
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  function is_primitive(obj) {
    return (0, _is_number2.default)(obj) || (0, _is_boolean2.default)(obj) || (0, _is_string2.default)(obj);
  }
});
define('frampton-utils/is_promise', ['exports', 'frampton-utils/is_object', 'frampton-utils/is_function'], function (exports, _is_object, _is_function) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_promise;

  var _is_object2 = _interopRequireDefault(_is_object);

  var _is_function2 = _interopRequireDefault(_is_function);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * Returns true/false indicating if object appears to be a Promise
   *
   * @name isPromise
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  function is_promise(obj) {
    return (0, _is_object2.default)(obj) && (0, _is_function2.default)(obj.then);
  }
});
define('frampton-utils/is_something', ['exports', 'frampton-utils/is_nothing'], function (exports, _is_nothing) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_something;

  var _is_nothing2 = _interopRequireDefault(_is_nothing);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * Returns true/false indicating if object is not null or undefined
   *
   * @name isSomething
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  function is_something(obj) {
    return !(0, _is_nothing2.default)(obj);
  }
});
define('frampton-utils/is_string', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_string;
  /**
   * Returns true/false indicating if object is a String
   *
   * @name isString
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  function is_string(obj) {
    return typeof obj === 'string';
  }
});
define("frampton-utils/is_true", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_true;
  /**
   * isTrue :: a -> Boolean
   *
   * @name isTrue
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  function is_true(obj) {
    return obj === true;
  }
});
define('frampton-utils/is_undefined', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_undefined;
  /**
   * Returns true/false indicating if object is undefined
   *
   * @name isUndefined
   * @method
   * @memberof Frampton.Utils
   * @param {*} obj
   * @returns {Boolean}
   */
  function is_undefined(obj) {
    return typeof obj === 'undefined';
  }
});
define("frampton-utils/is_value", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = is_value;
  function is_value(test) {
    return function (val) {
      return val === test;
    };
  }
});
define('frampton-utils/lazy', ['exports', 'frampton-utils/curry_n'], function (exports, _curry_n) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function lazy(fn, args) {
    return function () {
      return fn.apply(null, args);
    };
  });
});
define('frampton-utils/log', ['exports', 'frampton/namespace', 'frampton-utils/is_something'], function (exports, _namespace, _is_something) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = log;

  var _namespace2 = _interopRequireDefault(_namespace);

  var _is_something2 = _interopRequireDefault(_is_something);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function log(msg, data) {

    if (_namespace2.default.isDev() && (0, _is_something2.default)(console.log)) {
      if ((0, _is_something2.default)(data)) {
        console.log(msg, data);
      } else {
        console.log(msg);
      }
    }

    return msg;
  }
});
define('frampton-utils/map', ['exports', 'frampton-utils/curry_n'], function (exports, _curry_n) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function (fn, xs) {
    return xs.map(fn);
  });
});
define('frampton-utils/memoize', ['exports', 'frampton-utils/is_string', 'frampton-utils/is_number'], function (exports, _is_string, _is_number) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = memoize;

  var _is_string2 = _interopRequireDefault(_is_string);

  var _is_number2 = _interopRequireDefault(_is_number);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @name memoize
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn
   * @returns {Function}
   */
  function memoize(fn) {

    var store = {};
    var len = fn.length;

    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var key = len === 1 && ((0, _is_string2.default)(args[0]) || (0, _is_number2.default)(args[0])) ? args[0] : JSON.stringify(args);

      if (key in store) {
        return store[key];
      } else {
        return store[key] = fn.apply(undefined, args);
      }
    };
  }
});
define("frampton-utils/noop", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = noop;
  /**
   * @name noop
   * @method
   * @memberof Frampton.Utils
   */
  function noop() {}
});
define('frampton-utils/not', ['exports', 'frampton-utils/curry_n', 'frampton-utils/to_boolean'], function (exports, _curry_n, _to_boolean) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _curry_n2 = _interopRequireDefault(_curry_n);

  var _to_boolean2 = _interopRequireDefault(_to_boolean);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _curry_n2.default)(2, function (fn, arg) {
    return !(0, _to_boolean2.default)(fn(arg));
  });
});
define('frampton-utils/not_implemented', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    throw new Error('This method has not been implemented');
  };
});
define("frampton-utils/of_value", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = of_value;
  /**
   * Creates a function that always returns the specified value.
   *
   * @name ofValue
   * @method
   * @memberof Frampton.Utils
   * @param {*} value
   * @returns {Function}
   */
  function of_value(value) {
    return function () {
      return value;
    };
  }
});
define('frampton-utils/once', ['exports', 'frampton-utils/warn'], function (exports, _warn) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = once;

  var _warn2 = _interopRequireDefault(_warn);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * Create a function that can only be called once.
   *
   * @name once
   * @method
   * @memberof Frampton.Utils
   * @param {Function} fn
   * @returns {Function}
   */
  function once(fn) {
    var called = false;
    return function () {
      if (called === false) {
        called = true;
        return fn.apply(undefined, arguments);
      } else {
        (0, _warn2.default)('Once function called multiple times');
      }
    };
  }
});
define("frampton-utils/to_boolean", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (val) {
    return !!val;
  };
});
define('frampton-utils/warn', ['exports', 'frampton/namespace', 'frampton-utils/is_something'], function (exports, _namespace, _is_something) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = warn;

  var _namespace2 = _interopRequireDefault(_namespace);

  var _is_something2 = _interopRequireDefault(_is_something);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function warn(msg, data) {

    if (_namespace2.default.isDev()) {

      if ((0, _is_something2.default)(console.warn)) {
        if ((0, _is_something2.default)(data)) {
          console.warn(msg, data);
        } else {
          console.warn(msg);
        }
      } else if ((0, _is_something2.default)(console.log)) {
        if ((0, _is_something2.default)(data)) {
          console.log(msg, data);
        } else {
          console.log(msg);
        }
      }
    }

    return msg;
  }
});
define('frampton', ['exports', 'frampton/namespace', 'frampton-utils', 'frampton-list', 'frampton-object', 'frampton-string', 'frampton-math', 'frampton-events', 'frampton-data', 'frampton-signal', 'frampton-html', 'frampton-style'], function (exports, _namespace) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _namespace2 = _interopRequireDefault(_namespace);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _namespace2.default;
});
define('frampton/namespace', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /*globals Frampton:true */

  /**
   * The parent namespace for everything else in Frampton
   *
   * @name Frampton
   * @namespace
   */
  Frampton.VERSION = '0.3.6';

  Frampton.TEST = 'test';

  Frampton.DEV = 'dev';

  Frampton.PROD = 'prod';

  if (typeof Frampton.ENV === 'undefined') {
    Frampton.ENV = {};
  }

  if (typeof Frampton.ENV.MODE === 'undefined') {
    Frampton.ENV.MODE = Frampton.PROD;
  }

  if (typeof Frampton.ENV.MOCK === 'undefined') {
    Frampton.ENV.MOCK = {};
  }

  Frampton.mock = function (key) {
    return Frampton.ENV.MOCK && Frampton.ENV.MOCK[key] ? Frampton.ENV.MOCK[key] : null;
  };

  Frampton.isDev = function () {
    return Frampton.ENV.MODE === Frampton.DEV;
  };

  Frampton.isTest = function () {
    return Frampton.ENV.MODE === Frampton.TEST;
  };

  Frampton.isProd = function () {
    return Frampton.ENV.MODE === Frampton.PROD;
  };

  exports.default = Frampton;
});
require("frampton");
})();
