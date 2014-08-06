//整体结构
(function () {
	
}.call(this));

/***************************
声明一个立即执行的匿名函数
这种写法的目的是可以主动的设置函数的执行环境。
不仅可以在浏览器执行，也可以在服务端执行。

**************************/
// Establish the root object, `window` in the browser, or `exports` on the server.
//创建一个根对象，最底层的对象，在浏览器中是window;在服务器中是exports。
  var root = this;

  // Save the previous value of the `_` variable.
  //保存变量_的刚开始值，后面可能用到
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  //把js中数组、对象、函数的原型重新声明一下，方便调用。
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  //对js的一些常用的原生方法，创建快速的访问变量，方便经常的调用
  var
		push             = ArrayProto.push,
		slice            = ArrayProto.slice,
		concat           = ArrayProto.concat,
		toString         = ObjProto.toString,
		hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  //把希望使用ECMAScript 5 的原生方法，保存起来。
  //这些方法是新加的方法，一些浏览器可能不支持的
  //如果支持的浏览器，则用原生的方法。
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  //_()是一个underscore对象的构造函数，目的是为了创建一个新的underscore对象
  //如果传入的obj不是underscore对象，则会一层层的向上递归，直到this是一个underscore对象，
  //构建一个underscore对象，同时把obj赋值给这个对象的_wrapped属性
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  //在node.js环境中，如果存在module，则把_赋值给exports；否则，把_声明为exports的一个参数。
  //在浏览器环境中，把_声明为一个全局变量。
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  //当前underscore的版本
  _.VERSION = '1.6.0';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  /********************************
  * 这是一个内部的函数。
  * context === undefined时，返回函数
  * void 0 是 undefined ；不太清楚这里为什么要这样写。
  * @param {Function} func : 回调函数
  * @param {Object} context : 指定回调函数执行的作用域,为undefined 时，返回回调函数的引用
  * @param {Number} argCont : 指定执行回调函数时传入的参数，这个参数不传的时候，默认为3个
  *
  * 这个函数构建一个对回调函数的引用
  ********************************/
  var createCallback = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  /********************************
  * 这是一个重要的内部函数。
  * 根据传入参数value的类型，返回不同结果。
  * 当value为null时，返回underscore对象的indentity属性；
  * 当value是一个函数时，返回一个函数的引用
  * 当value是一个对象时，返回underscore对象matches方法引用
  * 当value是其他类型时，返回underscore对象的property方法引用
  ********************************/
  _.iteratee = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return createCallback(value, context, argCount);
    if (_.isObject(value)) return _.matches(value);
    return _.property(value);
  };
