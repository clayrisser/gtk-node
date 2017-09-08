import ffi from 'ffi';
import app from './bindings/app';
import window from './bindings/window';
import button from './bindings/button';

export default class App {
  constructor({title}) {
    this.title = title;
    this.self = app.create(this.title);
    this.userData = null;
    this.window = null;
  }

  run() {
    return new Promise((resolve, reject) => {
      const callback = ffi.Callback('void', ['pointer', 'pointer'], (userData, window) => {
        this.window = new Window({self: window});
        this.userData = userData;
        return resolve(this);
      });
      app.register_on_activate(callback);
      process.on('exit', () => {
        callback;
      });
      app.run(this.self);
    }).then(() => {
      app.show(this.window);
    });
  }
}

export class Window {
  constructor({self}) {
    this.self = self;
    if (!self) this.self = window.create();
  }
}

export class Button {
  constructor({parent, name}) {
    this.name = name;
    this.parent = parent;
    this.self = button.create(this.parent.self, this.name);
  }
}
