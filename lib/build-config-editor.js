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

function findOrAddConfigKey(key) {
    var configKey = this.configNode.properties.find(isKey(key));

    if (!configKey) {
        configKey = builders.property(
            'init',
            builders.literal(key),
            builders.objectExpression([])
        );

        this.configNode.properties.push(configKey);
    }

    return configKey;
}

function addOrUpdateConfigProperty(configObject, property, config) {
    var existingProperty = configObject.properties.find(isKey(property));

    if (existingProperty) {
        existingProperty.value.value = config[property];
    } else {
        var newProperty = builders.property(
            'init',
            builders.literal(property),
            builders.literal(config[property])
        );
        configObject.properties.push(newProperty);
    }
}

function addOrUpdateConfigProperties(configKey, config) {
    var configObject = configKey.value;

    for (var property in config) {
        addOrUpdateConfigProperty(configObject, property, config);
    }
}

EmberBuildConfigEditor.prototype.edit = function(key, config) {
    if (!key || !config) {
        return this.clone();
    }

    var configKey = findOrAddConfigKey.call(this, key);
    addOrUpdateConfigProperties(configKey, config);

    return this;
};

EmberBuildConfigEditor.prototype.code = function(options) {
    var printOptions = options || { tabWidth: 2, quote: 'single' };

    return recast.print(this.ast, printOptions).code;
};
