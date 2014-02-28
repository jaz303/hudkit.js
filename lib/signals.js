var signal = require('signalkit');

function s(signalName) {
	exports[signalName] = signal(signalName);
}

s('moduleRegistered');
s('widgetRegistered');