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

exports.init            = init;
exports.action          = require('./lib/action');

exports.Widget          = require('./lib/Widget');
exports.Box             = require('./lib/Box');
exports.RootPane        = require('./lib/RootPane');
exports.SplitPane       = require('./lib/SplitPane');
exports.CodeEditor      = require('./lib/CodeEditor');
exports.Console         = require('./lib/Console');
exports.Canvas2D        = require('./lib/Canvas2D');
exports.TabPane         = require('./lib/TabPane');
exports.Toolbar         = require('./lib/Toolbar');
exports.Container       = require('./lib/Container');
exports.Panel           = require('./lib/Panel');
exports.Button          = require('./lib/Button');
exports.ButtonBar       = require('./lib/ButtonBar');
// exports.TreeView        = require('./lib/TreeView');
exports.StatusBar       = require('./lib/StatusBar');
exports.MultiSplitPane  = require('./lib/MultiSplitPane');

var constants = require('./lib/constants');
Object.keys(constants).forEach(function(k) {
    exports[k] = constants[k];
});
