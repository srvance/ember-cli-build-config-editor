/*jshint node:true*/
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var config = {
    'some-addon': {
      'booleanProperty': true,
      'numericProperty': 42,
      'stringProperty': 'amazing'
    }
  };

  var app = new EmberAddon(defaults, config);

  /*
   This build file specifies the options for the dummy test app of this
   addon, located in `/tests/dummy`
   This build file does *not* influence how the addon or the app using it
   behave. You most likely want to be modifying `./index.js` or app's build fil
   */

  return app.toTree();
};
