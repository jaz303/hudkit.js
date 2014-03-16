var ctx 	= require('../core'),
	theme 	= require('../theme'),
	k		= require('../constants'),
	Widget 	= require('../Widget'),
	du 		= require('domutil');

var InlineWidget = module.exports = Widget.extend(function(_sc, _sm) {

	return [

		function(hk) {

			this._layoutSizeHints = null;
			this._userSizeHints = null;

			_sc.call(this, hk);
			du.addClass(this._root, 'hk-inline-widget');

		},

		'methods', {

			setLayoutSizeHints: function(hints) {
				this._layoutSizeHints = hints;
				this._applySizeHints();
			},

			setUserSizeHints: function(hints) {
				this._userSizeHints = hints;
				this._applySizeHints();
			},

			_applySizeHints: function() {
				// default implementation is no-op
			},

			_getHintedProperty: function(prop) {

				if (this._layoutSizeHints && (prop in this._layoutSizeHints)) {
					return this._layoutSizeHints[prop];
				}

				if (this._userSizeHints && (prop in this._userSizeHints)) {
					return this._userSizeHints[prop];
				}

				return null;

			},

			// for a given style property, apply it to el based on supplied hints.
			// layout hints take precedence over user hints, and if neither are set
			// the style property is set to the empty string (i.e. fall back to
			// whatever is specified in CSS)
			_applyHintedProperty: function(el, prop) {
				var val = this._getHintedProperty(prop);
				if (val !== null) {
					el.style[prop] = val + 'px';
				} else {
					el.style[prop] = '';
				}
			}

		}

	]

});

ctx.registerCSS(require('fs').readFileSync(__dirname + '/style.unwise', 'utf8'));
ctx.registerWidget('InlineWidget', InlineWidget);