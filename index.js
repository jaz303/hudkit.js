var RootPane    = require('./lib/RootPane');

var rootPane    = null,
    rootEl      = null;

function init() {

    rootPane = new RootPane();
    rootEl = document.body;
    rootEl.className = 'hk';
    rootEl.appendChild(rootPane.getRoot());

    return rootPane;

}

function xc(klass) {
    exports[klass] = require('./lib/' + klass);
}

exports.init = init;
exports.action = require('./lib/action');

xc('Widget');
xc('Box');
xc('RootPane');
xc('SplitPane');
xc('CodeEditor');
xc('Console');
xc('Canvas2D');
xc('TabPane');
xc('Toolbar');
xc('Container');
xc('Panel');
xc('Button');
xc('ButtonBar');
xc('TreeView');
xc('StatusBar');
xc('MultiSplitPane');

var constants = require('./lib/constants');
Object.keys(constants).forEach(function(k) {
    exports[k] = constants[k];
});
