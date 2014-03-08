var du = require('domutil');

exports.initialize = function(ctx, k, theme) {

	ctx.registerWidget('BlockWidget', ctx.Widget.extend(function(_sc, _sm) {

		return [

			function(hk, rect) {
				
				_sc.call(this, hk);
				
				du.addClass(this._root, 'hk-block-widget');

				if (rect) {
				    this.setBounds(rect.x, rect.y, rect.width, rect.height, true);
				} else {
				    var size = this._defaultSize();
				    this.setBounds(0, 0, size.width, size.height);
				}

			},

			'methods', {

				setRect: function(rect) {
				    return this.setBounds(rect.x, rect.y, rect.width, rect.height);
				},

				/**
				 * Set the position and size of this widget
				 * Of all the public methods for manipulating a widget's size, setBounds()
				 * is the one that does the actual work. If you need to override resizing
				 * behaviour in a subclass (e.g. see hk.RootPane), this is the only method
				 * you need to override.
				 */
				setBounds: function(x, y, width, height) {
				    this._setBounds(x, y, width, height);
				    this._applyBounds();
				},

				_setBounds: function(x, y, width, height) {
				    this.x = x;
				    this.y = y;
				    this.width = width;
				    this.height = height;
				},

				_applyBounds: function() {
				    this._applyPosition();
				    this._applySize();
				},

				_unapplyBounds: function() {
				    this._root.style.left = '';
			        this._root.style.top = '';
			        this._root.style.width = '';
			        this._root.style.height = '';
				},

				_applyPosition: function() {
				    this._root.style.left = this.x + 'px';
				    this._root.style.top = this.y + 'px';
				},

				_applySize: function() {
				    this._root.style.width = this.width + 'px';
				    this._root.style.height = this.height + 'px';
				},

				_defaultSize: function() {
                    return {width: 100, height: 100};
                }

			}

		]

	}));

}

var fs = require('fs'),
    CSS = fs.readFileSync(__dirname + '/style.unwise', 'utf8');

exports.attach = function(instance) {
	instance.appendCSS(CSS);
}