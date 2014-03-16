(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.hkinit = function() {
	window.hudkit = require('../');
	hudkit.init();
	window.hk = hudkit.instance(window);	
}

},{"../":2}],2:[function(require,module,exports){
module.exports = require('./lib/core');

require('./lib/Widget');
require('./lib/InlineWidget');
require('./lib/BlockWidget');
require('./lib/RootPane');

// hk.register(require('./lib/Box'));
// hk.register(require('./lib/SplitPane'));
// hk.register(require('./lib/MultiSplitPane'));
// hk.register(require('./lib/Console'));
// hk.register(require('./lib/Canvas2D'));
// hk.register(require('./lib/Container'));
// hk.register(require('./lib/Panel'));
// hk.register(require('./lib/Button'));
// hk.register(require('./lib/ButtonBar'));
// hk.register(require('./lib/TabPane'));
// hk.register(require('./lib/Toolbar'));
// hk.register(require('./lib/StatusBar'));
// hk.register(require('./lib/TreeView'));
// hk.register(require('./lib/Knob'));
// hk.register(require('./lib/Select'));
// hk.register(require('./lib/HorizontalSlider'));
// hk.register(require('./lib/PropertyEditor'));
// hk.register(require('./lib/Checkbox'));
// hk.register(require('./lib/TextField'));
},{"./lib/BlockWidget":3,"./lib/InlineWidget":4,"./lib/RootPane":6,"./lib/Widget":7,"./lib/core":9}],3:[function(require,module,exports){
(function (__dirname){var ctx		= require('../core'),
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

ctx.registerCSS(".hk-block-widget {\n\tdisplay: block;\n\tposition: absolute;\n\twidth: auto;\n\theight: auto;\n}");
ctx.registerWidget('BlockWidget', BlockWidget);}).call(this,"/../lib/BlockWidget")
},{"../Widget":7,"../constants":8,"../core":9,"../theme":11,"domutil":15}],4:[function(require,module,exports){
(function (__dirname){var ctx 	= require('../core'),
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

ctx.registerCSS(".hk-inline-widget {\n\tdisplay: inline-block;\n\twidth: auto;\n\theight: auto;\n}");
ctx.registerWidget('InlineWidget', InlineWidget);}).call(this,"/../lib/InlineWidget")
},{"../Widget":7,"../constants":8,"../core":9,"../theme":11,"domutil":15}],5:[function(require,module,exports){
(function (__dirname){var fs 			= require('fs'),
	styleTag 	= require('style-tag'),
    registry    = require('./registry'),
    action      = require('hudkit-action'),
    constants   = require('./constants'),
    theme       = require('./theme');

module.exports  = Instance;

var RESET_CSS   = "/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, img, ins, kbd, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed, \nfigure, figcaption, footer, header, hgroup, \nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, \nfooter, header, hgroup, menu, nav, section {\n\tdisplay: block;\n}\nbody {\n\tline-height: 1;\n}\nol, ul {\n\tlist-style: none;\n}\nblockquote, q {\n\tquotes: none;\n}\nblockquote:before, blockquote:after,\nq:before, q:after {\n\tcontent: '';\n\tcontent: none;\n}\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}",
    BASE_CSS    = ".hk-root-pane {\n\t-webkit-user-select: none;\n\tcursor: default;\n\tbackground: #101010;\n\tfont: 12px $HK_CONTROL_FONT;\n}\n\n.hk-root-pane a {\n\ttext-decoration: none;\n}\n\n.hk-root-pane * {\n\t-webkit-user-select: none;\n\tcursor: default;\n}\n";

function Instance(window) {

    this.window = window;
    this.document = window.document;
    
    this.appendCSS(RESET_CSS);
    this.appendCSS(BASE_CSS);

    registry.initializers.forEach(function(init) {
        init(this)
    }, this);

    this.root = this.rootPane();

    var body = this.document.body;
    body.className = 'hk';
    body.appendChild(this.root.getRoot());

}

Instance.prototype.action       = action;
Instance.prototype.constants    = constants;
Instance.prototype.k            = constants;
Instance.prototype.theme        = theme;

Instance.prototype.appendCSS = function(css) {

    css = css.replace(/\$(\w+)/g, function(m) {
        return theme.get(RegExp.$1);
    });

    return styleTag(this.document, css);

}
}).call(this,"/../lib")
},{"./constants":8,"./registry":10,"./theme":11,"fs":20,"hudkit-action":16,"style-tag":18}],6:[function(require,module,exports){
(function (__dirname){var ctx         = require('../core'),
    theme       = require('../theme'),
    k           = require('../constants'),
    BlockWidget = require('../BlockWidget'),
    trbl        = require('trbl');

var DEFAULT_PADDING         = 8,
    DEFAULT_TOOLBAR_HEIGHT  = 18;

var RootPane = module.exports = BlockWidget.extend(function(_sc, _sm) {

    return [

        function() {

            this._padding           = [DEFAULT_PADDING, DEFAULT_PADDING, DEFAULT_PADDING, DEFAULT_PADDING];
            this._toolbarHeight     = DEFAULT_TOOLBAR_HEIGHT;
            this._toolbarVisible    = true;
            this._toolbar           = null;
            this._rootWidget        = null;
            this._resizeDelay       = 500;

            _sc.apply(this, arguments);

            this._setupResizeHandler();

        },

        'methods', {

            dispose: function() {
                this.setToolbar(null);
                this.setRootWidget(null);
                _sm.dispose.call(this);
            },

            setPadding: function(padding) {
                this._padding = trbl(padding);
                this._layout();
            },

            setBackgroundColor: function(color) {
                this._root.style.backgroundColor = color;
            },

            setToolbarHeight: function(height) {

                if (height === this._toolbarHeight) {
                    return;
                }

                if (height === null) {
                    this._toolbarHeight = DEFAULT_TOOLBAR_HEIGHT;
                } else {
                    this._toolbarHeight = parseInt(height, 10);
                }

                this._layout();

            },

            setToolbar: function(widget) {

                if (widget === this._toolbar)
                    return;

                if (this._toolbar) {
                    this._removeChildViaElement(this._toolbar, this._root);
                    this._toolbar = null;
                }

                if (widget) {
                    this._toolbar = widget;
                    this._attachChildViaElement(this._toolbar, this._root);
                }

                this._layout();

            },

            showToolbar: function() {
                this._toolbarVisible = true;
                this._layout();
            },
            
            hideToolbar: function() {
                this._toolbarVisible = false;
                this._layout();
            },
            
            toggleToolbar: function() {
                this._toolbarVisible = !this._toolbarVisible;
                this._layout();
            },
            
            isToolbarVisible: function() {
                return this._toolbarVisible;
            },

            setRootWidget: function(widget) {

                if (widget === this._rootWidget)
                    return;

                if (this._rootWidget) {
                    this._removeChildViaElement(this._rootWidget, this._root);
                    this._rootWidget = null;
                }

                if (widget) {
                    this._rootWidget = widget;
                    this._attachChildViaElement(this._rootWidget, this._root);
                }

                this._layout();

            },

            setBounds: function(x, y, width, height) {
                /* no-op; root widget always fills its containing DOM element */
            },

            setResizeDelay: function(delay) {
                this._resizeDelay = parseInt(delay, 10);
            },

            _buildStructure: function() {
                this._root = this.document.createElement('div');
                this._root.className = 'hk-root-pane';
            },

            _layout: function() {
                
                var rect        = this._root.getBoundingClientRect(),
                    left        = this._padding[3],
                    top         = this._padding[0],
                    width       = rect.width - (this._padding[1] + this._padding[3]),
                    rootTop     = top,
                    rootHeight  = rect.height - (this._padding[0] + this._padding[2]);
                
                if (this._toolbar && this._toolbarVisible) {
                    
                    this._toolbar.setHidden(false);
                    this._toolbar.setBounds(left,
                                            top,
                                            width,
                                            this._toolbarHeight);
                    
                    var delta = this._toolbarHeight + theme.getInt('HK_TOOLBAR_MARGIN_BOTTOM');
                    rootTop += delta;
                    rootHeight -= delta;
                
                } else if (this._toolbar) {
                    this._toolbar.setHidden(true);
                }
                
                if (this._rootWidget) {
                    this._rootWidget.setBounds(left, rootTop, width, rootHeight);
                }
                
            },

            _setupResizeHandler: function() {

                var self    = this,
                    timeout = null;

                // FIXME: stash this registration for later unbinding
                // isn't this what basecamp is for?
                this.window.addEventListener('resize', function() {
                    if (self._resizeDelay <= 0) {
                        self._layout();    
                    } else {
                        if (timeout) {
                            self._clearTimeout(timeout);
                        }
                        timeout = self._setTimeout(function() {
                            self._layout();
                        }, self._resizeDelay);
                    }
                });

            }

        }

    ];

});

ctx.registerCSS(".hk-root-pane {\n\ttop: 0;\n\tleft: 0;\n\tright: 0;\n\tbottom: 0;\n\toverflow: hidden;\n\tbackground-color: $HK_ROOT_BG_COLOR;\n}");
ctx.registerWidget('RootPane', RootPane);}).call(this,"/../lib/RootPane")
},{"../BlockWidget":3,"../constants":8,"../core":9,"../theme":11,"trbl":19}],7:[function(require,module,exports){
(function (__dirname){var ctx     = require('../core'),
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

ctx.registerCSS(".hk-widget {\n\toverflow: hidden;\n\tbox-sizing: border-box;\n\t-moz-box-sizing: border-box;\n}\n");
ctx.registerWidget('Widget', Widget);}).call(this,"/../lib/Widget")
},{"../constants":8,"../core":9,"../theme":11,"classkit":12,"domutil":15,"signalkit":17}],8:[function(require,module,exports){
module.exports = {};
},{}],9:[function(require,module,exports){
var registry				= require('./registry'),
	theme 					= require('./theme'),
	constants 				= require('./constants'),
	Instance 				= require('./Instance');

exports.theme 				= theme;
exports.k 					= constants;

exports.defineConstant 		= defineConstant;
exports.defineConstants		= defineConstants;
exports.registerWidget		= registerWidget;
exports.registerInitializer	= registerInitializer;
exports.registerCSS 		= registerCSS;
exports.instance 			= instance;
exports.init 				= init;

function defineConstant(name, value) {
	Object.defineProperty(constants, name, {
		enumerable	: true,
		writable	: false,
		value		: value
	});
}

function defineConstants(ks) {
	for (var k in ks) {
		defineConstant(k, ks[k]);
	}
}

function registerWidget(name, ctor) {
	
	if (name in registry.widgets) {
		throw new Error("duplicate widget type: " + name);
	}

	if (name in exports) {
		throw new Error("widget name '" + name + "' clashes with hudkit exports");
	}

	registry.widgets[name] = exports[name] = ctor;

	var method = name[0].toLowerCase() + name.substring(1);

	Instance.prototype[method] = function(a, b, c, d, e, f, g, h) {
	    switch (arguments.length) {
	        case 0: return new ctor(this);
	        case 1: return new ctor(this, a);
	        case 2: return new ctor(this, a, b);
	        case 3: return new ctor(this, a, b, c);
	        case 4: return new ctor(this, a, b, c, d);
	        case 5: return new ctor(this, a, b, c, d, e);
	        case 6: return new ctor(this, a, b, c, d, e, f);
	        case 7: return new ctor(this, a, b, c, d, e, f, g);
	        case 8: return new ctor(this, a, b, c, d, e, f, g, h);
	        default: throw new Error("too many ctor arguments. sorry :(");
	    }
	}

}

function registerInitializer(cb) {
	registry.initializers.push(cb);
}

function registerCSS(css) {
	registerInitializer(function(instance) {
		instance.appendCSS(css);
	});
}

function instance(doc) {
	return new Instance(doc);
}

function init() {
	// no-op, backwards compatibility only
}
},{"./Instance":5,"./constants":8,"./registry":10,"./theme":11}],10:[function(require,module,exports){
exports.widgets 		= {};
exports.initializers	= [];
},{}],11:[function(require,module,exports){
// TODO: this is eventually to be handled by Unwise,
// with live updating when themes change.

var theme = {
    'HK_MONOSPACE_FONT'             : 'Menlo, Monaco, "Liberation Mono", monospace',
    'HK_TEXT_COLOR'                 : '#121729',

    'HK_CONTROL_FONT'               : 'Helvetica, sans-serif',
    'HK_CONTROL_FONT_SIZE'          : '10px',
    'HK_CONTROL_BORDER_COLOR'       : '#455366',
    'HK_CONTROL_ACTIVE_BG_COLOR'    : '#EAF20F',
    
    'HK_BUTTON_BG_COLOR'            : '#929DA8',

    'HK_ROOT_BG_COLOR'              : '#181E23',

    'HK_CONSOLE_FONT_SIZE'          : '13px',

    'HK_SPLIT_PANE_DIVIDER_SIZE'    : '8px',
    
    'HK_TAB_SPACING'                : '7px',
    'HK_TAB_PADDING'                : '7px',

    // control font size + 2 * tab padding
    'HK_TAB_HEIGHT'                 : '24px',
    'HK_TAB_BORDER_RADIUS'          : '5px',
    'HK_TAB_BACKGROUND_COLOR'       : '#67748C',

    // $HK_TAB_HEIGHT + $HK_TAB_SPACING
    'HK_TAB_CONTAINER_TOP'          : '31px',

    'HK_BLOCK_BORDER_RADIUS'        : '10px',

    'HK_TOOLBAR_ITEM_BORDER_COLOR'  : '#A6B5BB',

    'HK_TOOLBAR_V_PADDING'          : '3px',

    'HK_TOOLBAR_MARGIN_TOP'         : '8px',
    'HK_TOOLBAR_MARGIN_RIGHT'       : '8px',
    'HK_TOOLBAR_MARGIN_BOTTOM'      : '8px',
    'HK_TOOLBAR_MARGIN_LEFT'        : '8px',

    // Unused currently...
    'HK_DIALOG_PADDING'             : '6px',
    'HK_DIALOG_BORDER_RADIUS'       : '6px',
    'HK_DIALOG_HEADER_HEIGHT'       : '24px',
    'HK_DIALOG_TRANSITION_DURATION' : '200'
};

module.exports = {
    get: function(k) {
        return theme[k];
    },
    getInt: function(k) {
        return parseInt(theme[k], 10);
    }
};

},{}],12:[function(require,module,exports){
function Class() {};
  
Class.prototype.method = function(name) {
  var self = this, method = this[name];
  return function() { return method.apply(self, arguments); }
}

Class.prototype.lateBoundMethod = function(name) {
  var self = this;
  return function() { return self[name].apply(self, arguments); }
}

Class.extend = function(fn) {

  var features = fn ? fn(this, this.prototype) : [function() {}];
  
  var ctor = features[0];
  ctor.prototype = Object.create(this.prototype);
  
  ctor.extend = this.extend;
  ctor.Features = Object.create(this.Features);
    
  for (var i = 1; i < features.length; i += 2) {
    this.Features[features[i]](ctor, features[i+1]);
  }
  
  return ctor;
  
};

Class.Features = {
  methods: function(ctor, methods) {
    for (var methodName in methods) {
      ctor.prototype[methodName] = methods[methodName];
    }
  },
  properties: function(ctor, properties) {
    Object.defineProperties(ctor.prototype, properties);
  }
};

exports.Class = Class;

},{}],13:[function(require,module,exports){
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.toggleClass = toggleClass;

function hasClass(el, className) {
    return el.classList.contains(className);
}

function addClass(el, classes) {
    if (classes.indexOf(' ') >= 0) {
        classes.split(/\s+/).forEach(function(c) {
            el.classList.add(c);
        });
    } else {
        el.classList.add(classes);
    }
}

function removeClass(el, classes) {
    if (classes.indexOf(' ') >= 0) {
        classes.split(/\s+/).forEach(function(c) {
            el.classList.remove(c);
        });
    } else {
        el.classList.remove(classes);
    }
}

function toggleClass(el, classes) {
    if (classes.indexOf(' ') >= 0) {
        classes.split(/\s+/).forEach(function(c) {
            el.classList.toggle(c);
        });
    } else {
        el.classList.toggle(classes);
    }
}
},{}],14:[function(require,module,exports){
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.toggleClass = toggleClass;

// Constants from jQuery
var rclass = /[\t\r\n]/g;
var core_rnotwhite = /\S+/g;

// from jQuery
function hasClass(ele, className) {
    className = " " + className + " ";
    return (" " + ele.className + " ").replace(rclass, " ").indexOf(className) >= 0;
}

function addClass(ele, value) {
    var classes = (value || "").match(core_rnotwhite) || [],
            cur = ele.className ? (" " + ele.className + " ").replace(rclass, " ") : " ";

    if (cur) {
        var j = 0, clazz;
        while ((clazz = classes[j++])) {
            if (cur.indexOf(" " + clazz + " ") < 0) {
                cur += clazz + " ";
            }
        }
        ele.className = cur.trim();
    }
}

function removeClass(ele, value) {
    var classes = (value || "").match(core_rnotwhite) || [],
            cur = ele.className ? (" " + ele.className + " ").replace(rclass, " ") : " ";

    if (cur) {
        var j = 0, clazz;
        while ((clazz = classes[j++])) {
            while (cur.indexOf(" " + clazz + " ") >= 0) {
                cur = cur.replace(" " + clazz + " ", " ");
            }
            ele.className = value ? cur.trim() : "";
        }
    }
}

function toggleClass(ele, value) {
    var classes = (value || "").match(core_rnotwhite) || [],
            cur = ele.className ? (" " + ele.className + " ").replace(rclass, " ") : " ";

    if (cur) {
        var j = 0, clazz;
        while ((clazz = classes[j++])) {
            var removeCount = 0;
            while (cur.indexOf(" " + clazz + " ") >= 0) {
                cur = cur.replace(" " + clazz + " ", " ");
                removeCount++;
            }
            if (removeCount === 0) {
                cur += clazz + " ";
            }
            ele.className = cur.trim();
        }
    }
}
},{}],15:[function(require,module,exports){
var clazz;

if (typeof DOMTokenList !== 'undefined') {
    clazz = require('./impl/classes-classlist.js');
} else {
    clazz = require('./impl/classes-string.js');
}

module.exports = {
    hasClass: clazz.hasClass,
    addClass: clazz.addClass,
    removeClass: clazz.removeClass,
    toggleClass: clazz.toggleClass,

    viewportSize: function(doc) {
        return {
            width: doc.documentElement.clientWidth,
            height: doc.documentElement.clientHeight
        };
    },

    stop: function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    },

    setPosition: function(el, x, y) {
        el.style.left = x + 'px';
        el.style.top = y + 'px';
    },

    setSize: function(width, height) {
        el.style.width = width + 'px';
        el.style.height = height + 'px';
    },

    isElement: function(el) {
        return el && el.nodeType === 1;
    }
};
},{"./impl/classes-classlist.js":13,"./impl/classes-string.js":14}],16:[function(require,module,exports){
var signal = require('signalkit');

var ActionProto = Object.create(Function.prototype);

ActionProto.getTitle = function() { return this._title; };
ActionProto.setTitle = function(t) { this._title = ('' + t); this.onchange.emit(); };

ActionProto.isEnabled = function() { return this._enabled; };
ActionProto.toggleEnabled = function() { this.setEnabled(!this._enabled); };
ActionProto.enable = function() { this.setEnabled(true); };
ActionProto.disable = function() { this.setEnabled(false); };

ActionProto.setEnabled = function(en) {
    en = !!en;
    if (en != this._enabled) {
        this._enabled = en;
        this.onchange.emit();
    }
}

module.exports = function(fn, opts) {

    var actionFun = function() {
        if (actionFun._enabled) {
            return fn.apply(null, arguments);
        }
    }

    opts = opts || {};

    actionFun._title    = ('title' in opts) ? ('' + opts.title) : '';
    actionFun._enabled  = ('enabled' in opts) ? (!!opts.enabled) : true;
    actionFun.onchange  = signal('onchange');
    actionFun.__proto__ = ActionProto;

    return actionFun;

}

},{"signalkit":17}],17:[function(require,module,exports){
(function (process){//
// Helpers

if (typeof process !== 'undefined') {
    var nextTick = process.nextTick;
} else {
    var nextTick = function(fn) { setTimeout(fn, 0); }
}

function makeUnsubscriber(listeners, handlerFn) {
    var cancelled = false;
    return function() {
        if (cancelled) return;
        for (var i = listeners.length - 1; i >= 0; --i) {
            if (listeners[i] === handlerFn) {
                listeners.splice(i, 1);
                cancelled = true;
                break;
            }
        }
    }
}

//
// Signals

function Signal(name) {
    this.name = name;
    this._listeners = [];
}

Signal.prototype.onError = function(err) {
    nextTick(function() { throw err; });
}

Signal.prototype.emit = function() {
    for (var ls = this._listeners, i = ls.length - 1; i >= 0; --i) {
        try {
            ls[i].apply(null, arguments);
        } catch (err) {
            if (this.onError(err) === false) {
                break;
            }
        }
    }
}

Signal.prototype.connect = function(target, action) {
    if (target && action) {
        var handler = function() {
            target[action].apply(target, arguments);
        }
    } else if (typeof target === 'function') {
        var handler = target;
    } else {
        throw "signal connect expects either handler function or target/action pair";
    }
    this._listeners.push(handler);
    return makeUnsubscriber(this._listeners, handler);
}

Signal.prototype.clear = function() {
    this._listeners = [];
}

//
// Exports

module.exports = function(name) { return new Signal(name); }
module.exports.Signal = Signal;}).call(this,require("/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":21}],18:[function(require,module,exports){
// adapted from
// http://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript
module.exports = function(doc, initialCss) {
    
    if (typeof doc === 'string') {
        initialCss = doc;
        doc = null;
    }

    doc = doc || document;

    var head    = doc.getElementsByTagName('head')[0],
        style   = doc.createElement('style');

    style.type = 'text/css';
    head.appendChild(style);

    function set(css) {
        css = '' + (css || '');
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            while (style.childNodes.length) {
                style.removeChild(style.firstChild);
            }
            style.appendChild(doc.createTextNode(css));
        }
    }

    set(initialCss || '');

    set.el = style;
    set.destroy = function() {
        head.removeChild(style);
    }

    return set;

}
},{}],19:[function(require,module,exports){
// [a] => [a,a,a,a]
// [a,b] => [a,b,a,b]
// [a,b,c] => [a,b,c,b]
// [a,b,c,d] => [a,b,c,d]
// a => [(int)a, (int)a, (int)a, (int)a]
module.exports = function(thing) {
    if (Array.isArray(thing)) {
        switch (thing.length) {
            case 1:
                return [
                    parseInt(thing[0], 10),
                    parseInt(thing[0], 10),
                    parseInt(thing[0], 10),
                    parseInt(thing[0], 10)
                ];
            case 2:
                return [
                    parseInt(thing[0], 10),
                    parseInt(thing[1], 10),
                    parseInt(thing[0], 10),
                    parseInt(thing[1], 10)
                ];
            case 3:
                return [
                    parseInt(thing[0], 10),
                    parseInt(thing[1], 10),
                    parseInt(thing[2], 10),
                    parseInt(thing[1], 10)
                ];
            case 4:
                return [
                    parseInt(thing[0], 10),
                    parseInt(thing[1], 10),
                    parseInt(thing[2], 10),
                    parseInt(thing[3], 10)
                ];
            default:
                throw new Error("trbl - array must have 1-4 elements");
        }
    } else {
        var val = parseInt(thing);
        return [val, val, val, val];
    }
}
},{}],20:[function(require,module,exports){

},{}],21:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},[1])