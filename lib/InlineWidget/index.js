var du = require('domutil');

exports.initialize = function(ctx, k, theme) {

	ctx.registerWidget('InlineWidget', ctx.Widget.extend(function(_sc, _sm) {

		return [

			function(hk) {
				_sc.call(this, hk);
				du.addClass(this._root, 'hk-inline-widget');
			}

		]

	}));

}

var fs = require('fs'),
    CSS = fs.readFileSync(__dirname + '/style.unwise', 'utf8');

exports.attach = function(instance) {
	instance.appendCSS(CSS);
}