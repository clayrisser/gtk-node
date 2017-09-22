import ffi from 'ffi';
import path from 'path';
import ref from 'ref';
import _ from 'lodash';

const type = {
  GtkWidgetPtr: ref.refType(ref.types.void),
  on_activate_cb: ref.refType(ref.types.void),
  on_clicked_cb: ref.refType(ref.types.void),
  on_enter_cb: ref.refType(ref.types.void),
  on_leave_cb: ref.refType(ref.types.void),
  on_pressed_cb: ref.refType(ref.types.void),
  on_released_cb: ref.refType(ref.types.void)
};

const button = ffi.Library(path.resolve(__dirname, '../../build/Release/button'), {
  create: [type.GtkWidgetPtr, ['string', 'bool', 'double', 'int', 'int']],
  attach: [type.GtkWidgetPtr, [type.GtkWidgetPtr, type.GtkWidgetPtr]],
  register_on_activate: ['void', [type.on_activate_cb]],
  register_on_clicked: ['void', [type.on_clicked_cb]],
  register_on_enter: ['void', [type.on_enter_cb]],
  register_on_leave: ['void', [type.on_leave_cb]],
  register_on_pressed: ['void', [type.on_pressed_cb]],
  register_on_released: ['void', [type.on_released_cb]]
});

export default class Button {
  constructor({label, mnemonic, opacity, height, width}) {
    this.label = label || 'Some Button';
    this.mnemonic = !!mnemonic;
    this.opacity = opacity || 1;
    this.height = height || -1;
    this.width = width || -1;
    this.pointer = button.create(this.label, this.mnemonic, this.opacity, this.height, this.width);
    this.registerCallback('activate');
    this.registerCallback('clicked');
    this.registerCallback('enter');
    this.registerCallback('leave');
    this.registerCallback('pressed');
    this.registerCallback('released');
  }

  registerCallback(name) {
    const onActionCB = ffi.Callback('void', [type.GtkWidgetPtr], () => {
      this[`on${_.startCase(name)}`]();
    });
    button[`register_on_${name}`](onActionCB);
    process.on('exit', () => { onActionCB; });
  }

  onActivate() {}

  onClicked() {}

  onEnter() {}

  onLeave() {}

  onPressed() {}

  onReleased() {}

  attach(container) {
    if (container.pointer) container = container.pointer;
    button.attach(this.pointer, container);
  }
}
