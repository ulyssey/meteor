if (Meteor.isServer){
  Meteor.setTimeout(function () {
    Package.loadOnDemand('on-demand', function () {
      console.log(Package['on-demand'].onDemand);
    });
  },5000);

  Meteor.setTimeout(function () {
    Package.loadOnDemand('does-not-exist', function () {
      console.log(Package['on-demand'].onDemand);
    });
  },5000);
}

if (Meteor.isClient){
  console.log('app running');
}