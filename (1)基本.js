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
  //
  var
		push             = ArrayProto.push,
		slice            = ArrayProto.slice,
		concat           = ArrayProto.concat,
		toString         = ObjProto.toString,
		hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';


