var fs = require('fs');
var path = require('path');
var through2 = require('through2');
var Stream = require('stream').Stream;

var streamToArray = require('./stream-to-array');
var readFile = Promise.promisify(fs.readFile);

var INLINE_EXTS = {
  '.js': true,
  '.json': true,
  '.xml': true
};

/**
 * Used to create an inline cache from a file stream. Retrieve the cache after
 * the stream has ended by converting the returned stream to JSON or by calling
 * `toJSON` on it.
 *
 * @returns {Stream} caches files that match INLINE_EXTS
 */
exports.create = function (api) {
  var cache = {};
  var stream = through2.obj(undefined, function (file, enc, cb) {
    var ext = file.extname;
    if (!INLINE_EXTS[ext] || file.inline === false) {
      // do not inline
      this.push(file);
      cb();
      return;
    }

    // inline file contents
    Promise
      .try(function () {
        return file.contents || readFile(file.history[0], 'utf8');
      })
      .then(function (contents) {
        if (contents instanceof Stream) {
          return streamToArray(contents);
        } else {
          return contents;
        }
      })
      .then(function (contents) {
        if (Array.isArray(contents)) {
          contents = Buffer.concat(contents);
        }

        if (ext === '.json') {
          try {
            contents = JSON.stringify(JSON.parse(contents.toString('utf8')));
          } catch (e) {
            api.logging.get('inline-cache').error('invalid JSON in', file.history[0]);
            throw e;
          }
        }

        cache[file.relative] = contents;
      })
      .then(cb);
  });

  stream.has = function (relativePath) {
    return relativePath in cache;
  };

  stream.toJSON = function () {
    return cache;
  };

  return stream;
};
