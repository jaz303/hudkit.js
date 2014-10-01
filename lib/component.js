var Class = require('classkit').Class;

var du = require('domutil');

var Component = exports.Component = Class.extend(function(_super) {

	return [

		function(cid) {
			this.cid = cid;
			this._parent = null;
			this._hidden = false;
			this._isRootComponent = false;
			this._childComponents = [];
		},

		'methods', {

			attachAsRootComponent: function(el) {
				this._isRootComponent = true;
				this.willMount();
				el.appendChild(this.getRoot());
				this.didMount();
			},

			isHidden: function() {
				return this._hidden;
			},

			hide: function() {
				if (!this._hidden) {
					this.getRoot().style.display = 'none';
					this._hidden = true;	
				}
			},

			show: function() {
				if (this._hidden) {
					this.getRoot().style.display = '';
					this._hidden = false;	
				}
			},

			setHidden: function(hidden) {
				if (hidden) {
					this.hide();
				} else {
					this.show();
				}
			},

			isMounted: function() {
				return this._isRootComponent || (this._parent && this._parent.isMounted());
			},

			getRoot: function() {
				throw new Error("component must have a root");
			},

			getParent: function() {
				return this._parent;
			},

			willMount: function() {
				this._callOnChildren('willMount');
			},

			didMount: function() {
				this._callOnChildren('didMount');
			},

			willUnmount: function() {
				this._callOnChildren('willUnmount');
			},

			didUnmount: function() {
				this._callOnChildren('didUnmount');
			},

			//
			//

			_setParent: function(parent) {
				this._parent = parent;
			},

			_attachChildViaElement: function(component, el) {

				if (typeof el === 'string') {
					el = this.getRoot().querySelector(el);
				}

				if (component.getParent()) {
					throw new Error("can't attach component - already has parent");
				}

				var mounted = this.isMounted();

				if (mounted) {
					component.willMount();
				}

				var self = this;

				// this.dom.appendChild(el, component.getRoot());
				// this.dom.call(function() {
				// 	self._childComponents.push(component);
				// 	component._setParent(this);

				// 	if (mounted) {
				// 		component.didMount();
				// 	}

				// 	if (cb) cb();
				// });

				el.appendChild(component.getRoot());
				this._childComponents.push(component);
				component._setParent(this);

				if (mounted) {
					component.didMount();
				}

				return component;

			},

			_attachChildByReplacingElement: function(component, el) {

				if (typeof el === 'string') {
					el = this.getRoot().querySelector(el);
				}

				if (component.getParent()) {
					throw new Error("can't attach component - already has parent");	
				}

				var mounted = this.isMounted();

				if (mounted) {
					component.willMount();
				}

				du.replace(el, component.getRoot());
				this._childComponents.push(component);
				component._setParent(this);

				if (mounted) {
					component.didMount();
				}

				return component;

			},

			_removeChildViaElement: function(component, el) {

				if (typeof el === 'string') {
					el = this.getRoot().querySelector(el);
				}

				var ix = this._childComponents.indexOf(component);
				if (ix < 0) {
					throw new Error("can't remove component - not a child");
				}

				component.willUnmount();

				el.removeChild(component.getRoot());
				this._childComponents.splice(ix, 1);
				component._setParent(null);

				component.didUnmount();

				return component;

			},

			_callOnChildren: function(method) {
				if (this._childComponents.length) {
					this._childComponents.forEach(function(c) {
						c[method]();
					});	
				}
			}

		}

	];

});

exports.SimpleComponent = Component.extend(function(_super) {

	return [

		function(cid) {

			_super.constructor.call(this, cid);

			this.ui = this._buildComponent();
			
			this._root = this.ui.root;
			this._root.component = this;

			this._bindEvents();
			this._buildChildren();

		},

		'methods', {

			getRoot: function() {
				return this._root;
			},

			_buildComponent: function() {
				throw new Error("you must override SimpleComponent::_buildComponent()");
			},

			_bindEvents: function() {},
			_buildChildren: function() {}

		}

	];

});