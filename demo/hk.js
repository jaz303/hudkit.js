window.hkinit = function() {
	window.hudkit = require('../');
	hudkit.init();
	window.hk = hudkit.instance(window);	
}
