var signals = require('./signals');

module.exports = {
	registerModule	: registerModule,
	modules 		: modules,
	registerWidget	: registerWidget,
	widgets 		: widgets
};

var moduleList 			= [],
	widgetMap 			= {},
	moduleRegistered	= signals.moduleRegistered,
	widgetRegistered	= signals.widgetRegistered;

function registerModule(mod) {
	moduleList.push(mod);
	moduleRegistered.emit(mod);
}

function modules() {
	return moduleList;
}

function registerWidget(name, ctor) {
	if (name in widgetMap) {
		throw new Error("duplicate widget type: " + name);
	}
	widgetMap[name] = ctor;
	widgetRegistered.emit(name, ctor);
}

function widgets() {
	return widgetMap;
}
