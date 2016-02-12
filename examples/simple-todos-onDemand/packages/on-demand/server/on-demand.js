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
OnDemand.clientPackages = {};
OnDemand._conditions = {};


OnDemand.load = function(packageName){
  //first load server files
  PackageVersion.validatePackageName(packageName);
  var packageName_ =  packageName.replace(':', '_');

  var fileInfo = _.find(serverJson.load, function (fileInfo) {
    return fileInfo.path === "packages/" + packageName_ + ".js";
  });

  if (typeof fileInfo === 'undefined'){
    throw new Meteor.Error('package name do not exist');
  }

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
  //
  console.log("loading server package");
  var func = Npm.require('vm').runInThisContext(wrapped, scriptPath, true);
  func.call(global, Npm, Assets); // Coffeescript

  //Second prepare clients files:
  var programDir = serverDir.replace(/server$/, 'web.browser') + '/program.json';
  var program = Meteor.wrapAsync(fs.readFile)(programDir, 'utf8');
  var manifest = EJSON.parse(program).manifest;

  result = _.chain(manifest)
    .filter(function (item) {
      return item.packageName === packageName;
    })
    .map(function (item) {
      return _.pick(item, "type", "url");
    })
    .value();

  if (typeof result === 'undefined'){
    throw new Meteor.Error('package name do not exist');
  }
  OnDemand.clientPackages[packageName] = result;
};

Meteor.methods({
  onDemandLoadPackage: function (packageName) {
    PackageVersion.validatePackageName(packageName);

    var condition = typeof OnDemand._conditions[packageName] === 'undefined'  ?
      false : OnDemand._conditions[packageName];

    if(((typeof condition === 'function') && condition.apply(this)) ||
    ((typeof condition === 'boolean') && condition)){

      if(typeof OnDemand.clientPackages[packageName] === 'undefined'){
        OnDemand.load(packageName);
      }
      return OnDemand.clientPackages[packageName];

    }else{
      new Meteor.Error('package can not be loaded');
    }
  }
});

OnDemand.conditions = function (conditions) {
  for ( var packageName in conditions){
    if( conditions.hasOwnProperty( packageName ) ){
      PackageVersion.validatePackageName(packageName);

      if ((typeof conditions[packageName] !== 'function') &&
        (typeof conditions[packageName] !== 'boolean')){
        throw new Error('invalid packageName');
      }
      OnDemand._conditions[packageName] = conditions[packageName];
    }
  }
};

