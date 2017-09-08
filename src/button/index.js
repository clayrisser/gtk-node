import ffi from 'ffi';
import path from 'path';
import ref from 'ref';

const type = {
  GtkWidgetPtr: ref.refType(ref.types.void)
};

const button = ffi.Library(path.resolve(__dirname, './index'), {
  create: [type.GtkWidgetPtr, ['string']],
  attach: [type.GtkWidgetPtr, [type.GtkWidgetPtr, type.GtkWidgetPtr]]
});

export default class Button {
  constructor({name}) {
    this.name = name || 'Some Button';
    this.pointer = button.create(this.name);
  }

  attach(container) {
    if (container.pointer) container = container.pointer;
    button.attach(this.pointer, container);
  }
}
