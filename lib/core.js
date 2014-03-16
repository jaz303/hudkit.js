var registry				= require('./registry'),
	theme 					= require('./theme'),
	constants 				= require('./constants'),
	Instance 				= require('./Instance');

exports.theme 				= theme;
exports.k 					= constants;

exports.defineConstant 		= defineConstant;
exports.defineConstants		= defineConstants;
exports.registerWidget		= registerWidget;
exports.registerInitializer	= registerInitializer;
exports.registerCSS 		= registerCSS;
exports.instance 			= instance;
exports.init 				= init;

function defineConstant(name, value) {
	Object.defineProperty(constants, name, {
		enumerable	: true,
		writable	: false,
		value		: value
	});
}

function defineConstants(ks) {
	for (var k in ks) {
		defineConstant(k, ks[k]);
	}
}

function getWidget(name) {

	if (!(name in registry.widgets)) {
		throw new Error("unknown widget type: " + name);
	}

	return registry.widgets[name];

}

function registerWidget(name, ctor) {
	
	if (name in registry.widgets) {
		throw new Error("duplicate widget type: " + name);
	}

	if (name in exports) {
		throw new Error("widget name '" + name + "' clashes with hudkit exports");
	}

	registry.widgets[name] = exports[name] = ctor;

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

}

function registerInitializer(cb) {
	registry.initializers.push(cb);
}

function registerCSS(css) {
	registerInitializer(function(instance) {
		instance.appendCSS(css);
	});
}

function instance(doc) {
	return new Instance(doc);
}

function init() {
	// no-op, backwards compatibility only
}