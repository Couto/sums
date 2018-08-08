'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _isStream = require('is-stream');

var _isStream2 = _interopRequireDefault(_isStream);

var _concatStream = require('concat-stream');

var _concatStream2 = _interopRequireDefault(_concatStream);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (data, opts = {}) {
    if (!_isStream2.default.readable(data)) {
      const bufferStream = new _stream2.default.PassThrough();
      bufferStream.end(Buffer.from(data));

      data = bufferStream;
    }

    const getSize = (0, _through2.default)(function (chunk, enc, cb) {
      size += Buffer.byteLength(chunk);
      cb(null, chunk);
    });

    let size = 0;

    const sum = yield new Promise(function (resolve, reject) {
      const hash = _crypto2.default.createHash(opts.algorithm || 'sha1').setEncoding('hex');

      data.on('error', reject).pipe(getSize).pipe(hash).pipe((0, _concatStream2.default)(resolve));
    });

    return {
      sum,
      size
    };
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();