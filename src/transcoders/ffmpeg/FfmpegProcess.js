'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events').EventEmitter;
var ChildProcess = require('child_process');

/**
 * A spawned FFMPEG process
 */

var FfmpegProcess = function (_EventEmitter) {
  _inherits(FfmpegProcess, _EventEmitter);

  function FfmpegProcess(ffmpegTranscoder, options) {
    _classCallCheck(this, FfmpegProcess);

    /**
     * The ffmpeg process
     * @type {ChildProcess}
     */
    var _this = _possibleConstructorReturn(this, (FfmpegProcess.__proto__ || Object.getPrototypeOf(FfmpegProcess)).call(this));

    _this.process = ChildProcess.spawn(ffmpegTranscoder.command, options.ffmpegArguments);
    /**
     * The FFMPEG transcoder that created this process
     * @type {FfmpegTranscoder}
     */
    _this.transcoder = ffmpegTranscoder;
    /**
     * The input media
     * @type {?ReadableStream|string}
     */
    _this.inputMedia = options.media;

    if (typeof _this.inputMedia !== 'string') {
      try {
        _this.connectStream(_this.inputMedia);
      } catch (e) {
        _this.emit('error', e, 'instantiation');
      }
    } else {
      _this.attachErrorHandlers();
    }

    _this.on('error', _this.kill.bind(_this));
    _this.once('end', _this.kill.bind(_this));
    return _this;
  }

  /**
   * The ffmpeg output stream
   * @type {?ReadableStream}
   */


  _createClass(FfmpegProcess, [{
    key: 'attachErrorHandlers',
    value: function attachErrorHandlers() {
      var _this2 = this;

      this.process.stdout.on('error', function (e) {
        return _this2.emit('error', e, 'ffmpegProcess.stdout');
      });
      this.process.on('error', function (e) {
        return _this2.emit('error', e, 'ffmpegProcess');
      });
      this.process.stdout.on('end', function () {
        return _this2.emit('end');
      });
    }

    /**
     * Connects an input stream to the ffmpeg process
     * @param {ReadableStream} inputMedia the stream to pass to ffmpeg
     * @returns {ReadableStream} the ffmpeg output stream
     */

  }, {
    key: 'connectStream',
    value: function connectStream(inputMedia) {
      var _this3 = this;

      if (!this.process) throw new Error('No FFMPEG process available');
      this.inputMedia = inputMedia;
      this.inputMedia.pipe(this.process.stdin, { end: false });

      inputMedia.on('error', function (e) {
        return _this3.emit('error', e, 'inputstream', inputMedia);
      });

      this.process.stdin.on('error', function (e) {
        return _this3.emit('error', e, 'ffmpegProcess.stdin');
      });

      this.attachErrorHandlers();

      return this.process.stdout;
    }

    /**
     * Kills the ffmpeg process
     */

  }, {
    key: 'kill',
    value: function kill() {
      if (!this.process) return;
      if (this.inputMedia && this.inputMedia.unpipe) {
        this.inputMedia.unpipe(this.process.stdin);
      }
      this.process.kill('SIGKILL');
      this.process = null;
    }
  }, {
    key: 'output',
    get: function get() {
      return this.process ? this.process.stdout : null;
    }
  }]);

  return FfmpegProcess;
}(EventEmitter);

module.exports = FfmpegProcess;