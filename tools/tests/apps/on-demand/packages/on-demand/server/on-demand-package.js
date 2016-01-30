console.log('on-demand-package-server');
OnDemand = 'server export';


Meteor.methods({
  packageClientLoaded: function () {
    console.log('client package loaded');
  },
  clientPackageExported: function () {
    console.log('client package exported');
  },
  cssLoaded: function () {
    console.log('css loaded');
  }
});