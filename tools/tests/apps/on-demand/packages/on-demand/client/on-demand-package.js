OnDemand = 'client export';

Meteor.setTimeout(function (){
  Meteor.call('packageClientLoaded');
  //test if export is accessible:
  if(Package['on-demand'].OnDemand = 'client export'){
    Meteor.call('clientPackageExported');
  }
  //test if css loaded:
  if( false ){
    Meteor.call('cssLoaded');
  }
},5000);