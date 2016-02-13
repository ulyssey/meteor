// code extracted from tools/static-assets/server/boot.js
var fs = Npm.require('fs');
var path = Npm.require("path");

// read our control files
var serverJsonPath = path.resolve(process.argv[2]);
var serverDir = path.dirname(serverJsonPath);

OnDemand = {};
OnDemand.clientPackages = {};
OnDemand._conditions = {};

OnDemand.load = function(packageName){
  //first load server files
  PackageVersion.validatePackageName(packageName);

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
      new Meteor.Error('package "'+ packageName +'" can not be loaded');
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

