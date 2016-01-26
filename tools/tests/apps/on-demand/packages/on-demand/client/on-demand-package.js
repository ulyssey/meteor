OnDemand = 'client export';

Meteor.setTimeout(function (){
  Meteor.call('packageClientLoaded');
  if(Package['on-demand'].OnDemand = 'client export'){
    Meteor.call('clientPackageExported');
  }
},5000);