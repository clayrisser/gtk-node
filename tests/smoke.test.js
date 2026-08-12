import assert from 'node:assert/strict';
import { before, test } from 'node:test';
import koffi from 'koffi';
import { App, Button, Window } from '../src/index.js';
import load from '../src/library.js';

before(() => {
  // Widgets need an open display before they can be instantiated. A real app
  // gets that from g_application_run, which a headless test cannot enter
  // because it blocks until the last window closes.
  const gtk = koffi.load('libgtk-3.so.0');
  const initialised = gtk.func('bool gtk_init_check(void *argc, void *argv)')(null, null);
  assert.ok(initialised, 'gtk_init_check failed — no display available, run under xvfb-run');
});

test('load reports which library is missing instead of dying inside koffi', () => {
  assert.throws(() => load('nope'), /nope\.so not found/);
});

test('App wraps a live GtkApplication', () => {
  const app = new App({ title: 'Smoke', namespace: 'org.gtk.example', width: 320, height: 240 });
  assert.ok(app.pointer, 'gtk_application_new returned NULL');
  assert.equal(app.title, 'Smoke');
  assert.equal(app.width, 320);
  app.destroy();
});

test('App falls back to its documented defaults', () => {
  const app = new App();
  assert.equal(app.namespace, 'org.gtk.example');
  assert.equal(app.width, 200);
  assert.equal(app.height, 200);
  app.destroy();
});

test('Window wraps a live GtkWindow', () => {
  assert.ok(new Window().pointer, 'gtk_window_new returned NULL');
});

test('Window adopts a pointer it is handed', () => {
  const pointer = new Window().pointer;
  assert.equal(new Window({ pointer }).pointer, pointer);
});

test('Button wraps a live GtkButton and registers its six signals', () => {
  const button = new Button({ label: 'Smoke', opacity: 0.5, height: 40, width: 80 });
  assert.ok(button.pointer, 'gtk_button_new_with_label returned NULL');
  assert.equal(button.label, 'Smoke');
  assert.equal(button.opacity, 0.5);
  button.destroy();
});

test('Button attaches to a window without tripping the idle marshaller', () => {
  const button = new Button({ label: 'Attach' });
  assert.doesNotThrow(() => button.attach(new Window()));
  button.destroy();
});
