module.exports = exports = function (str) {
  if (str === 'binding') {
    const result = require('../node_modules/ref/build/Release/binding.node');
    result.path = '../node_modules/ref/build/Release/binding.node';
    return result;
  } else if (str === 'ffi_bindings.node') {
    const result = require('../node_modules/ffi/build/Release/ffi_bindings.node');
    result.path = '../node_modules/ffi/build/Release/ffi_bindings.node';
    return result;
  }
};
