import ffi from 'ffi';
import path from 'path';

export default ffi.Library(path.resolve(__dirname, '../clib/button'), {
  create: ['void', ['pointer', 'string']]
});