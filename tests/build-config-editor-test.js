var EmberBuildConfigEditor = require('../index.js');
var expect = require('chai').expect;
var fs = require('fs');
var astEquality = require('./helpers/esprima-ast-equality.js');

function readFixture(name) {
    return fs.readFileSync('./tests/fixtures/' + name, 'utf-8');
}

describe('Initialization', function() {
    it('parses', function() {
        var source = readFixture('default.js');

        var build = new EmberBuildConfigEditor(source);

        expect(build).to.exist;
        expect(build.source).to.exist;
        expect(build.ast).to.exist;
        expect(build.configNode).to.exist;
        expect(build.configNode.type).to.equal('ObjectExpression');
    });
});

describe('Adds configuration', function() {
    it('changes nothing if no key is supplied', function() {
        var source = readFixture('default.js');

        var build = new EmberBuildConfigEditor(source);

        var newBuild = build.edit(undefined, {});

        astEquality(newBuild.code(), source);
    });

    it('changes nothing if no configuration object is supplied', function() {
        var source = readFixture('default.js');

        var build = new EmberBuildConfigEditor(source);

        var newBuild = build.edit('some-addon', undefined);

        astEquality(newBuild.code(), source);
    });

    it('adds an empty configuration if an empty configuration is supplied', function() {
        var source = readFixture('default.js');

        var build = new EmberBuildConfigEditor(source);

        var newBuild = build.edit('some-addon', {});

        astEquality(newBuild.code(), readFixture('empty-config-block.js'));
    });

    it('does not duplicate an existing key', function() {
        var source = readFixture('empty-config-block.js');

        var build = new EmberBuildConfigEditor(source);

        var newBuild = build.edit('some-addon', {});

        astEquality(newBuild.code(), source);
    })
});
