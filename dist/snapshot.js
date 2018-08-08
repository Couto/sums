'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _checksum = require('./checksum');

var _checksum2 = _interopRequireDefault(_checksum);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (files, opts = {}) {
    let size = 0;

    const snapshot = yield Promise.all(files.sort().map(function (file, indx) {
      const stream = _fs2.default.createReadStream(file);

      return (0, _checksum2.default)(stream, opts).then(function (data) {
        size += data.size;

        return {
          name: file,
          sum: data.sum,
          size: data.size
        };
      });
    }));

    const { sum } = yield (0, _checksum2.default)(snapshot.map(function (s) {
      return s.sum;
    }).join(':'));

    return {
      sum,
      size,
      snapshot
    };
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();