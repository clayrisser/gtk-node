function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import ffi from 'ffi';
import path from 'path';
import ref from 'ref';
import { Window } from '../';

var type = {
  GtkApplicationPtr: ref.refType(ref.types.void),
  GtkWidgetPtr: ref.refType(ref.types.void),
  on_activate_cb: ref.refType(ref.types.void)
};

var app = ffi.Library(path.resolve(__dirname, './index'), {
  create: [type.GtkApplicationPtr, ['string', 'string']],
  init: ['int', [type.GtkApplicationPtr]],
  register_on_activate: ['void', [type.on_activate_cb]],
  render: ['void', [type.GtkWidgetPtr]]
});

var App = function () {
  function App(_ref) {
    var _this = this;

    var title = _ref.title,
        namespace = _ref.namespace;

    _classCallCheck(this, App);

    this.title = title || 'Some Title';
    this.namespace = namespace || 'org.gtk.example';
    this.window = null;
    app.register_on_activate(ffi.Callback('void', [type.GtkWidgetPtr], function (window) {
      _this.window = window;
      _this.onActivate(_this.window);
    }));
    this.pointer = app.create(this.title, this.namespace);
  }

  App.prototype.init = function init(cb) {
    this.onActivate = cb;
    app.init(this.pointer);
  };

  App.prototype.render = function render(window) {
    if (!window) window = this.window;
    if (window.pointer) window = window.pointer;
    app.render(window);
  };

  return App;
}();

export { App as default };