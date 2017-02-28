module.exports = EmberBuildConfigEditor;

var recast = require('recast');
var builders = recast.types.builders;

function EmberBuildConfigEditor(source, ast) {
    this.source = source;
    this.ast = this.parse(ast);
    this.configNode = null;

    this.findConfigNode(this.ast);
}

EmberBuildConfigEditor.prototype.parse = function(ast) {
    return ast || recast.parse(this.source);
};

function isObjectExpression(element) {
    return element.type === 'ObjectExpression';
}

EmberBuildConfigEditor.prototype.findConfigNode = function(ast) {
    var editor = this;

    recast.visit(ast, {
        visitNewExpression: function(path) {
            var node = path.node;

            if (node.callee.name === 'EmberApp') {
                editor.configNode = node.arguments.find(isObjectExpression);

                return false;
            } else {
                this.traverse(path);
            }
        }
    })
};

EmberBuildConfigEditor.prototype.clone = function() {
    return new EmberBuildConfigEditor(this.code());
};

function isKey(key) {
    return function(property) {
        return property.key.type === 'Literal' && property.key.value === key;
    };
}

function findOrAddConfigProperty(key) {
    var configProperty = this.configNode.properties.find(isKey(key));

    if (!configProperty) {
        configProperty = builders.property(
            'init',
            builders.literal(key),
            builders.objectExpression([])
        );

        this.configNode.properties.push(configProperty);
    }
}

EmberBuildConfigEditor.prototype.edit = function(key, config) {
    if (!key || !config) {
        return this.clone();
    }

    findOrAddConfigProperty.call(this, key);

    return this;
};

EmberBuildConfigEditor.prototype.code = function(options) {
    var printOptions = options || { tabWidth: 2, quote: 'single' };

    return recast.print(this.ast, printOptions).code;
};
