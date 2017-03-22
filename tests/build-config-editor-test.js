var EmberBuildConfigEditor = require('../index.js');
var expect = require('chai').expect;
var fs = require('fs');
var astEquality = require('./helpers/esprima-ast-equality.js');

function readFixture(name) {
  return fs.readFileSync('./tests/fixtures/' + name, 'utf-8');
}

describe('Initialization', function () {
  it('parses', function () {
    var source = readFixture('default.js');

    var build = new EmberBuildConfigEditor(source);

    expect(build).to.exist;
    expect(build.source).to.exist;
    expect(build.ast).to.exist;
    expect(build.configNode).to.exist;
    expect(build.configNode.type).to.equal('ObjectExpression');
  });
});

describe('Adds inline configuration', function () {
  it('changes nothing if no key is supplied', function () {
    var source = readFixture('default.js');

    var build = new EmberBuildConfigEditor(source);

    var newBuild = build.edit(undefined, {});

    astEquality(newBuild.code(), source);
  });

  it('changes nothing if no configuration object is supplied', function () {
    var source = readFixture('default.js');

    var build = new EmberBuildConfigEditor(source);

    var newBuild = build.edit('some-addon', undefined);

    astEquality(newBuild.code(), source);
  });

  it('adds an empty configuration if an empty configuration is supplied', function () {
    var source = readFixture('default.js');

    var build = new EmberBuildConfigEditor(source);

    var newBuild = build.edit('some-addon', {});

    astEquality(newBuild.code(), readFixture('empty-config-block.js'));
  });

  it('does not duplicate an existing key', function () {
    var source = readFixture('empty-config-block.js');

    var build = new EmberBuildConfigEditor(source);

    var newBuild = build.edit('some-addon', {});

    astEquality(newBuild.code(), source);
  });

  it('adds a key with properties to an empty configuration', function () {
    var source = readFixture('default.js');

    var build = new EmberBuildConfigEditor(source);

    var newBuild = build.edit('some-addon', {
      booleanProperty: false,
      numericProperty: 17,
      stringProperty: 'wow'
    });

    astEquality(newBuild.code(), readFixture('single-config-block.js'));
  });

  it('changes the values of existing configuration properties', function () {
    var source = readFixture('single-config-block-different-values.js');

    var build = new EmberBuildConfigEditor(source);

    var newBuild = build.edit('some-addon', {
      booleanProperty: false,
      numericProperty: 17,
      stringProperty: 'wow'
    });

    astEquality(newBuild.code(), readFixture('single-config-block.js'));
  });

  it('recognizes unquoted properties as matching', function () {
    var source = readFixture('single-config-block-unquoted-properties.js');

    var build = new EmberBuildConfigEditor(source);

    var newBuild = build.edit('some-addon', {
      booleanProperty: false,
      numericProperty: 17,
      stringProperty: 'wow'
    });

    astEquality(newBuild.code(), source);
  });

  it('recognizes an unquoted key as matching', function () {
    var source = readFixture('single-config-block-unquoted-key.js');

    var build = new EmberBuildConfigEditor(source);

    var newBuild = build.edit('someaddon', {
      booleanProperty: false,
      numericProperty: 17,
      stringProperty: 'wow'
    });

    astEquality(newBuild.code(), source);
  });
});

describe('Handles separate configuration', function() {
  it('gives throws an error when the configuration cannot be found', function() {
    var source = readFixture('separate-config-block.js');

    var build = new EmberBuildConfigEditor(source);

    expect(function() {
      build.edit('some-addon', {
        booleanProperty: true,
        numbericProperty: 42,
        stringProperty: 'amazing'
      });
    }).to.throw('Configuration object could not be found');
  });
});

describe('Retrieves configuration', function () {
  it('returns undefined if the key is not present', function () {
    var source = readFixture('default.js');

    var build = new EmberBuildConfigEditor(source);

    var config = build.retrieve('some-addon');

    expect(config).to.be.undefined;
  });

  it('returns an empty object when there is an empty config block', function () {
    var source = readFixture('empty-config-block.js');

    var build = new EmberBuildConfigEditor(source);

    var config = build.retrieve('some-addon');

    expect(config).to.exist;
    expect(Object.keys(config)).to.have.lengthOf(0);
  });

  it('returns the values in the config when present', function () {
    var source = readFixture('single-config-block.js');

    var build = new EmberBuildConfigEditor(source);

    var config = build.retrieve('some-addon');

    expect(config).to.exist;
    expect(config.booleanProperty).to.exist;
    expect(config.booleanProperty).to.be.false;
    expect(config.numericProperty).to.exist;
    expect(config.numericProperty).to.equal(17);
    expect(config.stringProperty).to.exist;
    expect(config.stringProperty).to.equal('wow');
  });

  it('returns undefined if the configuration cannot be found', function() {
    var source = readFixture('separate-config-block.js');

    var build = new EmberBuildConfigEditor(source);

    var config = build.retrieve('some-addon');

    expect(config).to.be.undefined;
  });
});
