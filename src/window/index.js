import ffi from 'ffi';
import path from 'path';
import ref from 'ref';

const type = {
  GtkWidgetPtr: ref.refType(ref.types.void)
};

const window = ffi.Library(path.resolve(__dirname, '../../build/Release/window'), {
  create: [type.GtkWidgetPtr, ['string']]
});

export default class Window {
  constructor({pointer}) {
    this.pointer = pointer;
    if (!pointer) this.pointer = window.create();
  }
}
