import koffi from 'koffi';
import load from '../library.js';
import Window from '../window/index.js';

const OnActivate = koffi.proto('void OnActivate(void *window)');

const lib = load('app');
const app = {
  create: lib.func('void *create(const char *title, const char *ns, int width, int height)'),
  init: lib.func('int init(void *app)'),
  registerOnActivate: lib.func('void register_on_activate(OnActivate *cb)'),
  render: lib.func('void render(void *window)'),
};

export default class App {
  #onActivate = null;

  constructor({ title, namespace, width, height } = {}) {
    this.title = title ?? 'Some Title';
    this.namespace = namespace ?? 'org.gtk.example';
    this.width = width ?? 200;
    this.height = height ?? 200;
    this.window = null;
    // Registered (not transient) because C holds the pointer past the call that
    // installs it. Keep the handle so destroy() can free the koffi slot.
    this.#onActivate = koffi.register((pointer) => {
      this.window = new Window({ pointer });
      this.onActivate(this.window);
    }, koffi.pointer(OnActivate));
    app.registerOnActivate(this.#onActivate);
    this.pointer = app.create(this.title, this.namespace, this.width, this.height);
  }

  onActivate() {}

  init() {
    return new Promise((resolve) => {
      this.onActivate = resolve;
      // g_application_run blocks until the last window closes, so it has to run
      // off-thread; koffi marshals the activate callback back onto the JS main
      // thread. The GTK main loop owns the process lifetime from here.
      app.init.async(this.pointer, (error, status) => {
        if (error) throw error;
        process.exit(status);
      });
    });
  }

  render() {
    return app.render(this.window.pointer);
  }

  destroy() {
    if (!this.#onActivate) return;
    koffi.unregister(this.#onActivate);
    this.#onActivate = null;
  }
}
