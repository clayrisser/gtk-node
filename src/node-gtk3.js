import ffi from 'ffi';

const settings = {
  title: 'My Awesome App',
  height: 200,
  width: 200
};

const libapp = ffi.Library('node_modules/node-gtk3/lib/clib/app', {
  new_app: ['pointer', ['string']],
  run_app: ['int', ['pointer']],
  register_on_activate: ['void', ['pointer']]
});
let libwindow = ffi.Library('node_modules/node-gtk3/lib/clib/window', {
  render: ['void', ['pointer', 'pointer', 'string', 'int', 'int']]
});

const app = libapp.new_app(settings.title);
libapp.register_on_activate(ffi.Callback('void', ['pointer'], (userData) => {
  libwindow.render(app, userData, settings.title, settings.height, settings.width);
}));
libapp.run_app(app);
