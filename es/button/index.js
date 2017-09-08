function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import ffi from 'ffi';
import path from 'path';
import ref from 'ref';

var type = {
  GtkWidgetPtr: ref.refType(ref.types.void)
};

var button = ffi.Library(path.resolve(__dirname, './index'), {
  create: [type.GtkWidgetPtr, ['string']],
  attach: [type.GtkWidgetPtr, [type.GtkWidgetPtr, type.GtkWidgetPtr]]
});

var Button = function () {
  function Button(_ref) {
    var name = _ref.name;

    _classCallCheck(this, Button);

    this.name = name || 'Some Button';
    this.pointer = button.create(this.name);
  }

  Button.prototype.attach = function attach(container) {
    if (container.pointer) container = container.pointer;
    button.attach(this.pointer, container);
  };

  return Button;
}();

export { Button as default };