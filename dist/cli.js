#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('util');

var _fs = require('fs');

var _path = require('path');

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const writeFileAsync = (0, _util.promisify)(_fs.writeFile);
const mkdirpAsync = (0, _util.promisify)(_mkdirp2.default);

const createSums = (() => {
  var _ref = _asyncToGenerator(function* ({ filepath, algorithm, files }) {
    const filepaths = yield (0, _fastGlob2.default)(files);

    // The glob doesn't match anyfile so there's nothing to do
    if (!files.length) {
      return;
    }

    const generatedSnapshot = yield (0, _.snapshot)(filepaths, { algorithm });

    // Create possible nested directories
    yield mkdirpAsync((0, _path.dirname)((0, _path.resolve)(process.cwd(), filepath)));

    return writeFileAsync((0, _path.resolve)(process.cwd(), filepath), JSON.stringify(generatedSnapshot, null, 2));
  });

  return function createSums(_x) {
    return _ref.apply(this, arguments);
  };
})();

// Define cli options
exports.default = _yargs2.default.command('snapshot [filepath] [files...]', 'Create a JSON file with the sums of the given files', yargs => {
  yargs.positional('filepath', {
    describe: 'Filepath to store the sums',
    default: 'sums.json'
  });
}, createSums).option('algorithm', {
  alias: 'a',
  default: 'sha256',
  describe: 'Set the checksum algorithm'
}).argv;