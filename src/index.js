import ffi from 'ffi';
import app from './bindings/app';
import window from './bindings/window';

export default class App {
  constructor({title, height, width}) {
    this.title = title;
    this.height = height;
    this.width = width;
    this.app = app.new_app(this.title);
  }

  run() {
    return new Promise((resolve, reject) => {
      app.register_on_activate(ffi.Callback('void', ['pointer'], (userData) => {
        window.render(this.app, userData, this.title, this.height, this.width);
        resolve();
      }));
      app.run_app(this.app);
    });
  }
}
