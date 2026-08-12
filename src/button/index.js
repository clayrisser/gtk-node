import koffi from 'koffi';
import load from '../library.js';

const signals = ['activate', 'clicked', 'enter', 'leave', 'pressed', 'released'];

const OnSignal = koffi.proto('void OnSignal(void *widget)');

const lib = load('button');
const button = {
  create: lib.func('void *create(const char *label, bool mnemonic, double opacity, int height, int width)'),
  attach: lib.func('void *attach(void *button, void *container)'),
  register: Object.fromEntries(signals.map((signal) => [signal, lib.func(`void register_on_${signal}(OnSignal *cb)`)])),
};

export default class Button {
  #callbacks = [];

  constructor({ label, mnemonic, opacity, height, width } = {}) {
    this.label = label ?? 'Some Button';
    this.mnemonic = Boolean(mnemonic);
    this.opacity = opacity ?? 1;
    this.height = height ?? -1;
    this.width = width ?? -1;
    this.pointer = button.create(this.label, this.mnemonic, this.opacity, this.height, this.width);
    for (const signal of signals) {
      const handler = `on${signal[0].toUpperCase()}${signal.slice(1)}`;
      // register_on_* stores a single global function pointer per library, so
      // the most recently constructed Button wins for every button's signals.
      const callback = koffi.register(() => this[handler](), koffi.pointer(OnSignal));
      this.#callbacks.push(callback);
      button.register[signal](callback);
    }
  }

  onActivate() {}

  onClicked() {}

  onEnter() {}

  onLeave() {}

  onPressed() {}

  onReleased() {}

  attach(container) {
    button.attach(this.pointer, container?.pointer ?? container);
  }

  destroy() {
    for (const callback of this.#callbacks) koffi.unregister(callback);
    this.#callbacks = [];
  }
}
