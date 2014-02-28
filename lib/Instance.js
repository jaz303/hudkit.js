var fs 			= require('fs'),
	styleTag 	= require('style-tag'),
    action      = require('hudkit-action'),
	registry 	= require('./registry'),
	signals 	= require('./signals'),
	theme 		= require('./theme'),
	constants	= require('./constants'),
    slice       = Array.prototype.slice;

module.exports = Instance;

var RESET_CSS   = fs.readFileSync(__dirname + '/reset.css', 'utf8'),
    BASE_CSS    = fs.readFileSync(__dirname + '/style.unwise', 'utf8');

function Instance(window) {

    this.window = window;
    this.document = window.document;
    
    this.appendCSS(RESET_CSS);
    this.appendCSS(BASE_CSS);

    registry.modules().forEach(function(mod) {
    	mod.attach(this);
    }, this);

    this.root = this.rootPane();

    var body = this.document.body;
    body.className = 'hk';
    body.appendChild(this.root.getRoot());

}

Instance.prototype.constants = Instance.prototype.k = constants;
Instance.prototype.action = action;

Instance.prototype.appendCSS = function(css) {

    css = css.replace(/\$(\w+)/g, function(m) {
        return theme.get(RegExp.$1);
    });

    return styleTag(this.document, css);

}

// when widget is registered make it available to all hudkit instances
signals.widgetRegistered.connect(function(name, ctor) {

    var method = name[0].toLowerCase() + name.substring(1);

    Instance.prototype[method] = function(a, b, c, d, e, f, g, h) {
        switch (arguments.length) {
            case 0: return new ctor(this);
            case 1: return new ctor(this, a);
            case 2: return new ctor(this, a, b);
            case 3: return new ctor(this, a, b, c);
            case 4: return new ctor(this, a, b, c, d);
            case 5: return new ctor(this, a, b, c, d, e);
            case 6: return new ctor(this, a, b, c, d, e, f);
            case 7: return new ctor(this, a, b, c, d, e, f, g);
            case 8: return new ctor(this, a, b, c, d, e, f, g, h);
            default: throw new Error("too many ctor arguments. sorry :(");
        }
    }

});