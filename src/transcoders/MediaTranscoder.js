'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ffmpeg = require('./ffmpeg/Ffmpeg');

var transcoders = ['ffmpeg'];

var MediaTranscoder = function () {
  function MediaTranscoder(prism) {
    _classCallCheck(this, MediaTranscoder);

    this.prism = prism;
    this.ffmpeg = new Ffmpeg(this);
  }

  _createClass(MediaTranscoder, [{
    key: 'transcode',


    /**
     * Transcodes a media stream based on specified options
     * @param {Object} options the options to use when transcoding
     * @returns {ReadableStream} the transcodeed stream
     */
    value: function transcode(options) {
      options = MediaTranscoder.verifyOptions(options);
      return this[options.type].transcode(options);
    }
  }], [{
    key: 'verifyOptions',
    value: function verifyOptions(options) {
      if (!options) throw new Error('Options must be passed to MediaTranscoder.transcode()');
      if (!options.type) throw new Error('Options.type must be passed to MediaTranscoder.transcode()');
      if (!transcoders.includes(options.type)) throw new Error('Options.type must be: ' + transcoders.join(' '));
      return options;
    }
  }]);

  return MediaTranscoder;
}();

module.exports = MediaTranscoder;