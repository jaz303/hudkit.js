(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/jason/dev/projects/hudkit.js/demo/hk.js":[function(require,module,exports){
window.hkinit = function() {
	window.hudkit = require('../');
	window.hk = hudkit.instance(window);	
}

// window.propertyObject = require('hudkit-property-object');
},{"../":"/Users/jason/dev/projects/hudkit.js/index.js"}],"/Users/jason/dev/projects/hudkit.js/index.js":[function(require,module,exports){
module.exports = require('./lib/core');

require('./lib/Widget');
require('./lib/RootPane');
require('./lib/Box');
require('./lib/SplitPane');
require('./lib/MultiSplitPane');
require('./lib/Console');
require('./lib/Canvas2D');
require('./lib/Container');
require('./lib/Panel');
require('./lib/Button');
require('./lib/ButtonBar');
// require('./lib/TabPane');
require('./lib/Toolbar');
// require('./lib/StatusBar');
require('./lib/TreeView');
require('./lib/Knob');
// require('./lib/Select');
require('./lib/HorizontalSlider');
// require('./lib/PropertyEditor');
// require('./lib/Checkbox');
// require('./lib/TextField');
},{"./lib/Box":"/Users/jason/dev/projects/hudkit.js/lib/Box/index.js","./lib/Button":"/Users/jason/dev/projects/hudkit.js/lib/Button/index.js","./lib/ButtonBar":"/Users/jason/dev/projects/hudkit.js/lib/ButtonBar/index.js","./lib/Canvas2D":"/Users/jason/dev/projects/hudkit.js/lib/Canvas2D/index.js","./lib/Console":"/Users/jason/dev/projects/hudkit.js/lib/Console/index.js","./lib/Container":"/Users/jason/dev/projects/hudkit.js/lib/Container/index.js","./lib/HorizontalSlider":"/Users/jason/dev/projects/hudkit.js/lib/HorizontalSlider/index.js","./lib/Knob":"/Users/jason/dev/projects/hudkit.js/lib/Knob/index.js","./lib/MultiSplitPane":"/Users/jason/dev/projects/hudkit.js/lib/MultiSplitPane/index.js","./lib/Panel":"/Users/jason/dev/projects/hudkit.js/lib/Panel/index.js","./lib/RootPane":"/Users/jason/dev/projects/hudkit.js/lib/RootPane/index.js","./lib/SplitPane":"/Users/jason/dev/projects/hudkit.js/lib/SplitPane/index.js","./lib/Toolbar":"/Users/jason/dev/projects/hudkit.js/lib/Toolbar/index.js","./lib/TreeView":"/Users/jason/dev/projects/hudkit.js/lib/TreeView/index.js","./lib/Widget":"/Users/jason/dev/projects/hudkit.js/lib/Widget/index.js","./lib/core":"/Users/jason/dev/projects/hudkit.js/lib/core.js"}],"/Users/jason/dev/projects/hudkit.js/lib/Box/index.js":[function(require,module,exports){
var ctx     = require('../core'),
    Widget  = require('../Widget');

var d       = require('dom-build');

var Box = module.exports = Widget.extend(function(_super) {

    return [

        function(hk, color) {
            _super.constructor.call(this, hk);
            this.setBackgroundColor(color || 'white');
        },

        'methods', {
            
            setBackgroundColor: function(color) {
                this._root.style.backgroundColor = color;
            },

            _buildStructure: function() {
                return d('.hk-box');
            }

        }

    ];

});

ctx.registerWidget('Box', Box);
},{"../Widget":"/Users/jason/dev/projects/hudkit.js/lib/Widget/index.js","../core":"/Users/jason/dev/projects/hudkit.js/lib/core.js","dom-build":"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/index.js"}],"/Users/jason/dev/projects/hudkit.js/lib/Button/index.js":[function(require,module,exports){
var ctx         = require('../core');
var k           = require('../constants');
var Widget      = require('../Widget');

var du          = require('domutil');
var d           = require('dom-build');

ctx.registerWidget('Button', module.exports = Widget.extend(function(_super) {

    return [

        function(hk, type) {
            
            _super.constructor.call(this, hk);

            this._addSignal('onAction');

            this._enabled = true;
            this._title = "";

            this._buttonType = type || 'rounded';
            this._buttonClass = '';

            this._baseClass = this._root.className;
            this._updateClass();

        },

        'methods', {

            dispose: function() {
                this.setAction(null);
                _super.dispose.call(this);
            },

            //
            // Action

            bindAction: function(action) {

                var self = this;

                function sync() {
                    self.setTitle(action.getTitle());
                    self.setEnabled(action.isEnabled());
                }

                var unbindAction    = this.onAction.connect(action),
                    unbindSync      = action.onchange.connect(sync);

                sync();

                return function() {
                    unbindAction();
                    unbindSync();
                }

            },

            //
            // Enabled

            isEnabled: function() {
                return this._enabled;
            },

            setEnabled: function(enabled) {
                enabled = !!enabled;
                if (enabled !== this._enabled) {
                    this._enabled = enabled;
                    if (this._enabled) {
                        du.removeClass(this._root, 'disabled');
                    } else {
                        du.addClass(this._root, 'disabled');
                    }
                }
            },

            //
            // Title

            getTitle: function() {
                return this._title;
            },

            setTitle: function(title) {
                title = '' + title;
                if (title !== this._title) {
                    this._title = this._text.textContent = title;
                }
            },

            //
            // Type

            getButtonType: function() {
                return this._buttonType;
            },

            setButtonType: function(type) {
                this._buttonType = type;
                this._updateClass();
            },

            //
            // Class

            getButtonClass: function() {
                return this._buttonClass;
            },

            setButtonClass: function() {
                this._buttonClass = className || '';
                this._updateClass();
            },

            //
            //
            
            _buildStructure: function() {
                return d('a', {href: '#'}, d('span!text'));
            },

            _bindEvents: function() {

                var self = this;

                this._root.addEventListener('click', function(evt) {
                    
                    evt.preventDefault();
                    evt.stopPropagation();

                    if (self._enabled) {
                        self.onAction.emit(self);
                    }
                
                });

            },

            _updateClass: function() {

                var className = this._baseClass + ' hk-button-common';
                className += ' hk-' + this._buttonType + '-button';
                className += ' ' + this._buttonClass;

                if (!this._enabled) {
                    className += ' disabled';
                }

                this._root.className = className;

            }
        
        }

    ];

}));
},{"../Widget":"/Users/jason/dev/projects/hudkit.js/lib/Widget/index.js","../constants":"/Users/jason/dev/projects/hudkit.js/lib/constants.js","../core":"/Users/jason/dev/projects/hudkit.js/lib/core.js","dom-build":"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/index.js","domutil":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/index.js"}],"/Users/jason/dev/projects/hudkit.js/lib/ButtonBar/index.js":[function(require,module,exports){
var ctx     = require('../core'),
    k       = require('../constants'),
    Widget  = require('../Widget');

var d       = require('dom-build');

ctx.registerWidget('ButtonBar', module.exports = Widget.extend(function(_super) {

    return [

        function(hk) {
            _super.constructor.call(this, hk);
            this._buttons = [];
        },

        'methods', {
            addButton: function(button) {
                
                button.setButtonType('button-bar');
                
                this._attachChildViaElement(button, this._root);
                this._buttons.push(button);

                return this;
            
            },
            
            _buildStructure: function() {
                return d('.hk-button-bar');
            }
        }

    ];

}));
},{"../Widget":"/Users/jason/dev/projects/hudkit.js/lib/Widget/index.js","../constants":"/Users/jason/dev/projects/hudkit.js/lib/constants.js","../core":"/Users/jason/dev/projects/hudkit.js/lib/core.js","dom-build":"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/index.js"}],"/Users/jason/dev/projects/hudkit.js/lib/Canvas2D/index.js":[function(require,module,exports){
var ctx     = require('../core');
var k       = require('../constants');
var Widget  = require('../Widget');

var d       = require('dom-build');

ctx.registerWidget('Canvas2D', module.exports = Widget.extend(function(_super) {

    return [

        function(hk) {
            _super.constructor.call(this, hk);
            this._context = this._root.getContext('2d');
        },

        'methods', {
            getContext: function() {
                return this._context;
            },
            
            getCanvas: function() {
                return this._root;
            },

            layout: function() {
                var rect = this._root.getBoundingClientRect();
                this._root.width = rect.width;
                this._root.height = rect.height;
            },
            
            _buildStructure: function() {
                return d('canvas.hk-canvas.hk-canvas-2d', {tabindex: 0});
            }
        }

    ];

}));

},{"../Widget":"/Users/jason/dev/projects/hudkit.js/lib/Widget/index.js","../constants":"/Users/jason/dev/projects/hudkit.js/lib/constants.js","../core":"/Users/jason/dev/projects/hudkit.js/lib/core.js","dom-build":"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/index.js"}],"/Users/jason/dev/projects/hudkit.js/lib/Console/index.js":[function(require,module,exports){
var ctx         = require('../core');
var Widget      = require('../Widget');

var CommandBox  = require('command-box');
var d           = require('dom-build');

var Console = module.exports = Widget.extend(function(_super) {

    return [

        function(hk, color) {
            
            _super.constructor.call(this, hk);
        
            this._console = new CommandBox(this._root);

        },

        'delegate', {
            print           : '_console',
            printText       : '_console',
            printError      : '_console',
            printSuccess    : '_console',
            printHTML       : '_console',
            printObject     : '_console',
            setFormatter    : '_console',
            setEvaluator    : '_console',
            setPrompt       : '_console',
            echoOn          : '_console',
            echoOff         : '_console',
            setEcho         : '_console',
            notReady        : '_console',
            ready           : '_console',
            focus           : '_console',
            clearCommand    : '_console',
            newCommand      : '_console'
        },

        'methods', {

            _buildStructure: function() {
                return d('.hk-console');
            }

        }

    ];

});

ctx.registerWidget('Console', Console);
},{"../Widget":"/Users/jason/dev/projects/hudkit.js/lib/Widget/index.js","../core":"/Users/jason/dev/projects/hudkit.js/lib/core.js","command-box":"/Users/jason/dev/projects/hudkit.js/node_modules/command-box/index.js","dom-build":"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/index.js"}],"/Users/jason/dev/projects/hudkit.js/lib/Container/index.js":[function(require,module,exports){
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
},{"../Widget":"/Users/jason/dev/projects/hudkit.js/lib/Widget/index.js","../constants":"/Users/jason/dev/projects/hudkit.js/lib/constants.js","../core":"/Users/jason/dev/projects/hudkit.js/lib/core.js"}],"/Users/jason/dev/projects/hudkit.js/lib/HorizontalSlider/index.js":[function(require,module,exports){
var ctx         = require('../core'),
    k           = require('../constants'),
    Widget      = require('../Widget');

var du          = require('domutil'),
    rattrap     = require('rattrap'),
    d           = require('dom-build');

ctx.registerWidget('HorizontalSlider', module.exports = Widget.extend(function(_super) {

    return [

        function(hk) {

            _super.constructor.call(this, hk);

            this._minValue = 0;
            this._maxValue = 100;
            this._caption = '';

            var self = this;
            this._addProperty('value', 50, function(set, v, oldValue) {

                if (v < self._minValue) v = self._minValue;
                if (v > self._maxValue) v = self._maxValue;

                if (v === oldValue) {
                    return;
                }

                set(v);
                self._redraw(v);

            });
            
            this._bind();
            this._redraw(this.value.get());

        },

        'methods', {

            setMinValue: function(min) {
                this._minValue = min;
                if (this.value.get() < min) {
                    this.value.set(min);
                } else {
                    this._redraw(this.value.get());    
                }
            },

            setMaxValue: function(max) {
                this._maxValue = max;
                if (this.value.get() > max) {
                    this.value.set(max);
                } else {
                    this._redraw(this.value.get());    
                }
            },

            dispose: function() {
                _sm.dispose.call(this);
            },

            getCaption: function() {
                return this._caption;
            },

            setCaption: function(c) {
                c = '' + c;
                if (c === this._caption) {
                    return;
                }
                this._caption = c;
                this._updateCaption(this._caption);
            },

            _setValue: function(v) {

                if (v < this._minValue) v = this._minValue;
                if (v > this._maxValue) v = this._maxValue;

                v = Math.floor(v);

                if (v === this._value) {
                    return false;
                }

                this._value = v;

                this._update();

                return true;

            },
            
            _buildStructure: function() {
                return d('.hk-horizontal-slider',
                    d('.fill!fill'),
                    d('.caption!captionEl')
                );
            },

            _bind: function() {

                var self = this;

                this._root.addEventListener('mousedown', function(evt) {

                    var rect = self._root.getBoundingClientRect();

                    function updateFromEvent(evt) {
                        
                        var offset = evt.pageX - rect.left;
                        
                        if (offset < 0) offset = 0;
                        if (offset > rect.width) offset = rect.width;

                        self.value.set(self._offsetToValue(rect, offset));
                        
                    }
                    
                    var stopCapture = rattrap.startCapture(document, {
                        cursor: 'col-resize',
                        mousemove: function(evt) {
                            updateFromEvent(evt);
                            self._updateCaption(self.value.get());
                        },
                        mouseup: function(evt) {
                            stopCapture();
                            updateFromEvent(evt);
                            self._updateCaption(self._caption);
                        }
                    });
                
                });

            },

            _redraw: function(value) {
                var percentage = ((value - this._minValue) / (this._maxValue - this._minValue)) * 100;
                this._fill.style.width = percentage + '%';
            },

            _updateCaption: function(caption) {
                this._captionEl.textContent = caption;
            },

            _offsetToValue: function(rect, offset) {
                return this._minValue + ((offset / rect.width) * (this._maxValue - this._minValue));
            }

            // _applySizeHints: function() {
            //     this._applyHintedProperty(this._root, 'width');
            //     this._applyHintedProperty(this._root, 'height');
            // }
        
        }

    ];

}));

},{"../Widget":"/Users/jason/dev/projects/hudkit.js/lib/Widget/index.js","../constants":"/Users/jason/dev/projects/hudkit.js/lib/constants.js","../core":"/Users/jason/dev/projects/hudkit.js/lib/core.js","dom-build":"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/index.js","domutil":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/index.js","rattrap":"/Users/jason/dev/projects/hudkit.js/node_modules/rattrap/index.js"}],"/Users/jason/dev/projects/hudkit.js/lib/Instance.js":[function(require,module,exports){
var registry    = require('./registry');
var constants   = require('./constants');

var action      = require('hudkit-action');

module.exports  = Instance;

function Instance(window) {

    this.window = window;
    this.document = window.document;

    registry.initializers.forEach(function(init) {
        init(this)
    }, this);

    var body = this.document.body;
    body.className = 'hk';

    this.root = this.rootPane();
    this.root.attachAsRootComponent(body);

}

Instance.prototype.action       = action;
Instance.prototype.constants    = constants;
Instance.prototype.k            = constants;

},{"./constants":"/Users/jason/dev/projects/hudkit.js/lib/constants.js","./registry":"/Users/jason/dev/projects/hudkit.js/lib/registry.js","hudkit-action":"/Users/jason/dev/projects/hudkit.js/node_modules/hudkit-action/index.js"}],"/Users/jason/dev/projects/hudkit.js/lib/Knob/index.js":[function(require,module,exports){
var ctx         = require('../core'),
    k           = require('../constants'),
    Widget      = require('../Widget');

var du          = require('domutil'),
    d           = require('dom-build'),
    rattrap     = require('rattrap');

var DEFAULT_SIZE    = 18,
    GAP_SIZE        = Math.PI / 6,
    RANGE           = (Math.PI * 2) - (2 * GAP_SIZE),
    START_ANGLE     = Math.PI / 2 + GAP_SIZE,
    END_ANGLE       = Math.PI / 2 - GAP_SIZE;

ctx.registerWidget('Knob', module.exports = Widget.extend(function(_super) {

    return [

        function(hk) {

            this._size = DEFAULT_SIZE;

            _super.constructor.call(this, hk);

            this._minValue = 0;
            this._maxValue = 100;
            this._dragDirection = k.HORIZONTAL;
            this._ctx = this._root.getContext('2d');

            var self = this;
            this._addProperty('value', 0, function(set, v, oldValue) {
                
                if (v < self._minValue) v = self._minValue;
                if (v > self._maxValue) v = self._maxValue;

                if (v === oldValue) {
                    return;
                }

                set(v);
                self._redraw(v);
            
            })
            
            this._bind();
            this._redraw(this.value.get());

        },

        'methods', {

            setMinValue: function(min) {
                this._minValue = min;
                if (this.value.get() < min) {
                    this.value.set(min);
                } else {
                    this._redraw(this.value.get());    
                }
            },

            setMaxValue: function(max) {
                this._maxValue = max;
                if (this.value.get() > max) {
                    this.value.set(max);
                } else {
                    this._redraw(this.value.get());    
                }
            },

            dispose: function() {
                _sm.dispose.call(this);
            },
            
            _buildStructure: function() {
                return d('canvas.hk-knob', {width: this._size, height: this._size});
            },

            _bind: function() {

                var self = this;

                this._root.addEventListener('mousedown', function(evt) {

                    var startX      = evt.pageX,
                        startY      = evt.pageY;
                        startV      = self.value.get(),
                        horizontal  = (self._dragDirection === k.HORIZONTAL);

                    var stopCapture = rattrap.startCapture(document, {
                        cursor: horizontal ? 'col-resize' : 'row-resize',
                        mousemove: function(evt) {

                            var delta;
                            if (horizontal) {
                                delta = evt.pageX - startX;
                            } else {
                                delta = startY - evt.pageY;
                            }

                            self.value.set(startV + delta);
                        
                        },
                        mouseup: function(evt) {
                            stopCapture();
                        }
                    });
                
                });

            },

            _redraw: function(value) {

                var ctx         = this._ctx,
                    filledRatio = (value - this._minValue) / (this._maxValue - this._minValue),
                    fillAngle   = START_ANGLE + (filledRatio * RANGE),
                    cx          = this._size / 2,
                    cy          = this._size / 2;
                    radius      = Math.min(cx, cy) - 3;
                
                ctx.clearRect(0, 0, this._size, this._size);
                ctx.lineWidth = 2;
                
                ctx.strokeStyle = '#EF701E';
                ctx.beginPath();
                ctx.arc(cx, cy, radius, START_ANGLE, fillAngle, false);
                ctx.stroke();
                
                ctx.strokeStyle = '#1D222F';
                ctx.beginPath();
                ctx.arc(cx, cy, radius, END_ANGLE, fillAngle, true);
                ctx.lineTo(cx, cy);
                ctx.stroke();

            }

            // _applySizeHints: function() {

            //     var requestedWidth = this._getHintedProperty('width'),
            //         requestedHeight = this._getHintedProperty('height');

            //     if (requestedWidth === null && requestedHeight === null) {
            //         this._size = DEFAULT_SIZE;
            //     } else if (requestedWidth === null) {
            //         this._size = requestedHeight;
            //     } else if (requestedHeight === null) {
            //         this._size = requestedWidth;
            //     } else {
            //         this._size = Math.min(requestedWidth, requestedHeight);
            //     }

            //     this._root.width = this._size;
            //     this._root.height = this._size;

            //     this._update();

            // }
        
        }

    ];

}));
},{"../Widget":"/Users/jason/dev/projects/hudkit.js/lib/Widget/index.js","../constants":"/Users/jason/dev/projects/hudkit.js/lib/constants.js","../core":"/Users/jason/dev/projects/hudkit.js/lib/core.js","dom-build":"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/index.js","domutil":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/index.js","rattrap":"/Users/jason/dev/projects/hudkit.js/node_modules/rattrap/index.js"}],"/Users/jason/dev/projects/hudkit.js/lib/MultiSplitPane/index.js":[function(require,module,exports){
var ctx         = require('../core'),
    k           = require('../constants'),
    Widget      = require('../Widget');

var du          = require('domutil'),
    rattrap     = require('rattrap'),
    d           = require('dom-build');

var DIVIDER_SIZE = 8;

function unstyle(widget) {
    var s = widget.getRoot().style;
    s.top = s.left = s.width = s.height = '';
}

ctx.registerWidget('MultiSplitPane', module.exports = Widget.extend(function(_super) {

    return [

        function(hk) {

            this._orientation   = k.SPLIT_PANE_HORIZONTAL;
            this._widgets       = [null];
            this._splits        = [];

            this._addSignal('onPaneResize');
            
            _super.constructor.call(this, hk);

            this._bind();

        },

        'methods', {

            dispose: function() {
                this._widgets.forEach(function(w) {
                    if (w) {
                        self._removeChildViaElement(w, this._root);
                    }
                }, this);
                _sm.dispose.call(this);
            },
            
            setOrientation: function(orientation) {
                
                this._orientation = orientation;
                
                du.removeClass(this._root, 'horizontal vertical');
                du.addClass(this._root, this._orientation === k.SPLIT_PANE_HORIZONTAL ? 'horizontal' : 'vertical');
                
                this.layout();
            
            },

            setPaneSizes: function(sizes) {

                var requested = 0,
                    fill = 0;

                if (sizes.length !== this._widgets.length) {
                    throw new Error("length of size array must equal number of widgets in split pane");
                }

                for (var i = 0; i < sizes.length; ++i) {
                    if (sizes[i] === null) {
                        fill++;
                    } else {
                        requested += sizes[i];
                    }
                }

                var availableWidth = this.width - (this._splits.length * DIVIDER_SIZE),
                    remainingWidth = availableWidth - requested;

                // wimp out if we can't fill exactly.
                // TODO: should probably try a best-effort thing
                if (fill === 0 && remainingWidth !== 0) {
                    return;
                } else if (fill > 0 && remainingWidth <= 0) {
                    return;
                }

                var last = 0;
                for (var i = 0; i < sizes.length - 1; ++i) {
                    var s = (sizes[i] === null) ? (remainingWidth / fill) : sizes[i],
                        r = last + (s / availableWidth)
                    this._splits[i].ratio = r;
                    last = r;
                }

                this.layout();

            },

            addSplit: function(ratio, widget) {

                if (ratio < 0 || ratio > 1) {
                    throw new Error("ratio must be between 0 and 1");
                }

                var div = document.createElement('div');
                div.className = 'hk-split-pane-divider';
                this._root.appendChild(div);

                var newSplit = {divider: div, ratio: ratio};
                var addedIx = -1;

                for (var i = 0; i < this._splits.length; ++i) {
                    var split = this._splits[i];
                    if (ratio < split.ratio) {
                        this._widgets.splice(i, 0, null);
                        this._splits.splice(i, 0, newSplit);
                        addedIx = i;
                        break;
                    }
                }

                if (addedIx == -1) {
                    this._widgets.push(null);
                    this._splits.push(newSplit);
                    addedIx = this._widgets.length - 1;
                }

                if (widget) {
                    this.setWidgetAtIndex(addedIx, widget);
                }

                this.layout();

            },

            removeWidgetAtIndex: function(ix) {

                if (ix < 0 || ix >= this._widgets.length) {
                    throw new RangeError("invalid widget index");
                }

                if (this._widgets.length === 1) {
                    this.setWidgetAtIndex(0, null);
                    return;
                }

                var widget = this._widgets[ix];
                if (widget) {
                    this._removeChildViaElement(widget, this._root);    
                    unstyle(widget);
                }

                this._widgets.splice(ix, 1);

                var victimSplit = (ix === this._widgets.length) ? (ix - 1) : ix;
                this._root.removeChild(this._splits[victimSplit].divider);
                this._splits.splice(victimSplit, 1);
                
                this.layout();

                return widget;
                
            },

            getWidgetAtIndex: function(ix) {

                if (ix < 0 || ix >= this._widgets.length) {
                    throw new RangeError("invalid widget index");
                }

                return this._widgets[ix];

            },

            setWidgetAtIndex: function(ix, widget) {

                if (ix < 0 || ix >= this._widgets.length) {
                    throw new RangeError("invalid widget index");
                }

                var existingWidget = this._widgets[ix];
                
                if (widget !== existingWidget) {
                    if (existingWidget) {
                        this._removeChildViaElement(existingWidget, this._root);
                        this._widgets[ix] = null;
                    }

                    if (widget) {
                        this._widgets[ix] = widget;
                        this._attachChildViaElement(widget, this._root);
                    }

                    this.layout();
                }
                    
                return existingWidget;

            },
            
            _buildStructure: function() {

                var ui = d('.hk-split-pane');

                this._ghost = d('.hk-split-pane-divider.hk-split-pane-ghost').root;

                du.addClass(ui.root, this._orientation === k.SPLIT_PANE_HORIZONTAL ? 'horizontal' : 'vertical');

                return ui;
            
            },
            
            layout: function() {

                var rect        = this._root.getBoundingClientRect(),
                    width       = rect.width,
                    height      = rect.height,
                    horizontal  = this._orientation === k.SPLIT_PANE_HORIZONTAL,
                    widgets     = this._widgets,
                    splits      = this._splits,
                    totalSpace  = (horizontal ? height : width) - (splits.length * DIVIDER_SIZE),
                    pos         = 0,
                    root        = this._root;

                function setBounds(widget, x, y, w, h) {
                    du.setRect(widget.getRoot(), x, y, w, h);
                }

                if (totalSpace < 0) {

                    // TODO: handle

                } else {

                    var lastRatio = 0;
                    
                    for (var i = 0; i < splits.length; ++i) {
                        
                        var ratio   = splits[i].ratio,
                            divider = splits[i].divider,
                            widget  = widgets[i];

                        if (horizontal) {
                            
                            var paneHeight = Math.floor(totalSpace * (ratio - lastRatio));

                            if (widget) {
                                setBounds(widget, 0, pos, width, paneHeight);    
                            }
                            
                            divider.style.top = (pos + paneHeight) + 'px';
                            pos += paneHeight + DIVIDER_SIZE;
                            
                        } else {
                            
                            var paneWidth = Math.floor(totalSpace * (ratio - lastRatio));

                            if (widget) {
                                setBounds(widget, pos, 0, paneWidth, height);    
                            }
                                   
                            divider.style.left = (pos + paneWidth) + 'px';
                            pos += paneWidth + DIVIDER_SIZE;
                            
                        }
                        
                        lastRatio = ratio;
                        
                    }

                    var lastWidget = widgets[widgets.length-1];
                    if (lastWidget) {
                        if (horizontal) {
                            setBounds(lastWidget, 0, pos, width, height - pos);
                        } else {
                            setBounds(lastWidget, pos, 0, width - pos, height);
                        }    
                    }

                }
            
            },
            
            _bind: function() {

                var self = this;
                this._root.addEventListener('mousedown', function(evt) {

                    var horizontal = self._orientation === k.SPLIT_PANE_HORIZONTAL;

                    if (evt.target.className === 'hk-split-pane-divider') {

                        evt.stopPropagation();

                        var splitIx;
                        for (var i = 0; i < self._splits.length; ++i) {
                            if (self._splits[i].divider === evt.target) {
                                splitIx = i;
                                break;
                            }
                        }
                        
                        var min, max;

                        if (splitIx === 0) {
                            min = 0;
                        } else {
                            min = parseInt(self._splits[splitIx-1].divider.style[horizontal ? 'top' : 'left'], 10) + DIVIDER_SIZE;
                        }
                        
                        if (splitIx === self._splits.length - 1) {
                            max = parseInt(self[horizontal ? 'height' : 'width']) - DIVIDER_SIZE;
                        } else {
                            max = parseInt(self._splits[splitIx+1].divider.style[horizontal ? 'top' : 'left'], 10) - DIVIDER_SIZE;
                        }

                        var spx       = evt.pageX,
                            spy       = evt.pageY,
                            sx        = parseInt(evt.target.style.left),
                            sy        = parseInt(evt.target.style.top),
                            lastValid = (horizontal ? sy : sx);

                        function updateGhost() {
                            self._ghost.style[horizontal ? 'top' : 'left'] = lastValid + 'px';
                        }
                        
                        self._root.appendChild(self._ghost);
                        updateGhost();

                        var stopCapture = rattrap.startCapture(document, {
                            cursor: (self._orientation === k.SPLIT_PANE_VERTICAL) ? 'col-resize' : 'row-resize',
                            mousemove: function(evt) {
                                if (horizontal) {
                                    var dy = evt.pageY - spy,
                                        y = sy + dy;
                                    if (y < min) y = min;
                                    if (y > max) y = max;
                                    lastValid = y;
                                } else {
                                    var dx = evt.pageX - spx,
                                        x = sx + dx;
                                    if (x < min) x = min;
                                    if (x > max) x = max;
                                    lastValid = x;
                                }
                                updateGhost();
                            },
                            mouseup: function() {
                                stopCapture();
                                self._root.removeChild(self._ghost);
                                
                                var p = (lastValid - min) / (max - min);
                                if (isNaN(p)) p = 0;

                                var minSplit = (splitIx === 0) ? 0 : self._splits[splitIx-1].ratio,
                                    maxSplit = (splitIx === self._splits.length-1) ? 1 : self._splits[splitIx+1].ratio;

                                self._splits[splitIx].ratio = minSplit + (maxSplit - minSplit) * p;

                                self.layout();

                                self.onPaneResize.emit(self);
                            }
                        });

                    }
                
                });
            
            }
        
        }
    
    ];

}));
},{"../Widget":"/Users/jason/dev/projects/hudkit.js/lib/Widget/index.js","../constants":"/Users/jason/dev/projects/hudkit.js/lib/constants.js","../core":"/Users/jason/dev/projects/hudkit.js/lib/core.js","dom-build":"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/index.js","domutil":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/index.js","rattrap":"/Users/jason/dev/projects/hudkit.js/node_modules/rattrap/index.js"}],"/Users/jason/dev/projects/hudkit.js/lib/Panel/index.js":[function(require,module,exports){
var ctx         = require('../core'),
    k           = require('../constants'),
    Container   = require('../Container');

var d 			= require('dom-build');

ctx.registerWidget('Panel', module.exports = Container.extend(function(_super) {

	return [

	    function(hk) {
	        _super.constructor.call(this, hk);
	    },

	    'methods', {
	        _buildStructure: function() {
	        	return d('.hk-panel');
	        }
	    }

	]

}));
},{"../Container":"/Users/jason/dev/projects/hudkit.js/lib/Container/index.js","../constants":"/Users/jason/dev/projects/hudkit.js/lib/constants.js","../core":"/Users/jason/dev/projects/hudkit.js/lib/core.js","dom-build":"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/index.js"}],"/Users/jason/dev/projects/hudkit.js/lib/RootPane/index.js":[function(require,module,exports){
var ctx     = require('../core');
var Widget  = require('../Widget');

var d       = require('dom-build');
var du      = require('domutil');

function style(el) {
    el.style.width = '100%';
    el.style.height = '100%';
}

function unstyle(el) {
    el.style.width = '';
    el.style.height = '';
}

var RootPane = module.exports = Widget.extend(function(_sc, _sm) {

    return [

        function() {

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

            setBackgroundColor: function(color) {
                this._root.style.backgroundColor = color;
            },

            setToolbar: function(widget) {

                if (widget === this._toolbar)
                    return;

                if (this._toolbar) {
                    this._removeChildViaElement(this._toolbar, this._toolbarWrapper);
                    unstyle(this._toolbar.getRoot());
                    this._toolbar = null;
                }

                if (widget) {
                    this._toolbar = widget;
                    style(this._toolbar.getRoot());
                    this._attachChildViaElement(this._toolbar, this._toolbarWrapper);
                }

                this.layout();

            },

            showToolbar: function() {
                this._toolbarVisible = true;
                this.layout();
            },
            
            hideToolbar: function() {
                this._toolbarVisible = false;
                this.layout();
            },
            
            toggleToolbar: function() {
                this._toolbarVisible = !this._toolbarVisible;
                this.layout();
            },
            
            isToolbarVisible: function() {
                return this._toolbarVisible;
            },

            setRootWidget: function(widget) {

                if (widget === this._rootWidget)
                    return;

                if (this._rootWidget) {
                    this._removeChildViaElement(this._rootWidget, this._rootWrapper);
                    unstyle(this._rootWidget.getRoot());
                    this._rootWidget = null;
                }

                if (widget) {
                    this._rootWidget = widget;
                    style(this._rootWidget.getRoot());
                    this._attachChildViaElement(this._rootWidget, this._rootWrapper);
                }

                this.layout();

            },

            setResizeDelay: function(delay) {
                this._resizeDelay = parseInt(delay, 10);
            },

            layout: function() {

                if (this._toolbar && this._toolbarVisible) {
                    du.removeClass(this.getRoot(), 'toolbar-hidden');
                    this._toolbar.show();
                } else {
                    du.addClass(this.getRoot(), 'toolbar-hidden');
                    if (this._toolbar) {
                        this._toolbar.hide();    
                    }
                }

                this._layoutChildren();

            },

            _buildStructure: function() {
                return d('.hk-root-pane',
                    d('.toolbar-wrapper!toolbarWrapper'),
                    d('.root-wrapper!rootWrapper')
                );
            },

            _layoutChildren: function() {

                if (this._toolbar && this._toolbarVisible) {
                    this._toolbar.layout();
                }

                if (this._rootWidget) {
                    this._rootWidget.layout();
                }

            },

            _setupResizeHandler: function() {

                var self    = this,
                    timeout = null;

                window.addEventListener('resize', function() {
                    if (self._resizeDelay <= 0) {
                        self._layoutChildren();    
                    } else {
                        if (timeout) {
                            clearTimeout(timeout);
                        }
                        timeout = setTimeout(function() {
                            self._layoutChildren();
                        }, self._resizeDelay);
                    }
                });

            }

        }

    ];

});

ctx.registerWidget('RootPane', RootPane);
},{"../Widget":"/Users/jason/dev/projects/hudkit.js/lib/Widget/index.js","../core":"/Users/jason/dev/projects/hudkit.js/lib/core.js","dom-build":"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/index.js","domutil":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/index.js"}],"/Users/jason/dev/projects/hudkit.js/lib/SplitPane/index.js":[function(require,module,exports){
var ctx         = require('../core');
var k           = require('../constants');
var Widget      = require('../Widget');

var du      	= require('domutil');
var d           = require('dom-build');
var rattrap 	= require('rattrap');

var SPLIT_PANE_HORIZONTAL   = 'h';
var SPLIT_PANE_VERTICAL     = 'v';

ctx.defineConstants({
    SPLIT_PANE_HORIZONTAL   : SPLIT_PANE_HORIZONTAL,
    SPLIT_PANE_VERTICAL     : SPLIT_PANE_VERTICAL
});

// TODO: extract this from theme somehow
var HK_SPLIT_PANE_DIVIDER_SIZE = 8;

//
// Widget

ctx.registerWidget('SplitPane', module.exports = Widget.extend(function(_super) {

    return [

        function(hk) {

            this._widgets       = [null, null];
            this._hiddenWidgets = [false, false];
            this._split         = 0.5;
            this._orientation   = SPLIT_PANE_HORIZONTAL;
            
            _super.constructor.call(this, hk);

            this._bind();

        },

        'methods', {

            dispose: function() {
                this.setWidgetAtIndex(0, null);
                this.setWidgetAtIndex(1, null);
                _super.dispose.call(this);
            },
            
            setOrientation: function(orientation) {

                if (orientation !== SPLIT_PANE_HORIZONTAL && orientation !== SPLIT_PANE_VERTICAL) {
                    throw new Error("invalid orientation: " + orientation);
                }
                
                this._orientation = orientation;
                
                du.removeClass(this._root, 'horizontal vertical');
                du.addClass(this._root, this._orientation === SPLIT_PANE_HORIZONTAL ? 'horizontal' : 'vertical');
                
                this.layout();
            
            },

            getSplit: function() {
                return this._split;
            },
            
            setSplit: function(split) {
                if (split < 0) split = 0;
                if (split > 1) split = 1;
                this._split = split;
                this.layout();
            },
            
            setLeftWidget       : function(widget) { this.setWidgetAtIndex(0, widget); },
            setTopWidget        : function(widget) { this.setWidgetAtIndex(0, widget); },
            setRightWidget      : function(widget) { this.setWidgetAtIndex(1, widget); },
            setBottomWidget     : function(widget) { this.setWidgetAtIndex(1, widget); },

            hideWidgetAtIndex: function(ix) {
                this._hiddenWidgets[ix] = true;
                this.layout();
            },

            showWidgetAtIndex: function(ix) {
                this._hiddenWidgets[ix] = false;
                this.layout();
            },

            toggleWidgetAtIndex: function(ix) {
                this._hiddenWidgets[ix] = !this._hiddenWidgets[ix];
                this.layout();
            },
            
            setWidgetAtIndex: function(ix, widget) {
                
                var existingWidget = this._widgets[ix];
                
                if (widget !== existingWidget) {
                    if (existingWidget) {
                        this._removeChildViaElement(existingWidget, this._root);
                        this._widgets[ix] = null;
                    }

                    if (widget) {
                        this._widgets[ix] = widget;
                        this._attachChildViaElement(widget, this._root);
                    }

                    this.layout();
                }
                    
                return existingWidget;
                
            },
            
            _buildStructure: function() {

                var ui = d('.hk-split-pane',
                    d('.hk-split-pane-divider!divider')
                );

                this._ghost = d('.hk-split-pane-divider.hk-split-pane-ghost').root;

                du.addClass(ui.root, this._orientation === SPLIT_PANE_HORIZONTAL ? 'horizontal' : 'vertical');

                return ui;
            
            },
            
            layout: function() {

                var dividerSize = HK_SPLIT_PANE_DIVIDER_SIZE;

                var hw = this._hiddenWidgets,
                    ws = this._widgets;

                var rect = this._root.getBoundingClientRect();

                function setBounds(widget, x, y, width, height) {
                    du.setRect(widget.getRoot(), x, y, width, height);
                }

                if (ws[0]) ws[0].setHidden(hw[0]);
                if (ws[1]) ws[1].setHidden(hw[1]);

                if (hw[0] || hw[1]) {
                    this._divider.style.display = 'none';
                    if (!hw[0] && ws[0]) {
                        setBounds(ws[0], 0, 0, rect.width, rect.height);
                    } else if (!hw[1] && ws[1]) {
                        setBounds(ws[1], 0, 0, rect.width, rect.height);
                    }
                } else {

                    this._divider.style.display = 'block';

                    if (this._orientation === SPLIT_PANE_HORIZONTAL) {
                        
                        var divt  = Math.floor(this._split * (rect.height - dividerSize)),
                            w2t   = divt + dividerSize,
                            w2h   = rect.height - w2t;
                        
                        this._divider.style.left = '';
                        this._divider.style.top = divt + 'px';
                        
                        if (ws[0]) setBounds(ws[0], 0, 0, rect.width, divt);
                        if (ws[1]) setBounds(ws[1], 0, w2t, rect.width, w2h);
                    
                    } else if (this._orientation === SPLIT_PANE_VERTICAL) {
                        
                        var divl  = Math.floor(this._split * (rect.width - dividerSize)),
                            w2l   = divl + dividerSize,
                            w2w   = rect.width - w2l;
                            
                        this._divider.style.left = divl + 'px';
                        this._divider.style.top = '';
                        
                        if (ws[0]) setBounds(ws[0], 0, 0, divl, rect.height);
                        if (ws[1]) setBounds(ws[1], w2l, 0, w2w, rect.height);
                        
                    }
                
                }

                if (ws[0] && !hw[0]) ws[0].layout();
                if (ws[1] && !hw[1]) ws[1].layout();

            },
            
            _bind: function() {
                
                var self = this;
                
                this._divider.addEventListener('mousedown', function(evt) {

                    var dividerSize     = HK_SPLIT_PANE_DIVIDER_SIZE;
                    
                    var rootPos         = self._root.getBoundingClientRect(),
                        lastValidSplit  = self._split;

                    if ('offsetX' in evt) {
                    	var offsetX = evt.offsetX,
                    		offsetY = evt.offsetY;
                    } else {
                    	var offsetX = evt.layerX,
                    		offsetY = evt.layerY;
                    }

                    function moveGhost() {
                        if (self._orientation === SPLIT_PANE_VERTICAL) {
                            self._ghost.style.left = Math.floor(lastValidSplit * (rootPos.width - dividerSize)) + 'px';
                            self._ghost.style.top = '';
                        } else if (self._orientation === SPLIT_PANE_HORIZONTAL) {
                            self._ghost.style.left = '';
                            self._ghost.style.top = Math.floor(lastValidSplit * (rootPos.height - dividerSize)) + 'px';
                        }
                    }
                            
                    self._root.appendChild(self._ghost);
                    moveGhost();
                    
                    var stopCapture = rattrap.startCapture(document, {
                        cursor: (self._orientation === SPLIT_PANE_VERTICAL) ? 'col-resize' : 'row-resize',
                        mousemove: function(evt) {
                            if (self._orientation === SPLIT_PANE_VERTICAL) {
                                var left    = evt.pageX - offsetX,
                                    leftMin = (rootPos.left),
                                    leftMax = (rootPos.right - dividerSize);
                                if (left < leftMin) left = leftMin;
                                if (left > leftMax) left = leftMax;
                                
                                lastValidSplit = (left - leftMin) / (rootPos.width - dividerSize);
                                moveGhost();
                            } else {
                                var top     = evt.pageY - offsetY,
                                    topMin  = (rootPos.top),
                                    topMax  = (rootPos.bottom - dividerSize);
                                if (top < topMin) top = topMin;
                                if (top > topMax) top = topMax;

                                lastValidSplit = (top - topMin) / (rootPos.height - dividerSize);
                                moveGhost();
                            }
                        },
                        mouseup: function() {
                            stopCapture();
                            self._root.removeChild(self._ghost);
                            self.setSplit(lastValidSplit);
                        }
                    });
                    
                });
            
            }
        
        }
    
    ];

}));
},{"../Widget":"/Users/jason/dev/projects/hudkit.js/lib/Widget/index.js","../constants":"/Users/jason/dev/projects/hudkit.js/lib/constants.js","../core":"/Users/jason/dev/projects/hudkit.js/lib/core.js","dom-build":"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/index.js","domutil":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/index.js","rattrap":"/Users/jason/dev/projects/hudkit.js/node_modules/rattrap/index.js"}],"/Users/jason/dev/projects/hudkit.js/lib/Toolbar/index.js":[function(require,module,exports){
var ctx     = require('../core');
var k 		= require('../constants');
var Widget 	= require('../Widget');

var du  	= require('domutil');
var d 		= require('dom-build');

ctx.defineConstants({
	TOOLBAR_ALIGN_LEFT	: 'left',
	TOOLBAR_ALIGN_RIGHT	: 'right'
});

ctx.registerWidget('Toolbar', module.exports = Widget.extend(function(_super) {

	return [

        function(hk) {

        	this._leftWidgets = [];
        	this._rightWidgets = [];

            _super.constructor.call(this, hk);

        },

        'methods', {
            
            addAction: function(action, align) {
				var button = this.hk.button('toolbar');
				button.bindAction(action);
				return this.addWidget(button, align);
            },

            addWidget: function(widget, align) {
			
				align = align || k.TOOLBAR_ALIGN_LEFT;

				if (align === k.TOOLBAR_ALIGN_LEFT) {
					var targetEl 	= this._left,
						targetArray	= this._leftWidgets;
				} else {
					var targetEl 	= this._right,
						targetArray	= this._rightWidgets;
				}
				
				this._attachChildViaElement(widget, targetEl);
				targetArray.push(widget);

				return widget;

			},

            _buildStructure: function() {
				return d('.hk-toolbar',
            		d('.hk-toolbar-items.hk-toolbar-items-left!left'),
            		d('.hk-toolbar-items.hk-toolbar-items-left!right')
            	);
			}

        }

    ];

}));

},{"../Widget":"/Users/jason/dev/projects/hudkit.js/lib/Widget/index.js","../constants":"/Users/jason/dev/projects/hudkit.js/lib/constants.js","../core":"/Users/jason/dev/projects/hudkit.js/lib/core.js","dom-build":"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/index.js","domutil":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/index.js"}],"/Users/jason/dev/projects/hudkit.js/lib/TreeView/index.js":[function(require,module,exports){
var ctx         = require('../core'),
    k           = require('../constants'),
    Widget      = require('../Widget');

var du          = require('domutil'),
    d           = require('dom-build');

// TODO: refresh
// TODO: context menu

// TODO: observation
// TODO: deletable items

// TODO: drag and drop (move, reorder)

// TODO: some sort of guard object that can only ever be
// executing/waiting for a single callback, and operation
// can be cancelled... based on the following...

function cancellable(fn, ifCancelled) {
    var cancelled = false, fn = function() {
        if (cancelled) {
            if (ifCancelled) {
                ifCancelled();
            }
        } else {
            return fn.apply(null, arguments);    
        }
    }
    return [fn, function() { cancelled = true; }];
}

ctx.registerWidget('TreeView', module.exports = Widget.extend(function(_sc, _sm) {

    return [

        function() {

            this._busy = false;
            this._delegate = null;
            this._selected = [];

            _sc.apply(this, arguments);

        },

        'methods', {

            setDelegate: function(delegate) {
                
                // FIXME: for completeness this should handle being
                // busy when called; changing delegates is a rare 
                // operation but should be handled gracefully.
                // idea: this._busy could be a cancellation function.

                if (delegate === this._delegate)
                    return;

                this._delegate = delegate;
                this._selected = false;

                this._wrapper.innerHTML = '';

                if (this._delegate) {
                    this._loadRootItems();
                }

            },

            _buildStructure: function() {
                return d('.hk-tree-view',
                    d('ul.hk-tree-view-items!wrapper')
                );
            },

            _bindEvents: function() {

                var self = this;

                this._wrapper.addEventListener('click', function(evt) {

                    evt.preventDefault();
                    evt.stopPropagation();

                    // click on icon to toggle expanded state
                    if (evt.target.className.match(/icon/)) {
                        var li = evt.target.parentNode.parentNode;
                        if (li.treeViewContainer) {
                            if (li.treeViewChildrenLoaded) {
                                du.toggleClass(li, 'expanded');
                            } else {
                                self._loadChildren(li);
                            }
                            return;
                        }
                    }

                    // otherwise, select
                    var li = self._itemForEvent(evt);

                    if (!li)
                        return;

                    if (evt.shiftKey) {
                        self._toggleSelection(li);
                    } else {
                        self._setSelection(li);
                    }

                });

                this._wrapper.addEventListener('dblclick', function(evt) {

                    evt.preventDefault();
                    evt.stopPropagation();

                    var li = self._itemForEvent(evt);

                    if (!li)
                        return;
                    
                    self._delegate.itemActivated(li.treeViewItem);    
                
                });

            },

            _loadRootItems: function() {

                if (this._busy)
                    return;

                this._busy = true;

                var self = this;
                this._delegate.rootItems(function(err, roots) {
                    if (err) {
                        // TODO: handle error
                    } else {
                        self._appendItems(self._wrapper, roots);
                    }
                    self._busy = false;
                });

            },

            _loadChildren: function(li) {

                if (this._busy)
                    return;

                this._busy = true;

                var self = this;
                this._delegate.childrenForItem(li.treeViewItem, function(err, children) {
                    if (err) {
                        // TODO: handle error
                        self._busy = false;
                    } else {

                        var list = document.createElement('ul');
                        li.appendChild(list);
                        li.treeViewChildrenLoaded = true;

                        self._appendItems(list, children);

                        setTimeout(function() {
                            du.addClass(li, 'expanded');
                            self._busy = false;
                        }, 0);

                    }
                });

            },

            _createNodeForItem: function(item) {

                var li          = document.createElement('li'),
                    isContainer = this._delegate.itemIsContainer(item);

                du.addClass(li, isContainer ? 'hk-tree-view-container' : 'hk-tree-view-leaf');
                
                var itemClass = this._delegate.itemClass(item);
                if (itemClass) {
                    du.addClass(li, itemClass);
                }

                var itemEl = document.createElement('div');
                itemEl.className = 'item';

                var icon = document.createElement('span');
                icon.className = 'icon';
                icon.innerHTML = '&nbsp;';
                itemEl.appendChild(icon);

                var title = document.createElement('span');
                title.className = 'title';
                title.textContent = this._delegate.itemTitle(item);
                itemEl.appendChild(title);

                var flair = this._delegate.itemFlair(item);
                if (flair.length > 0) {
                    var flairWrapper = document.createElement('div');
                    flairWrapper.className = 'hk-tree-view-flair';
                    flair.forEach(function(f) {
                        var flairEl = document.createElement('span');
                        flairEl.className = f.className;
                        if ('text' in f) {
                            flairEl.textContent = f.text;
                        } else if ('html' in f) {
                            flairEl.innerHTML = f.html;
                        }
                        flairWrapper.appendChild(flairEl);
                    }, this);
                    itemEl.appendChild(flairWrapper);
                }

                li.appendChild(itemEl);
                li.treeViewItem = item;
                li.treeViewContainer = isContainer;
                li.treeViewChildrenLoaded = false;

                return li;

            },

            _appendItems: function(wrapper, items) {
                items.map(function(r) {
                    return this._createNodeForItem(r);
                }, this).forEach(function(n) {
                    wrapper.appendChild(n);
                });
            },

            _setSelection: function(item) {
                this._clearSelection();
                this._addToSelection(item);
            },

            _toggleSelection: function(item) {
                var ix = this._selected.indexOf(item);
                if (ix < 0) {
                    this._addToSelection(item);
                } else {
                    this._removeFromSelection(item);
                }
            },

            _clearSelection: function() {
                for (var i = 0; i < this._selected.length; ++i) {
                    du.removeClass(this._selected[i], 'selected');
                }
                this._selected = [];
            },

            _removeFromSelection: function(item) {
                this._removeSelectedIndex(this._selected.indexOf(item));
            },

            _removeSelectedIndex: function(ix) {
                if (ix < 0 || ix >= this._selected.length) {
                    return;
                }
                du.removeClass(this._selected[ix], 'selected');
                this._selected.splice(ix, 1);
            },

            _addToSelection: function(item) {

                if (this._selected.indexOf(item) >= 0) {
                    return;
                }

                this._selected.push(item);
                du.addClass(item, 'selected');

            },

            _itemForEvent: function(evt) {

                var nn = evt.target.nodeName.toLowerCase();

                // ignore direct clicks on li because this means user clicked
                // dead space to left of expanded node.
                if (nn === 'ul' || nn === 'li') {
                    return null;
                }

                var curr = evt.target;
                while (curr && curr.nodeName.toLowerCase() !== 'li') {
                    curr = curr.parentNode;
                }

                return curr || null;

            }

        }

    ];

}));
},{"../Widget":"/Users/jason/dev/projects/hudkit.js/lib/Widget/index.js","../constants":"/Users/jason/dev/projects/hudkit.js/lib/constants.js","../core":"/Users/jason/dev/projects/hudkit.js/lib/core.js","dom-build":"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/index.js","domutil":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/index.js"}],"/Users/jason/dev/projects/hudkit.js/lib/Widget/index.js":[function(require,module,exports){
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

},{"../component":"/Users/jason/dev/projects/hudkit.js/lib/component.js","../core":"/Users/jason/dev/projects/hudkit.js/lib/core.js","domutil":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/index.js","hudkit-values":"/Users/jason/dev/projects/hudkit.js/node_modules/hudkit-values/index.js"}],"/Users/jason/dev/projects/hudkit.js/lib/component.js":[function(require,module,exports){
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
},{"classkit":"/Users/jason/dev/projects/hudkit.js/node_modules/classkit/index.js","domutil":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/index.js"}],"/Users/jason/dev/projects/hudkit.js/lib/constants.js":[function(require,module,exports){
module.exports = {};
},{}],"/Users/jason/dev/projects/hudkit.js/lib/core.js":[function(require,module,exports){
var registry				= require('./registry'),
	constants 				= require('./constants'),
	Instance 				= require('./Instance');

exports.k 					= constants;
exports.defineConstant 		= defineConstant;
exports.defineConstants		= defineConstants;
exports.getWidget 			= getWidget;
exports.registerWidget		= registerWidget;
exports.registerInitializer	= registerInitializer;
exports.registerCSS 		= registerCSS;
exports.instance 			= instance;

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

function getWidget(name) {

	if (!(name in registry.widgets)) {
		throw new Error("unknown widget type: " + name);
	}

	return registry.widgets[name];

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

},{"./Instance":"/Users/jason/dev/projects/hudkit.js/lib/Instance.js","./constants":"/Users/jason/dev/projects/hudkit.js/lib/constants.js","./registry":"/Users/jason/dev/projects/hudkit.js/lib/registry.js"}],"/Users/jason/dev/projects/hudkit.js/lib/registry.js":[function(require,module,exports){
exports.widgets         = {};
exports.initializers    = [];
},{}],"/Users/jason/dev/projects/hudkit.js/node_modules/classkit/index.js":[function(require,module,exports){
exports.Class = Class;

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

  var features;

  if (fn) {
    // backwards compatibility
    if (fn.length > 1) {
      features = fn(this, this.prototype);
    } else {
      features = fn(this.prototype);
    }
  } else {
    features = [function() {}];
  }
  
  var ctor = features[0];
  ctor._super = this;
  ctor.prototype = Object.create(this.prototype);
  ctor.prototype.constructor = ctor;
  
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
  },
  delegate: function(ctor, delegates) {
    for (var methodName in delegates) {
      var target = delegates[methodName];
      if (Array.isArray(target)) {
        ctor.prototype[methodName] = makeDelegate(target[0], target[1]);
      } else {
        ctor.prototype[methodName] = makeDelegate(target, methodName);
      }
    }
  }
};

function makeDelegate(member, method) {
  return function() {
    var target = this[member];
    return target[method].apply(target, arguments);
  }
}
},{}],"/Users/jason/dev/projects/hudkit.js/node_modules/command-box/index.js":[function(require,module,exports){
module.exports = CommandBox;

var bind = require('dom-bind').bind;

//
// utilities

function defaultFormatter(object) {
    throw new Error("no object formatter specified");
}

function defaultEvaluator(command, console) {
    console.notReady();
    setTimeout(function() {
        console.print('evaluate: `' + command + '`');
        console.newCommand(true);
        console.focus();
    }, 200);
}

var defaultPrompt = { text: '> ' };

function isElement(x) {
    return x && x.nodeType === 1;
}

//
//

function CommandBox(el, opts) {
    
    this.root = el;

    opts = opts || {};
    
    this._format    = opts.format || defaultFormatter;
    this._evaluate  = opts.evaluate || defaultEvaluator;
    this._prompt    = opts.prompt || defaultPrompt;
    this._echo      = ('echo' in opts) ? (!!opts.echo) : true;

    this._history = [];
    this._historyIx = null;
    this._historyStash = null;
    
    this._buildStructure();

    this.notReady();
    this.newCommand();

}

//
// Public Interface

CommandBox.prototype.print = function(thing, className) {
    if (isElement(thing) || (typeof thing === 'string' && thing[0] === '<')) {
        this.printHTML(thing);
    } else if (typeof text === 'object') {
        this.printObject(thing);
    } else {
        this.printText(thing, className)
    }
}

CommandBox.prototype.printText = function(text, className) {
    this._appendOutputText(text, className);
}

CommandBox.prototype.printError = function(text) {
    this._appendOutputText(text, 'error');
}

CommandBox.prototype.printSuccess = function(text) {
    this._appendOutputText(text, 'success');
}

CommandBox.prototype.printHTML = function(html) {
    var el = this.document.createElement('div');
    if (isElement(html)) {
        el.appendChild(html);
    } else {
        el.innerHTML = html;
    }
    this._appendOutputElement(el);
}

CommandBox.prototype.printObject = function(obj) {
    var formatted = this._format(obj);
    if (formatted !== false)
        this.printHTML(formatted);
}

CommandBox.prototype.setFormatter = function(formatter) {
    this._format = formatter;
}

/**
 * Set the evaluator function.
 * The evaluator function will be passed 2 arguments - the command to be
 * evaluated, and the CommandBox object.
 *
 * @param evaluator
 */
CommandBox.prototype.setEvaluator = function(evaluator) {
    this._evaluate = evaluator;
}

/**
 * Prompt can either be:
 * a string representing the prompt text
 * an object with any/all of the keys: text, color, className
 * a function returning any of the above
 *
 * @param prompt
 */
CommandBox.prototype.setPrompt = function(prompt) {
    if (typeof prompt == 'string')
        prompt = { text: prompt };
        
    this._prompt = prompt;
}

CommandBox.prototype.echoOn = function() {
    this.setEcho(true);
}

CommandBox.prototype.echoOff = function() {
    this.setEcho(false);
}

CommandBox.prototype.setEcho = function(echo) {
    this._echo = !!echo;
}

// terminal is not ready for input; command line is hidden.
CommandBox.prototype.notReady = function() {
    // this._command.setAttribute('disabled', 'disabled');
    this._input.style.display = 'none';
}

// terminal is ready for input; command line is shown.
CommandBox.prototype.ready = function() {
    // this._command.removeAttribute('disabled');
    this._input.style.display = '-webkit-box';
}

CommandBox.prototype.focus = function() {
    this._command.focus();
}

/**
 * Clear's the user's current command.
 * Also cancels any active history navigation.
 */
CommandBox.prototype.clearCommand = function() {
    this._command.value = '';
    this._historyIx = null;
}

// prepare for a new command - clear current input, generate
// a new prompt and scroll to the bottom. set `makeReady` to
// true to make the terminal ready at the same time.
CommandBox.prototype.newCommand = function(makeReady) {

    this.clearCommand();
    
    var prompt = this._optionsForNewPrompt();
    this._inputPrompt.textContent = prompt.text;
    
    if ('color' in prompt) {
        this._inputPrompt.style.color = prompt.color;
    }

    this._inputPrompt.className = 'prompt';
    if (prompt.className) {
        this._inputPrompt.className += ' ' + prompt.className;
    }
    
    // TODO: not sure if this belongs here
    this._scrollToBottom();

    if (makeReady) {
        this.ready();
    }

}

//
// Private API

CommandBox.prototype._appendOutputText = function(text, className) {

    text = ('' + text);

    // TODO: text should be appended using a <pre> so we don't need to do
    // any of this replacement crap
    var el = document.createElement('div');
    el.className = 'text-line ' + (className || '');
    el.innerHTML = text.replace(/\n/g, "<br/>")
                       .replace(/ /g,  "&nbsp;");
    
    this._appendOutputElement(el);

}

CommandBox.prototype._appendOutputElement = function(el) {
    el.className += ' output-item';
    this._output.appendChild(el);
    this._scrollToBottom();
}

CommandBox.prototype._getCommand = function() {
    return this._command.value;
}

CommandBox.prototype._scrollToBottom = function() {
    this.root.scrollTop = this.root.scrollHeight;
}

CommandBox.prototype._optionsForNewPrompt = function() {
    var prompt = this._prompt;
    if (typeof prompt === 'function') prompt = prompt();
    return prompt || defaultPrompt;
}

CommandBox.prototype._bell = function() {
    // TODO: beep or something
}

CommandBox.prototype._handleEnter = function() {
    
    if (this._echo) {
        this._echoCurrentCommand();
    }
    
    var command = this._getCommand();
    if (this._evaluate) {
        this.clearCommand();
        if (this._history.length == 0 || command != this._history[this._history.length - 1]) {
            this._history.push(command);
        }
        this._evaluate(command, this);
    } else {
        this.newCommand();
    }

}

CommandBox.prototype._handleClear = function() {
    this.clearCommand();
}

CommandBox.prototype._handleHistoryNav = function(dir) {
    
    if (this._history.length == 0) {
        return;
    }
    
    var cmd = null;
    
    if (dir == 'prev') {
        if (this._historyIx === null) {
            this._historyStash = this._command.value || '';
            this._historyIx = this._history.length - 1;
        } else {
            this._historyIx--;
            if (this._historyIx < 0) {
                this._historyIx = 0;
            }
        }
    } else {
        if (this._historyIx === null) {
            return;
        }
        this._historyIx++;
        if (this._historyIx == this._history.length) {
            cmd = this._historyStash;
            this._historyIx = null;
        }
    }
    
    if (cmd === null) {
        cmd = this._history[this._historyIx];
    }
    
    this._command.value = cmd;
    
}

CommandBox.prototype._handleAutocomplete = function() {
    console.log("AUTO-COMPLETE");
}

CommandBox.prototype._echoCurrentCommand = function() {
    
    var line = document.createElement('div');
    line.className = 'input-line';

    var prompt = this._inputPrompt.cloneNode(true);
    
    var cmd = document.createElement('span');
    cmd.className = 'command';
    cmd.textContent = this._getCommand();
    
    line.appendChild(prompt);
    line.appendChild(cmd);
    
    this._appendOutputElement(line);
}

//
// Internals

CommandBox.prototype._buildStructure = function() {

    var self = this;

    if (!this.root.hasAttribute('tabindex')) {
        this.root.setAttribute('tabindex', 0);
    }

    this._output      = document.createElement('output');
    this._input       = document.createElement('div');
    this._inputPrompt = document.createElement('span');
    this._cmdWrapper  = document.createElement('span');
    this._command     = document.createElement('input');
    
    this._input.className       = 'input-line';
    this._cmdWrapper.className  = 'command-wrapper';
    this._command.type          = 'text';
    this._command.className     = 'command';
    
    this._cmdWrapper.appendChild(this._command);
    this._input.appendChild(this._inputPrompt);
    this._input.appendChild(this._cmdWrapper);
    this.root.appendChild(this._output);
    this.root.appendChild(this._input);

    bind(this.root, 'focus', function() {
        self._command.focus();
    });

    bind(this._command, 'keydown', function(evt) {
        switch (evt.which) {
            case 8:  if (self._command.value.length == 0) self._bell();     break;
            case 13: evt.preventDefault(); self._handleEnter();             break;
            case 27: evt.preventDefault(); self._handleClear();             break;
            case 38: evt.preventDefault(); self._handleHistoryNav('prev');  break;
            case 40: evt.preventDefault(); self._handleHistoryNav('next');  break;
            case 9:  evt.preventDefault(); self._handleAutocomplete();      break;
        }
    });

}
},{"dom-bind":"/Users/jason/dev/projects/hudkit.js/node_modules/command-box/node_modules/dom-bind/index.js"}],"/Users/jason/dev/projects/hudkit.js/node_modules/command-box/node_modules/dom-bind/index.js":[function(require,module,exports){
var matches = require('dom-matchesselector');

var bind = null, unbind = null;

if (typeof window.addEventListener === 'function') {

	bind = function(el, evtType, cb, useCapture) {
		el.addEventListener(evtType, cb, useCapture || false);
		return cb;
	}

	unbind = function(el, evtType, cb, useCapture) {
		el.removeEventListener(evtType, cb, useCapture || false);
		return cb;
	}

} else if (typeof window.attachEvent === 'function') {

	bind = function(el, evtType, cb, useCapture) {
		
		function handler(evt) {
			evt = evt || window.event;
			
			if (!evt.preventDefault) {
				evt.preventDefault = function() { evt.returnValue = false; }
			}
			
			if (!evt.stopPropagation) {
				evt.stopPropagation = function() { evt.cancelBubble = true; }
			}

			cb.call(el, evt);
		}
		
		el.attachEvent('on' + evtType, handler);
		return handler;
	
	}

	unbind = function(el, evtType, cb, useCapture) {
		el.detachEvent('on' + evtType, cb);
		return cb;
	}

}

function delegate(el, evtType, selector, cb, useCapture) {
	return bind(el, evtType, function(evt) {
		var currTarget = evt.target;
		while (currTarget && currTarget !== el) {
			if (matches(selector, currTarget)) {
				evt.delegateTarget = currTarget;
				cb.call(el, evt);
				break;
			}
			currTarget = currTarget.parentNode;
		}
	}, useCapture);
}

function bind_c(el, evtType, cb, useCapture) {
	cb = bind(el, evtType, cb, useCapture);

	var removed = false;
	return function() {
		if (removed) return;
		removed = true;
		unbind(el, evtType, cb, useCapture);
		el = cb = null;
	}
}

function delegate_c(el, evtType, selector, cb, useCapture) {
	cb = delegate(el, evtType, selector, cb, useCapture);

	var removed = false;
	return function() {
		if (removed) return;
		removed = true;
		unbind(el, evtType, cb, useCapture);
		el = cb = null;
	}
}

exports.bind = bind;
exports.unbind = unbind;
exports.delegate = delegate;
exports.bind_c = bind_c;
exports.delegate_c = delegate_c;
},{"dom-matchesselector":"/Users/jason/dev/projects/hudkit.js/node_modules/command-box/node_modules/dom-bind/node_modules/dom-matchesselector/index.js"}],"/Users/jason/dev/projects/hudkit.js/node_modules/command-box/node_modules/dom-bind/node_modules/dom-matchesselector/index.js":[function(require,module,exports){
var proto = window.Element.prototype;
var nativeMatch = proto.webkitMatchesSelector
					|| proto.mozMatchesSelector
					|| proto.msMatchesSelector
					|| proto.oMatchesSelector;

if (nativeMatch) {
	
	module.exports = function(selector, el) {
		return nativeMatch.call(el, selector);
	}

} else {

	console.warn("Warning: using slow matchesSelector()");
	
	var indexOf = Array.prototype.indexOf;
	module.exports = function(selector, el) {
		return indexOf.call(document.querySelectorAll(selector), el) >= 0;
	}

}

},{}],"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/index.js":[function(require,module,exports){
module.exports = dombuild;

var bind = require('dom-bind').bind;

var PIXELS = {

    fontSize            : true,

    top                 : true,
    right               : true,
    bottom              : true,
    left                : true,

    width               : true,
    minWidth            : true,
    maxWidth            : true,

    height              : true,
    minHeight           : true,
    maxHeight           : true,

    outlineWidth        : true,

    margin              : true,
    marginTop           : true,
    marginRight         : true,
    marginBottom        : true,
    marginLeft          : true,

    padding             : true,
    paddingTop          : true,
    paddingRight        : true,
    paddingBottom       : true,
    paddingLeft         : true,

    borderTopWidth      : true,
    borderRightWidth    : true,
    borderBottomWidth   : true,
    borderLeftWidth     : true
    
};

function Result() {}

function dombuild(tag) {
    var state = new Result();
    state.root = builder(state, arguments);
    return state;
}

function builder(state, args) {
    var el = createElement(state, args[0]);
    append(state, el, args, 1);
    return el;
}

function append(state, el, items, startOffset) {
    for (var i = startOffset, len = items.length; i < len; ++i) {
        var item = items[i];
        if (typeof item === 'string' || typeof item === 'number') {
            el.appendChild(document.createTextNode(item));
        } else if (item instanceof Result) {
            for (var k in item) {
                if (k === 'root') {
                    el.appendChild(item[k]);
                } else {
                    state[k] = item[k];
                }
            }
        } else if (Array.isArray(item)) {
            append(state, el, item, 0);
        } else if (!item) {
            continue;
        } else {
            for (var k in item) {
                var v = item[k];
                if (typeof v === 'function' && k[0] === 'o' && k[1] === 'n') {
                    bind(el, k.substr(2), v);
                } else if (k === 'style') {
                    if (typeof v === 'string') {
                        el.style.cssText = v;
                    } else {
                        for (var prop in v) {
                            var propVal = v[prop];
                            if (typeof propVal === 'number' && PIXELS[prop]) {
                                propVal += 'px';
                            }
                            el.style[prop] = propVal;
                        }   
                    }
                } else {
                    el.setAttribute(k, v);
                }
            }
        }
    }
}

function createElement(state, tag) {

    var m;
    if (!tag.length || !(m = /^([\w-]+)?(#[\w-]+)?((\.[\w-]+)*)(\![\w-]+)?$/.exec(tag))) {
        throw new Error("invalid tag");
    }

    var el = document.createElement(m[1] || 'div');

    if (m[2]) el.id = m[2].substr(1);
    if (m[3]) el.className = m[3].replace(/\./g, ' ').trim();
    if (m[5]) state[m[5].substr(1)] = el;

    return el;

}
},{"dom-bind":"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/node_modules/dom-bind/index.js"}],"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/node_modules/dom-bind/index.js":[function(require,module,exports){
var matches = require('dom-matchesselector');

var bind = null, unbind = null;

if (typeof window.addEventListener === 'function') {

	bind = function(el, evtType, cb, useCapture) {
		el.addEventListener(evtType, cb, useCapture || false);
		return cb;
	}

	unbind = function(el, evtType, cb, useCapture) {
		el.removeEventListener(evtType, cb, useCapture || false);
		return cb;
	}

} else if (typeof window.attachEvent === 'function') {

	bind = function(el, evtType, cb, useCapture) {
		
		function handler(evt) {
			evt = evt || window.event;
			
			if (!evt.preventDefault) {
				evt.preventDefault = function() { evt.returnValue = false; }
			}
			
			if (!evt.stopPropagation) {
				evt.stopPropagation = function() { evt.cancelBubble = true; }
			}

			cb.call(el, evt);
		}
		
		el.attachEvent('on' + evtType, handler);
		return handler;
	
	}

	unbind = function(el, evtType, cb, useCapture) {
		el.detachEvent('on' + evtType, cb);
		return cb;
	}

}

function delegate(el, evtType, selector, cb, useCapture) {
	return bind(el, evtType, function(evt) {
		var currTarget = evt.target;
		while (currTarget && currTarget !== el) {
			if (matches(selector, currTarget)) {
				evt.delegateTarget = currTarget;
				cb.call(el, evt);
				break;
			}
			currTarget = currTarget.parentNode;
		}
	}, useCapture);
}

function bind_c(el, evtType, cb, useCapture) {
	cb = bind(el, evtType, cb, useCapture);

	var removed = false;
	return function() {
		if (removed) return;
		removed = true;
		unbind(el, evtType, cb, useCapture);
		el = cb = null;
	}
}

function delegate_c(el, evtType, selector, cb, useCapture) {
	cb = delegate(el, evtType, selector, cb, useCapture);

	var removed = false;
	return function() {
		if (removed) return;
		removed = true;
		unbind(el, evtType, cb, useCapture);
		el = cb = null;
	}
}

exports.bind = bind;
exports.unbind = unbind;
exports.delegate = delegate;
exports.bind_c = bind_c;
exports.delegate_c = delegate_c;
},{"dom-matchesselector":"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/node_modules/dom-bind/node_modules/dom-matchesselector/index.js"}],"/Users/jason/dev/projects/hudkit.js/node_modules/dom-build/node_modules/dom-bind/node_modules/dom-matchesselector/index.js":[function(require,module,exports){
var proto = window.Element.prototype;
var nativeMatch = proto.webkitMatchesSelector
					|| proto.mozMatchesSelector
					|| proto.msMatchesSelector
					|| proto.oMatchesSelector;

if (nativeMatch) {
	
	module.exports = function(selector, el) {
		return nativeMatch.call(el, selector);
	}

} else {

	console.warn("Warning: using slow matchesSelector()");
	
	var indexOf = Array.prototype.indexOf;
	module.exports = function(selector, el) {
		return indexOf.call(document.querySelectorAll(selector), el) >= 0;
	}

}

},{}],"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/impl/classes.js":[function(require,module,exports){
if (typeof window.DOMTokenList === 'undefined') {

	// Constants from jQuery
	var rclass = /[\t\r\n]/g;
	var core_rnotwhite = /\S+/g;

	// from jQuery
	exports.hasClass = function(ele, className) {
	    className = " " + className + " ";
	    return (" " + ele.className + " ").replace(rclass, " ").indexOf(className) >= 0;
	}

	exports.addClass = function(ele, value) {
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

	exports.removeClass = function(ele, value) {
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

	exports.toggleClass = function(ele, value) {
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

} else {

	exports.hasClass = function(el, className) {
	    return el.classList.contains(className);
	}

	exports.addClass = function(el, classes) {
	    if (classes.indexOf(' ') >= 0) {
	        classes.split(/\s+/).forEach(function(c) {
	            el.classList.add(c);
	        });
	    } else {
	        el.classList.add(classes);
	    }
	}

	exports.removeClass = function(el, classes) {
	    if (classes.indexOf(' ') >= 0) {
	        classes.split(/\s+/).forEach(function(c) {
	            el.classList.remove(c);
	        });
	    } else {
	        el.classList.remove(classes);
	    }
	}

	exports.toggleClass = function(el, classes) {
	    if (classes.indexOf(' ') >= 0) {
	        classes.split(/\s+/).forEach(function(c) {
	            el.classList.toggle(c);
	        });
	    } else {
	        el.classList.toggle(classes);
	    }
	}

}

exports.removeMatchingClasses = function(el, regex) {
	var out = '';
	el.className.split(/\s+/).forEach(function(cn) {
		if (!cn.match(regex)) {
			if (out.length) {
				out += ' ';
			}
			out += cn;
		}
	});
	el.className = out;
}

},{}],"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/impl/events.js":[function(require,module,exports){
module.exports = exports = require('dom-bind');

exports.stop = stop;
function stop(evt) {
	evt.preventDefault();
	evt.stopPropagation();
}

},{"dom-bind":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/node_modules/dom-bind/index.js"}],"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/impl/layout.js":[function(require,module,exports){
exports.setRect = function(el, x, y, width, height) {
	el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = width + 'px';
    el.style.height = height + 'px';
}

exports.setPosition = function(el, x, y) {
    el.style.left = x + 'px';
    el.style.top = y + 'px';
}

exports.setSize = function(el, width, height) {
    el.style.width = width + 'px';
    el.style.height = height + 'px';
}

exports.isHidden = function(el) {
    return el.offsetWidth <= 0 || el.offsetHeight <= 0;
}

exports.isVisible = function(el) {
    return !(el.offsetWidth <= 0 || el.offsetHeight <= 0);
}
},{}],"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/impl/matches_selector.js":[function(require,module,exports){
module.exports = require('dom-matchesselector');
},{"dom-matchesselector":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/node_modules/dom-matchesselector/index.js"}],"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/impl/node.js":[function(require,module,exports){
exports.append = append;
function append(el, content) {
	if (Array.isArray(content)) {
		for (var i = 0, l = content.length; i < l; ++i) {
			append(el, content[i]);
		}
	} else if (typeof content === 'string') {
		if (content.charAt(0) === '<') {
			el.innerHTML += content;
		} else {
			el.appendChild(document.createTextNode(content));
		}
	} else {
		el.appendChild(content);
	}
}

exports.clear = clear;
function clear(el) {
	el.innerHTML = '';
}

exports.isElement = function(el) {
	return el && el.nodeType === 1;
}

exports.replace = function(oldEl, newEl) {
	oldEl.parentNode.replaceChild(newEl, oldEl);
}

exports.content = function(el, content) {
	if (typeof content === 'string') {
		el.innerHTML = content;
	} else{
		clear(el);
		append(el, content);	
	}
}
},{}],"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/impl/style.js":[function(require,module,exports){
function v(val) {
    if (typeof val === 'number') {
        return val + 'px';
    } else {
        return val;
    }
}

exports.style = function(el, attribute, value) {
    if (typeof attribute === 'string') {
        el.style[attribute] = v(value);
    } else {
        for (var k in attribute) {
            el.style[k] = v(attribute[k]);
        }
    }
}

exports.removeStyle = function(el, attribute) {
    el.style[attribute] = '';
}
},{}],"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/impl/text.js":[function(require,module,exports){
if ('textContent' in document.createElement('span')) {
    
    exports.getText = function(el) {
        return el.textContent;
    }

    exports.text = function(el, text) {
        el.textContent = text;
    }

} else {

    exports.getText = function(el) {
        return el.innerText;
    }

    exports.text = function(el, text) {
        el.innerText = text;
    }

}
},{}],"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/impl/viewport.js":[function(require,module,exports){
// http://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
exports.viewportSize = function() {
	return {
	    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
	    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
	};
}
},{}],"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/index.js":[function(require,module,exports){
var du = module.exports = {};

extend(require('./impl/classes'));
extend(require('./impl/events'));
extend(require('./impl/layout'));
extend(require('./impl/matches_selector'));
extend(require('./impl/node'));
extend(require('./impl/style'));
extend(require('./impl/text'));
extend(require('./impl/viewport'));

function extend(things) {
    for (var k in things) {
        du[k] = things[k];
    }
}

},{"./impl/classes":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/impl/classes.js","./impl/events":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/impl/events.js","./impl/layout":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/impl/layout.js","./impl/matches_selector":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/impl/matches_selector.js","./impl/node":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/impl/node.js","./impl/style":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/impl/style.js","./impl/text":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/impl/text.js","./impl/viewport":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/impl/viewport.js"}],"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/node_modules/dom-bind/index.js":[function(require,module,exports){
var matches = require('dom-matchesselector');

var bind = null, unbind = null;

if (typeof window.addEventListener === 'function') {

	bind = function(el, evtType, cb, useCapture) {
		el.addEventListener(evtType, cb, useCapture || false);
		return cb;
	}

	unbind = function(el, evtType, cb, useCapture) {
		el.removeEventListener(evtType, cb, useCapture || false);
		return cb;
	}

} else if (typeof window.attachEvent === 'function') {

	bind = function(el, evtType, cb, useCapture) {
		
		function handler(evt) {
			evt = evt || window.event;
			
			if (!evt.preventDefault) {
				evt.preventDefault = function() { evt.returnValue = false; }
			}
			
			if (!evt.stopPropagation) {
				evt.stopPropagation = function() { evt.cancelBubble = true; }
			}

			cb.call(el, evt);
		}
		
		el.attachEvent('on' + evtType, handler);
		return handler;
	
	}

	unbind = function(el, evtType, cb, useCapture) {
		el.detachEvent('on' + evtType, cb);
		return cb;
	}

}

function delegate(el, evtType, selector, cb, useCapture) {
	return bind(el, evtType, function(evt) {
		var currTarget = evt.target;
		while (currTarget && currTarget !== el) {
			if (matches(selector, currTarget)) {
				evt.delegateTarget = currTarget;
				cb.call(el, evt);
				break;
			}
			currTarget = currTarget.parentNode;
		}
	}, useCapture);
}

function bind_c(el, evtType, cb, useCapture) {
	cb = bind(el, evtType, cb, useCapture);

	var removed = false;
	return function() {
		if (removed) return;
		removed = true;
		unbind(el, evtType, cb, useCapture);
		el = cb = null;
	}
}

function delegate_c(el, evtType, selector, cb, useCapture) {
	cb = delegate(el, evtType, selector, cb, useCapture);

	var removed = false;
	return function() {
		if (removed) return;
		removed = true;
		unbind(el, evtType, cb, useCapture);
		el = cb = null;
	}
}

exports.bind = bind;
exports.unbind = unbind;
exports.delegate = delegate;
exports.bind_c = bind_c;
exports.delegate_c = delegate_c;
},{"dom-matchesselector":"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/node_modules/dom-matchesselector/index.js"}],"/Users/jason/dev/projects/hudkit.js/node_modules/domutil/node_modules/dom-matchesselector/index.js":[function(require,module,exports){
var proto = window.Element.prototype;
var nativeMatch = proto.webkitMatchesSelector
					|| proto.mozMatchesSelector
					|| proto.msMatchesSelector
					|| proto.oMatchesSelector;

if (nativeMatch) {
	
	module.exports = function(selector, el) {
		return nativeMatch.call(el, selector);
	}

} else {

	console.warn("Warning: using slow matchesSelector()");
	
	var indexOf = Array.prototype.indexOf;
	module.exports = function(selector, el) {
		return indexOf.call(document.querySelectorAll(selector), el) >= 0;
	}

}

},{}],"/Users/jason/dev/projects/hudkit.js/node_modules/hudkit-action/index.js":[function(require,module,exports){
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

},{"signalkit":"/Users/jason/dev/projects/hudkit.js/node_modules/signalkit/index.js"}],"/Users/jason/dev/projects/hudkit.js/node_modules/hudkit-values/index.js":[function(require,module,exports){
exports.property = function(name, value, transformer) {

	transformer = transformer || function(set, v) { set(v); };

	var listeners = [];

	return {

		name: name,
		
		get: function() {
			return value;
		},

		set: function(newValue) {
			transformer(function(actualValue) {
				value = actualValue;
				for (var i = 0, len = listeners.length; i < len; i += 2) {
					listeners[i].call(listeners[i+1], value);
				}
			}, newValue, value);
		},

		connect: function(fn, ctx) {
			ctx = ctx || null;
			listeners.push(fn, ctx);
			fn.call(ctx, value);
			return remover(listeners, fn, ctx);
		}

	};

}

exports.signal = function(name) {

	var listeners = [];
    
	return {

		name: name,

		emit: function() {
			for (var i = 0, len = listeners.length; i < len; i += 2) {
				listeners[i].apply(listeners[i+1], arguments);
			}
		},

		connect: function(fn, ctx) {
			ctx = ctx || null;
			listeners.push(fn, ctx);
			return remover(listeners, fn, ctx);
		}

	}

}

//
// Helpers

function remover(lst, fn, ctx) {
	var removed = false;
	return function() {
		if (removed) return;
		removed = true;
		for (var i = lst.length - 2; i >= 0; i -= 2) {
			if (lst[i] === fn && lst[i+1] === ctx) {
				lst.splice(i, 2);
				return;
			}
		}
	}
}
},{}],"/Users/jason/dev/projects/hudkit.js/node_modules/rattrap/index.js":[function(require,module,exports){
var activeCaptures = [];

function createOverlay(doc) {
    var overlay = doc.createElement('div');
    overlay.className = 'rattrap-overlay';
    overlay.unselectable = 'on';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.webkitUserSelect = 'none';
    overlay.style.mozUserSelect = 'none';
    overlay.style.msUserSelect = 'none';
    return overlay;
}

function makeCaptureHandler(fn) {
    return function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        fn(evt);
    }
}

exports.startCapture = function(doc, events) {

    if (typeof events === 'undefined') {
        events = doc;
        doc = document;
    }

    if (activeCaptures.indexOf(doc) >= 0) {
        throw "cannot capture events, capture is already in progress";
    }

    var overlay = createOverlay(doc);
    doc.body.appendChild(overlay);
    activeCaptures.push(overlay);

    for (var k in events) {
        if (k === 'cursor') {
            overlay.style.cursor = events[k];
        } else {
            overlay.addEventListener(k, makeCaptureHandler(events[k]));
        }
    }

    return function() {
        doc.body.removeChild(overlay);
        activeCaptures.splice(activeCaptures.indexOf(overlay), 1);
        doc = null;
        overlay = null;
    }

}

},{}],"/Users/jason/dev/projects/hudkit.js/node_modules/signalkit/index.js":[function(require,module,exports){
(function (process){
//
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
module.exports.Signal = Signal;
}).call(this,require('_process'))
},{"_process":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js"}],"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
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

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},["/Users/jason/dev/projects/hudkit.js/demo/hk.js"]);
