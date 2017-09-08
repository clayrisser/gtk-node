import ffi from 'ffi';
import path from 'path';

export default ffi.Library(path.resolve(__dirname, '../clib/app'), {
  create: ['pointer', ['string']],
  run: ['int', ['pointer']],
  show: ['void', ['pointer']],
  register_on_activate: ['void', ['pointer']]
});