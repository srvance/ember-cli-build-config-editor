module.exports = EmberBuildConfigEditor;

var recast = require('recast');

function EmberBuildConfigEditor(source, ast) {
    this.source = source;
    this.ast = ast;
    this.configNode = null;

    this.parse();
    this.findConfigNode();
}

EmberBuildConfigEditor.prototype.parse = function() {
    return (this.ast = this.ast || recast.parse(this.source));
};

function isObjectExpression(element) {
    return element.type === 'ObjectExpression';
}

EmberBuildConfigEditor.prototype.findConfigNode = function() {
    var editor = this;

    recast.visit(this.ast, {
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
