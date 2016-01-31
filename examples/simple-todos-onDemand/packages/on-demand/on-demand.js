// code extracted from tools/static-assets/server/boot.js
var fs = Npm.require('fs');
var path = Npm.require("path");

// read our control files
var serverJsonPath = path.resolve(process.argv[2]);
var serverDir = path.dirname(serverJsonPath);
var serverJson = JSON.parse(fs.readFileSync(serverJsonPath, 'utf8'));
var configJson =
  JSON.parse(fs.readFileSync(path.resolve(serverDir, 'config.json'), 'utf8'));

OnDemand = {};
OnDemand.load = function(packageName){
  PackageVersion.validatePackageName(packageName);
  packageName =  packageName.replace(':', '_')

  var fileInfo = _.find(serverJson.load, function (fileInfo) {
    return fileInfo.path === "packages/" + packageName + ".js";
  });

  var code = fs.readFileSync(path.resolve(serverDir, fileInfo.path));

  var getAsset = function (assetPath, encoding, callback) {
    var fut;
    if (! callback) {
      fut = new Future();
      callback = fut.resolver();
    }
    // This assumes that we've already loaded the meteor package, so meteor
    // itself can't call Assets.get*. (We could change this function so that
    // it doesn't call bindEnvironment if you don't pass a callback if we need
    // to.)
    var _callback = Meteor.bindEnvironment(function (err, result) {
      if (result && ! encoding)
      // Sadly, this copies in Node 0.10.
        result = new Uint8Array(result);
      callback(err, result);
    }, function (e) {
      console.log("Exception in callback of getAsset", e.stack);
    });

    // Convert a DOS-style path to Unix-style in case the application code was
    // written on Windows.
    assetPath = files.convertToStandardPath(assetPath);

    if (!fileInfo.assets || !_.has(fileInfo.assets, assetPath)) {
      _callback(new Error("Unknown asset: " + assetPath));
    } else {
      var filePath = path.join(serverDir, fileInfo.assets[assetPath]);
      fs.readFile(files.convertToOSPath(filePath), encoding, _callback);
    }
    if (fut)
      return fut.wait();
  };

  var Assets = {
    getText: function (assetPath, callback) {
      return getAsset(assetPath, "utf8", callback);
    },
    getBinary: function (assetPath, callback) {
      return getAsset(assetPath, undefined, callback);
    }
  };

  // \n is necessary in case final line is a //-comment
  var wrapped = "(function(Npm, Assets){" + code + "\n})";

  // It is safer to use the absolute path when source map is present as
  // different tooling, such as node-inspector, can get confused on relative
  // urls.

  // fileInfo.path is a standard path, convert it to OS path to join with
  // serverDir
  var scriptPath = files.convertToOSPath(fileInfo.path);

  // The final 'true' is an undocumented argument to runIn[Foo]Context that
  // causes it to print out a descriptive error message on parse error. It's
  // what require() uses to generate its errors.
  var func = Npm.require('vm').runInThisContext(wrapped, scriptPath, true);
  func.call(global, Npm, Assets); // Coffeescript
};