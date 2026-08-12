import load from '../library.js';

const lib = load('window');
const window = {
  create: lib.func('void *create()'),
};

export default class Window {
  constructor({ pointer } = {}) {
    this.pointer = pointer ?? window.create();
  }
}
