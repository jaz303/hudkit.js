exports.initialize = function(ctx, k, theme) {

    ctx.registerWidget('PropertyEditor', ctx.BlockWidget.extend(function(_sc, _sm) {

        return [

            function(hk, rect) {

            	this._delegate = null;

                _sc.call(this, hk, rect);

            },

            'methods', {

            	getDelegate: function() {
            		return this._delegate;
            	},

            	setDelegate: function(d) {
            		
            		if (d === this._delegate) {
            			return;
            		}

            		// mojo!

            	}

                _buildStructure: function() {
                    
                    this._root = this.document.createElement('div');
                    this._root.className = 'hk-property-editor';

                    this._table = this.document.createElement('table');

                    this._root.appendChild(this._table);

                },

                _rebuild: function(group) {

                }

            }

        ];

    }));

}

var fs = require('fs'),
	css = fs.readFileSync(__dirname + '/style.unwise', 'utf8');

exports.attach = function(instance) {
	instance.appendCSS(css);
}