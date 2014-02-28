var registry 	= require('./registry'),
	signals		= require('./signals'),
	constants 	= require('./constants');

// Context object is passed to each registered module's initialize()
// function, allowing them to access select registry methods and 
// all previously registered widgets.
var Context = module.exports = {
	
	registerWidget  : registry.registerWidget,
	
	defineConstant: function(name, value) {
		Object.defineProperty(constants, name, {
			enumerable	: true,
			writable	: false,
			value		: value
		});
	},

	defineConstants: function(constants) {
		for (var k in constants) {
			this.defineConstant(k, constants[k]);
		}
	}

};

signals.widgetRegistered.connect(function(name, ctor) {
	Context[name] = ctor;
});