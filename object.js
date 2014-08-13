// Object Functions
// ----------------
//对象的扩展方法

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  /****************************
  *返回一个对象的所有属性组成的一个数组
  *只返回对象本身的属性，不返回原型链中的属性
  *@param {Object} obj:传入的对象
  *@rturn {Array} 返回值是一个数组 
  *
  *****************************/
  _.keys = function(obj) {
    //传入的参数不是一个对象时，返回一个空数组
    if (!_.isObject(obj)) return [];
    //如果有原生的keys方法，则使用原生的方法
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    //循环，判断是否是对象本身的属性；若是，插入返回的数组
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  /****************************
  *返回一个对象的所有属性的值组成的一个数组
  *
  *@param {Object} obj:传入的对象
  *@rturn {Array} 返回值是一个数组 
  *
  *****************************/
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  /****************************
  *返回一个对象的所有属性和对应的值组成的一个数组
  *
  *@param {Object} obj:传入的对象
  *@rturn {Array} 返回值是一个二维数组 
  *
  *****************************/
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
 /****************************
  *反转一个对象的所有属性和对应的值
  *
  *@param {Object} obj:传入的对象
  *@rturn {Array} 返回值是一个对象，对象的属性名和属性值进行了反转
  *
  *****************************/
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
 /****************************
  *返回一个数组，数组的值是对象中为函数的属性，按照对象属性名进行排序的
  *
  *@param {Object} obj:传入的对象
  *@rturn {Array} 返回值是一个对象
  *
  *****************************/
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
 /****************************
  *
  *重要函数，继承的实现
  *可以传入多个参数，第一个参数是准备继承的对象
  *@param {Object} obj:准备继承别的对象的对象
  *@rturn {Array} 返回值是继承过后的对象
  *
  *****************************/
  _.extend = function(obj) {
    if (!_.isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
        }
      }
    }
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
    /****************************
    *返回对一个对象的copy
    *
    *第二个参数是函数时，按照函数的规则，copy对象的属性
    *第二个参数不是函数时，则传入的是属性名称，只复制这些对象的这些属性
    *@param {Object} obj:传入的对象
    *@return {Array} 返回值是copy的对象
    *
    *****************************/
  _.pick = function(obj, iteratee, context) {
    var result = {}, key;
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      iteratee = createCallback(iteratee, context);
      for (key in obj) {
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
      }
    } else {
      var keys = concat.apply([], slice.call(arguments, 1));
      obj = new Object(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        if (key in obj) result[key] = obj[key];
      }
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
   /**********************
   *TODO
   *先放一放，其中的一些方法不知道什么含义
   *
   *
   *
   ************************/
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  /**************************
  *给一个对象添加没有的属性
  *
  *
  ***************************/
  _.defaults = function(obj) {
    if (!_.isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  /**************************
  *克隆一个对象
  *如果是数组，返回数组
  *如果是对象了，进行克隆
  *是浅克隆
  ***************************/
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  /*********************
  *主要进行链式操作的
  *传入一个对象和以这个对象为参数的函数
  *返回对对象进行操作的过后的对象
  *
  *********************/
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  /***********************
  *
  *
  ************************/
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (
      aCtor !== bCtor &&
      // Handle Object.create(x) cases
      'constructor' in a && 'constructor' in b &&
      !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
        _.isFunction(bCtor) && bCtor instanceof bCtor)
    ) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size, result;
    // Recursively compare objects and arrays.
    if (className === '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size === b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      size = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      result = _.keys(b).length === size;
      if (result) {
        while (size--) {
          // Deep compare each member
          key = keys[size];
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
     /****************************
  *判断传入的对象是否为空
  *首先判断是否为null,
  *然后判断是否为数组、字符串、函数的参数列表
  *最后判断是否有自身的属性
  *
  *@return {Boolean} 返回一个booble值
  *****************************/
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
   /****************************
  *判断传入的参数是否是一个DOM对象
  *
  *@return {Boolean} 返回一个booble值
  *
  *****************************/
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
   /****************************
  *判断传入的参数是否是一个数组
  *@return {Boolean} 返回一个booble值
  *
  * 首先使用ECMA5的原生方法进行判断
  *****************************/
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  /****************************
  *判断传入的参数是否是一个对象
  *
  *@return {Boolean} 返回一个booble值
  *
  *****************************/
  _.isObject = function(obj) {
    var type = typeof obj;
    //function属于对象
    //typeof null === 'object',因此，需要加上!!obj。
    //因为，一般情况下，并不把null作为object.
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  /****************************
  *增加多种类型数据的判断方法
  *
  *通过toString()方法
  *@return {Boolean} 返回一个booble值
  *
  *****************************/
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });


  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  /****************************
  *增加Arguments类型数据的判断方法
  *
  *Arguments 是一个类数组的对象
  *通过判断是否有callee属性，来进行参数判断
  *callee:返回正被执行的 Function 对象，即指定的 Function 对象的正文。
  *@return {Boolean} 返回一个booble值
  *
  *****************************/
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate.
  /****************************
  *增加Function类型数据的判断方法
  *
  *@return {Boolean} 返回一个booble值
  *
  *****************************/
  if (typeof /./ !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
   /****************************
  *判断一个数是否是有限数
  *
  *parseFloat 是全局函数，不属于任何对象。
  *
  *@return {Boolean} 返回一个booble值
  *
  *****************************/
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };


  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  /****************************
  *判断传入的参数是否是NaN类型
  *NaN是唯一的一个不等于它自身的数
  *
  *@return {Boolean} 返回一个booble值
  *
  *****************************/
  _.isNaN = function(obj) {
    //obj !== +obj ,使得更容易理解一些
    return _.isNumber(obj) && obj !== +obj;
  };


  // Is a given value a boolean?
  /****************************
  *判断传入的参数是否是Boolean类型
  *
  *@return {Boolean} 返回一个booble值
  *
  *****************************/
  _.isBoolean = function(obj) {
    //三种判断方法
    //第三种判断条件是否多余的？
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };


  // Is a given value equal to null?
  /****************************
  *判断传入的参数是否是null
  *
  *@return {Boolean} 返回一个booble值
  *
  *****************************/
  _.isNull = function(obj) {
    return obj === null;
  };


  // Is a given variable undefined?
  /****************************
  *判断传入的参数是否是undefined
  *用void 0 来进行判断
  *
  *@return {Boolean} 返回一个booble值
  *
  *****************************/
  _.isUndefined = function(obj) {
    return obj === void 0;
  };


  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  /****************************
  *判断传入的键值是否是这个对象自身的属性(而不是原型上的方法)
  *
  *@return {Boolean} 返回一个booble值
  *
  *****************************/
  _.has = function(obj, key) {
    //在object !==null的情况下，调用原生的js方法hasOwnProperty()
    return obj != null && hasOwnProperty.call(obj, key);
  };