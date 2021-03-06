var ctx         = require('../core'),
    k           = require('../constants'),
    Widget      = require('../Widget');

ctx.registerWidget('Container', module.exports = Widget.extend(function(_super) {

	return [

		function(hk) {
            
            this._layout = null;
            this._children = [];

            _super.constructor.call(this, hk);
        
            this._container = this._getContainer();

        },

        'methods', {
            getLayout: function() {
                return this._layout;
            },

            setLayout: function(layout) {
                this._layout = layout;
                this.layout();
            },

            layout: function() {
                // TODO: batch this stuff asynchronously
                this.layoutImmediately();
            },

            layoutImmediately: function() {
                if (this._layout) {
                    this._layout(this._root.getBoundingClientRect());
                }
            },

            addChild: function(tag, widget) {

                if (typeof widget === 'undefined') {
                    widget = tag;
                    tag = null;
                }

                if (tag && this[tag])
                    throw new Error("duplicate child tag: " + tag);
                
                this._attachChildViaElement(widget, this._container);
                this._children.push(widget);

                if (tag) {
                    this[tag] = widget;
                    widget.__container_tag__ = tag;
                }

                this.layout();

                return this;
            
            },

            removeChild: function(widget) {

                for (var i = 0, l = this._children.length; i < l; ++i) {
                    var ch = this._children[i];
                    if (ch === widget) {
                        
                        this._removeChildViaElement(ch, this._container);
                        this._children.splice(i, 1);

                        if ('__container_tag__' in widget) {
                            delete this[widget.__container_tag__];
                            delete widget.__container_tag__;
                        }
                        
                        this.layout();

                        return true;
                    
                    }
                }

                return false;

            },

            removeChildByTag: function(tag) {

                var widget = this[tag];

                if (!widget)
                    throw new Error("no widget with tag: " + tag);

                this.removeChild(widget);

                return widget;

            },

            // Returns the element to which child widgets should be appended.
            // Default is to return the root element.
            _getContainer: function() {
                return this._root;
            }
        }

    ];

}));