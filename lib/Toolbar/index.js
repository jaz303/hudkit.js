var du = require('domutil');

exports.initialize = function(ctx, k, theme) {

	var TOOLBAR_ITEM_CLASS = 'hk-toolbar-item';

	ctx.registerWidget('Toolbar', ctx.Widget.extend(function(_sc, _sm) {

		return [

	        function() {
	            _sc.apply(this, arguments);
	        },

	        'methods', {
	            addAction: function(action, align) {

	                align = align || k.TOOLBAR_ALIGN_LEFT;
	                var target = (align === k.TOOLBAR_ALIGN_LEFT) ? this._left : this._right;
	                
	                var buttonEl = this.document.createElement('a');
	                buttonEl.href = '#';
	                buttonEl.className = 'hk-button';

	                function sync() {
	                    buttonEl.textContent = action.getTitle();
	                    if (action.isEnabled()) {
	                        du.removeClass(buttonEl, 'disabled');
	                    } else {
	                        du.addClass(buttonEl, 'enabled');
	                    }
	                }

	                sync();

	                action.onchange.connect(sync);

	                buttonEl.className = 'hk-button-common hk-button ' + TOOLBAR_ITEM_CLASS;
	                buttonEl.style.width = 'auto';
	                buttonEl.style.height = 'auto';
	                buttonEl.style.position = 'relative';

	                buttonEl.addEventListener('click', function(evt) {
	                    evt.preventDefault();
	                    evt.stopPropagation();
	                    action();
	                });

	                target.appendChild(buttonEl);

	                return action;

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