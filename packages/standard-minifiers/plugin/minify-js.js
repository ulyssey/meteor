Plugin.registerMinifier({
  extensions: ["js"]
}, function () {
  var minifier = new UglifyJSMinifier();
  return minifier;
});

function UglifyJSMinifier () {};

UglifyJSMinifier.prototype.processFilesForBundle = function (files, options) {
  var mode = options.minifyMode;

  // don't minify anything for development
  if (mode === 'development') {
    files.forEach(function (file) {
      file.addJavaScript({
        data: file.getContentsAsBuffer(),
        sourceMap: file.getSourceMap(),
        path: file.getPathInBundle()
      });
    });
    return;
  }

  var jsClassified = {};
  jsClassified._notOnDemand = {files: []};
  var packageName = '';
  
  //classify js files by package:
  files.forEach(function (file) {
    if (file._source.onDemand) {
      packageName = file._source.packageName;
      if (typeof jsClassified[packageName] === 'undefined') {
        jsClassified[packageName] = {files: []};
      }
      jsClassified[packageName].files.push(file);
    } else {
      jsClassified._notOnDemand.files.push(file);
    }
  });

  var minifyOptions = {
    fromString: true,
    compress: {
      drop_debugger: false,
      unused: false,
      dead_code: false
    }
  };

  var someJs = '';
 
  if (files.length) {
    Object.getOwnPropertyNames(jsClassified).forEach(function(property) {
      current = jsClassified[property];
      someJs = '';

      current.files.forEach(function (file) {
        someJs += UglifyJSMinify(file.getContentsAsString(), minifyOptions).code;
        someJs += '\n\n';

        Plugin.nudge();
      });

      current.files[0].addJavaScript({ data: someJs });
    });
  }
};


