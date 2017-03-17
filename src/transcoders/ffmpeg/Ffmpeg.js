'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChildProcess = require('child_process');
var FfmpegProcess = require('./FfmpegProcess');

var FfmpegTranscoder = function () {
  function FfmpegTranscoder(mediaTranscoder) {
    _classCallCheck(this, FfmpegTranscoder);

    this.mediaTranscoder = mediaTranscoder;
    this.command = FfmpegTranscoder.selectFfmpegCommand();
    this.processes = [];
  }

  _createClass(FfmpegTranscoder, [{
    key: 'transcode',


    /**
     * Transcodes an input using FFMPEG
     * @param {FfmpegTranscoderOptions} options the options to use
     * @returns {FfmpegProcess} the created FFMPEG process
     * @throws {FFMPEGOptionsError}
     */
    value: function transcode(options) {
      if (!this.command) this.command = FfmpegTranscoder.selectFfmpegCommand();
      var proc = new FfmpegProcess(this, FfmpegTranscoder.verifyOptions(options));
      this.processes.push(proc);
      return proc;
    }
  }], [{
    key: 'verifyOptions',
    value: function verifyOptions(options) {
      if (!options) throw new Error('Options not provided!');
      if (!options.media) throw new Error('Media must be provided');
      if (!options.ffmpegArguments || !(options.ffmpegArguments instanceof Array)) {
        throw new Error('FFMPEG Arguments must be an array');
      }
      if (options.ffmpegArguments.includes('-i')) return options;
      if (typeof options.media === 'string') {
        options.ffmpegArguments = ['-i', '' + options.media].concat(options.ffmpegArguments).concat(['pipe:1']);
      } else {
        options.ffmpegArguments = ['-i', '-'].concat(options.ffmpegArguments).concat(['pipe:1']);
      }
      return options;
    }
  }, {
    key: 'selectFfmpegCommand',
    value: function selectFfmpegCommand() {
      try {
        return require('ffmpeg-binaries').ffmpegPath();
      } catch (err) {
        var _arr = ['ffmpeg', 'avconv', './ffmpeg', './avconv'];

        for (var _i = 0; _i < _arr.length; _i++) {
          var command = _arr[_i];
          if (!ChildProcess.spawnSync(command, ['-h']).error) return command;
        }
        throw new Error('FFMPEG not found');
      }
    }
  }]);

  return FfmpegTranscoder;
}();

module.exports = FfmpegTranscoder;