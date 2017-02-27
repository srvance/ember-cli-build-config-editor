var EmberBuildConfigEditor = require('../index.js');
var expect = require('chai').expect;
var fs = require('fs');

describe('Ember Build Config Editor', function() {
    it('exists', function() {
        expect(EmberBuildConfigEditor).to.exist;
    });

    it('parses', function() {
        var source = fs.readFileSync('./tests/fixtures/default.js');

        var build = new EmberBuildConfigEditor(source);

        expect(build).to.exist;
        expect(build.source).to.exist;
        expect(build.ast).to.exist;
        expect(build.configNode).to.exist;
    });
});
