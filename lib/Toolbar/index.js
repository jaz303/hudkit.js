var du = require('domutil');

exports.initialize = function(ctx, k, theme) {

	ctx.registerWidget('Toolbar', ctx.Widget.extend(function(_sc, _sm) {

		return [

	        function() {
	            _sc.apply(this, arguments);
	        },

	        'methods', {
	            
	            addAction: function(action, align) {
					var button = this._hk.button('toolbar');
					button.setAction(action);
					return this.addWidget(button, align);
	            },

	            addWidget: function(widget, align) {
					align = align || k.TOOLBAR_ALIGN_LEFT;
					var target = (align === k.TOOLBAR_ALIGN_LEFT) ? this._left : this._right;
					widget._setPositionMode(k.POSITION_MODE_AUTO);
					this._attachChildViaElement(widget, target);
					return widget;
				},

	            _buildStructure: function() {

	                this._root = this.document.createElement('div');
	                
	                this._left = this.document.createElement('div');
	                this._left.className = 'hk-toolbar-items hk-toolbar-items-left';
	                this._root.appendChild(this._left);
	                
	                this._right = this.document.createElement('div');
	                this._right.className = 'hk-toolbar-items hk-toolbar-items-right';
	                this._root.appendChild(this._right);
	                
	                this._root.className = 'hk-toolbar';

	            }

	        }

	    ];

	}));

}

var fs = require('fs'),
    CSS = fs.readFileSync(__dirname + '/style.unwise', 'utf8');

exports.attach = function(instance) {
	instance.appendCSS(CSS);
}