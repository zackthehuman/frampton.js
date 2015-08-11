/**
 *
 */
if (typeof Frampton === 'undefined') {
  var Frampton = {};
}

if (typeof define === 'undefined' && typeof require === 'undefined') {
  var define, require
}

(function() {

  if (typeof Frampton.__loader === 'undefined') {

    var registry = {},
        seen     = {};

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

    requirejs = require = requireModule = function(name) {
      return internalRequire(name, null);
    };

    function internalRequire(name, referrerName) {

      var exports = seen[name];
          module  = {};

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

      var mod      = registry[name],
          deps     = mod.deps,
          callback = mod.callback,
          reified  = [],
          len      = deps.length,
          i        = 0;

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

      var parts      = child.split('/'),
          parentBase = name.split('/').slice(0, -1),
          len        = parts.length,
          i          = 0;

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
(function() {
define('frampton-cache', ['exports', 'frampton-cache/Cache'], function (exports, _framptonCacheCache) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Cache = _interopRequire(_framptonCacheCache);

  exports.Cache = _Cache;
});
define('frampton-cache/cache', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  var defaults = {
    LIMIT: 1000,
    TIMEOUT: 5 * 60 * 1000 // 5 minutes
  };

  function currentTime() {
    return new Date().getTime();
  }

  function isExpired(entry, timeout) {
    return currentTime() - entry.timestamp > timeout;
  }

  // Takes two entries and bidirectionally links them.
  function linkEntries(prevEntry, nextEntry) {

    if (nextEntry === prevEntry) return;

    if (nextEntry) {
      nextEntry.prev = prevEntry || null;
    }

    if (prevEntry) {
      prevEntry.next = nextEntry || null;
    }
  }

  // update the counter to keep track of most popular cached items.
  function updateCounter(entry) {
    entry.counter = entry.counter + 1;
  }

  // takes an entry and makes it the head of the linked list
  function makeHead(entry, head, tail) {

    if (entry === head) return;

    if (!tail) {
      tail = entry;
    } else if (tail === entry) {
      tail = entry.prev;
    }

    linkEntries(entry.prev, entry.next);
    linkEntries(entry, head);

    head = entry;
    head.prev = null;
  }

  /**
   * Simple cache that removes items based on least recently used (LRU).
   *
   * @name Cache
   * @class
   * @param {Object} options - A hash of options to configure the cache. Currently only supports
   * LIMIT (the max number of items in cache) and TIMEOUT (how long an entry should be valid).
   */
  function Cache(options) {

    this.store = {};
    this.config = {};
    this.size = 0;
    this.head = null;
    this.tail = null;

    (0, _framptonUtils.extend)(this.config, defaults, options);
  }

  /**
   * @name get
   * @memberOf Cache
   * @method
   * @instance
   * @param {String} key Key lookup in the cache
   * @param {Function} fn Funtion to generate value if not available
   */
  Cache.prototype.get = function Cache_get(key, fn) {

    if (this.store[key]) {

      // if we have a key but it's expired, blow the mother up.
      if (isExpired(this.store[key], this.config.TIMEOUT)) {
        this.remove(key);
        return null;
      }

      // otherwise, yeah b@$%#!, let's return the value and get moving.
      makeHead(this.store[key], this.head, this.tail);
      updateCounter(this.store[key]);
      return this.store[key].value;
    }

    return null;
  };

  /**
   * @name put
   * @memberOf Cache
   * @method
   * @instance
   */
  Cache.prototype.put = function Cache_put(key, value) {

    if ((0, _framptonUtils.isNothing)(key) || (0, _framptonUtils.isNothing)(value)) return;

    if (!this.store[key]) {

      this.size = this.size + 1;
      this.store[key] = {
        key: key,
        value: value,
        next: null,
        prev: null,
        timestamp: currentTime(),
        counter: 1
      };
    } else {
      this.store[key].value = value;
      this.store[key].timestamp = currentTime();
      updateCounter(this.store[key]);
    }

    makeHead(this.store[key], this.head, this.tail);

    if (this.size > this.config.LIMIT) {
      this.remove(this.tail.key);
    }

    return value;
  };

  /**
   * @name remove
   * @memberOf Cache
   * @method
   * @instance
   */
  Cache.prototype.remove = function Cache_remove(key) {

    var entryToRemove;

    if ((0, _framptonUtils.isNothing)(this.store[key])) return;

    entryToRemove = this.store[key];

    if (entryToRemove === this.head) {
      this.head = entryToRemove.next;
    }

    if (entryToRemove === this.tail) {
      this.tail = entryToRemove.tail;
    }

    linkEntries(entryToRemove.prev, entryToRemove.next);

    delete this.store[key];

    this.size = this.size - 1;
  };

  /**
   * @name isCache
   * @memberOf Cache
   * @static
   * @param {Object} obj Object to test.
   * @return {Boolean} Is the object an instance of Cache?
   */
  Cache.isCache = function Cache_isCache(obj) {
    return obj instanceof Cache;
  };

  module.exports = Cache;
});
define('frampton-data', ['exports', 'frampton-data/either', 'frampton-data/maybe', 'frampton-data/task', 'frampton-data/when', 'frampton-data/sequence', 'frampton-data/run_task', 'frampton-data/fork', 'frampton-data/fail', 'frampton-data/succeed'], function (exports, _framptonDataEither, _framptonDataMaybe, _framptonDataTask, _framptonDataWhen, _framptonDataSequence, _framptonDataRun_task, _framptonDataFork, _framptonDataFail, _framptonDataSucceed) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Task = _interopRequire(_framptonDataTask);

  var _when = _interopRequire(_framptonDataWhen);

  var _sequence = _interopRequire(_framptonDataSequence);

  var _runTask = _interopRequire(_framptonDataRun_task);

  var _fork = _interopRequire(_framptonDataFork);

  var _fail = _interopRequire(_framptonDataFail);

  var _succeed = _interopRequire(_framptonDataSucceed);

  exports.Either = _framptonDataEither.Either;
  exports.Left = _framptonDataEither.Left;
  exports.Right = _framptonDataEither.Right;
  exports.Maybe = _framptonDataMaybe.Maybe;
  exports.Just = _framptonDataMaybe.Just;
  exports.Nothing = _framptonDataMaybe.Nothing;
  exports.Task = _Task;
  exports.when = _when;
  exports.sequence = _sequence;
  exports.runTask = _runTask;
  exports.fork = _fork;
  exports.fail = _fail;
  exports.succeed = _succeed;
});
define('frampton-data/either', ['exports', 'frampton-utils/noop', 'frampton-utils/identity', 'frampton-utils/inherits', 'frampton-utils/not_implemented'], function (exports, _framptonUtilsNoop, _framptonUtilsIdentity, _framptonUtilsInherits, _framptonUtilsNot_implemented) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _noop = _interopRequire(_framptonUtilsNoop);

  var _identity = _interopRequire(_framptonUtilsIdentity);

  var _inherits = _interopRequire(_framptonUtilsInherits);

  var _notImplemented = _interopRequire(_framptonUtilsNot_implemented);

  /**
   *
   */
  function Either() {}

  Either.of = function (val) {
    return new Right(val);
  };

  Either.prototype.ap = _notImplemented;

  Either.prototype.chain = _notImplemented;

  Either.prototype.map = _notImplemented;

  Either.prototype.toString = _notImplemented;

  Either.prototype.isLeft = function () {
    return false;
  };

  Either.prototype.isRight = function () {
    return false;
  };

  (0, _inherits)(Left, Either);

  function Left(val) {
    this.value = val;
  }

  Left.prototype.ap = _identity;

  Left.prototype.chain = _noop;

  Left.prototype.map = _noop;

  Left.prototype.toString = function () {
    return 'Left(' + this.value + ')';
  };

  (0, _inherits)(Right, Either);

  function Right(val) {
    this.value = val;
  }

  // ap(<*>) :: Either [x, (b -> c)] -> Either x b -> Either [x, c]
  Right.prototype.ap = function (either) {
    return either.map(this.value);
  };

  // chain(>>=) :: Either [x, b] -> (b -> Either [x, c]) -> Either [x, c]
  Right.prototype.chain = function (fn) {
    return fn(this.value);
  };

  // map :: Either [x, a] -> (a -> b) -> Either [x, b]
  Right.prototype.map = function (fn) {
    return new Right(fn(this.value));
  };

  // toString :: String
  Right.prototype.toString = function () {
    return 'Right(' + this.value + ')';
  };

  // isRight :: Boolean
  Right.prototype.isRight = function () {
    return true;
  };

  exports.Either = Either;
  exports.Left = Left;
  exports.Right = Right;
});
define('frampton-data/fail', ['exports', 'module', 'frampton-data/task'], function (exports, module, _framptonDataTask) {
  'use strict';

  //+ fail :: x -> Task x a
  module.exports = fail;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Task = _interopRequire(_framptonDataTask);

  function fail(err) {
    return new _Task(function (reject, _) {
      return reject(err);
    });
  }
});
define('frampton-data/fork', ['exports', 'module', 'frampton-data/run_task'], function (exports, module, _framptonDataRun_task) {
  'use strict';

  //+ fork
  module.exports = fork;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _runTask = _interopRequire(_framptonDataRun_task);

  function fork(tasks, values, errors) {
    return tasks.next(function (task) {
      (0, _runTask)(task, values.push, errors.push);
    });
  }
});
define('frampton-data/maybe', ['exports', 'frampton-utils/inherits', 'frampton-utils/is_something', 'frampton-utils/not_implemented'], function (exports, _framptonUtilsInherits, _framptonUtilsIs_something, _framptonUtilsNot_implemented) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _inherits = _interopRequire(_framptonUtilsInherits);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _notImplemented = _interopRequire(_framptonUtilsNot_implemented);

  /**
   * @class
   */
  function Maybe(a) {}

  Maybe.fromEither = function (a) {
    return a.fold(Maybe.Nothing, Maybe.Just);
  };

  Maybe.prototype.fromEither = Maybe.fromEither;

  Maybe.of = function (val) {
    return (0, _isSomething)(val) ? new Just(val) : new Nothing();
  };

  Maybe.prototype.of = Maybe.of;

  // join :: Maybe (Maybe a) -> Maybe a
  Maybe.prototype.join = _notImplemented;

  // chain(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b
  Maybe.prototype.chain = _notImplemented;

  // ap(<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b
  Maybe.prototype.ap = _notImplemented;

  Maybe.prototype.map = _notImplemented;

  Maybe.prototype.isJust = function () {
    return false;
  };

  Maybe.prototype.isNothing = function () {
    return false;
  };

  Maybe.prototype.get = _notImplemented;

  Maybe.prototype.getOrElse = _notImplemented;

  Maybe.prototype.toString = _notImplemented;

  /**
   * @class
   * @extends Maybe
   */
  (0, _inherits)(Just, Maybe);

  function Just(val) {
    this.value = val;
  }

  Just.prototype.isJust = function () {
    return true;
  };

  // join :: Maybe (Maybe a) -> Maybe a
  Just.prototype.join = function () {
    return this.value;
  };

  // chain(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b
  Just.prototype.chain = function (fn) {
    return this.map(fn).join();
  };

  // ap(<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b
  Just.prototype.ap = function (maybe) {
    return maybe.map(this.value);
  };

  Just.prototype.map = function (fn) {
    return this.of(fn(this.value));
  };

  Just.prototype.get = function () {
    return this.value;
  };

  Just.prototype.getOrElse = function (val) {
    return this.value;
  };

  Just.prototype.toString = function () {
    return 'Just(' + this.value + ')';
  };

  /**
   * @class
   * @extends Maybe
   */
  (0, _inherits)(Nothing, Maybe);

  function Nothing() {}

  Nothing.prototype.isNothing = function () {
    return true;
  };

  Nothing.prototype.ap = function (val) {
    return val;
  };

  Nothing.prototype.map = function (fn) {
    return new Nothing();
  };

  Nothing.prototype.chain = function (fn) {
    return new Nothing();
  };

  Nothing.prototype.toString = function () {
    return 'Nothing';
  };

  Nothing.prototype.get = function () {
    throw new TypeError('Can\'t extract the value of a Nothing.');
  };

  Nothing.prototype.getOrElse = function (val) {
    return val;
  };

  exports.Maybe = Maybe;
  exports.Just = Just;
  exports.Nothing = Nothing;
});
define("frampton-data/run_task", ["exports", "module"], function (exports, module) {
  //+ runTask
  "use strict";

  module.exports = run_task;

  function run_task(task, reject, resolve) {
    task.run(reject, resolve);
  }
});
define("frampton-data/sequence", ["exports", "module"], function (exports, module) {
  //+ sequence :: [Task x a] -> Task x a
  "use strict";

  module.exports = sequence;

  function sequence() {
    for (var _len = arguments.length, tasks = Array(_len), _key = 0; _key < _len; _key++) {
      tasks[_key] = arguments[_key];
    }

    return tasks.reduce(function (acc, next) {
      acc.concat(next);
    });
  }
});
define('frampton-data/succeed', ['exports', 'module', 'frampton-data/task'], function (exports, module, _framptonDataTask) {
  'use strict';

  //+ succeed :: a -> Task x a
  module.exports = succeed;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Task = _interopRequire(_framptonDataTask);

  function succeed(val) {
    return new _Task(function (_, resolve) {
      return resolve(val);
    });
  }
});
define("frampton-data/task", ["exports", "module"], function (exports, module) {
  /**
   * Task takes an error stream and a value stream
   * Task are lazy, must be told to run?
   * Lazy, possibly async, error-throwing tasks
   * Stream of tasks, executed and return a new stream
   * // execute :: EventStream Task x a -> EventStream a
   * execute(stream) -> EventStream
   *
   * // fork :: EventStream Task x a -> EventStream x -> EventStream z -> ()
   * fork(stream)
   */
  "use strict";

  function Task(computation) {
    this.run = computation;
  }

  // of(return) :: a -> Success a
  Task.prototype.of = function (val) {
    return new Task(function (_, resolve) {
      return resolve(val);
    });
  };

  // join :: Task x (Task x a) -> Task x a
  Task.prototype.join = function () {
    var run = this.run;
    return new Task(function (reject, resolve) {
      return run(function (err) {
        return reject(err);
      }, function (val) {
        return val.run(reject, resolve);
      });
    });
  };

  // concat(>>) :: Task x a -> Task x b -> Task x b
  Task.prototype.concat = function (task) {
    var run = this.run;
    return new Task(function (reject, resolve) {
      return run(function (err) {
        return reject(err);
      }, function (val) {
        return task.run(reject, resolve);
      });
    });
  };

  // chain(>>=) :: Task x a -> (a -> Task x b) -> Task x b
  Task.prototype.chain = function (fn) {
    return this.map(fn).join();
  };

  // ap(<*>) :: Task x (a -> b) -> Task x a -> Task x b
  Task.prototype.ap = function (task) {
    return this.chain(function (fn) {
      return task.map(fn);
    });
  };

  // recover :: Task x a -> (a -> Task x b) -> Task x b
  Task.prototype.recover = function (fn) {
    var run = this.run;
    return new Task(function (reject, resolve) {
      return run(function (err) {
        return fn(err).run(reject, resolve);
      }, function (val) {
        return resolve(val);
      });
    });
  };

  // map :: Task x a -> (a -> b) -> Task x b
  Task.prototype.map = function (fn) {
    var run = this.run;
    return new Task(function (reject, resolve) {
      return run(function (err) {
        return reject(err);
      }, function (val) {
        return resolve(fn(val));
      });
    });
  };

  module.exports = Task;
});
define('frampton-data/when', ['exports', 'module', 'frampton-data/task'], function (exports, module, _framptonDataTask) {
  'use strict';

  //+ when :: [Task x a] -> Task x [a]
  module.exports = when;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Task = _interopRequire(_framptonDataTask);

  function when() {
    for (var _len = arguments.length, tasks = Array(_len), _key = 0; _key < _len; _key++) {
      tasks[_key] = arguments[_key];
    }

    return new _Task(function (reject, resolve) {

      var valueArray = new Array(tasks.length);
      var errorArray = [];
      var len = tasks.length;
      var idx = 0;
      var count = 0;

      function logError(err) {
        errorArray.push(err);
      }

      tasks.forEach(function (task) {
        var index = idx++;
        task.run(logError, function (val) {
          count = count + 1;
          valueArray[index] = val;
          if (count === len - 1) {
            resolve.apply(null, valueArray);
          }
        });
      });
    });
  }
});
define('frampton-events', ['exports', 'frampton-events/event_dispatcher', 'frampton-events/listen', 'frampton-events/contains', 'frampton-events/event_target', 'frampton-events/event_value', 'frampton-events/get_position', 'frampton-events/get_position_relative', 'frampton-events/target_value'], function (exports, _framptonEventsEvent_dispatcher, _framptonEventsListen, _framptonEventsContains, _framptonEventsEvent_target, _framptonEventsEvent_value, _framptonEventsGet_position, _framptonEventsGet_position_relative, _framptonEventsTarget_value) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _listen = _interopRequire(_framptonEventsListen);

  var _contains = _interopRequire(_framptonEventsContains);

  var _eventTarget = _interopRequire(_framptonEventsEvent_target);

  var _eventValue = _interopRequire(_framptonEventsEvent_value);

  var _getPosition = _interopRequire(_framptonEventsGet_position);

  var _getPositionRelative = _interopRequire(_framptonEventsGet_position_relative);

  var _targetValue = _interopRequire(_framptonEventsTarget_value);

  exports.addListener = _framptonEventsEvent_dispatcher.addListener;
  exports.removeListener = _framptonEventsEvent_dispatcher.removeListener;
  exports.listen = _listen;
  exports.contains = _contains;
  exports.eventTarget = _eventTarget;
  exports.eventValue = _eventValue;
  exports.getPosition = _getPosition;
  exports.getPositionRelative = _getPositionRelative;
  exports.targetValue = _targetValue;
});
define('frampton-events/contains', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/is_something'], function (exports, module, _framptonUtilsCurry, _framptonUtilsIs_something) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  module.exports = (0, _curry)(function curried_contains(element, evt) {
    var target = evt.target;
    return (0, _isSomething)(target) && (0, _isSomething)(element) && (element === target || element.contains(target));
  });
});
define("frampton-events/document_cache", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = {};
});
define('frampton-events/event_dispatcher', ['exports', 'frampton-utils/assert', 'frampton-utils/is_function', 'frampton-utils/is_defined', 'frampton-utils/lazy', 'frampton-events/event_map'], function (exports, _framptonUtilsAssert, _framptonUtilsIs_function, _framptonUtilsIs_defined, _framptonUtilsLazy, _framptonEventsEvent_map) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  var _lazy = _interopRequire(_framptonUtilsLazy);

  var _EVENT_MAP = _interopRequire(_framptonEventsEvent_map);

  // get dom event -> filter -> return stream
  function addDomEvent(name, node, callback) {
    node.addEventListener(name, callback, !_EVENT_MAP[name].bubbles);
  }

  function addCustomEvent(name, target, callback) {
    var listen = (0, _isFunction)(target.addEventListener) ? target.addEventListener : (0, _isFunction)(target.on) ? target.on : null;

    (0, _assert)('addListener received an unknown type as target', (0, _isFunction)(listen));

    listen.call(target, name, callback);
  }

  function removeDomEvent(name, node, callback) {
    node.removeEventListener(name, callback, !_EVENT_MAP[name].bubbles);
  }

  function removeCustomEvent(name, target, callback) {
    var remove = (0, _isFunction)(target.removeEventListener) ? target.removeEventListener : (0, _isFunction)(target.off) ? target.off : null;

    (0, _assert)('removeListener received an unknown type as target', (0, _isFunction)(remove));

    remove.call(target, name, callback);
  }

  function addListener(eventName, callback, target) {

    if ((0, _isDefined)(_EVENT_MAP[eventName])) {
      addDomEvent(eventName, target, callback);
    } else {
      addCustomEvent(eventName, target, callback);
    }

    return (0, _lazy)(removeListener, eventName, callback, target);
  }

  function removeListener(eventName, callback, target) {
    if ((0, _isDefined)(_EVENT_MAP[eventName])) {
      removeDomEvent(eventName, target, callback);
    } else {
      removeCustomEvent(eventName, target, callback);
    }
  }

  exports.addListener = addListener;
  exports.removeListener = removeListener;
});
define("frampton-events/event_map", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = {
    focus: {
      bubbles: false,
      stream: null
    },

    blur: {
      bubbles: false,
      stream: null
    },

    focusin: {
      bubbles: true,
      stream: null
    },

    focusout: {
      bubbles: true,
      stream: null
    },

    input: {
      bubbles: true,
      stream: null
    },

    change: {
      bubbles: true,
      stream: null
    },

    click: {
      bubbles: true,
      stream: null
    },

    mousedown: {
      bubbles: true,
      stream: null
    },

    mouseup: {
      bubbles: true,
      stream: null
    },

    mousemove: {
      bubbles: true,
      stream: null
    },

    mouseenter: {
      bubbles: true,
      stream: null
    },

    mouseleave: {
      bubbles: true,
      stream: null
    },

    mouseover: {
      bubbles: true,
      stream: null
    },

    mouseout: {
      bubbles: true,
      stream: null
    },

    keyup: {
      bubbles: true,
      stream: null
    },

    keydown: {
      bubbles: true,
      stream: null
    },

    keypress: {
      bubbles: true,
      stream: null
    },

    touchstart: {
      bubbles: true,
      stream: null
    },

    touchend: {
      bubbles: true,
      stream: null
    },

    touchcancel: {
      bubbles: true,
      stream: null
    },

    touchleave: {
      bubbles: true,
      stream: null
    },

    touchmove: {
      bubbles: true,
      stream: null
    },

    submit: {
      bubbles: true,
      stream: null
    },

    animationstart: {
      bubbles: true,
      stream: null
    },

    animationend: {
      bubbles: true,
      stream: null
    },

    animationiteration: {
      bubbles: true,
      stream: null
    },

    transitionend: {
      bubbles: true,
      stream: null
    },

    drag: {
      bubbles: true,
      stream: null
    },

    drop: {
      bubbles: true,
      stream: null
    },

    dragstart: {
      bubbles: true,
      stream: null
    },

    dragend: {
      bubbles: true,
      stream: null
    },

    dragenter: {
      bubbles: true,
      stream: null
    },

    dragleave: {
      bubbles: true,
      stream: null
    },

    dragover: {
      bubbles: true,
      stream: null
    },

    wheel: {
      bubbles: true,
      stream: null
    }
  };
});
define('frampton-events/event_supported', ['exports', 'module', 'frampton-utils/is_function', 'frampton-utils/memoize'], function (exports, module, _framptonUtilsIs_function, _framptonUtilsMemoize) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _memoize = _interopRequire(_framptonUtilsMemoize);

  var TAGNAMES = {
    select: 'input',
    change: 'input',
    submit: 'form',
    reset: 'form',
    error: 'img',
    load: 'img',
    abort: 'img'
  };

  module.exports = (0, _memoize)(function event_supported(eventName) {
    var el = document.createElement(TAGNAMES[eventName] || 'div');
    eventName = 'on' + eventName;
    var isSupported = (eventName in el);
    if (!isSupported) {
      el.setAttribute(eventName, 'return;');
      isSupported = (0, _isFunction)(el[eventName]);
    }
    el = null;
    return isSupported;
  });
});
define("frampton-events/event_target", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = event_target;

  function event_target(evt) {
    return evt.target;
  }
});
define('frampton-events/event_value', ['exports', 'module', 'frampton-utils/compose', 'frampton-events/event_target', 'frampton-events/target_value'], function (exports, module, _framptonUtilsCompose, _framptonEventsEvent_target, _framptonEventsTarget_value) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _compose = _interopRequire(_framptonUtilsCompose);

  var _eventTarget = _interopRequire(_framptonEventsEvent_target);

  var _targetValue = _interopRequire(_framptonEventsTarget_value);

  module.exports = (0, _compose)(_targetValue, _eventTarget);
});
define("frampton-events/get_position", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = get_position;

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
define('frampton-events/get_position_relative', ['exports', 'module', 'frampton-utils/curry', 'frampton-events/get_position'], function (exports, module, _framptonUtilsCurry, _framptonEventsGet_position) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _getPosition = _interopRequire(_framptonEventsGet_position);

  module.exports = (0, _curry)(function get_position_relative(node, evt) {

    var position = (0, _getPosition)(evt);

    var rect = node.getBoundingClientRect();
    var relx = rect.left + document.body.scrollLeft + document.documentElement.scrollLeft;
    var rely = rect.top + document.body.scrollTop + document.documentElement.scrollTop;

    var posx = position[0] - Math.round(relx) - node.clientLeft;
    var posy = position[1] - Math.round(rely) - node.clientTop;

    return [posx, posy];
  });
});
define('frampton-events/listen', ['exports', 'module', 'frampton-utils/curry', 'frampton-signals/event_stream', 'frampton-signals/event', 'frampton-events/contains', 'frampton-events/event_map', 'frampton-events/event_dispatcher'], function (exports, module, _framptonUtilsCurry, _framptonSignalsEvent_stream, _framptonSignalsEvent, _framptonEventsContains, _framptonEventsEvent_map, _framptonEventsEvent_dispatcher) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  var _contains = _interopRequire(_framptonEventsContains);

  var _EVENT_MAP = _interopRequire(_framptonEventsEvent_map);

  var DOCUMENT_CACHE = {};

  function getEventStream(name, target) {
    return new _EventStream(function (sink) {
      return (0, _framptonEventsEvent_dispatcher.addListener)(name, function (evt) {
        return sink((0, _framptonSignalsEvent.nextEvent)(evt));
      }, target);
    });
  }

  function getDocumentStream(name) {
    if (!DOCUMENT_CACHE[name]) {
      DOCUMENT_CACHE[name] = getEventStream(name, document);
    }
    return DOCUMENT_CACHE[name];
  }

  // listen :: String -> Dom -> EventStream Event
  module.exports = (0, _curry)(function listen(eventName, target) {
    if (_EVENT_MAP[eventName]) {
      return getDocumentStream(eventName).filter((0, _contains)(target));
    } else {
      return getEventStream(eventName, target);
    }
  });
});
define("frampton-events/target_value", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = target_value;

  function target_value(target) {
    return target.value;
  }
});
define('frampton-keyboard', ['exports', 'frampton-keyboard/keyboard', 'frampton-keyboard/key_code', 'frampton-keyboard/is_key', 'frampton-keyboard/is_enter', 'frampton-keyboard/is_esc', 'frampton-keyboard/is_up', 'frampton-keyboard/is_down', 'frampton-keyboard/is_left', 'frampton-keyboard/is_right', 'frampton-keyboard/is_space', 'frampton-keyboard/is_ctrl', 'frampton-keyboard/is_shift'], function (exports, _framptonKeyboardKeyboard, _framptonKeyboardKey_code, _framptonKeyboardIs_key, _framptonKeyboardIs_enter, _framptonKeyboardIs_esc, _framptonKeyboardIs_up, _framptonKeyboardIs_down, _framptonKeyboardIs_left, _framptonKeyboardIs_right, _framptonKeyboardIs_space, _framptonKeyboardIs_ctrl, _framptonKeyboardIs_shift) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Keyboard = _interopRequire(_framptonKeyboardKeyboard);

  var _keyCode = _interopRequire(_framptonKeyboardKey_code);

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _isEnter = _interopRequire(_framptonKeyboardIs_enter);

  var _isEsc = _interopRequire(_framptonKeyboardIs_esc);

  var _isUp = _interopRequire(_framptonKeyboardIs_up);

  var _isDown = _interopRequire(_framptonKeyboardIs_down);

  var _isLeft = _interopRequire(_framptonKeyboardIs_left);

  var _isRight = _interopRequire(_framptonKeyboardIs_right);

  var _isSpace = _interopRequire(_framptonKeyboardIs_space);

  var _isCtrl = _interopRequire(_framptonKeyboardIs_ctrl);

  var _isShift = _interopRequire(_framptonKeyboardIs_shift);

  exports.Keyboard = _Keyboard;
  exports.keyCode = _keyCode;
  exports.isKey = _isKey;
  exports.isEsc = _isEsc;
  exports.isEnter = _isEnter;
  exports.isUp = _isUp;
  exports.isDown = _isDown;
  exports.isLeft = _isLeft;
  exports.isRight = _isRight;
  exports.isSpace = _isSpace;
  exports.isCtrl = _isCtrl;
  exports.isShift = _isShift;
});
define('frampton-keyboard/is_ctrl', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_ctrl :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.CTRL);
});
define('frampton-keyboard/is_down', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_down :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.DOWN);
});
define('frampton-keyboard/is_enter', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_enter :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.ENTER);
});
define('frampton-keyboard/is_esc', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_esc :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.ESC);
});
define('frampton-keyboard/is_key', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // isKey :: KeyCode -> KeyCode -> Boolean
  module.exports = (0, _curry)(function is_key(key, keyCode) {
    return key === keyCode;
  });
});
define('frampton-keyboard/is_left', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_left :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.LEFT);
});
define('frampton-keyboard/is_right', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_right :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.RIGHT);
});
define('frampton-keyboard/is_shift', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_shift :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.SHIFT);
});
define('frampton-keyboard/is_space', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_space :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.SPACE);
});
define('frampton-keyboard/is_up', ['exports', 'module', 'frampton-keyboard/is_key', 'frampton-keyboard/key_map'], function (exports, module, _framptonKeyboardIs_key, _framptonKeyboardKey_map) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isKey = _interopRequire(_framptonKeyboardIs_key);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  // is_up :: KeyCode -> Boolean
  module.exports = (0, _isKey)(_KEY_MAP.UP);
});
define('frampton-keyboard/key_code', ['exports', 'module', 'frampton-utils/get'], function (exports, module, _framptonUtilsGet) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _get = _interopRequire(_framptonUtilsGet);

  // key_code :: DomEvent -> KeyCode
  module.exports = (0, _get)('keyCode');
});
define("frampton-keyboard/key_map", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = {
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    CTRL: 17,
    SHIFT: 16,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
  };
});
define('frampton-keyboard/keyboard', ['exports', 'module', 'frampton-utils/curry', 'frampton-list', 'frampton-events', 'frampton-signals', 'frampton-keyboard/key_map', 'frampton-keyboard/key_code'], function (exports, module, _framptonUtilsCurry, _framptonList, _framptonEvents, _framptonSignals, _framptonKeyboardKey_map, _framptonKeyboardKey_code) {
  'use strict';

  module.exports = Keyboard;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _KEY_MAP = _interopRequire(_framptonKeyboardKey_map);

  var _keyCode = _interopRequire(_framptonKeyboardKey_code);

  //+ keyUp :: EventStream DomEvent
  var keyUp = (0, _framptonEvents.listen)('keyup', document);

  //+ keyDown :: EventStream DomEvent
  var keyDown = (0, _framptonEvents.listen)('keydown', document);

  //+ keyPress :: EventStream DomEvent
  var keyPress = (0, _framptonEvents.listen)('keypress', document);

  //+ keyUpCodes :: EventStream KeyCode
  var keyUpCodes = keyUp.map(_keyCode);

  //+ keyDownCodes :: EventStream KeyCode
  var keyDownCodes = keyDown.map(_keyCode);

  var addKey = function addKey(keyCode) {
    return function (arr) {
      if (!(0, _framptonList.contains)(arr, keyCode)) {
        return (0, _framptonList.append)(arr, keyCode);
      }
      return arr;
    };
  };

  var removeKey = function removeKey(keyCode) {
    return function (arr) {
      return (0, _framptonList.remove)(arr, keyCode);
    };
  };

  var update = function update(acc, fn) {
    return fn(acc);
  };

  //+ rawEvents :: EventStream Function
  var rawEvents = keyUpCodes.map(removeKey).merge(keyDownCodes.map(addKey));

  //+ keysDown :: EventStream []
  var keysDown = rawEvents.fold(update, []);

  //+ keyIsDown :: KeyCode -> EventStream Boolean
  var keyIsDown = function keyIsDown(keyCode) {
    return keysDown.map(function (arr) {
      return (0, _framptonList.contains)(arr, keyCode);
    });
  };

  //+ direction :: KeyCode -> [KeyCode] -> Boolean
  var direction = (0, _curry)(function (keyCode, arr) {
    return (0, _framptonList.contains)(arr, keyCode) ? 1 : 0;
  });

  //+ isUp :: [KeyCode] -> Boolean
  var isUp = direction(_KEY_MAP.UP);

  //+ isDown :: [KeyCode] -> Boolean
  var isDown = direction(_KEY_MAP.DOWN);

  //+ isRight :: [KeyCode] -> Boolean
  var isRight = direction(_KEY_MAP.RIGHT);

  //+ isLeft :: [KeyCode] -> Boolean
  var isLeft = direction(_KEY_MAP.LEFT);

  //+ arrows :: EventStream [horizontal, vertical]
  var arrows = keysDown.map(function (arr) {
    return [isRight(arr) - isLeft(arr), isUp(arr) - isDown(arr)];
  });

  var defaultKeyboard = {
    downs: keyDown,
    ups: keyUp,
    presses: keyPress,
    codes: keyUpCodes,
    arrows: (0, _framptonSignals.stepper)([0, 0], arrows),
    shift: (0, _framptonSignals.stepper)(false, keyIsDown(_KEY_MAP.SHIFT)),
    ctrl: (0, _framptonSignals.stepper)(false, keyIsDown(_KEY_MAP.CTRL)),
    escape: (0, _framptonSignals.stepper)(false, keyIsDown(_KEY_MAP.ESC)),
    enter: (0, _framptonSignals.stepper)(false, keyIsDown(_KEY_MAP.ENTER)),
    space: (0, _framptonSignals.stepper)(false, keyIsDown(_KEY_MAP.SPACE))
  };

  function Keyboard() {
    return defaultKeyboard;
  }
});
define('frampton-list', ['exports', 'frampton-list/append', 'frampton-list/contains', 'frampton-list/copy', 'frampton-list/diff', 'frampton-list/drop', 'frampton-list/each', 'frampton-list/filter', 'frampton-list/foldl', 'frampton-list/foldr', 'frampton-list/head', 'frampton-list/init', 'frampton-list/last', 'frampton-list/length', 'frampton-list/maximum', 'frampton-list/minimum', 'frampton-list/prepend', 'frampton-list/product', 'frampton-list/remove', 'frampton-list/reverse', 'frampton-list/split', 'frampton-list/sum', 'frampton-list/tail', 'frampton-list/zip'], function (exports, _framptonListAppend, _framptonListContains, _framptonListCopy, _framptonListDiff, _framptonListDrop, _framptonListEach, _framptonListFilter, _framptonListFoldl, _framptonListFoldr, _framptonListHead, _framptonListInit, _framptonListLast, _framptonListLength, _framptonListMaximum, _framptonListMinimum, _framptonListPrepend, _framptonListProduct, _framptonListRemove, _framptonListReverse, _framptonListSplit, _framptonListSum, _framptonListTail, _framptonListZip) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _append = _interopRequire(_framptonListAppend);

  var _contains = _interopRequire(_framptonListContains);

  var _copy = _interopRequire(_framptonListCopy);

  var _diff = _interopRequire(_framptonListDiff);

  var _drop = _interopRequire(_framptonListDrop);

  var _each = _interopRequire(_framptonListEach);

  var _filter = _interopRequire(_framptonListFilter);

  var _foldl = _interopRequire(_framptonListFoldl);

  var _foldr = _interopRequire(_framptonListFoldr);

  var _head = _interopRequire(_framptonListHead);

  var _init = _interopRequire(_framptonListInit);

  var _last = _interopRequire(_framptonListLast);

  var _length = _interopRequire(_framptonListLength);

  var _maximum = _interopRequire(_framptonListMaximum);

  var _minimum = _interopRequire(_framptonListMinimum);

  var _prepend = _interopRequire(_framptonListPrepend);

  var _product = _interopRequire(_framptonListProduct);

  var _remove = _interopRequire(_framptonListRemove);

  var _reverse = _interopRequire(_framptonListReverse);

  var _split = _interopRequire(_framptonListSplit);

  var _sum = _interopRequire(_framptonListSum);

  var _tail = _interopRequire(_framptonListTail);

  var _zip = _interopRequire(_framptonListZip);

  exports.append = _append;
  exports.contains = _contains;
  exports.copy = _copy;
  exports.diff = _diff;
  exports.drop = _drop;
  exports.each = _each;
  exports.filter = _filter;
  exports.foldl = _foldl;
  exports.foldr = _foldr;
  exports.head = _head;
  exports.init = _init;
  exports.last = _last;
  exports.length = _length;
  exports.maximum = _maximum;
  exports.minimum = _minimum;
  exports.prepend = _prepend;
  exports.product = _product;
  exports.reverse = _reverse;
  exports.remove = _remove;
  exports.split = _split;
  exports.sum = _sum;
  exports.tail = _tail;
  exports.zip = _zip;
});
define('frampton-list/append', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name append
   * @param {Array} xs
   * @param {Any} obj
   */
  module.exports = (0, _curry)(function (xs, obj) {
    return xs.concat([].concat(obj));
  });
});
define('frampton-list/contains', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   *
   */
  module.exports = (0, _curry)(function (xs, obj) {
    return xs.indexOf(obj) > -1;
  });
});
define("frampton-list/copy", ["exports", "module"], function (exports, module) {
  /**
   * @name copy
   * @memberOf Frampton
   */
  "use strict";

  module.exports = function (xs) {

    var len = xs.length;
    var arr = new Array(len);

    for (var i = 0; i < len; i++) {
      arr[i] = xs[i];
    }

    return arr;
  };
});
define('frampton-list/diff', ['exports', 'module', 'frampton-utils/curry', 'frampton-list/contains'], function (exports, module, _framptonUtilsCurry, _framptonListContains) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _contains = _interopRequire(_framptonListContains);

  /**
   * @name diff
   * @memberOf Frampton
   * @returns {Array}
   */
  module.exports = (0, _curry)(function curried_diff(xs, ys) {

    var diff = [];

    xs.forEach(function (item) {
      if (!(0, _contains)(ys, item)) {
        diff.push(item);
      }
    });

    return diff;
  });
});
define('frampton-list/drop', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry, _framptonUtilsIs_array) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  /**
   * @name drop
   * @memberOf Frampton
   */
  module.exports = (0, _curry)(function curried_drop(n, xs) {
    (0, _assert)('Frampton.drop recieved a non-array', (0, _isArray)(xs));
    return xs.filter(function (next) {
      return next !== n;
    });
  });
});
define('frampton-list/each', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name each
   * @memberOf Frampton
   * @static
   */
  module.exports = (0, _curry)(function curried_each(fn, xs) {
    xs.forEach(fn);
  });
});
define('frampton-list/filter', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name filter
   * @memberOf Frampton
   * @static
   */
  module.exports = (0, _curry)(function (predicate, xs) {
    return xs.filter(predicate);
  });
});
define('frampton-list/foldl', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry, _framptonUtilsIs_array) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  /**
   * @name foldl
   * @memberOf Frampton
   * @static
   */
  module.exports = (0, _curry)(function curried_foldl(fn, acc, xs) {
    (0, _assert)('Frampton.foldl recieved a non-array', (0, _isArray)(xs));
    return xs.reduce(fn, acc);
  });
});
define('frampton-list/foldr', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/curry', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsCurry, _framptonUtilsIs_array) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  /**
   * @name foldr
   * @memberOf Frampton
   * @static
   */
  module.exports = (0, _curry)(function curried_foldr(fn, acc, xs) {
    (0, _assert)('Frampton.foldr recieved a non-array', (0, _isArray)(xs));
    return xs.reduceRight(fn, acc);
  });
});
define('frampton-list/head', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_defined', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_defined, _framptonUtilsIs_array) {
  'use strict';

  /**
   * @name head
   * @memberOf Frampton
   * @static
   */
  module.exports = head;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function head(xs) {
    (0, _assert)('Frampton.head recieved a non-array', (0, _isArray)(xs));
    return (0, _isDefined)(xs[0]) ? xs[0] : null;
  }
});
define('frampton-list/init', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_array) {
  'use strict';

  /**
   * @name init
   * @memberOf Frampton
   * @static
   */
  module.exports = init;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function init(xs) {
    (0, _assert)('Frampton.init recieved a non-array', (0, _isArray)(xs));
    switch (xs.length) {
      case 0:
        return [];
      default:
        return xs.slice(0, xs.length - 1);
    }
  }
});
define('frampton-list/last', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_array) {
  'use strict';

  /**
   * @name last
   * @memberOf Frampton
   * @static
   */
  module.exports = last;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function last(xs) {
    (0, _assert)('Frampton.last recieved a non-array', (0, _isArray)(xs));
    switch (xs.length) {
      case 0:
        return null;
      default:
        return xs[xs.length - 1];
    }
  }
});
define('frampton-list/length', ['exports', 'module', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsIs_array) {
  'use strict';

  /**
   * @name length
   * @memberOf Frampton
   * @static
   */
  module.exports = length;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function length(xs) {
    return (0, _isArray)(xs) ? xs.length : 0;
  }
});
define('frampton-list/maximum', ['exports', 'module', 'frampton-list/foldl', 'frampton-utils/is_nothing'], function (exports, module, _framptonListFoldl, _framptonUtilsIs_nothing) {
  'use strict';

  /**
   * @name maximum
   * @param {Array} xs
   */
  module.exports = maximum;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  function maximum(xs) {
    return (0, _foldl)(function (acc, next) {
      if ((0, _isNothing)(acc) || next > acc) {
        acc = next;
      }
      return acc;
    }, null, xs);
  }
});
define('frampton-list/minimum', ['exports', 'module', 'frampton-list/foldl', 'frampton-utils/is_nothing'], function (exports, module, _framptonListFoldl, _framptonUtilsIs_nothing) {
  'use strict';

  /**
   * @name minimum
   * @param {Array} xs
   */
  module.exports = minimum;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  function minimum(xs) {
    return (0, _foldl)(function (acc, next) {
      if ((0, _isNothing)(acc) || next < acc) {
        acc = next;
      }
      return acc;
    }, null, xs);
  }
});
define('frampton-list/prepend', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * @name prepend
   * @param {Array} xs
   * @param {Any} obj
   */
  module.exports = (0, _curry)(function (xs, obj) {
    return [].concat(obj).concat(xs);
  });
});
define('frampton-list/product', ['exports', 'module', 'frampton-list/foldl'], function (exports, module, _framptonListFoldl) {
  'use strict';

  /**
   * @name product
   * @param {Array} xs
   */
  module.exports = product;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  function product(xs) {
    (0, _foldl)(function (acc, next) {
      return acc = acc * next;
    }, 0, xs);
  }
});
define('frampton-list/remove', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * remove :: List a -> Any a -> List a
   *
   * @name remove
   * @memberOf Frampton
   * @static
   * @param {Array} xs
   * @param {Object} obj
   */
  module.exports = (0, _curry)(function curried_remove(xs, obj) {
    return xs.filter(function (next) {
      return next !== obj;
    });
  });
});
define('frampton-list/reverse', ['exports', 'module', 'frampton-list/foldr'], function (exports, module, _framptonListFoldr) {
  'use strict';

  /**
   * + reverse :: List a -> List a
   *
   * @name reverse
   * @memberOf Frampton
   * @static
   */
  module.exports = reverse;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldr = _interopRequire(_framptonListFoldr);

  function reverse(xs) {
    return (0, _foldr)(function (acc, next) {
      acc.push(next);
      return acc;
    }, [], xs);
  }
});
define('frampton-list/split', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * + split :: Number -> List a -> (List a, List a)
   */
  module.exports = (0, _curry)(function split(n, xs) {
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
define('frampton-list/sum', ['exports', 'module', 'frampton-list/foldl'], function (exports, module, _framptonListFoldl) {
  'use strict';

  /**
   * + sum :: Number a => List a -> a
   * @name sum
   * @param {Array} xs
   */
  module.exports = sum;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  function sum(xs) {
    (0, _foldl)(function (acc, next) {
      return acc = acc + next;
    }, 0, xs);
  }
});
define('frampton-list/tail', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_array) {
  /**
   * @name tail
   * @memberOf Frampton
   * @static
   */
  'use strict';

  module.exports = tail;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function tail(xs) {
    (0, _assert)('Frampton.tail recieved a non-array', (0, _isArray)(xs));
    switch (xs.length) {
      case 0:
        return [];
      default:
        return xs.slice(1);
    }
  }
});
define('frampton-list/zip', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  /**
   * zip :: List a -> List b - List (a, b)
   *
   * @name zip
   * @memberOf Frampton
   * @param {Array} xs
   * @param {Array} ys
   */
  module.exports = (0, _curry)(function (xs, ys) {

    var xLen = xs.length;
    var yLen = ys.length;
    var len = xLen > yLen ? yLen : xLen;
    var zs = new Array(len);
    var i = 0;

    for (; i < len; i++) {
      zs[i] = [xs[i], ys[i]];
    }

    return zs;
  });
});
define('frampton-math', ['exports', 'frampton-math/add', 'frampton-math/subtract', 'frampton-math/multiply', 'frampton-math/divide', 'frampton-math/modulo', 'frampton-math/max', 'frampton-math/min'], function (exports, _framptonMathAdd, _framptonMathSubtract, _framptonMathMultiply, _framptonMathDivide, _framptonMathModulo, _framptonMathMax, _framptonMathMin) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _add = _interopRequire(_framptonMathAdd);

  var _subtract = _interopRequire(_framptonMathSubtract);

  var _multiply = _interopRequire(_framptonMathMultiply);

  var _divide = _interopRequire(_framptonMathDivide);

  var _modulo = _interopRequire(_framptonMathModulo);

  var _max = _interopRequire(_framptonMathMax);

  var _min = _interopRequire(_framptonMathMin);

  exports.add = _add;
  exports.subtract = _subtract;
  exports.multiply = _multiply;
  exports.divide = _divide;
  exports.modulo = _modulo;
  exports.max = _max;
  exports.min = _min;
});
define('frampton-math/add', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  // add :: Number -> Number -> Number
  module.exports = (0, _framptonUtils.curry)(function add(a, b) {
    return a + b;
  });
});
define('frampton-math/divide', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  // divide :: Number -> Number -> Number
  module.exports = (0, _framptonUtils.curry)(function divide(a, b) {
    return a / b;
  });
});
define('frampton-math/max', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function (a, b) {
    return a > b ? a : b;
  });
});
define('frampton-math/min', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function (a, b) {
    return a < b ? a : b;
  });
});
define('frampton-math/modulo', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  // modulo :: Number -> Number -> Number
  module.exports = (0, _framptonUtils.curry)(function modulo(a, b) {
    return a % b;
  });
});
define('frampton-math/multiply', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  // multiply :: Number -> Number -> Number
  module.exports = (0, _framptonUtils.curry)(function multiply(a, b) {
    return a * b;
  });
});
define('frampton-math/subtract', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  // subtract :: Number -> Number -> Number
  module.exports = (0, _framptonUtils.curry)(function subtract(a, b) {
    return a - b;
  });
});
define('frampton-monad', ['exports', 'frampton-monad/ap', 'frampton-monad/chain', 'frampton-monad/filter', 'frampton-monad/map'], function (exports, _framptonMonadAp, _framptonMonadChain, _framptonMonadFilter, _framptonMonadMap) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _ap = _interopRequire(_framptonMonadAp);

  var _chain = _interopRequire(_framptonMonadChain);

  var _filter = _interopRequire(_framptonMonadFilter);

  var _map = _interopRequire(_framptonMonadMap);

  exports.ap = _ap;
  exports.chain = _chain;
  exports.filter = _filter;
  exports.map = _map;
});
define('frampton-monad/ap', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  //+ ap(<*>) :: (a -> b) -> Monad a -> Monad b
  module.exports = (0, _framptonUtils.curry)(function curried_ap(fn, monad) {
    return monad.ap(fn);
  });
});
define('frampton-monad/chain', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  //+ chain(>>=) :: Monad a -> Monad b -> Monad b
  module.exports = (0, _framptonUtils.curry)(function curried_ap(monad1, monad2) {
    return monad1.chain(monad2);
  });
});
define('frampton-monad/filter', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  //+ filter :: (a -> b) -> Monad a -> Monad b
  module.exports = (0, _framptonUtils.curry)(function curried_filter(predicate, monad) {
    return monad.filter(predicate);
  });
});
define('frampton-monad/map', ['exports', 'module', 'frampton-utils'], function (exports, module, _framptonUtils) {
  'use strict';

  //+ map :: (a -> b) -> Monad a -> Monad b
  module.exports = (0, _framptonUtils.curry)(function curried_map(mapping, monad) {
    return monad.map(mapping);
  });
});
define('frampton-mouse', ['exports', 'frampton-mouse/mouse'], function (exports, _framptonMouseMouse) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Mouse = _interopRequire(_framptonMouseMouse);

  exports.Mouse = _Mouse;
});
define('frampton-mouse/mouse', ['exports', 'module', 'frampton-signals/stepper', 'frampton-events/listen', 'frampton-events/contains', 'frampton-events/get_position', 'frampton-events/get_position_relative'], function (exports, module, _framptonSignalsStepper, _framptonEventsListen, _framptonEventsContains, _framptonEventsGet_position, _framptonEventsGet_position_relative) {
  'use strict';

  module.exports = Mouse;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _stepper = _interopRequire(_framptonSignalsStepper);

  var _listen = _interopRequire(_framptonEventsListen);

  var _contains = _interopRequire(_framptonEventsContains);

  var _getPosition = _interopRequire(_framptonEventsGet_position);

  var _getPositionRelative = _interopRequire(_framptonEventsGet_position_relative);

  var clickStream = (0, _listen)('click', document);
  var downStream = (0, _listen)('mousedown', document);
  var upStream = (0, _listen)('mouseup', document);
  var moveStream = (0, _listen)('mousemove', document);
  var isDown = (0, _stepper)(false, downStream.map(true).merge(upStream.map(false)));

  var defaultMouse = {
    clicks: clickStream,
    downs: downStream,
    ups: upStream,
    position: (0, _stepper)([0, 0], moveStream.map(_getPosition)),
    isDown: isDown
  };

  function Mouse(element) {
    if (!element) {
      return defaultMouse;
    } else {
      return {
        clicks: clickStream.filter((0, _contains)(element)),
        downs: downStream.filter((0, _contains)(element)),
        ups: upStream.filter((0, _contains)(element)),
        position: (0, _stepper)([0, 0], moveStream.filter((0, _contains)(element)).map((0, _getPositionRelative)(element))),
        isDown: isDown
      };
    }
  }
});
define('frampton-object', ['exports', 'frampton-object/filter', 'frampton-object/reduce', 'frampton-object/map', 'frampton-object/for_each', 'frampton-object/as_list'], function (exports, _framptonObjectFilter, _framptonObjectReduce, _framptonObjectMap, _framptonObjectFor_each, _framptonObjectAs_list) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _filter = _interopRequire(_framptonObjectFilter);

  var _reduce = _interopRequire(_framptonObjectReduce);

  var _map = _interopRequire(_framptonObjectMap);

  var _forEach = _interopRequire(_framptonObjectFor_each);

  var _asList = _interopRequire(_framptonObjectAs_list);

  exports.filter = _filter;
  exports.map = _map;
  exports.reduce = _reduce;
  exports.forEach = _forEach;
  exports.asList = _asList;
});
define('frampton-object/as_list', ['exports', 'module', 'frampton-object/reduce'], function (exports, module, _framptonObjectReduce) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _reduce = _interopRequire(_framptonObjectReduce);

  // as_list :: Object -> Array [String, String]

  module.exports = function (map) {
    return (0, _reduce)(function (acc, nextValue, nextKey) {
      acc.push([nextKey, nextValue]);
      return acc;
    }, [], map);
  };
});
define('frampton-object/filter', ['exports', 'module', 'frampton-utils/curry', 'frampton-object/for_each'], function (exports, module, _framptonUtilsCurry, _framptonObjectFor_each) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _forEach = _interopRequire(_framptonObjectFor_each);

  module.exports = (0, _curry)(function curried_filter(fn, obj) {

    var newObj = {};

    (0, _forEach)(function (value, key) {
      if (fn(value, key)) {
        newObj[key] = value;
      }
    }, obj);

    return newObj;
  });
});
define('frampton-object/for_each', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function curried_for_each(fn, obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        fn(obj[key], key);
      }
    }
  });
});
define('frampton-object/map', ['exports', 'module', 'frampton-utils/curry', 'frampton-object/for_each'], function (exports, module, _framptonUtilsCurry, _framptonObjectFor_each) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _forEach = _interopRequire(_framptonObjectFor_each);

  module.exports = (0, _curry)(function curried_map(fn, obj) {

    var newObj = {};

    (0, _forEach)(function (value, key) {
      newObj[key] = fn(value, key);
    }, obj);

    return newObj;
  });
});
define('frampton-object/reduce', ['exports', 'module', 'frampton-utils/curry', 'frampton-object/for_each'], function (exports, module, _framptonUtilsCurry, _framptonObjectFor_each) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _forEach = _interopRequire(_framptonObjectFor_each);

  module.exports = (0, _curry)(function curried_reduce(fn, acc, obj) {

    (0, _forEach)(function (value, key) {
      acc = fn(acc, value, key);
    }, obj);

    return acc;
  });
});
define('frampton-signals', ['exports', 'frampton-signals/dispatcher', 'frampton-signals/event_stream', 'frampton-signals/behavior', 'frampton-signals/empty', 'frampton-signals/interval', 'frampton-signals/sequential', 'frampton-signals/null', 'frampton-signals/send', 'frampton-signals/stepper', 'frampton-signals/accum_b', 'frampton-signals/event'], function (exports, _framptonSignalsDispatcher, _framptonSignalsEvent_stream, _framptonSignalsBehavior, _framptonSignalsEmpty, _framptonSignalsInterval, _framptonSignalsSequential, _framptonSignalsNull, _framptonSignalsSend, _framptonSignalsStepper, _framptonSignalsAccum_b, _framptonSignalsEvent) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Dispatcher = _interopRequire(_framptonSignalsDispatcher);

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  var _Behavior = _interopRequire(_framptonSignalsBehavior);

  var _empty = _interopRequire(_framptonSignalsEmpty);

  var _interval = _interopRequire(_framptonSignalsInterval);

  var _sequential = _interopRequire(_framptonSignalsSequential);

  var _nullStream = _interopRequire(_framptonSignalsNull);

  var _send = _interopRequire(_framptonSignalsSend);

  var _stepper = _interopRequire(_framptonSignalsStepper);

  var _accumB = _interopRequire(_framptonSignalsAccum_b);

  exports.Dispatcher = _Dispatcher;
  exports.EventStream = _EventStream;
  exports.Behavior = _Behavior;
  exports.nextEvent = _framptonSignalsEvent.nextEvent;
  exports.endEvent = _framptonSignalsEvent.endEvent;
  exports.errorEvent = _framptonSignalsEvent.errorEvent;
  exports.emptyEvent = _framptonSignalsEvent.emptyEvent;
  exports.empty = _empty;
  exports.interval = _interval;
  exports.sequential = _sequential;
  exports.nullStream = _nullStream;
  exports.send = _send;
  exports.merge = _framptonSignalsEvent_stream.merge;
  exports.stepper = _stepper;
  exports.accumB = _accumB;
});
define('frampton-signals/accum_b', ['exports', 'module', 'frampton-utils', 'frampton-signals/behavior'], function (exports, module, _framptonUtils, _framptonSignalsBehavior) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Behavior = _interopRequire(_framptonSignalsBehavior);

  // accumB :: a -> EventStream (a -> b) -> Behavior b
  module.exports = (0, _framptonUtils.curry)(function accumB(initial, stream) {
    return new _Behavior(initial, function (behavior) {
      return stream.next(function (fn) {
        behavior.update(fn(initial));
      });
    });
  });
});
define('frampton-signals/behavior', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/guid', 'frampton-utils/noop', 'frampton-utils/is_defined', 'frampton-utils/equal', 'frampton-list/contains'], function (exports, module, _framptonUtilsAssert, _framptonUtilsGuid, _framptonUtilsNoop, _framptonUtilsIs_defined, _framptonUtilsEqual, _framptonListContains) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _guid = _interopRequire(_framptonUtilsGuid);

  var _noop = _interopRequire(_framptonUtilsNoop);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  var _equal = _interopRequire(_framptonUtilsEqual);

  var _contains = _interopRequire(_framptonListContains);

  function Behavior(initial, seed) {
    (0, _assert)('Behavior must have initial value', (0, _isDefined)(initial));
    this.value = initial;
    this.listeners = [];
    this.cleanup = null;
    this.seed = seed || _noop;
    this._id = (0, _guid)();
  }

  function addListener(behavior, fn) {
    if (!(0, _contains)(behavior.listeners, fn)) {
      if (behavior.listeners.length === 0) {
        var sink = behavior.update.bind(behavior);
        behavior.cleanup = behavior.seed(sink) || _noop;
      }
      behavior.listeners.push(fn);
      fn(behavior.value);
    }
  }

  function updateListeners(behavior) {
    behavior.listeners.forEach(function (listener) {
      listener(behavior.value);
    });
  }

  // of :: a -> Behavior a
  Behavior.of = function Behavior_of(value) {
    return new Behavior(value);
  };

  Behavior.prototype.of = Behavior.of;

  Behavior.prototype.update = function Behavior_update(val) {
    if (!(0, _equal)(val, this.value)) {
      this.value = val;
      updateListeners(this);
    }
    return this;
  };

  Behavior.prototype.changes = function Behavior_changes(fn) {
    addListener(this, fn);
    return this;
  };

  Behavior.prototype.bind = function Behavior_bind(obj, prop) {
    this.changes(function (val) {
      obj[prop] = val;
    });
    return this;
  };

  Behavior.prototype.destroy = function Behavior_destroy() {
    this.cleanup();
    this.cleanup = null;
    this.seed = null;
    this.value = null;
    this.listeners = null;
  };

  module.exports = Behavior;
});
define('frampton-signals/constant', ['exports', 'module', 'frampton-signals/behavior'], function (exports, module, _framptonSignalsBehavior) {
  'use strict';

  // constant :: a -> Behavior a
  module.exports = constant;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Behavior = _interopRequire(_framptonSignalsBehavior);

  function constant(val) {
    return _Behavior.of(val);
  }
});
define('frampton-signals/dispatcher', ['exports', 'frampton-utils', 'frampton-list'], function (exports, _framptonUtils, _framptonList) {
  'use strict';

  exports.__esModule = true;

  /**
   * Dispatcher is a helper object that helps the a stream manage its Outlets. A
   * new instance of the Dispatcher is created for each new stream. The owning stream
   * inherits references to its dispatcher's subscribe, broadcast and clear methods.
   *
   * @name Dispatcher
   * @class
   * @private
   * @param  {EventStream} stream The EventStream that owns this instance of the dispatcher.
   * @returns {Dispatcher}   A new dispatcher.
   */
  function Dispatcher(stream) {

    var subscribers = [],
        sink = null;

    /**
     * Add Outlets to the owning stream.
     *
     * @name subscribe
     * @memberOf Dispatcher
     * @method
     * @instance
     * @param   {Function} fn - A callback for this stream
     * @returns {Function} A function to cancel the subscription.
     */
    this.subscribe = function Dispatcher_subscribe(fn) {

      subscribers.push(fn);

      if (subscribers.length === 1) {
        sink = stream.push.bind(stream);
        stream.cleanup = stream.seed(sink) || _framptonUtils.noop;
      }

      return function unsub() {
        subscribers = (0, _framptonList.remove)(subscribers, fn);
        if (subscribers.length === 0) {
          stream.cleanup();
          stream.cleanup = null;
        }
      };
    };

    /**
     * Handles notifying outlets of new data on the stream.
     *
     * @name push
     * @memberOf Dispatcher
     * @method
     * @instance
     * @param {Any} data The data to push to subscribers.
     */
    this.push = function Dispatcher_push(event) {
      subscribers.forEach(function (fn) {
        fn(event);
      });
    };

    /**
     * Used to burn it all down when this stream is destroyed.
     *
     * @name destroy
     * @memberOf Dispatcher
     * @method
     * @instance
     */
    this.destroy = function Dispatcher_destroy() {
      if (stream.cleanup) {
        stream.cleanup();
        stream.cleanup = null;
      }
      subscribers = null;
      sink = null;
      this.subscribe = null;
      this.push = null;
    };
  }

  var isDispatcher = function isDispatcher(obj) {
    return obj instanceof Dispatcher;
  };

  exports['default'] = Dispatcher;
  exports.isDispatcher = isDispatcher;
});
define('frampton-signals/empty', ['exports', 'module', 'frampton-signals/event_stream'], function (exports, module, _framptonSignalsEvent_stream) {
  'use strict';

  module.exports = empty_stream;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  function empty_stream() {
    return new _EventStream(null, null);
  }
});
define('frampton-signals/event', ['exports', 'frampton-utils'], function (exports, _framptonUtils) {
  'use strict';

  exports.__esModule = true;

  /**
   * The value of a observable
   */
  function Event(value) {}

  Event.of = function (value) {
    return new Next(value);
  };

  Event.prototype.of = Event.of;

  Event.prototype.ap = _framptonUtils.notImplemented;

  Event.prototype.map = _framptonUtils.notImplemented;

  Event.prototype.recover = _framptonUtils.notImplemented;

  Event.prototype.filter = _framptonUtils.notImplemented;

  Event.prototype.get = function () {
    return this._value;
  };

  Event.prototype.isEmpty = function () {
    return false;
  };

  Event.prototype.isEnd = function () {
    return false;
  };

  Event.prototype.isNext = function () {
    return false;
  };

  Event.prototype.isError = function () {
    return false;
  };

  /**
   * @class Next
   * @extends Event
   */
  (0, _framptonUtils.inherits)(Next, Event);

  function Next(value) {
    this._value = value;
  }

  Next.prototype.map = function (fn) {
    return new Next(fn(this._value));
  };

  Next.prototype.recover = function (fn) {
    return new Next(this._value);
  };

  Next.prototype.filter = function (fn) {
    if (fn(this._value)) {
      return new Next(this._value);
    } else {
      return new Empty();
    }
  };

  Next.prototype.isNext = function () {
    return true;
  };

  function nextEvent(value) {
    return new Next(value);
  }

  /**
   * @class End
   * @extends Event
   */
  (0, _framptonUtils.inherits)(End, Event);

  function End(value) {
    this._value = value;
  }

  End.prototype.map = function () {
    return new End(this._value);
  };

  End.prototype.recover = function (fn) {
    return new End(this._value);
  };

  End.prototype.filter = function (fn) {
    if (fn(this._value)) {
      return new End(this._value);
    } else {
      return new Empty();
    }
  };

  End.prototype.isEnd = function () {
    return true;
  };

  function endEvent(value) {
    return new End(value || null);
  }

  /**
   * @class Error
   * @extends Event
   */
  (0, _framptonUtils.inherits)(Error, Event);

  function Error(msg) {
    (0, _framptonUtils.assert)('Error requires a message', (0, _framptonUtils.isString)(msg));
    this._message = msg;
  }

  Error.prototype.get = function () {
    return this._message;
  };

  Error.prototype.map = function () {
    return new Error(this._message);
  };

  Error.prototype.recover = function (fn) {
    return new Next(fn(this._message));
  };

  Error.prototype.filter = function () {
    return new Error(this._message);
  };

  Error.prototype.isError = function () {
    return true;
  };

  function errorEvent(msg) {
    return new Error(msg);
  }

  /**
   * @class Empty
   * @extends Event
   */
  (0, _framptonUtils.inherits)(Empty, Event);

  function Empty() {}

  Empty.prototype.get = function () {
    return null;
  };

  Empty.prototype.map = function () {
    return new Empty();
  };

  Empty.prototype.recover = function () {
    return new Empty();
  };

  Empty.prototype.filter = function () {
    return new Empty();
  };

  Empty.prototype.isEmpty = function () {
    return true;
  };

  function emptyEvent() {
    return new Empty();
  }

  exports.emptyEvent = emptyEvent;
  exports.errorEvent = errorEvent;
  exports.nextEvent = nextEvent;
  exports.endEvent = endEvent;
});
define('frampton-signals/event_stream', ['exports', 'frampton-utils', 'frampton-signals/event', 'frampton-signals/stepper', 'frampton-signals/dispatcher'], function (exports, _framptonUtils, _framptonSignalsEvent, _framptonSignalsStepper, _framptonSignalsDispatcher) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _stepper = _interopRequire(_framptonSignalsStepper);

  var _Dispatcher = _interopRequire(_framptonSignalsDispatcher);

  // Creates a new stream with a given transform.
  function withTransform(source, transform) {
    return new EventStream(function (sink) {
      return source.subscribe(function (event) {
        sink(event);
      });
    }, transform);
  }

  function fromMerge() {
    for (var _len = arguments.length, streams = Array(_len), _key = 0; _key < _len; _key++) {
      streams[_key] = arguments[_key];
    }

    var breakers = [];

    return new EventStream(function (sink) {

      streams.forEach(function (source) {
        breakers.push(source.subscribe(function (event) {
          sink(event);
        }));
      });

      return function merge_cleanup() {
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        streams = null;
      };
    });
  }

  function EventStream(seed, transform) {
    this._id = (0, _framptonUtils.guid)();
    this.seed = seed || _framptonUtils.noop;
    this.transform = transform || _framptonUtils.identity;
    this.dispatcher = new _Dispatcher(this);
    this.cleanup = null;
    this.isClosed = false;
  }

  /**
   * @name push
   * @memberOf EventStream
   */
  EventStream.prototype.push = function EventStream_push(event) {
    try {
      if (!this.isClosed) {
        this.dispatcher.push(this.transform(event));
      }
    } catch (e) {
      (0, _framptonUtils.log)('error: ', e);
      this.dispatcher.push((0, _framptonSignalsEvent.errorEvent)(e.message));
    }
  };

  // Gets raw event, including empty events discarded by filter actions
  EventStream.prototype.subscribe = function EventStream_subscribe(fn) {
    return this.dispatcher.subscribe(fn);
  };

  /**
   * Registers a callback for the next value on the stream
   *
   * @name next
   * @method
   * @memberOf EventStream
   * @instance
   * @param {Function} fn   Function to call when there is a value
   * @returns {EventStream} A function to unsubscribe from the EventStream
   */
  EventStream.prototype.next = function EventStream_next(fn) {
    return this.subscribe(function (event) {
      if (event.isNext()) {
        fn(event.get());
      }
    });
  };

  /**
   * Registers a callback for errors on the stream
   *
   * @name error
   * @method
   * @memberOf EventStream
   * @instance
   * @param {Function} fn   Function to call when there is an error
   * @returns {EventStream} A function to unsubscribe from the EventStream
   */
  EventStream.prototype.error = function EventStream_error(fn) {
    return this.subscribe(function (event) {
      if (event.isError()) {
        fn(event.get());
      }
    });
  };

  /**
   * Registers a callback for when the stream closes
   *
   * @name next
   * @method
   * @memberOf EventStream
   * @instance
   * @param {Function} fn   Function to call when the stream closes
   * @returns {EventStream} A function to unsubscribe from the EventStream
   */
  EventStream.prototype.done = function EventStream_done(fn) {
    return this.subscribe(function (event) {
      if (event.isEnd()) {
        fn(event.get());
      }
    });
  };

  /**
   * Closes the stream by removing all subscribers and calling cleanup function (if any)
   *
   * @name close
   * @method
   * @memberOf EventStream
   * @instance
   */
  EventStream.prototype.close = function EventStream_close() {
    if (!this.isClosed) {
      this.push((0, _framptonSignalsEvent.endEvent)());
      this.isClosed = true;
      this.dispatcher.destroy();
      this.dispatcher = null;
    }
  };

  /**
   * join :: EventStream ( EventStream a ) -> EventStream a
   *
   * Given an EventStream of an EventStream it will remove one layer of nesting.
   *
   * @name close
   * @method
   * @memberOf EventStream
   * @instance
   * @returns {EventStream} A new EventStream with a level of nesting removed
   */
  EventStream.prototype.join = function EventStream_join() {

    var source = this;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {
        if (event.isNext()) {
          breakers.push(event.get().subscribe(function (event) {
            sink(event);
          }));
        } else {
          sink(event);
        }
      }));

      return function chain_cleanup() {
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        source = null;
      };
    });
  };

  /**
   * chain(>>=) :: EventStream a -> (a -> EventStream b) -> EventStream b
   *
   * Given a function that returns an EventStream this will create a new EventStream
   * that passes the value of the parent EventStream to the function and returns the value
   * of the nested EventStream
   *
   * @name chain
   * @method
   * @memberOf EventStream
   * @instance
   * @param {Function} fn   A function that returns an EventStream
   * @returns {EventStream} A new EventStream with a level of nesting removed
   */
  EventStream.prototype.chain = function EventStream_chain(fn) {
    return this.map(fn).join();
  };

  // chainLatest :: EventStream a -> (a -> EventStream b) -> EventStream b
  EventStream.prototype.chainLatest = function EventStream_chainLatest(fn) {

    var source = this;
    var innerStream = null;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {

        if (event.isNext()) {

          if (innerStream) {
            innerStream.close();
            innerStream = null;
          }

          innerStream = fn(event.get());
          innerStream.subscribe(function (event) {
            sink(event);
          });
        } else {
          sink(event);
        }
      }));

      return function chainLatest_cleanup() {
        if (innerStream) {
          innerStream.close();
          innerStream = null;
        }
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        source = null;
      };
    });
  };

  // ap(<*>) :: EventStream (a -> b) -> EventStream a -> EventStream b
  EventStream.prototype.ap = function EventStream_ap(stream) {

    var source = this;
    var breakers = [];

    return new EventStream(function (sink) {

      var fn = _framptonUtils.identity;

      breakers.push(source.subscribe(function (event) {
        if (event.isNext()) {
          fn = event.get();
        }
      }));

      breakers.push(stream.subscribe(function (event) {
        if (event.isNext()) {
          sink((0, _framptonSignalsEvent.nextEvent)(fn(event.get())));
        } else {
          sink(event);
        }
      }));

      return function ap_cleanup() {
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        source = null;
      };
    });
  };

  // map :: EventStream a -> (a -> b) -> EventStream b
  EventStream.prototype.map = function EventStream_map(mapping) {
    var mappingFn = (0, _framptonUtils.isFunction)(mapping) ? mapping : (0, _framptonUtils.ofValue)(mapping);
    return withTransform(this, function (event) {
      return event.map(mappingFn);
    });
  };

  // recover :: EventStream a -> (err -> a) -> EventStream a
  EventStream.prototype.recover = function EventStream_recover(mapping) {
    var mappingFn = (0, _framptonUtils.isFunction)(mapping) ? mapping : (0, _framptonUtils.ofValue)(mapping);
    return withTransform(this, function (event) {
      return event.recover(mappingFn);
    });
  };

  // filter :: EventStream a -> (a -> Bool) -> EventStream a
  EventStream.prototype.filter = function EventStream_filter(predicate) {
    var filterFn = (0, _framptonUtils.isFunction)(predicate) ? predicate : (0, _framptonUtils.isEqual)(predicate);
    return withTransform(this, function (event) {
      return event.filter(filterFn);
    });
  };

  // scan :: EventStream a -> (a -> b) -> Behavior b
  EventStream.prototype.scan = function (initial, fn) {
    return (0, _stepper)(initial, this.map(fn));
  };

  // sample :: EventStream a -> Behavior b -> EventStream b
  EventStream.prototype.sample = function (behavior) {
    var source = this;
    var breakers = [];
    return new EventStream(function (sink) {
      breakers.push(source.subscribe(function (event) {
        if (event.isNext()) {
          sink((0, _framptonSignalsEvent.nextEvent)(behavior.value));
        } else {
          sink(event);
        }
      }));
      return function sample_cleanup() {
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        source = null;
      };
    });
  };

  // fold :: EventStream a -> (a -> s -> s) -> s -> EventStream s
  EventStream.prototype.fold = function (fn, acc) {
    return withTransform(this, function (event) {
      acc = (0, _framptonUtils.isUndefined)(acc) ? event.get() : fn(acc, event.get());
      return (0, _framptonSignalsEvent.nextEvent)(acc);
    });
  };

  // take :: EventStream a -> Number n -> EventStream a
  EventStream.prototype.take = function (limit) {

    var source = this;
    var breaker = null;

    return new EventStream(function (sink) {

      var stream = this;

      breaker = source.subscribe(function (event) {
        if (event.isNext()) {
          if (limit > 0) {
            limit = limit - 1;
            sink(event);
          } else {
            stream.close();
          }
        } else {
          sink(event);
        }
      });

      return function take_cleanup() {
        breaker();
        breaker = null;
        source = null;
      };
    });
  };

  /**
   * Merges a stream with the current stream and returns a new stream
   *
   * @name merge
   * @method
   * @memberOf EventStream
   * @instance
   * @param {Object} stream - stream to merge with current stream
   * @returns {EventStream} A new EventStream
   */
  EventStream.prototype.merge = function Stream_merge(stream) {
    return fromMerge(this, stream);
  };

  /**
   * zip :: EventStream a -> Behavior b -> EventStream [a,b]
   *
   * @name zip
   * @method
   * @memberOf EventStream
   * @instance
   * @param {Behavior} behavipr - The EventStream to zip with the current EventStream.
   * @returns {EventStream} A new EventStream.
   */
  EventStream.prototype.zip = function Stream_zip(behavior) {

    var source = this;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {
        if (event.isNext()) {
          sink((0, _framptonSignalsEvent.nextEvent)([event.get(), behavior.value]));
        } else {
          sink(event);
        }
      }));

      return function break_zip() {
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        source = null;
      };
    });
  };

  // debounce :: EventStream a -> Number -> EventStream a
  EventStream.prototype.debounce = function EventStream_debounce(delay) {

    var source = this;
    var timerId = null;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {

        if (event.isNext()) {

          if (timerId) clearTimeout(timerId);

          timerId = setTimeout(function () {
            sink((0, _framptonSignalsEvent.nextEvent)(event.get()));
            timerId = null;
          }, delay);
        } else {
          sink(event);
        }
      }));

      return function debounce_cleanup() {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        source = null;
      };
    });
  };

  /**
   * throttle :: EventStream a -> Number -> EventStream a
   *
   * @name throttle
   * @method
   * @memberOf EventStream
   * @instance
   * @param {Number} delay - Time (milliseconds) to delay each update on the stream.
   * @returns {EventStream} A new Stream with the delay applied.
   */
  EventStream.prototype.throttle = function EventStream_throttle(delay) {

    var source = this;
    var timer = null;
    var saved = null;
    var breakers = [];

    return new EventStream(function (sink) {

      function applyTimeout() {

        return setTimeout(function () {

          timer = null;

          if (saved) {
            sink((0, _framptonSignalsEvent.nextEvent)(saved));
            saved = null;
          }
        }, delay);
      }

      breakers.push(source.subscribe(function (event) {

        if (event.isNext()) {
          saved = event.get();
          timer = timer !== null ? timer : applyTimeout();
        } else {
          sink(event);
        }
      }));

      return function throttle_cleanup() {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        saved = null;
        source = null;
      };
    });
  };

  /**
   * dropRepeats :: EventStream a -> EventStream a
   *
   * @name dropRepeats
   * @method
   * @memberOf EventStream
   * @instance
   * @returns {EventStream} A new Stream with repeated values dropped.
   */
  EventStream.prototype.dropRepeats = function EventStream_dropRepeats() {
    var prevVal = null;
    return this.filter(function (val) {
      if (val !== prevVal) {
        prevVal = val;
        return true;
      }
      return false;
    });
  };

  /**
   * and :: EventStream a -> Behavior b -> EventStream a
   *
   * @name and
   * @method
   * @memberOf EventStream
   * @instance
   * @param {Behavior} behavior - A behavior to test against
   * @returns {EventStream} A new EventStream that only produces values if the behavior is truthy.
   */
  EventStream.prototype.and = function (behavior) {

    var source = this;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {

        if (event.isNext()) {
          if (behavior.value) {
            sink(event);
          }
        } else {
          sink(event);
        }
      }));

      return function and_cleanup() {
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        source = null;
      };
    });
  };

  /**
   * not :: EventStream a -> Behavior b -> EventStream a
   *
   * @name not
   * @method
   * @memberOf EventStream
   * @instance
   * @param {Behavior} behavior - A behavior to test against
   * @returns {EventStream} A new EventStream that only produces values if the behavior is falsy.
   */
  EventStream.prototype.not = function (behavior) {

    var source = this;
    var breakers = [];

    return new EventStream(function (sink) {

      breakers.push(source.subscribe(function (event) {

        if (event.isNext()) {
          if (!behavior.value) {
            sink(event);
          }
        } else {
          sink(event);
        }
      }));

      return function not_cleanup() {
        breakers.forEach(_framptonUtils.apply);
        breakers = null;
        source = null;
      };
    });
  };

  /**
   * log :: EventStream a
   *
   * @name log
   * @method
   * @memberOf EventStream
   * @instance
   * @returns {EventStream} A new EventStream that logs its values to the console.
   */
  EventStream.prototype.log = function EventStream_log() {
    return withTransform(this, function (event) {
      (0, _framptonUtils.log)(event.get());
      return event;
    });
  };

  var isEventStream = function isEventStream(obj) {
    return obj instanceof EventStream;
  };

  exports['default'] = EventStream;
  exports.merge = fromMerge;
  exports.isEventStream = isEventStream;
});
define('frampton-signals/interval', ['exports', 'module', 'frampton-signals/event_stream', 'frampton-signals/event'], function (exports, module, _framptonSignalsEvent_stream, _framptonSignalsEvent) {
  'use strict';

  // interval :: EventStream Number
  module.exports = interval;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  function interval() {
    return new _EventStream(function (sink) {

      var frame = 0;
      var requestId = null;
      var isStopped = false;

      requestId = requestAnimationFrame(function step() {
        sink((0, _framptonSignalsEvent.nextEvent)(frame++));
        if (!isStopped) requestId = requestAnimationFrame(step);
      });

      return function interval_destroy() {
        cancelAnimationFrame(requestId);
        isStopped = true;
        requestId = null;
      };
    });
  }
});
define('frampton-signals/null', ['exports', 'module', 'frampton-signals/event_stream'], function (exports, module, _framptonSignalsEvent_stream) {
  'use strict';

  module.exports = null_stream;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  var instance = null;

  function null_stream() {
    return instance !== null ? instance : instance = new _EventStream(null, null);
  }
});
define('frampton-signals/send', ['exports', 'module', 'frampton-utils/curry', 'frampton-signals/event'], function (exports, module, _framptonUtilsCurry, _framptonSignalsEvent) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // send :: EventStream a -> EventStream b -> Task [a, b] -> ()
  module.exports = (0, _curry)(function send(errors, values, task) {
    task.run(function (err) {
      return errors.push((0, _framptonSignalsEvent.nextEvent)(err));
    }, function (val) {
      return values.push((0, _framptonSignalsEvent.nextEvent)(val));
    });
  });
});
define('frampton-signals/sequential', ['exports', 'module', 'frampton-utils', 'frampton-list', 'frampton-signals/event_stream', 'frampton-signals/event'], function (exports, module, _framptonUtils, _framptonList, _framptonSignalsEvent_stream, _framptonSignalsEvent) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _EventStream = _interopRequire(_framptonSignalsEvent_stream);

  /**
   * Creates a new stream that sequentially emits the values of the given
   * array with the provided delay between each value.
   * @name sequential
   * @param {Number} delay Millisecond delay
   * @param {Array}  arr   Array of values
   * @returns {EventStream} A new EventStream
   */
  module.exports = (0, _framptonUtils.curry)(function sequential(delay, arr) {
    return new _EventStream(function (sink) {

      var stream = this;
      var isStopped = false;
      var timerId = null;

      function step(arr) {
        timerId = setTimeout(function () {
          sink((0, _framptonSignalsEvent.nextEvent)(arr[0]));
          timerId = null;
          if (arr.length > 1 && !isStopped) {
            step((0, _framptonList.drop)(1, arr));
          } else {
            stream.close();
          }
        }, delay);
      }

      step(arr);

      return function sequential_destroy() {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
        isStopped = true;
        stream = null;
        arr = null;
      };
    });
  });
});
define('frampton-signals/stepper', ['exports', 'module', 'frampton-utils', 'frampton-signals/behavior'], function (exports, module, _framptonUtils, _framptonSignalsBehavior) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Behavior = _interopRequire(_framptonSignalsBehavior);

  // stepper :: a -> EventStream a -> Behavior a
  module.exports = (0, _framptonUtils.curry)(function stepper(initial, stream) {
    return new _Behavior(initial, function (sink) {
      return stream.next(function (val) {
        sink(val);
      });
    });
  });
});
define('frampton-string', ['exports', 'frampton-string/join', 'frampton-string/split', 'frampton-string/lines', 'frampton-string/words', 'frampton-string/starts_with', 'frampton-string/ends_with', 'frampton-string/contains'], function (exports, _framptonStringJoin, _framptonStringSplit, _framptonStringLines, _framptonStringWords, _framptonStringStarts_with, _framptonStringEnds_with, _framptonStringContains) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _join = _interopRequire(_framptonStringJoin);

  var _split = _interopRequire(_framptonStringSplit);

  var _lines = _interopRequire(_framptonStringLines);

  var _words = _interopRequire(_framptonStringWords);

  var _startsWith = _interopRequire(_framptonStringStarts_with);

  var _endsWith = _interopRequire(_framptonStringEnds_with);

  var _contains = _interopRequire(_framptonStringContains);

  exports.join = _join;
  exports.split = _split;
  exports.lines = _lines;
  exports.words = _words;
  exports.endsWith = _endsWith;
  exports.startsWith = _startsWith;
  exports.contains = _contains;
});
define('frampton-string/contains', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // contains :: String -> String -> Boolean
  module.exports = (0, _curry)(function contains(sub, str) {
    return str.indexOf(sub) > -1;
  });
});
define('frampton-string/ends_with', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // ends_with :: String -> String -> Boolean
  module.exports = (0, _curry)(function ends_with(sub, str) {
    return str.length >= sub.length && str.lastIndexOf(sub) === str.length - sub.length;
  });
});
define('frampton-string/join', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // join :: String -> Array String -> String
  module.exports = (0, _curry)(function join(sep, strs) {
    return strs.join(sep);
  });
});
define("frampton-string/lines", ["exports", "module"], function (exports, module) {
  // lines :: String -> Array String
  "use strict";

  module.exports = lines;

  function lines(str) {
    return str.split(/\r\n|\r|\n/g);
  }
});
define('frampton-string/split', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // split :: String -> String -> Array String
  module.exports = (0, _curry)(function join(sep, str) {
    return str.split(sep);
  });
});
define('frampton-string/starts_with', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  // starts_with :: String -> String -> Boolean
  module.exports = (0, _curry)(function starts_with(sub, str) {
    return str.indexOf(sub) === 0;
  });
});
define("frampton-string/words", ["exports", "module"], function (exports, module) {
  // words :: String -> Array String
  "use strict";

  module.exports = words;

  function words(str) {
    return str.trim().split(/\s+/g);
  }
});
define('frampton-style', ['exports', 'frampton-style/add_class', 'frampton-style/remove_class', 'frampton-style/has_class', 'frampton-style/current_value', 'frampton-style/apply_styles', 'frampton-style/remove_styles'], function (exports, _framptonStyleAdd_class, _framptonStyleRemove_class, _framptonStyleHas_class, _framptonStyleCurrent_value, _framptonStyleApply_styles, _framptonStyleRemove_styles) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _addClass = _interopRequire(_framptonStyleAdd_class);

  var _removeClass = _interopRequire(_framptonStyleRemove_class);

  var _hasClass = _interopRequire(_framptonStyleHas_class);

  var _current = _interopRequire(_framptonStyleCurrent_value);

  var _applyStyles = _interopRequire(_framptonStyleApply_styles);

  var _removeStyles = _interopRequire(_framptonStyleRemove_styles);

  exports.addClass = _addClass;
  exports.removeClass = _removeClass;
  exports.hasClass = _hasClass;
  exports.current = _current;
  exports.applyStyles = _applyStyles;
  exports.removeStyles = _removeStyles;
});
define('frampton-style/add_class', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function add_class(element, name) {
    element.classList.add(name);
  });
});
define('frampton-style/apply_styles', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function apply_styles(element, props) {
    for (var key in props) {
      element.style.setProperty(key, props[key], '');
    }
  });
});
define('frampton-style/current_value', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var style = window.getComputedStyle;

  // current :: DomNode -> String -> String
  module.exports = (0, _curry)(function current(element, prop) {
    return style(element).getPropertyValue(prop);
  });
});
define('frampton-style/has_class', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function add_class(element, name) {
    return element.classList.contains(name);
  });
});
define('frampton-style/remove_class', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function remove_class(element, name) {
    element.classList.remove(name);
  });
});
define('frampton-style/remove_styles', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function remove_styles(element, props) {
    for (var key in props) {
      element.style.removeProperty(key);
    }
  });
});
define('frampton-ui', ['exports', 'frampton-ui/input'], function (exports, _framptonUiInput) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Input = _interopRequire(_framptonUiInput);

  exports.Input = _Input;
});
define('frampton-ui/input', ['exports', 'module', 'frampton-signals', 'frampton-events'], function (exports, module, _framptonSignals, _framptonEvents) {
  'use strict';

  module.exports = ui_input;

  function ui_input(element) {

    var localInputs = (0, _framptonEvents.listen)('input', element);
    var localChanges = (0, _framptonEvents.listen)('change', element);
    var localBlurs = (0, _framptonEvents.listen)('blur', element);
    var localFocuses = (0, _framptonEvents.listen)('focus', element);
    var focused = localBlurs.map(false).merge(localFocuses.map(true));
    var values = localInputs.merge(localChanges).map(_framptonEvents.eventValue);

    return {
      change: localChanges,
      input: localInputs,
      blur: localBlurs,
      focus: localFocuses,
      isFocused: (0, _framptonSignals.stepper)(false, focused),
      value: (0, _framptonSignals.stepper)('', values)
    };
  }
});
define('frampton-utils', ['exports', 'frampton-utils/apply', 'frampton-utils/assert', 'frampton-utils/compose', 'frampton-utils/curry', 'frampton-utils/equal', 'frampton-utils/extend', 'frampton-utils/get', 'frampton-utils/guid', 'frampton-utils/identity', 'frampton-utils/immediate', 'frampton-utils/inherits', 'frampton-utils/is_array', 'frampton-utils/is_defined', 'frampton-utils/is_equal', 'frampton-utils/is_nothing', 'frampton-utils/is_something', 'frampton-utils/is_null', 'frampton-utils/is_object', 'frampton-utils/is_string', 'frampton-utils/is_undefined', 'frampton-utils/is_boolean', 'frampton-utils/is_function', 'frampton-utils/is_promise', 'frampton-utils/log', 'frampton-utils/lazy', 'frampton-utils/memoize', 'frampton-utils/noop', 'frampton-utils/of_value', 'frampton-utils/safe_get'], function (exports, _framptonUtilsApply, _framptonUtilsAssert, _framptonUtilsCompose, _framptonUtilsCurry, _framptonUtilsEqual, _framptonUtilsExtend, _framptonUtilsGet, _framptonUtilsGuid, _framptonUtilsIdentity, _framptonUtilsImmediate, _framptonUtilsInherits, _framptonUtilsIs_array, _framptonUtilsIs_defined, _framptonUtilsIs_equal, _framptonUtilsIs_nothing, _framptonUtilsIs_something, _framptonUtilsIs_null, _framptonUtilsIs_object, _framptonUtilsIs_string, _framptonUtilsIs_undefined, _framptonUtilsIs_boolean, _framptonUtilsIs_function, _framptonUtilsIs_promise, _framptonUtilsLog, _framptonUtilsLazy, _framptonUtilsMemoize, _framptonUtilsNoop, _framptonUtilsOf_value, _framptonUtilsSafe_get) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _apply = _interopRequire(_framptonUtilsApply);

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _compose = _interopRequire(_framptonUtilsCompose);

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _equal = _interopRequire(_framptonUtilsEqual);

  var _extend = _interopRequire(_framptonUtilsExtend);

  var _get = _interopRequire(_framptonUtilsGet);

  var _guid = _interopRequire(_framptonUtilsGuid);

  var _identity = _interopRequire(_framptonUtilsIdentity);

  var _immediate = _interopRequire(_framptonUtilsImmediate);

  var _inherits = _interopRequire(_framptonUtilsInherits);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  var _isDefined = _interopRequire(_framptonUtilsIs_defined);

  var _isEqual = _interopRequire(_framptonUtilsIs_equal);

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _isNull = _interopRequire(_framptonUtilsIs_null);

  var _isObject = _interopRequire(_framptonUtilsIs_object);

  var _isString = _interopRequire(_framptonUtilsIs_string);

  var _isUndefined = _interopRequire(_framptonUtilsIs_undefined);

  var _isBoolean = _interopRequire(_framptonUtilsIs_boolean);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  var _isPromise = _interopRequire(_framptonUtilsIs_promise);

  var _log = _interopRequire(_framptonUtilsLog);

  var _lazy = _interopRequire(_framptonUtilsLazy);

  var _memoize = _interopRequire(_framptonUtilsMemoize);

  var _noop = _interopRequire(_framptonUtilsNoop);

  var _ofValue = _interopRequire(_framptonUtilsOf_value);

  var _safeGet = _interopRequire(_framptonUtilsSafe_get);

  exports.apply = _apply;
  exports.assert = _assert;
  exports.compose = _compose;
  exports.curry = _curry;
  exports.equal = _equal;
  exports.extend = _extend;
  exports.get = _get;
  exports.guid = _guid;
  exports.identity = _identity;
  exports.immediate = _immediate;
  exports.inherits = _inherits;
  exports.isArray = _isArray;
  exports.isDefined = _isDefined;
  exports.isEqual = _isEqual;
  exports.isNothing = _isNothing;
  exports.isSomething = _isSomething;
  exports.isNull = _isNull;
  exports.isObject = _isObject;
  exports.isString = _isString;
  exports.isUndefined = _isUndefined;
  exports.isBoolean = _isBoolean;
  exports.isFunction = _isFunction;
  exports.isPromise = _isPromise;
  exports.log = _log;
  exports.lazy = _lazy;
  exports.memoize = _memoize;
  exports.noop = _noop;
  exports.ofValue = _ofValue;
  exports.safeGet = _safeGet;
});
define("frampton-utils/apply", ["exports", "module"], function (exports, module) {
  /**
   * Takes a function and warps it to be called at a later time.
   * @name apply
   * @memberOf Frampton
   * @method
   * @static
   * @param {Function} fn      The function to wrap.
   * @param {Object}   thisArg Context in which to apply function.
   */
  "use strict";

  module.exports = apply;

  function apply(fn, thisArg) {
    return fn.call(thisArg || null);
  }
});
define('frampton-utils/assert', ['exports', 'module'], function (exports, module) {
  /**
   * Occassionally we need to blow things up if something isn't right.
   * @name assert
   * @param {String} msg  - Message to throw with error.
   * @param {Any}    cond - A condition that evaluates to a Boolean. If false, an error is thrown.
   */
  'use strict';

  module.exports = assert;

  function assert(msg, cond) {
    if (!cond) {
      throw new Error(msg || 'An error occured'); // Boom!
    }
  }
});
define('frampton-utils/compose', ['exports', 'module', 'frampton-utils/assert', 'frampton-list/copy', 'frampton-list/foldr', 'frampton-list/head'], function (exports, module, _framptonUtilsAssert, _framptonListCopy, _framptonListFoldr, _framptonListHead) {
  'use strict';

  /**
   * Compose takes any number of functions and returns a function that when
   * executed will call the passed functions in order, passing the return of
   * each function to the next function in the execution order.
   *
   * @name compose
   * @memberOf Frampton
   * @static
   * @param {Function} functions - Any number of function used to build the composition.
   */
  module.exports = compose;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _copy = _interopRequire(_framptonListCopy);

  var _foldr = _interopRequire(_framptonListFoldr);

  var _head = _interopRequire(_framptonListHead);

  function compose() {
    var fns = (0, _copy)(arguments);
    (0, _assert)('Compose did not receive any arguments. You can\'t compose nothing. Stoopid.', fns.length > 0);
    return function composition() {
      return (0, _head)((0, _foldr)(function (args, fn) {
        return [fn.apply(this, args)];
      }, (0, _copy)(arguments), fns));
    };
  }
});
/* functions */
define('frampton-utils/curry', ['exports', 'module', 'frampton-utils/assert', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsAssert, _framptonUtilsIs_function) {
  'use strict';

  /**
   * Takes a function and returns a new function that will wait to execute the original
   * function until it has received all of its arguments. Each time the function is called
   * without receiving all of its arguments it will return a new function waiting for the
   * remaining arguments.
   *
   * @name curry
   * @memberOf Frampton
   * @static
   * @param {Function} curry - Function to curry.
   */
  module.exports = curry;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _assert = _interopRequire(_framptonUtilsAssert);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  function curry(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (0, _assert)('Argument passed to curry is not a function', (0, _isFunction)(fn));

    var arity = fn.length;

    function curried() {
      for (var _len2 = arguments.length, args2 = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args2[_key2] = arguments[_key2];
      }

      // an array of arguments for this instance of the curried function
      var locals = args;

      if (arguments.length > 0) {
        locals = locals.concat(args2);
      }

      if (locals.length >= arity) {
        return fn.apply(null, locals);
      } else {
        return curry.apply(null, [fn].concat(locals));
      }
    }

    return args.length >= arity ? curried() : curried;
  }
});
define('frampton-utils/equal', ['exports', 'module', 'frampton-utils/is_object', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsIs_object, _framptonUtilsIs_array) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isObject = _interopRequire(_framptonUtilsIs_object);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  module.exports = function (obj1, obj2) {

    if (((0, _isObject)(obj1) || (0, _isArray)(obj1)) && ((0, _isObject)(obj1) || (0, _isArray)(obj1))) {

      var key = null;

      for (key in obj1) {
        if (obj2[key] !== obj1[key]) {
          return false;
        }
      }

      return true;
    } else {
      return obj1 === obj2;
    }
  };
});
define('frampton-utils/extend', ['exports', 'module', 'frampton-list/foldl'], function (exports, module, _framptonListFoldl) {
  'use strict';

  module.exports = extend;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _foldl = _interopRequire(_framptonListFoldl);

  function extend(base) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return (0, _foldl)(function (acc, next) {
      var key;
      for (key in next) {
        acc[key] = next[key];
      }
      return acc;
    }, base, args);
  }
});
define('frampton-utils/get', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  //+ get :: String -> Object -> Any
  module.exports = (0, _curry)(function get(prop, obj) {
    return obj[prop] || null;
  });
});
define("frampton-utils/guid", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = guid;
  var id = 0;

  function guid() {
    return id++;
  }
});
define("frampton-utils/identity", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = identity;

  function identity(x) {
    return x;
  }
});
define("frampton-utils/immediate", ["exports", "module"], function (exports, module) {
  // immediate :: Function -> ()
  "use strict";

  module.exports = immediate;

  function immediate(fn, context) {
    setTimeout(fn.bind(context || null), 0);
  }
});
define("frampton-utils/inherits", ["exports", "module"], function (exports, module) {
  /**
   * Similar to class extension in other languages. The child recieves all the
   * static and prototype methods/properties of the parent object.
   */
  "use strict";

  module.exports = inherits;

  function inherits(child, parent) {

    for (var key in parent) {
      if (parent.hasOwnProperty(key)) {
        child[key] = parent[key];
      }
    }

    function Class() {
      this.constructor = child;
    }

    Class.prototype = parent.prototype;
    child.prototype = new Class();
    child.__super__ = parent.prototype;

    return child;
  }
});
define("frampton-utils/is_array", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = isArray;

  function isArray(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
  }
});
define('frampton-utils/is_boolean', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = isBoolean;

  function isBoolean(obj) {
    return typeof obj === 'boolean';
  }
});
define('frampton-utils/is_defined', ['exports', 'module', 'frampton-utils/is_undefined'], function (exports, module, _framptonUtilsIs_undefined) {
  'use strict';

  module.exports = isDefined;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isUndefined = _interopRequire(_framptonUtilsIs_undefined);

  function isDefined(obj) {
    return !(0, _isUndefined)(obj);
  }
});
define('frampton-utils/is_equal', ['exports', 'module', 'frampton-utils/curry'], function (exports, module, _framptonUtilsCurry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  module.exports = (0, _curry)(function is_equal(a, b) {
    return a === b;
  });
});
define('frampton-utils/is_function', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = isFunction;

  function isFunction(fn) {
    return typeof fn === 'function';
  }
});
define('frampton-utils/is_nothing', ['exports', 'module', 'frampton-utils/is_undefined', 'frampton-utils/is_null'], function (exports, module, _framptonUtilsIs_undefined, _framptonUtilsIs_null) {
  'use strict';

  module.exports = isNothing;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isUndefined = _interopRequire(_framptonUtilsIs_undefined);

  var _isNull = _interopRequire(_framptonUtilsIs_null);

  function isNothing(obj) {
    return (0, _isUndefined)(obj) || (0, _isNull)(obj);
  }
});
define("frampton-utils/is_null", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = isNull;

  function isNull(obj) {
    return obj === null;
  }
});
define('frampton-utils/is_object', ['exports', 'module', 'frampton-utils/is_something', 'frampton-utils/is_array'], function (exports, module, _framptonUtilsIs_something, _framptonUtilsIs_array) {
  'use strict';

  module.exports = isObject;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var _isArray = _interopRequire(_framptonUtilsIs_array);

  function isObject(obj) {
    return (0, _isSomething)(obj) && !(0, _isArray)(obj) && typeof obj === 'object';
  }
});
define('frampton-utils/is_promise', ['exports', 'module', 'frampton-utils/is_object', 'frampton-utils/is_function'], function (exports, module, _framptonUtilsIs_object, _framptonUtilsIs_function) {
  'use strict';

  module.exports = isPromise;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isObject = _interopRequire(_framptonUtilsIs_object);

  var _isFunction = _interopRequire(_framptonUtilsIs_function);

  function isPromise(promise) {
    return (0, _isObject)(promise) && (0, _isFunction)(promise.then);
  }
});
define('frampton-utils/is_something', ['exports', 'module', 'frampton-utils/is_nothing'], function (exports, module, _framptonUtilsIs_nothing) {
  'use strict';

  module.exports = isSomething;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _isNothing = _interopRequire(_framptonUtilsIs_nothing);

  function isSomething(obj) {
    return !(0, _isNothing)(obj);
  }
});
define('frampton-utils/is_string', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = isString;

  function isString(obj) {
    return typeof obj === 'string';
  }
});
define('frampton-utils/is_undefined', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = isUndefined;

  function isUndefined(obj) {
    return typeof obj === 'undefined';
  }
});
define("frampton-utils/lazy", ["exports", "module"], function (exports, module) {
  /**
   * Takes a function and warps it to be called at a later time.
   * @name lazy
   * @memberOf Frampton
   * @method
   * @static
   * @param {Function} fn The function to wrap.
   * @param {...Any} args Arguments to pass to the function when called.
   */
  "use strict";

  module.exports = lazy;

  function lazy(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return function () {
      fn.apply(null, args);
    };
  }
});
define('frampton-utils/log', ['exports', 'module', 'frampton'], function (exports, module, _frampton) {
  'use strict';

  module.exports = log;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_frampton);

  function log(msg, data) {

    if (typeof console.log !== 'undefined' && _Frampton.isDev()) {
      if (data) {
        console.log(msg, data);
      } else {
        console.log(msg);
      }
    }

    return msg;
  }
});
define("frampton-utils/memoize", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = memoize;

  function memoize(fn, thisArg) {

    var store = {};

    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var key = JSON.stringify(args);

      if (key in store) {
        return store[key];
      } else {
        return store[key] = fn.apply(thisArg || null, args);
      }
    };
  }
});
define("frampton-utils/noop", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = noop;

  function noop() {}
});
define('frampton-utils/not_implemented', ['exports', 'module'], function (exports, module) {
  'use strict';

  module.exports = function () {
    throw new Error('This method has not been implemented');
  };
});
define("frampton-utils/of_value", ["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = of_value;

  function of_value(value) {
    return function () {
      return value;
    };
  }
});
define('frampton-utils/safe_get', ['exports', 'module', 'frampton-utils/curry', 'frampton-utils/get', 'frampton-data/maybe'], function (exports, module, _framptonUtilsCurry, _framptonUtilsGet, _framptonDataMaybe) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _curry = _interopRequire(_framptonUtilsCurry);

  var _get = _interopRequire(_framptonUtilsGet);

  //+ safeGet :: String -> Object -> Maybe Any
  module.exports = (0, _curry)(function safe_get(prop, obj) {
    return _framptonDataMaybe.Maybe.of((0, _get)(prop, obj));
  });
});
define('frampton-window', ['exports', 'frampton-window/window'], function (exports, _framptonWindowWindow) {
  'use strict';

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Window = _interopRequire(_framptonWindowWindow);

  exports.Window = _Window;
});
define('frampton-window/window', ['exports', 'module', 'frampton-signals/empty', 'frampton-signals/stepper', 'frampton-signals/event', 'frampton-events/listen', 'frampton-utils/get', 'frampton-utils/is_something'], function (exports, module, _framptonSignalsEmpty, _framptonSignalsStepper, _framptonSignalsEvent, _framptonEventsListen, _framptonUtilsGet, _framptonUtilsIs_something) {
  'use strict';

  module.exports = Window;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _empty = _interopRequire(_framptonSignalsEmpty);

  var _stepper = _interopRequire(_framptonSignalsStepper);

  var _listen = _interopRequire(_framptonEventsListen);

  var _get = _interopRequire(_framptonUtilsGet);

  var _isSomething = _interopRequire(_framptonUtilsIs_something);

  var element = null;
  var resize = (0, _listen)('resize', window);
  var dimensionsStream = (0, _empty)();
  var dimensions = (0, _stepper)([getWidth(), getHeight()], dimensionsStream);
  var width = (0, _stepper)(getWidth(), dimensionsStream.map((0, _get)(0)));
  var height = (0, _stepper)(getHeight(), dimensionsStream.map((0, _get)(1)));

  function getWidth() {
    return (0, _isSomething)(element) ? element.clientWidth : window.innerWidth;
  }

  function getHeight() {
    return (0, _isSomething)(element) ? element.clientHeight : window.innerHeight;
  }

  function updateIfNeeded() {
    var w = getWidth();
    var h = getHeight();
    if (w !== dimensions[0] || h !== dimensions[1]) {
      dimensionsStream.push((0, _framptonSignalsEvent.nextEvent)([w, h]));
    }
  }

  function update() {
    updateIfNeeded();
    setTimeout(updateIfNeeded, 0);
  }

  resize.next(update);

  function Window(element) {
    element = element;
    return {
      dimensions: dimensions,
      width: width,
      height: height
    };
  }
});
define('frampton', ['exports', 'module', 'frampton/namespace'], function (exports, module, _framptonNamespace) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Frampton = _interopRequire(_framptonNamespace);

  module.exports = _Frampton;
});
define('frampton/namespace', ['exports', 'module'], function (exports, module) {
  'use strict';

  if (typeof Frampton === 'undefined') {
    var Frampton = {};
  }

  Frampton.VERSION = '0.0.3';

  Frampton.TEST = 'test';

  Frampton.DEV = 'dev';

  Frampton.PROD = 'prod';

  if (typeof Frampton.ENV === 'undefined') {
    Frampton.ENV = {
      MODE: Frampton.PROD
    };
  }

  Frampton.isDev = function () {
    return Frampton.ENV.MODE === Frampton.DEV;
  };

  Frampton.isTest = function () {
    return Frampton.ENV.MODE === Frampton.TEST;
  };

  Frampton.isProd = function () {
    return Frampton.ENV.MODE === Frampton.PROD;
  };

  module.exports = Frampton;
});
define("frampton/runtime", ["exports"], function (exports) {
  "use strict";
});
require("frampton");

})();