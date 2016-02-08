Package.describe({
  name: 'ulyssey:on-demand',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
//  api.versionsFrom('1.2.1');
  api.use(['ecmascript', 'underscore', 'package-version-parser']);
  api.addFiles('server/mini-files.js', 'server');
  api.addFiles('server/on-demand.js', 'server');
  api.addFiles('client/on-demand.js', 'client');
  api.export('OnDemand');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('ulyssey:on-demand');
  api.addFiles('on-demand-tests.js');
});
