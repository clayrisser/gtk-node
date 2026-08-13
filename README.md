# node-gtk3

> Node bindings for GTK3, built on hand-written C wrappers and FFI.

**Status: superseded, preserved as a working artifact.** Use
[node-gtk](https://www.npmjs.com/package/node-gtk) for new work. This repository
is kept building and tested so the approach stays inspectable, not because it is
the binding you should reach for.

## Relationship to node-gtk

[node-gtk](https://www.npmjs.com/package/node-gtk) generates its bindings from
GObject Introspection, so it exposes the whole GTK API surface and tracks
upstream automatically. It went quiet for a few years and came back — 4.1.1
shipped in July 2026 — and it is the binding that [react-gtk][react-gtk], the
project this one was originally written to support, actually depends on.

This repository took the opposite approach: three hand-written C shims
(`GtkApplication`, `GtkWindow`, `GtkButton`) compiled to shared libraries and
called over FFI. It was started in June 2017, and the last change to the code
itself landed that September. The 2017 README pointed at `node-gir` as its
successor; that project is also dormant now, and GObject Introspection won the
argument by way of node-gtk.

Three widgets is not a GTK binding. Nothing here is going to change that, and
nothing here is trying to compete. What survives is a small, readable example of
the non-introspection approach, and it is small enough to still be worth reading.

[react-gtk]: https://gitlab.com/bitspur/react-gnome/react-gtk

## What this actually is

Worth being precise, because the layout looks like a native addon and is not
one:

- `src/*/index.c` are compiled by node-gyp as **plain C shared libraries**
  (`shared_library`, `.so`), not as V8/Node-API addons. They link against
  `gtk+-3.0` and know nothing about Node.
- `src/*/index.js` load those `.so` files at runtime over FFI and expose small
  JavaScript classes.

The practical consequence is that the usual native-addon breakage does not apply
here. There is no NAN, no `node-addon-api`, no V8 ABI to go stale, so the C side
compiles unchanged against a 2026 toolchain. Everything that broke, broke on the
JavaScript side.

## 2026 revive

Verified on Debian bookworm (aarch64), GTK 3.24.38, Node 26.7.0, node-gyp 13.0.1:

- all three libraries compile with no warnings
- the built libraries load, and `App`, `Window` and `Button` each instantiate a
  live GTK object headlessly under Xvfb (`make test`)
- the full path also runs: `App#init()` enters the GTK main loop, the activate
  callback is marshalled back to the JS main thread, and a button attaches and
  renders into the window

The one substantive change was replacing the FFI layer. The original used
[node-ffi](https://www.npmjs.com/package/ffi), which no longer builds:

| package       | outcome on Node 22/26 | reason                                                                                                                |
| ------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `ffi@2.2.0`   | fails to build        | its vendored libffi never generates `fficonfig.h` on modern platforms                                                 |
| `ffi-napi`    | fails to build        | `get-uv-event-loop-napi-h` and its pinned `node-addon-api` predate Node 18's `node_api_basic_env` const-qualification |
| `koffi@3.1.4` | works                 | ships prebuilt binaries, no compilation at install time                                                               |

So the binding now uses [koffi](https://koffi.dev). It keeps the property the
original depended on: a callback invoked from a secondary thread is queued back
onto the JS main thread, which is what lets the GTK main loop run off-thread.

`nwb` and the Babel pipeline are gone — `src/` is native ESM that Node runs
directly, so there is no build step for the JavaScript.

## Known limitations

These are inherited from the 2017 design and are not fixed here:

- **Three widgets.** `GtkApplication`, `GtkWindow`, `GtkButton`. That is all.
- **One set of signal handlers per library.** `register_on_*` stores a single
  global function pointer in the `.so`, so the most recently constructed
  `Button` wins for every button's signals. Fixing it means passing per-widget
  `user_data` through the C API.
- **The process does not exit on its own.** `g_application_run` blocks on an FFI
  worker thread, and `process.exit()` called while it is running does not
  terminate the process. The intended exit is closing the last window, which
  returns from the main loop.
- **Linux-first.** The container is the supported environment. macOS needs
  `gtk+3` from Homebrew and is untested.

## Usage

```js
import { App, Button } from 'node-gtk3';

const app = new App({ title: 'Node Gtk', width: 200, height: 200 });
const window = await app.init();

const button = new Button({ label: 'Button 1' });
button.onClicked = () => console.log('clicked');
button.attach(window);
app.render();
```

`examples/demo.js` is the same thing, runnable.

## Building

Everything runs in a container, which is the only environment this is verified
in:

```sh
make docker/run/build   # compile the C libraries
make docker/run/test    # build, then instantiate GTK objects under Xvfb
make docker/shell       # poke around inside
```

To build on the host instead you need GTK3 development headers and the
toolchain pinned in `.tool-versions`:

```sh
make prepare   # asdf toolchain, cloc, and GTK3 dev headers via brew/apt/dnf
make build
make test
```

`make test/e2e` runs the bats suite, which drives a container build from a clean
checkout and asserts the smoke tests pass in it.

Other targets: `format`, `lint`, `count`, `clean`, `purge`, `docker/bake`,
`docker/down`.

Note that `pnpm install` deliberately does not compile anything. npm would
otherwise infer an install script from the presence of `binding.gyp` and run
node-gyp on every install, which breaks on any host without GTK3; `make build`
owns compilation instead.

The npm package is `node-gtk3` while the repository is `gtk-node` — the
`gtk-node` name on npm belongs to someone else.

## Credits

- Clay Risser (as Jam Risser) — author
- [Everton Ribeiro](https://github.com/nuxlli) — contributor

## License

[MIT](LICENSE) — Copyright (c) 2017 Jam Risser
