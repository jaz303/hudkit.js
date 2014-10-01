var ctx     = require('../core');
var k 		= require('../constants');
var Widget 	= require('../Widget');

var du  	= require('domutil');
var d 		= require('dom-build');

ctx.defineConstants({
	TOOLBAR_ALIGN_LEFT	: 'left',
	TOOLBAR_ALIGN_RIGHT	: 'right'
});

ctx.registerWidget('Toolbar', module.exports = Widget.extend(function(_super) {

	return [

        function(hk) {

        	this._leftWidgets = [];
        	this._rightWidgets = [];

            _super.constructor.call(this, hk);

        },

        'methods', {
            
            addAction: function(action, align) {
				var button = this.hk.button('toolbar');
				button.bindAction(action);
				return this.addWidget(button, align);
            },

            addWidget: function(widget, align) {
			
				align = align || k.TOOLBAR_ALIGN_LEFT;

				if (align === k.TOOLBAR_ALIGN_LEFT) {
					var targetEl 	= this._left,
						targetArray	= this._leftWidgets;
				} else {
					var targetEl 	= this._right,
						targetArray	= this._rightWidgets;
				}
				
				this._attachChildViaElement(widget, targetEl);
				targetArray.push(widget);

				return widget;

			},

            _buildStructure: function() {
				return d('.hk-toolbar',
            		d('.hk-toolbar-items.hk-toolbar-items-left!left'),
            		d('.hk-toolbar-items.hk-toolbar-items-left!right')
            	);
			}

        }

    ];

}));
