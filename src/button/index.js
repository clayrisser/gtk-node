import ffi from 'ffi';
import path from 'path';
import ref from 'ref';

const type = {
  GtkWidgetPtr: ref.refType(ref.types.void),
  on_click_cb: ref.refType(ref.types.void)
};

const button = ffi.Library(path.resolve(__dirname, './index'), {
  create: [type.GtkWidgetPtr, ['string']],
  attach: [type.GtkWidgetPtr, [type.GtkWidgetPtr, type.GtkWidgetPtr]],
  register_on_click: ['void', [type.on_click_cb]]
});

export default class Button {
  constructor({name}) {
    this.name = name || 'Some Button';
    this.pointer = button.create(this.name);
    button.register_on_click(ffi.Callback('void', [type.GtkWidgetPtr], () => {
      this.onClick();
    }));
  }

  onClick() {}

  attach(container) {
    if (container.pointer) container = container.pointer;
    button.attach(this.pointer, container);
  }
}
