module.exports = EmberBuildConfigEditor;

var recast = require('recast');

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
