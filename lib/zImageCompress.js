(function(global) {
  'use strict';

  function zImageCompress(opt, callback) {
    var file = opt.file;
    var quality = opt.quality;
    var maxWidth = opt.maxWidth;
    var maxHeight = opt.maxHeight;

    var reader = new FileReader();
    var img = new Image();

    if (file.type.indexOf("image") == 0) {
      reader.readAsDataURL(file);
    }

    reader.onload = function(e) {
      img.src = e.target.result;
    };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    img.onload = function () {
      var originWidth = this.width;
      var originHeight = this.height;

      if (!maxWidth) {
        maxWidth = originWidth
      }

      if (!maxHeight) {
        maxHeight = originHeight
      }

      var targetWidth = originWidth, targetHeight = originHeight;

      if (originWidth > maxWidth || originHeight > maxHeight) {
        if (originWidth / originHeight > maxWidth / maxHeight) {
          targetWidth = maxWidth;
          targetHeight = Math.round(maxWidth * (originHeight / originWidth));
        }
        else {
          targetHeight = maxHeight;
          targetWidth = Math.round(maxHeight * (originWidth / originHeight));
        }
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      context.clearRect(0, 0, targetWidth, targetHeight);

      context.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(function(blob) {
        var result = {
          image: img,
          blob,
          canvas
        };
        callback(result);
      }, file.type || 'image/png', quality);
    };
  }

  if (typeof define === 'function' && define.amd) {
    define(function() {
      return zImageCompress;
    });
  }
  else if (typeof exports === 'object') {
    module.exports = zImageCompress;
  }
  else {
    global.zImageCompress = zImageCompress;
  }
})(this);
