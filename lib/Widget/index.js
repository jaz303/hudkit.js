var ctx     = require('../core'),
    theme   = require('../theme'),
    k       = require('../constants'),
    Class   = require('classkit').Class,
    du      = require('domutil'),
    signal  = require('signalkit');

var Mixins = {};

var Widget = module.exports = Class.extend(function(_sc, _sm) {

    return [

        function(hk) {

            this._hk = hk;
            
            this._parent = null;
            this._hidden = false;
            
            var root = this._buildStructure();
            if (root) this._root = root;
            if (!this._root) throw new Error("widget root not built");
            du.addClass(this._root, 'hk-widget');

        },

        'properties', {
            window: {
                get: function() { return this._hk.window; }
            },
            document: {
                get: function() { return this._hk.document; }
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
                this._root.style.display = this._hidden ? 'none' : '';
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

            },

            //
            // Timeout/intervals

            _setTimeout: function(fn, timeout) {
                return this._hk.window.setTimeout(fn, timeout);
            },

            _clearTimeout: function(id) {
                return this._hk.window.clearTimeout(id);
            },

            _setInterval: function(fn, interval) {
                return this._hk.window.setInterval(fn, interval);
            },

            _clearInterval: function(id) {
                return this._hk.window.clearInterval(id);
            },

            //
            // Signals/properties

            _addSignal: function(name) {
                this[name] = signal(name);
            }
        
        }
    
    ];

});

Widget.registerMixin = function(name, obj) {
    if (name in Mixins) {
        throw new Error("duplicate mixin: " + name);
    }
    Mixins[name] = obj;
}

Widget.Features.mixins = function(ctor, mixinList) {
    mixinList.forEach(function(m) {
        var mixin = Mixins[m];
        if (!mixin) {
            throw new Error("unknown mixin: " + m);
        }
        for (var k in mixin) {
            ctor.prototype[k] = mixin[k];
        }
    });
}

//
// Default mixins

/*
 * ValueWidget mixin denotes any widget that represents a value.
 *  This mixin requires that the implementing widget have the following:
 *
 *   _value => the widget's current value
 *   onChange => a signal for broadcasting changes
 * 
 * Additionally, the private _setValue() function may be overridden to
 * apply custom transform/display update logic
 */
Widget.registerMixin('ValueWidget', {
    getValue: function() {
        return this._value;
    },

    setValue: function(value) {
        this._setValue(value) && this._broadcastChange();
    },

    _setValue: function(v) {
        this._value = v;
    },

    _broadcastChange: function() {
        this.onChange.emit(this, this.getValue());
    }
});

Widget.registerMixin('ValueRange', {
    getMinValue: function() {
        return this._minValue;
    },

    getMaxValue: function() {
        return this._maxValue;
    },

    setMinValue: function(min) {
        if (min === this._minValue) {
            return;
        }

        this._minValue = min;
        if (this._value < min) {
            this._value = min;
        }
            
        this._update();
    },

    setMaxValue: function(max) {
        if (max === this._maxValue) {
            return;
        }
            
        this._maxValue = max;
        if (this._value > max) {
            this._value = max;
        }
            
        this._update();
    }
});

ctx.registerCSS(require('fs').readFileSync(__dirname + '/style.unwise', 'utf8'));
ctx.registerWidget('Widget', Widget);