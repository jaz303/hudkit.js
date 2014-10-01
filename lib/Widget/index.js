var ctx 		= require('../core');

var Component 	= require('../component').Component;
var du 			= require('domutil');
var signal 		= require('hudkit-values').signal;
var property 	= require('hudkit-values').property;

var nextWidgetId = 1;

ctx.registerWidget('Widget', module.exports = Component.extend(function(_super) {

	return [

		function(hk) {

			this.hk = hk;

			_super.constructor.call(this, nextWidgetId++);

			this._ui = this._buildStructure();
			for (var k in this._ui) {
				this['_' + k] = this._ui[k];
			}
			
			this._root.component = this;
			this._root.setAttribute('data-cid', this.cid);
			du.addClass(this._root, 'hk-widget');


			this._bindEvents();
			this._buildChildren();
		
		},

		'methods', {

			/**
			 * Call on a widget when you're done with it and never want to use it again.
			 *
			 * There is no need to remove this widget's root from the DOM, this guaranteed
			 * to have happened by the time dispose() is called. However, container widgets
			 * *must* remove all of their children (non-recursively).
			 *
			 * Subclasses should override this method to unregister listeners, remove child
			 * widgets and nullify any references likely to cause memory leaks.
			 */
			dispose: function() {
			    this._root = null;
			},

			getRoot: function() {
				return this._root;
			},

			layout: function() {

			},

			//
			//

			_buildStructure: function() {
				throw new Error("you must override SimpleComponent::_buildComponent()");
			},

			_bindEvents: function() {

			},
			
			_buildChildren: function() {

			},

			_addSignal: function(name) {
				this[name] = signal(name);
			},

			_addProperty: function(name, value, transformer) {
				this[name] = property(name, value, transformer);
			}
			
		}

	]

}));
