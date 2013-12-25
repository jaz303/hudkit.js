(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.hk = require('../');
},{"../":2}],2:[function(require,module,exports){
var hk = require('hudkit-core');

hk.register(require('./lib/Box'));
hk.register(require('./lib/SplitPane'));
// hk.register(require('./lib/CodeEditor'));
// hk.register(require('./lib/Console'));
// hk.register(require('./lib/Canvas2D'));
// hk.register(require('./lib/TabPane'));
// hk.register(require('./lib/Toolbar'));
// hk.register(require('./lib/Container'));
// hk.register(require('./lib/Panel'));
// hk.register(require('./lib/Button'));
// hk.register(require('./lib/ButtonBar'));
// hk.register(require('./lib/TreeView'));
// hk.register(require('./lib/StatusBar'));
// hk.register(require('./lib/MultiSplitPane'));

module.exports = hk;
},{"./lib/Box":3,"./lib/SplitPane":4,"hudkit-core":6}],3:[function(require,module,exports){
module.exports = function(hk, k, theme) {

    //
    // Widget

    hk.Box = hk.Widget.extend(function(_sc, _sm) {

        return [

            function() {
                _sc.apply(this, arguments);
                this.setBackgroundColor('white');
            },

            'methods', {
                
                setBackgroundColor: function(color) {
                    this._root.style.backgroundColor = color;
                },

                _buildStructure: function() {
                    this._root = document.createElement('div');
                    this._root.className = 'hk-box';
                }

            }

        ]

    });

};
},{}],4:[function(require,module,exports){
var du      = require('domutil');
var rattrap = require('rattrap');

module.exports = function(hk, k, theme) {

    var SPLIT_PANE_HORIZONTAL   = 'h',
        SPLIT_PANE_VERTICAL     = 'v';

    //
    // Constants

    hk.defineConstants({
        SPLIT_PANE_HORIZONTAL   : SPLIT_PANE_HORIZONTAL,
        SPLIT_PANE_VERTICAL     : SPLIT_PANE_VERTICAL
    });

    //
    // Theme

    var sb = hk.styles.block();

    sb.rule('.hk-split-pane', {
        '> .hk-split-pane-divider': {
            position: 'absolute',
            background: '$HK_ROOT_BG_COLOR'
        },
        '> .hk-split-pane-ghost': {
            background: '#ff3300',
            opacity: 0.7
        },
        '&.horizontal > .hk-split-pane-divider': {
            left: 0,
            right: 0,
            height: '$HK_SPLIT_PANE_DIVIDER_SIZE',
            cursor: 'row-resize'
        },
        '&.vertical > .hk-split-pane-divider': {
            top: 0,
            bottom: 0,
            width: '$HK_SPLIT_PANE_DIVIDER_SIZE',
            cursor: 'col-resize'
        }
    });

    sb.commit();

    //
    // Widget

    hk.SplitPane = hk.Widget.extend(function(_sc, _sm) {

        return [

            function() {

                this._widgets       = [null, null];
                this._hiddenWidgets = [false, false];
                this._split         = 0.5;
                this._orientation   = SPLIT_PANE_HORIZONTAL;
                
                _sc.apply(this, arguments);

                this._bind();

            },

            'methods', {

                dispose: function() {
                    this.setWidgetAtIndex(0, null);
                    this.setWidgetAtIndex(1, null);
                    _sm.dispose.call(this);
                },
                
                setOrientation: function(orientation) {
                    
                    this._orientation = orientation;
                    
                    du.removeClass(this._root, 'horizontal vertical');
                    du.addClass(this._root, this._orientation === SPLIT_PANE_HORIZONTAL ? 'horizontal' : 'vertical');
                    
                    this._layout();
                
                },
                
                setBounds: function(x, y, w, h) {
                    _sm.setBounds.call(this, x, y, w, h);
                    this._layout();
                },

                getSplit: function() {
                    return this._split;
                },
                
                setSplit: function(split) {
                    if (split < 0) split = 0;
                    if (split > 1) split = 1;
                    this._split = split;
                    this._layout();
                },
                
                setLeftWidget       : function(widget) { this.setWidgetAtIndex(0, widget); },
                setTopWidget        : function(widget) { this.setWidgetAtIndex(0, widget); },
                setRightWidget      : function(widget) { this.setWidgetAtIndex(1, widget); },
                setBottomWidget     : function(widget) { this.setWidgetAtIndex(1, widget); },

                hideWidgetAtIndex: function(ix) {
                    this._hiddenWidgets[ix] = true;
                    this._layout();
                },

                showWidgetAtIndex: function(ix) {
                    this._hiddenWidgets[ix] = false;
                    this._layout();
                },

                toggleWidgetAtIndex: function(ix) {
                    this._hiddenWidgets[ix] = !this._hiddenWidgets[ix];
                    this._layout();
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

                        this._layout();
                    }
                        
                    return existingWidget;
                    
                },
                
                _buildStructure: function() {
                    
                    this._root = document.createElement('div');
                    this._root.className = 'hk-split-pane';
                    
                    this._divider = document.createElement('div');
                    this._divider.className = 'hk-split-pane-divider';
                    
                    this._ghost = document.createElement('div');
                    this._ghost.className = 'hk-split-pane-divider hk-split-pane-ghost';
                    
                    this._root.appendChild(this._divider);
                    
                    du.addClass(this._root, this._orientation === SPLIT_PANE_HORIZONTAL ? 'horizontal' : 'vertical');
                
                },
                
                _layout: function() {

                    var dividerSize = theme.getInt('HK_SPLIT_PANE_DIVIDER_SIZE');

                    var hw = this._hiddenWidgets,
                        ws = this._widgets;

                    if (ws[0]) ws[0].setHidden(hw[0]);
                    if (ws[1]) ws[1].setHidden(hw[1]);

                    if (hw[0] || hw[1]) {
                        this._divider.style.display = 'none';
                        if (!hw[0] && ws[0]) {
                            ws[0].setBounds(0, 0, this.width, this.height);
                        } else if (!hw[1] && ws[1]) {
                            ws[1].setBounds(0, 0, this.width, this.height);
                        }
                        return;
                    } else {
                        this._divider.style.display = 'block';
                    }

                    if (this._orientation === SPLIT_PANE_HORIZONTAL) {
                        
                        var divt  = Math.floor(this._split * (this.height - dividerSize)),
                            w2t   = divt + dividerSize,
                            w2h   = this.height - w2t;
                        
                        this._divider.style.left = '';
                        this._divider.style.top = divt + 'px';
                        
                        if (ws[0]) ws[0].setBounds(0, 0, this.width, divt);
                        if (ws[1]) ws[1].setBounds(0, w2t, this.width, w2h);
                    
                    } else if (this._orientation === SPLIT_PANE_VERTICAL) {
                        
                        var divl  = Math.floor(this._split * (this.width - dividerSize)),
                            w2l   = divl + dividerSize,
                            w2w   = this.width - w2l;
                            
                        this._divider.style.left = divl + 'px';
                        this._divider.style.top = '';
                        
                        if (ws[0]) ws[0].setBounds(0, 0, divl, this.height);
                        if (ws[1]) ws[1].setBounds(w2l, 0, w2w, this.height);
                        
                    }
                
                },
                
                _bind: function() {
                    
                    var self = this;
                    
                    this._divider.addEventListener('mousedown', function(evt) {

                        var dividerSize     = theme.getInt('HK_SPLIT_PANE_DIVIDER_SIZE');
                        
                        var rootPos         = self._root.getBoundingClientRect(),
                            offsetX         = evt.offsetX,
                            offsetY         = evt.offsetY,
                            lastValidSplit  = self._split;
                        
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
                        
                        rattrap.startCapture({
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
                                rattrap.stopCapture();
                                self._root.removeChild(self._ghost);
                                self.setSplit(lastValidSplit);
                            }
                        });
                        
                    });
                
                }
            
            }
        
        ];

    });

};
},{"domutil":5,"rattrap":17}],5:[function(require,module,exports){
// Constants from jQuery
var rclass = /[\t\r\n]/g;
var core_rnotwhite = /\S+/g;

var DataStore         = {},
    kDataStoreNextIx  = 1,
    kDataKey          = 'du-data-key';

var __window = typeof window === 'undefined'
                ? null
                : window;

var __document = typeof document === 'undefined'
                  ? null
                  : document;

function generateElementKey() {
  return kDataStoreNextIx++;
}

module.exports = {
  init: function(window, document) {
    __window = window;
    __document = document;
  },

  data: function(el, key, val) {
    var elementKey = el.getAttribute(kDataKey);
    if (!elementKey) {
      elementKey = generateElementKey();
      el.setAttribute(kDataKey, elementKey);
    }

    var elementData = DataStore[elementKey];
    
    if (arguments.length === 2) {
      if (typeof key === 'undefined') {
        delete DataStore[elementKey];
      } else {
        return elementData ? elementData[key] : undefined;
      }
    } else if (arguments.length === 3) {
      if (typeof val === 'undefined') {
        if (elementData) {
          delete elementData[key];
        }
      } else {
        if (!elementData) {
          elementData = {};
          DataStore[elementKey] = elementData;
        }
        elementData[key] = val;
      }
    } else {
      throw "data() - invalid arguments";
    }
  },

  // from jQuery
  hasClass: function(ele, className) {
    className = " " + className + " ";
    return (" " + ele.className + " ").replace(rclass, " ").indexOf(className) >= 0;
  },

  // from jQuery
  addClass: function(ele, value) {
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
  },

  // from jQuery
  removeClass: function(ele, value) {
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
  },

  viewportSize: function() {
    return {
      width: __document.documentElement.clientWidth,
      height: __document.documentElement.clientHeight
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
},{}],6:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};var stylekit = require('stylekit');

var hk = {};

var initialized = false,
    styles      = null,
    modules     = [],
    constants   = {};

function initializeModule(mod) {
    if (typeof mod === 'function') {
        mod(hk, hk.constants, hk.theme);
    }
}

function installDefaultTheme() {

    var controlFontSize = 10,
        tabPadding      = 7;

    // TODO: stylekit should support assigned of functions as values
    // and give those functions the ability to watch depend on variables.
    // This would make it possible to have the entire stylesheet update correctly
    // when live. (we can't use calc() here because the calculated variables also
    // need to be accessible from Javascript)
    // Maybe this should be a change in wmap...
    var theme = {
        'HK_MONOSPACE_FONT'             : 'Menlo, Monaco, "Liberation Mono", monospace',
        'HK_TEXT_COLOR'                 : '#121729',

        'HK_CONTROL_FONT'               : 'Helvetica, sans-serif',
        'HK_CONTROL_FONT_SIZE'          : controlFontSize + 'px',
        'HK_CONTROL_BORDER_COLOR'       : '#455366',
        'HK_CONTROL_ACTIVE_BG_COLOR'    : '#EAF20F',
        
        'HK_BUTTON_BG_COLOR'            : '#929DA8',

        'HK_ROOT_BG_COLOR'              : '#181E23',

        'HK_CONSOLE_FONT_SIZE'          : '13px',

        'HK_SPLIT_PANE_DIVIDER_SIZE'    : '8px',
        
        'HK_TAB_SPACING'                : '7px',
        'HK_TAB_PADDING'                : tabPadding + 'px',
        'HK_TAB_HEIGHT'                 : (controlFontSize + (2 * tabPadding)) + 'px',
        'HK_TAB_BORDER_RADIUS'          : '5px',
        'HK_TAB_BACKGROUND_COLOR'       : '#67748C',

        'HK_BLOCK_BORDER_RADIUS'        : '10px',

        'HK_TOOLBAR_HEIGHT'             : '18px',
        'HK_TOOLBAR_ITEM_BORDER_COLOR'  : '#A6B5BB',
        'HK_TOOLBAR_MARGIN_TOP'         : '8px',
        'HK_TOOLBAR_MARGIN_RIGHT'       : '8px',
        'HK_TOOLBAR_MARGIN_BOTTOM'      : '8px',
        'HK_TOOLBAR_MARGIN_LEFT'        : '8px',

        // Unused currently...
        'HK_DIALOG_PADDING'             : '6px',
        'HK_DIALOG_BORDER_RADIUS'       : '$HK_DIALOG_PADDING',
        'HK_DIALOG_HEADER_HEIGHT'       : '24px',
        'HK_DIALOG_TRANSITION_DURATION' : '200'
    };

    for (var k in theme) {
        hk.theme.set(k, theme[k]);
    }

}

function installDefaultStyles() {

    //
    // Global macros

    var ms = styles.macros;

    ms.noSelect = function() {
        this.attribs({
            webkitUserSelect    : 'none',
            cursor              : 'default'
        });
    };

    ms.controlFont = function() {
        this.attribs({
            font: '$HK_CONTROL_FONT_SIZE $HK_CONTROL_FONT',
            lineHeight: 1
        });
    };

    ms.controlBorder = function() {
        this.attribs({
            border: '1px solid $HK_CONTROL_BORDER_COLOR'
        });
    }

    ms.button = function() {
        this.controlFont();

        this.attribs({
            background: '$HK_BUTTON_BG_COLOR',
            color: '$HK_TEXT_COLOR'
        });

        this.rule('&.disabled', {
            color: '#d0d0d0'
        });

        this.rule('&:not(.disabled):active', {
            background: '$HK_CONTROL_ACTIVE_BG_COLOR'
        });
    };

    ms.borderedButton = function() {
        this.button();
        this.controlBorder();
    };

    //
    // Default styles

    var sb = styles.block();

    sb.rule('.hk', function(b) {
        
        b.noSelect();

        b.attribs({
            background: '#101010',
            font: '12px Arial, Helvetica, sans-serif',
        });

        b.rules({
            a: {
                textDecoration: 'none'
            },
            '*': function() {
                b.noSelect();
            }
        });

    });

    sb.commit();

}

function init(doc) {

    if (initialized)
        return hk.rootPane;

    doc = doc || global.document;

    styles = stylekit(doc);

    hk.styles = styles;
    hk.theme = styles.vars;

    installDefaultTheme();
    installDefaultStyles();

    modules.forEach(initializeModule);

    hk.rootPane = new hk.RootPane();
    hk.rootEl = doc.body;
    doc.body.className = 'hk';
    doc.body.appendChild(hk.rootPane.getRoot());

    initialized = true;

    return hk.rootPane;

}

function register(mod) {

    modules.push(mod);

    if (initialized)
        initializeModule(mod);

}

function defineConstant(key, value) {
    
    if (key in constants) {
        throw new Error("duplicate constant: " + key);
    }

    Object.defineProperty(constants, key, {
        value       : value,
        writable    : false,
        enumerable  : true
    });

}

function defineConstants(cs) {
    for (var k in cs) {
        defineConstant(k, cs[k]);
    }
}

hk.init             = init;
hk.register         = register;
hk.constants        = constants;
hk.defineConstant   = defineConstant;
hk.defineConstants  = defineConstants;
hk.action           = require('hudkit-action');

register(require('./lib/Widget'));
register(require('./lib/RootPane'));

module.exports = hk;
},{"./lib/RootPane":7,"./lib/Widget":8,"hudkit-action":11,"stylekit":12}],7:[function(require,module,exports){
var trbl = require('trbl');

var DEFAULT_PADDING = 8;

module.exports = function(hk, k, theme) {

    //
    // Styles

    var sb = hk.styles.block();

    sb.rule('.hk-root-pane', {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        backgroundColor: '$HK_ROOT_BG_COLOR'
    });

    sb.commit();

    //
    // Widget

    hk.RootPane = hk.Widget.extend(function(_sc, _sm) {

        return [

            function() {

                this._padding           = [DEFAULT_PADDING, DEFAULT_PADDING, DEFAULT_PADDING, DEFAULT_PADDING];
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
                    this._root = document.createElement('div');
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
                                                theme.getInt('HK_TOOLBAR_HEIGHT'));
                        
                        var delta = theme.getInt('HK_TOOLBAR_HEIGHT') + theme.getInt('HK_TOOLBAR_MARGIN_BOTTOM');
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

                    var self = this,
                        timeout = null;

                    window.addEventListener('resize', function() {
                        if (self._resizeDelay <= 0) {
                            self._layout();    
                        } else {
                            if (timeout) clearTimeout(timeout);
                            timeout = setTimeout(function() { self._layout(); }, self._resizeDelay);
                        }
                    });

                }

            }

        ];

    });

}
},{"trbl":16}],8:[function(require,module,exports){
var Class   = require('classkit').Class;
var du      = require('domutil');

module.exports = function(hk, k, theme) {

    //
    // Styles

    var sb = hk.styles.block();

    sb.rule('.hk-widget', {
        overflow: 'hidden',
        boxSizing: 'border-box'
    });

    sb.rule('.hk-position-manual', {
        position: 'absolute'
    });

    sb.rule('.hk-position-auto', {
        // placeholder only
    });

    sb.commit();

    //
    // Widget

    hk.Widget = Class.extend(function(_sc, _sm) {

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

}
},{"classkit":9,"domutil":10}],9:[function(require,module,exports){
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
  }
};

exports.Class = Class;

},{}],10:[function(require,module,exports){
// Constants from jQuery
var rclass = /[\t\r\n]/g;
var core_rnotwhite = /\S+/g;

var DataStore         = {},
    kDataStoreNextIx  = 1,
    kDataKey          = 'du-data-key';

var __window = typeof window === 'undefined'
                ? null
                : window;

var __document = typeof document === 'undefined'
                  ? null
                  : document;

function generateElementKey() {
  return kDataStoreNextIx++;
}

module.exports = {
  init: function(window, document) {
    __window = window;
    __document = document;
  },

  data: function(el, key, val) {
    var elementKey = el.getAttribute(kDataKey);
    if (!elementKey) {
      elementKey = generateElementKey();
      el.setAttribute(kDataKey, elementKey);
    }

    var elementData = DataStore[elementKey];
    
    if (arguments.length === 2) {
      if (typeof key === 'undefined') {
        delete DataStore[elementKey];
      } else {
        return elementData ? elementData[key] : undefined;
      }
    } else if (arguments.length === 3) {
      if (typeof val === 'undefined') {
        if (elementData) {
          delete elementData[key];
        }
      } else {
        if (!elementData) {
          elementData = {};
          DataStore[elementKey] = elementData;
        }
        elementData[key] = val;
      }
    } else {
      throw "data() - invalid arguments";
    }
  },

  // from jQuery
  hasClass: function(ele, className) {
    className = " " + className + " ";
    return (" " + ele.className + " ").replace(rclass, " ").indexOf(className) >= 0;
  },

  // from jQuery
  addClass: function(ele, value) {
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
  },

  // from jQuery
  removeClass: function(ele, value) {
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
  },

  toggleClass: function(ele, value) {
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
  },

  viewportSize: function() {
    return {
      width: __document.documentElement.clientWidth,
      height: __document.documentElement.clientHeight
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
},{}],11:[function(require,module,exports){
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

},{"signalkit":18}],12:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};var styleTag    = require('style-tag'),
    builder     = require('css-builder'),
    wmap        = require('wmap');

var VAR_RE      = /\$[\w-]+/g;

//
//

function StyleSet(doc) {
    
    this._document = doc || global.document || document;
    this._blocks = [];

    this.macros = {};
    this.vars = wmap();
    
    this.vars.getInt = function(key) {
        var val = this.get(key);
        return (typeof val === 'undefined')
                ? Number.NaN
                : parseInt(val, 10);
    }

    this.vars.getFloat = function(key) {
        var val = this.get(key);
        return (typeof val === 'undefined')
                ? Number.NaN
                : parseFloat(val, 10);
    }

}

StyleSet.prototype.block = function() {
    var block = new StyleBlock(this);
    this._blocks.push(block);
    return block;
}

//
//

function StyleBlock(set) {
    this._styleSet = set;
    this._styleTag = null;
    this._unwatch = null;
    this._builder = null;

    this._css = '';

    this.macros = Object.create(set.macros);
}

StyleBlock.prototype.appendCSS = function(css) {
    this._checkMutable();
    this._css += css;
    return this;
}

StyleBlock.prototype.commit = function() {

    if (this._styleTag !== null)
        return;

    if (this._builder)
        this._builder.commit();

    this._watchReferencedVariables();

    this._styleTag = styleTag(this._styleSet._document, this._cssWithVariableExpansion());

}

StyleBlock.prototype.destroy = function() {
    if (this._styleTag) {
        this._styleTag.destroy();
        this._styleTag = false;
        this._unwatch();
        this._unwatch = null;
    }
}

StyleBlock.prototype.rule = function(selector, rs) {
    if (this._builder === null) {
        this._builder = builder({
            append      : this.appendCSS.bind(this),
            builder     : this.macros
        });
    }
    return this._builder.rule(selector, rs);
}

StyleBlock.prototype._watchReferencedVariables = function() {

    var matches = this._css.match(VAR_RE) || [],
        referencedVariables = matches.map(function(v) { return v.substr(1); });

    this._unwatch = this._styleSet.vars.watch(referencedVariables, function() {
        this._styleTag(this._cssWithVariableExpansion());
    }.bind(this));

}

StyleBlock.prototype._cssWithVariableExpansion = function() {
    var vars = this._styleSet.vars;

    var css = this._css;
    while (css.match(VAR_RE)) {
        css = css.replace(VAR_RE, function(m) {
            return vars.get(m.substr(1));
        });
    }

    return css;
}

StyleBlock.prototype._checkMutable = function() {
    if (this._styleTag !== null) {
        throw new Error("style block is immutable - style tag already created");
    }
}

//
//

module.exports = function(doc) {
    return new StyleSet(doc);
}
},{"css-builder":13,"style-tag":14,"wmap":15}],13:[function(require,module,exports){
// StyleBlock.prototype.macro = function(name, fn) {
//     this._macros[name] = fn;
// }

// StyleBlock.prototype.expand = function(macro) {
//     var m = this._lookupMacro(macro);
//     var args = slice.call(arguments, 0);
//     args[0] = this;
//     m.apply(null, args);
// }

// StyleBlock.prototype._lookupMacro = function(macro) {
//     var m = this._macros[macro];
//     if (!m) throw new Error("unknown macro: " + macro);
//     return m;
// }

module.exports = function(options) {

    options = options || {};

    var buffer          = '',
        _append         = options.append || function(str) { buffer += str; },
        path            = [],
        currSelector    = null,
        lastSelector    = null,
        b               = options.builder || {},
        frozen          = false;

    function attrib(name, value) {
        frozen && throwFrozen();
        append(currSelector, translateKey(name) + ': ' + value);
        return this;
    }

    function attribs(as) {
        frozen && throwFrozen();
        for (var k in as) {
            b.attrib(k, as[k]);
        }
        return this;
    }

    function rule(selector, rs) {

        frozen && throwFrozen();

        if (Array.isArray(rs)) {
            rs.forEach(function(r) { b.rule(selector, r); });
            return;
        }

        var oldSelector = currSelector;
        path.push(selector);
        currSelector = path.join(' ').replace(/\s+\&/g, '');

        if (typeof rs === 'string') {
            append(currSelector, rs);
        } else if (typeof rs === 'function') {
            rs.call(b, b);
        } else if (typeof rs === 'object') {
            for (var cssKey in rs) {
                var cssValue = rs[cssKey];
                if (typeof cssValue === 'object') {
                    b.rule(cssKey, cssValue);
                } else {
                    b.attrib(cssKey, cssValue);
                }
            }
        } else {
            throw new TypeError("rule must be string, function or object");
        }

        path.pop();
        currSelector = oldSelector;

        return this;

    }

    function rules(rs) {
        for (var k in rs) {
            b.rule(k, rs[k]);
        }
    }

    function append(sel, css) {
        if (lastSelector === sel) {
            _append(' ' + css + ';');
        } else {
            if (lastSelector !== null) {
                _append(" }\n");
            }
            _append(sel + ' { ' + css + ';');
            lastSelector = sel;
        }
    }

    function commit() {
        if (!frozen) {
            if (lastSelector) {
                _append(" }\n");
            }
            frozen = true;
        }
    }

    function translateKey(k) {
        k = k.replace(/[A-Z]/g, function(m) {
            return '-' + m[0].toLowerCase();
        });

        if (k.match(/^(webkit|moz|ms|o|khtml)-/)) {
            k = '-' + k;
        }

        return k;
    }

    function throwFrozen() {
        throw new Error("can't modify CSS builder - is frozen");
    }

    b.attrib        = attrib;
    b.attribs       = attribs;
    b.rule          = rule;
    b.rules         = rules;
    b.commit        = commit;
    b.toString      = function() { commit(); return buffer; }

    return b;

}


},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
function WMap(parent) {
    this._entries = {};
    this._watchers = {};
}

WMap.prototype.get = function(key) {
    return this._entries[key];
}

WMap.prototype.set = function(key, value) {
    var vb = this._entries[key];
    this._entries[key] = value;
    this._dispatch(key, vb, value);
}

WMap.prototype.remove = function(key) {
    var vb = this._entries[key];
    delete this._entries[key];
    this._dispatch(key, vb, undefined);
}

WMap.prototype.watch = function(keys, cb) {

    if (!Array.isArray(keys))
        keys = [keys];

    if (keys.length === 0)
        return function() {};

    var ws = this._watchers;

    keys.forEach(function(k) {
        (k in ws) ? ws[k].push(cb) : (ws[k] = [cb]);
    }, this);

    return function() {
        keys.forEach(function(k) {
            var kws = ws[k];
            for (var i = 0; i < kws.length; ++i) {
                if (kws[i] === cb) {
                    kws.splice(i, 1);
                    return;
                }
            }
        });
    };

}

WMap.prototype._dispatch = function(key, oldValue, newValue) {

    var ws = this._watchers[key];

    if (!ws)
        return;

    ws.forEach(function(c) { c(key, oldValue, newValue); });

}

module.exports = function() {
    return new WMap();
}

},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
var activeCapture = null;

function createOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'rattrap-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    return overlay;
}

function makeCaptureHandler(fn) {
    return function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        fn(evt);
    }
}

exports.startCapture = function(events) {

    if (activeCapture) {
        throw "cannot capture events, capture is already in progress";
    }

    activeCapture = createOverlay();

    document.body.appendChild(activeCapture);

    for (var k in events) {
        if (k === 'cursor') {
            activeCapture.style.cursor = events[k];
        } else {
            activeCapture.addEventListener(k, makeCaptureHandler(events[k]));
        }
    }

}

exports.stopCapture = function() {
    if (activeCapture) {
        document.body.removeChild(activeCapture);
        activeCapture = null;
    }
}

},{}],18:[function(require,module,exports){
var process=require("__browserify_process");//
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
},{"__browserify_process":19}],19:[function(require,module,exports){
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
            if (ev.source === window && ev.data === 'process-tick') {
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