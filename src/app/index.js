import ffi from 'ffi';
import path from 'path';
import ref from 'ref';
import { Window } from '../';

const type = {
  GtkApplicationPtr: ref.refType(ref.types.void),
  GtkWidgetPtr: ref.refType(ref.types.void),
  on_activate_cb: ref.refType(ref.types.void)
};

const app = ffi.Library(path.resolve(__dirname, '../../build/Release/app'), {
  create: [type.GtkApplicationPtr, ['string', 'string', 'int', 'int']],
  init: ['int', [type.GtkApplicationPtr]],
  register_on_activate: ['void', [type.on_activate_cb]],
  render: ['void', [type.GtkWidgetPtr]]
});

export default class App {
  constructor({title, namespace, width, height}) {
    this.title = title || 'Some Title';
    this.namespace = namespace || 'org.gtk.example';
    this.width = width || 200;
    this.height = height || 200;
    this.window = null;
    app.register_on_activate(ffi.Callback('void', [type.GtkWidgetPtr], (window) => {
      this.window = new Window({ pointer: window });
      this.onActivate(this.window);
    }));
    this.pointer = app.create(this.title, this.namespace, this.width, this.height);
  }

  init() {
    return new Promise((resolve, reject) => {
      this.onActivate = resolve;
      app.init.async(this.pointer, (err, status) => {
        if (status !== 0) {
          console.error(new Error('Program initialized with error'));
        }
        process.exit(status);
      });
    });
  }

  render() {
    return app.render(this.window.pointer);
  }
}
