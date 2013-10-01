var Class   = require('classkit').Class;
var du      = require('domutil');
var k       = require('./constants');

module.exports = Class.extend(function(_sc, _sm) {

    return [

        function(rect) {

            this._parent = null;
            this._hidden = false;
            this._positionMode = k.POSITION_MODE_MANUAL;

            var root = this._buildStructure();
            if (root) this._root = root;
            if (!this._root) throw new Error("widget root not built");
            du.addClass(this._root, 'hk-widget hk-position-manual');

            if (rect) {
                this.setBounds(rect.x, rect.y, rect.width, rect.height, true);
            } else {
                var size = this._defaultSize();
                this.setBounds(0, 0, size.width, size.height);
            }

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

            getRoot: function() { return this._root; },

            getParent: function() { return this._parent; },
            setParent: function(p) { this._parent = p; },

            isHidden: function() { return this._hidden; },
            setHidden: function(hidden) {
                this._hidden = !!hidden;
                this._root.style.display = this._hidden ? 'none' : this._cssDisplayMode();
            },

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

            /**
             * A widget's implementation of this method should create that widget's
             * HTML structure and either assign it to this.root or return it. There
             * is no need to assign the CSS class `hk-widget`; this is done by the
             * widget initialiser, but any additional CSS classes must be added by
             * your code.
             *
             * Shortly after it has called _buildStructure(), the initialiser will
             * call setBounds() - a method you may have overridden to perform
             * additional layout duties - so ensure that the HTML structure is
             * set up sufficiently for this call to complete.
             */
            _buildStructure: function() {
                throw new Error("widgets must override Widget.prototype._buildStructure()");
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
                if (this._positionMode === k.POSITION_MODE_AUTO) {
                    this._root.style.left = '';
                    this._root.style.top = '';
                    this._root.style.width = '';
                    this._root.style.height = '';
                }
            },

            _applyPosition: function() {
                if (this._positionMode === k.POSITION_MODE_MANUAL) {
                    this._root.style.left = this.x + 'px';
                    this._root.style.top = this.y + 'px';    
                }
            },

            _applySize: function() {
                if (this._positionMode === k.POSITION_MODE_MANUAL) {
                    this._root.style.width = this.width + 'px';
                    this._root.style.height = this.height + 'px';
                }
            },

            _setPositionMode: function(newMode) {

                if (newMode === this._positionMode)
                    return;

                this._positionMode = newMode;

                if (newMode === k.POSITION_MODE_MANUAL) {
                    du.removeClass(this._root, 'hk-position-auto');
                    du.addClass(this._root, 'hk-position-manual');
                    this._applyBounds();
                } else if (newMode === k.POSITION_MODE_AUTO) {
                    du.removeClass(this._root, 'hk-position-manual');
                    du.addClass(this._root, 'hk-position-auto');
                    this._unapplyBounds();
                } else {
                    throw new Error("unknown position mode: " + newMode);
                }

            },

            _defaultSize: function() {
                return {width: 100, height: 100};
            },

            _cssDisplayMode: function() {
                return 'block';
            },

            _attachChildViaElement: function(childWidget, ele) {

                // TODO: it would probably be better if we just asked the
                // child to remove itself from the its current parent here
                // but that pre-supposes a standard interface for removing
                // elements from "containers", which we don't have yet. And
                // I'm not willing to commit to an interface that hasn't yet
                // proven to be required...
                var existingParent = childWidget.getParent();
                if (existingParent) {
                    throw "can't attach child widget - child already has a parent!";
                }

                ele = ele || this.getRoot();
                ele.appendChild(childWidget.getRoot());
                childWidget.setParent(this);

            },

            _removeChildViaElement: function(childWidget, ele) {

                ele = ele || this.getRoot();
                ele.removeChild(childWidget.getRoot());
                childWidget.setParent(null);

            }
        
        }
    
    ];

});