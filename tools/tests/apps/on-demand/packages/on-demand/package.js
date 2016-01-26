Package.describe({
  name: 'on-demand',
  onDemand: true
});

Package.onUse(function(api) {
  api.addFiles('client/on-demand-package.js', 'client');
  api.addFiles('server/on-demand-package.js', 'server');
  api.export('OnDemand');
});
