var ctx          = require('../core'),
    theme        = require('../theme'),
    k            = require('../constants'),
    Container    = require('../Container');

ctx.registerWidget('Panel', module.exports = Container.extend(function(_sc, _sm) {

	return [

	    function() {
	        _sc.apply(this, arguments);
	    },

	    'methods', {
	        _buildStructure: function() {
	            this._root = this.document.createElement('div');
	            this._root.className = 'hk-panel';
	        }
	    }

	]

}));