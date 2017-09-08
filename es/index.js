function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import ffi from 'ffi';
import app from './bindings/app';
import window from './bindings/window';
import button from './bindings/button';

var App = function () {
  function App(_ref) {
    var title = _ref.title;

    _classCallCheck(this, App);

    this.title = title;
    this.self = app.create(this.title);
    this.userData = null;
    this.window = null;
  }

  App.prototype.run = function run() {
    var _this = this;

    return new Promise(function (resolve, reject) {
      var callback = ffi.Callback('void', ['pointer', 'pointer'], function (userData, window) {
        _this.window = new Window({ self: window });
        _this.userData = userData;
        return resolve(_this);
      });
      app.register_on_activate(callback);
      process.on('exit', function () {
        callback;
      });
      app.run(_this.self);
    }).then(function () {
      app.show(_this.window);
    });
  };

  return App;
}();

export { App as default };


export var Window = function Window(_ref2) {
  var self = _ref2.self;

  _classCallCheck(this, Window);

  this.self = self;
  if (!self) this.self = window.create();
};

export var Button = function Button(_ref3) {
  var parent = _ref3.parent,
      name = _ref3.name;

  _classCallCheck(this, Button);

  this.name = name;
  this.parent = parent;
  this.self = button.create(this.parent.self, this.name);
};