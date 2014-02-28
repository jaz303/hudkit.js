var hk = require('hudkit-core');

var fs = require('fs');

hk.register(require('./lib/Box'));
hk.register(require('./lib/SplitPane'));
hk.register(require('./lib/MultiSplitPane'));
hk.register(require('./lib/Console'));
hk.register(require('./lib/Canvas2D'));
hk.register(require('./lib/Container'));
hk.register(require('./lib/Panel'));
hk.register(require('./lib/Button'));
hk.register(require('./lib/ButtonBar'));
hk.register(require('./lib/TabPane'));
hk.register(require('./lib/Toolbar'));
hk.register(require('./lib/StatusBar'));

module.exports = hk;