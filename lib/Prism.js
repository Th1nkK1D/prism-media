'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MediaTranscoder = require('./transcoders/MediaTranscoder');

var Prism = function () {
  function Prism() {
    _classCallCheck(this, Prism);

    this.transcoder = new MediaTranscoder(this);
  }

  _createClass(Prism, [{
    key: 'createTranscoder',
    value: function createTranscoder() {
      return this.transcode.apply(this, arguments);
    }
  }, {
    key: 'transcode',
    value: function transcode() {
      var _transcoder;

      return (_transcoder = this.transcoder).transcode.apply(_transcoder, arguments);
    }
  }]);

  return Prism;
}();

module.exports = Prism;