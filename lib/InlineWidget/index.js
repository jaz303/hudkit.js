var du = require('domutil');

exports.initialize = function(ctx, k, theme) {

	ctx.registerWidget('InlineWidget', ctx.Widget.extend(function(_sc, _sm) {

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