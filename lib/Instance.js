var fs 			= require('fs'),
	styleTag 	= require('style-tag'),
    registry    = require('./registry'),
    action      = require('hudkit-action'),
    constants   = require('./constants'),
    theme       = require('./theme');

module.exports  = Instance;

var RESET_CSS   = fs.readFileSync(__dirname + '/reset.css', 'utf8'),
    BASE_CSS    = fs.readFileSync(__dirname + '/style.unwise', 'utf8');

function Instance(window) {

    this.window = window;
    this.document = window.document;
    
    this.appendCSS(RESET_CSS);
    this.appendCSS(BASE_CSS);

    registry.initializers.forEach(function(init) {
        init(this)
    }, this);

    this.root = this.rootPane();

    var body = this.document.body;
    body.className = 'hk';
    body.appendChild(this.root.getRoot());

}

Instance.prototype.action       = action;
Instance.prototype.constants    = constants;
Instance.prototype.k            = constants;
Instance.prototype.theme        = theme;

Instance.prototype.appendCSS = function(css) {

    css = css.replace(/\$(\w+)/g, function(m) {
        return theme.get(RegExp.$1);
    });

    return styleTag(this.document, css);

}
