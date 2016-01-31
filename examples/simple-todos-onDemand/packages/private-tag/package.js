Package.describe({
  name: 'ulyssey:private-tag',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
  onDemand: true
});

Package.onUse(function(api) {
//  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('templating', 'client');
  api.addFiles('template.html', 'client');
  api.addFiles('private-tag.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('ulyssey:private-tag');
  api.addFiles('private-tag-tests.js');
});