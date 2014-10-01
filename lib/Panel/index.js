var ctx         = require('../core'),
    k           = require('../constants'),
    Container   = require('../Container');

var d 			= require('dom-build');

ctx.registerWidget('Panel', module.exports = Container.extend(function(_super) {

	return [

	    function(hk) {
	        _super.constructor.call(this, hk);
	    },

	    'methods', {
	        _buildStructure: function() {
	        	return d('.hk-panel');
	        }
	    }

	]

}));