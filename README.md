[![Build Status](https://travis-ci.org/srvance/ember-cli-build-config-editor.svg?branch=master)](https://travis-ci.org/srvance/ember-cli-build-config-editor)
[![Dependency Status](https://david-dm.org/srvance/ember-cli-build-config-editor/status.svg)](https://david-dm.org/srvance/ember-cli-build-config-editor) 
[![devDependency Status](https://david-dm.org/srvance/ember-cli-build-config-editor/dev-status.svg)](https://david-dm.org/srvance/ember-cli-build-config-editor?type=dev)


# Ember CLI Build Config Editor

Utility for ember blueprints to use to modify ember-cli-build.js

## Installation for Use

For installation in a non-Ember project:

```commandline
npm install ember-cli-build-config-editor --save-dev
```

For installation in an Ember project:

```commandline
ember install ember-cli-build-config-editor
```

## Usage

Use this from your Ember blueprint to add or update configuration options in your `ember-cli-build.js`.

```js
var BuildConfigEditor = require('ember-cli-build-config-editor.js');
var fs = require('fs');

var source = fs.readFileSync('./ember-cli-build.js');

var build = new BuildConfigEditor(source);

build.edit('some-addon', {
    booleanProperty: false,
    numericProperty: 17,
    stringProperty: 'wow'
});

fs.writeFileSync('./ember-cli-build.js', build.code());
```

## TODO

* Add CI build
* Add David and Greenkeeper integrations
* Recurse into complex nexted configurations
* Handle configuration property removal
* Verify that the types are the same or compatible before updating
* Allow the configuration key and properties to use identifiers instead of literals when feasible. In normal terms, allow
for unquoted property keys rather than the save but more verbose quoted keys we use now.

## Development

### Installation for Development

* Fork and clone the repo
* cd into the project directory
* `npm install`

## Running tests

```commandline
npm test
```

### Understanding JavaScript ASTs

The AST for [the basic configuration](./tests/fixtures/single-config-block.js) can be found in
[this SVG](./docs/ember-cli-build-ast.svg) for reference. It was generated from
[Rappid's JavaScript AST Visualizer](http://resources.jointjs.com/demos/javascript-ast).

The approach used here is based on that for [ember-router-generator](https://github.com/ember-cli/ember-router-generator).

The [DSL for AST types](https://github.com/benjamn/ast-types/blob/master/def/core.js) used by esprima provided great
insight once I got my head around it.

## Contributing

Please fork the project and submit pull requests and issues using GitHub.
