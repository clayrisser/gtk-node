function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import ffi from 'ffi';
import path from 'path';
import ref from 'ref';

var type = {
  GtkWidgetPtr: ref.refType(ref.types.void)
};

var window = ffi.Library(path.resolve(__dirname, './index'), {
  create: [type.GtkWidgetPtr, ['string']]
});

var Window = function Window(_ref) {
  var pointer = _ref.pointer;

  _classCallCheck(this, Window);

  this.pointer = pointer;
  if (!pointer) this.pointer = window.create();
};

export { Window as default };