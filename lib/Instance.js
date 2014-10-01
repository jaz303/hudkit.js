var registry    = require('./registry');
var constants   = require('./constants');

var action      = require('hudkit-action');

module.exports  = Instance;

function Instance(window) {

    this.window = window;
    this.document = window.document;

    registry.initializers.forEach(function(init) {
        init(this)
    }, this);

    var body = this.document.body;
    body.className = 'hk';

    this.root = this.rootPane();
    this.root.attachAsRootComponent(body);

}

Instance.prototype.action       = action;
Instance.prototype.constants    = constants;
Instance.prototype.k            = constants;
