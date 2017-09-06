import ffi from 'ffi';
import path from 'path';

export default ffi.Library(path.resolve(__dirname, '../clib/app'), {
  new_app: ['pointer', ['string']],
  run_app: ['int', ['pointer']],
  register_on_activate: ['void', ['pointer']]
});
