exports.initialize = function(ctx, k, theme) {

	ctx.registerWidget('Panel', ctx.Container.extend(function(_sc, _sm) {

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

};

exports.attach = function(instance) {

};
