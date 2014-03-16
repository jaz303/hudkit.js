var ctx         = require('../core'),
    theme       = require('../theme'),
    k           = require('../constants'),
    BlockWidget = require('../BlockWidget'),
    du  		= require('domutil');

ctx.defineConstants({
	TOOLBAR_ALIGN_LEFT	: 'left',
	TOOLBAR_ALIGN_RIGHT	: 'right'
});

ctx.registerWidget('Toolbar', module.exports = BlockWidget.extend(function(_sc, _sm) {

	return [

        function() {

        	this._leftWidgets = [];
        	this._rightWidgets = [];

            _sc.apply(this, arguments);

        },

        'methods', {
            
            addAction: function(action, align) {
				var button = this._hk.button('toolbar');
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

			setBounds: function(x, y, width, height) {
				
				_sm.setBounds.call(this, x, y, width, height);

				function applyHints(widget) {
					widget.setLayoutSizeHints({height: height});
				}

				this._leftWidgets.forEach(applyHints);
				this._rightWidgets.forEach(applyHints);

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

ctx.registerCSS(require('fs').readFileSync(__dirname + '/style.unwise', 'utf8'));