var ctx		= require('../core'),
	theme 	= require('../theme'),
	k		= require('../constants'),
	Widget 	= require('../Widget'),
	du 		= require('domutil');

var BlockWidget = module.exports = Widget.extend(function(_sc, _sm) {

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

});

ctx.registerCSS(require('fs').readFileSync(__dirname + '/style.unwise', 'utf8'));
ctx.registerWidget('BlockWidget', BlockWidget);