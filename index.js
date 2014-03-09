var fs          = require('fs'),
    signals     = require('./lib/signals'),
    constants   = require('./lib/constants'),
    theme       = require('./lib/theme'),
    Instance    = require('./lib/Instance'),
    Context     = require('./lib/Context'),
    registry    = require('./lib/registry');

var hk = module.exports = {
    register    : registry.registerModule,
    init        : init,
    instance    : function(doc) { return new Instance(doc); }
};

var initialized = false;

signals.moduleRegistered.connect(function(mod) {
    if (initialized) {
        initializeModule(mod);
    }
});

function initializeModule(mod) {
    mod.initialize(Context, constants, theme);
}

function init() {
    if (initialized) {
        return;
    }
    registry.modules().forEach(initializeModule);
    initialized = true;
}

hk.register(require('./lib/Widget'));
hk.register(require('./lib/InlineWidget'));
hk.register(require('./lib/BlockWidget'));

hk.register(require('./lib/RootPane'));
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
hk.register(require('./lib/TreeView'));
hk.register(require('./lib/Knob'));