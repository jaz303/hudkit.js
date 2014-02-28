(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.hkinit = function() {
	window.hudkit = require('../');
	hudkit.init();
	window.hk = hudkit.instance(window);	
}

},{"../":2}],2:[function(require,module,exports){
var hk = require('hudkit-core');

var fs = require('fs');

hk.register(require('./lib/Box'));
hk.register(require('./lib/SplitPane'));
hk.register(require('./lib/MultiSplitPane'));
hk.register(require('./lib/Console'));
hk.register(require('./lib/Canvas2D'));
hk.register(require('./lib/Container'));
hk.register(require('./lib/Panel'));
hk.register(require('./lib/Button'));
hk.register(require('./lib/ButtonBar'));
hk.register(require('./lib/TabPane'));
hk.register(require('./lib/Toolbar'));
hk.register(require('./lib/StatusBar'));

module.exports = hk;
},{"./lib/Box":3,"./lib/Button":4,"./lib/ButtonBar":5,"./lib/Canvas2D":6,"./lib/Console":7,"./lib/Container":8,"./lib/MultiSplitPane":9,"./lib/Panel":10,"./lib/SplitPane":11,"./lib/StatusBar":12,"./lib/TabPane":13,"./lib/Toolbar":14,"fs":32,"hudkit-core":16}],3:[function(require,module,exports){
exports.initialize = function(ctx, k, theme) {

    ctx.registerWidget('Box', ctx.Widget.extend(function(_sc, _sm) {

        return [

            function(hk, rect, color) {
                if (typeof rect === 'string') {
                    color = rect;
                    rect = null;
                }
                _sc.call(this, hk, rect);
                this.setBackgroundColor(color || 'white');
            },

            'methods', {
                
                setBackgroundColor: function(color) {
                    this._root.style.backgroundColor = color;
                },

                _buildStructure: function() {
                    this._root = this.document.createElement('div');
                    this._root.className = 'hk-box';
                }

            }

        ];

    }));

}

exports.attach = function(instance) {
    // no styles here
}

},{}],4:[function(require,module,exports){
(function (__dirname){var du = require('domutil');

exports.initialize = function(ctx, k, theme) {

    ctx.registerWidget('Button', ctx.Widget.extend(function(_sc, _sm) {

        return [

            function() {
                
                this._action = null;
                _sc.apply(this, arguments);

                var self = this;
                this._root.addEventListener('click', function(evt) {
                    
                    evt.preventDefault();
                    evt.stopPropagation();
                    
                    if (self._action)
                        self._action(self);
                
                });

            },

            'methods', {

                dispose: function() {
                    this.setAction(null);
                    _sm.dispose.call(this);
                },

                getAction: function() {
                    return this._action;
                },

                setAction: function(action) {

                    if (action === this._action)
                        return;

                    if (this._action) {
                        this._actionUnbind();
                        this._action = null;
                    }

                    if (action) {
                        this._action = action;
                        this._actionUnbind = this._action.onchange.connect(this._sync.bind(this));
                    }

                },
                
                _buildStructure: function() {
                    
                    this._root = this.document.createElement('a');
                    this._root.href = '#';
                    this._root.className = 'hk-button-common hk-button';
                
                    this._text = this.document.createElement('span');

                    this._root.appendChild(this._text);

                },

                _sync: function() {

                    var title   = "",
                        enabled = true;

                    if (this._action) {
                        title = this._action.getTitle();
                        enabled = this._action.isEnabled();
                    }

                    this._text.textContent = title;
                    if (enabled) {
                        du.removeClass(this._root, 'disabled');
                    } else {
                        du.addClass(this._root, 'disabled');
                    }

                }
            
            }

        ];

    }));

}

var fs = require('fs'),
    CSS = "/* TODO add button styles! */\n\n/*\n.hk-button {\n  @include control-font;\n  @include control-border;\n  background: $HK_BUTTON_BG_COLOR;\n  color: $HK_TEXT_COLOR;\n  padding: 1px 10px 2px 10px;\n  border-radius: 7px;\n  \n  &.disabled {\n      color: #d0d0d0;\n  }\n  \n  &:not(.disabled):active {\n    background: $HK_CONTROL_ACTIVE_BG_COLOR;\n  }\n}\n*/";

exports.attach = function(instance) {
    instance.appendCSS(CSS);
}
}).call(this,"/../lib/Button")
},{"domutil":15,"fs":32}],5:[function(require,module,exports){
(function (__dirname){exports.initialize = function(ctx, k, theme) {

    ctx.registerWidget('ButtonBar', ctx.Widget.extend(function(_sc, _sm) {

        return [

            function() {
                _sc.apply(this, arguments);
                this._buttons = [];
            },

            'methods', {
                addButton: function(button) {
                    button._setPositionMode(k.POSITION_MODE_AUTO);
                    this._attachChildViaElement(button, this._root);
                    this._buttons.push(button);
                    return this;
                },
                
                _buildStructure: function() {
                    this._root = this.document.createElement('div');
                    this._root.className = 'hk-button-bar';
                }
            }

        ];

    }));

}

var fs = require('fs'),
    CSS = ".hk-button-bar {\n    \n}\n\n.hk-button-bar .hk-button {\n    \n    /* control-font mixin */\n    font: $HK_CONTROL_FONT_SIZE $HK_CONTROL_FONT;\n    line-height: 1;\n\n    /* button mixin */\n    background: $HK_BUTTON_BG_COLOR;\n    color: $HK_TEXT_COLOR;\n\n    /* ... */\n\n    display: block;\n    width: 20px;\n    height: 20px;\n    border-radius: 10px;\n    margin: 0 4px 4px 0;\n\n    span {\n        display: none;\n    }\n\n}\n\n.hk-button-bar .hk-button:not(.disabled):active {\n    /* button mixin */\n    background: $HK_CONTROL_ACTIVE_BG_COLOR;\n}\n\n.hk-button-bar .hk-button.disabled {\n    /* button mixin */\n    color: #d0d0d0;\n}\n";

exports.attach = function(instance) {
    instance.appendCSS(CSS);
}
}).call(this,"/../lib/ButtonBar")
},{"fs":32}],6:[function(require,module,exports){
(function (__dirname){exports.initialize = function(ctx, k, theme) {

    ctx.registerWidget('Canvas2D', ctx.Widget.extend(function(_sc, _sm) {

        return [

            function() {
                _sc.apply(this, arguments);
            },

            'methods', {
                getContext: function() {
                    return this._context;
                },
                
                getCanvas: function() {
                    return this._root;
                },

                _applySize: function() {
                    this._root.width = this.width;
                    this._root.height = this.height;
                },
                
                _buildStructure: function() {
                    this._root = this.document.createElement('canvas');
                    this._root.setAttribute('tabindex', 0);
                    this._root.className = 'hk-canvas hk-canvas-2d';
                    this._context = this._root.getContext('2d');
                }
            }

        ];

    }));

}

var fs = require('fs'),
    CSS = ".hk-canvas-2d {\n    background-color: #121212;\n    border-radius: $HK_BLOCK_BORDER_RADIUS;\n}\n\n.hk-canvas-2d:focus {\n\toutline: none;\n}\n";

exports.attach = function(instance) {
    instance.appendCSS(CSS);
}
}).call(this,"/../lib/Canvas2D")
},{"fs":32}],7:[function(require,module,exports){
(function (__dirname){var du = require('domutil');

var DEFAULT_PROMPT = {text: '>'},
    HISTORY_LENGTH = 500;

exports.initialize = function(ctx, k, theme) {

	ctx.registerWidget('Console', ctx.Widget.extend(function(_sc, _sm) {

		return [

		    function() {

		        _sc.apply(this, arguments);

		        this._formatter = null;
		        
		        this._history = [];
		        this._historyIx = null;
		        
		        this.echoOn();
		        this.notReady();

		    },

		    'methods', {
		        print: function(text, className) { this._appendOutputText(text, className); },
		        printError: function(text) { this._appendOutputText(text, 'error'); },
		        printSuccess: function(text) { this._appendOutputText(text, 'success'); },
		        
		        printHTML: function(html) {
		            var ele = this.document.createElement('div');
		            if (du.isElement(html)) {
		                ele.appendChild(html);
		            } else {
		                ele.innerHTML = html;
		            }
		            this._appendOutputElement(ele);
		        },
		        
		        printObject: function(obj) {
		            var formatted = this._formatter(obj);
		            if (formatted !== false)
		                this.printHTML(formatted);
		        },
		        
		        setObjectFormatter: function(formatter) {
		        	this._formatter = formatter;
		       	},
		        
		        /**
		         * Set the evaluator function.
		         * The evaluator function will be passed 2 arguments - the command to be
		         * evaluated, and the terminal object.
		         *
		         * @param evaluator
		         */
		        setEvaluator: function(evaluator) {
		        	this._evaluator = evaluator;
		        },
		        
		        /**
		         * Prompt can either be:
		         * a string representing the prompt text
		         * an object with any/all of the keys: text, color, className
		         * a function returning any of the above
		         *
		         * @param prompt
		         */
		        setPrompt: function(prompt) {
		            if (typeof prompt == 'string')
		                prompt = {text: prompt};
		                
		            this._userPrompt = prompt;
		        },
		        
		        echoOn: function() {
		        	this.setEcho(true);
		        },
		        
		        echoOff: function() {
		        	this.setEcho(false);
		        },
		        
		        setEcho: function(echo) {
		        	this._echo = !!echo;
		        },
		        
		        // terminal is not ready for input; command line is hidden.
		        notReady: function() {
		        	this._input.style.display = 'none';
		        },
		        
		        // terminal is ready for input; command line is shown.
		        ready: function() {
		        	this._input.style.display = '-webkit-box';
		        },
		        
		        /**
		         * Clear's the user's current command.
		         * Also cancels any active history navigation.
		         */
		        clearCommand: function() {
		            this._command.value = '';
		            this._historyIx = null;
		        },
		        
		        // prepare for a new command - clear current input, generate
		        // a new prompt and scroll to the bottom. set `makeReady` to
		        // true to make the terminal ready at the same time.
		        newCommand: function(makeReady) {
		            if (makeReady) {
		                this.ready();
		            }
		            
		            var prompt = this._optionsForNewPrompt();
		            this._prompt.innerText = prompt.text;
		            
		            if ('color' in prompt) {
		                this._prompt.style.color = prompt.color;
		            } else {
		                this._prompt.style.color = '';
		            }
		            
		            if ('className' in prompt) {
		                this._prompt.className = 'prompt ' + prompt.className;
		            } else {
		                this._prompt.className = 'prompt';
		            }
		            
		            this.clearCommand();
		            this._scrollToBottom();
		        },
		        
		        //
		        // Private API
		        
		        _appendOutputText: function(text, className) {

		            text = ('' + text);

		            // TODO: text should be appended using a <pre> so we don't need to do
		            // any of this replacement crap
		            var ele = this.document.createElement('div');
		            ele.className = 'text-line ' + (className || '');
		            ele.innerHTML = text.replace(/\n/g, "<br/>")
		                                .replace(/ /g,  "&nbsp;");
		            
		            this._appendOutputElement(ele);
		        
		        },
		        
		        _appendOutputElement: function(ele) {
		            ele.className += ' output-item';
		            this._output.appendChild(ele);
		            this._scrollToBottom();
		        },
		        
		        _getCommand: function() {
		            return this._command.value;
		        },
		        
		        _scrollToBottom: function() {
		            this._root.scrollTop = this._root.scrollHeight;
		        },
		        
		        _optionsForNewPrompt: function() {
		            var prompt = (typeof this._userPrompt == 'function') ? this._userPrompt() : this._userPrompt;
		            return prompt || DEFAULT_PROMPT;
		        },
		        
		        _bell: function() {
		            console.log("bell!");
		        },
		        
		        _handlePaste: function(e) {
		            var pastedText = undefined;
		            if (e.clipboardData && e.clipboardData.getData) {
		                pastedText = e.clipboardData.getData('text/plain');
		            }
		            if (pastedText !== undefined) {
		                console.log(pastedText);
		            }
		        },
		        
		        _handleEnter: function() {
		            if (this._echo) {
		                this._echoCurrentCommand();
		            }
		            var command = this._getCommand();
		            if (this._evaluator) {
		                this.clearCommand();
		                if (this._history.length == 0 || command != this._history[this._history.length - 1]) {
		                    this._history.push(command);
		                }
		                this._evaluator(command, this);
		            } else {
		                this.newCommand();
		            }
		        },
		        
		        _handleClear: function() {
		            this.clearCommand();
		        },
		        
		        _handleHistoryNav: function(dir) {
		            
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
		            
		        },
		        
		        _handleAutocomplete: function() {
		            console.log("AUTO-COMPLETE");
		        },
		        
		        _echoCurrentCommand: function() {
		            var line = this.document.createElement('div');
		            line.className = 'input-line';
		            
		            var prompt = this.document.createElement('span');
		            prompt.className = this._prompt.className;
		            prompt.style.color = this._prompt.style.color;
		            prompt.textContent = this._prompt.textContent;
		            
		            var cmd = this.document.createElement('span');
		            cmd.className = 'command';
		            cmd.textContent = this._getCommand();
		            
		            line.appendChild(prompt);
		            line.appendChild(cmd);
		            
		            this._appendOutputElement(line);
		        },
		        
		        _buildStructure: function() {
		            
		            var self = this;
		            
		            var root        = this.document.createElement('div'),
		                output      = this.document.createElement('output'),
		                line        = this.document.createElement('div'),
		                prompt      = this.document.createElement('span'),
		                cmdWrapper  = this.document.createElement('span'),
		                cmd         = this.document.createElement('input');
		                    
		            root.className        = 'hk-console';
		            line.className        = 'input-line';
		            cmdWrapper.className  = 'command-wrapper';
		            cmd.type              = 'text';
		            cmd.className         = 'command';
		            
		            cmdWrapper.appendChild(cmd);
		            line.appendChild(prompt);
		            line.appendChild(cmdWrapper);
		            root.appendChild(output);
		            root.appendChild(line);
		            
		            root.onclick = function() { cmd.focus(); }
		            cmd.onpaste = function(evt) { self._handlePaste(evt); evt.preventDefault(); };
		            cmd.onkeydown = function(evt) {
		                switch (evt.which) {
		                    case 8:  if (self._command.value.length == 0) self._bell();     break;
		                    case 13: evt.preventDefault(); self._handleEnter();             break;
		                    case 27: evt.preventDefault(); self._handleClear();             break;
		                    case 38: evt.preventDefault(); self._handleHistoryNav('prev');  break;
		                    case 40: evt.preventDefault(); self._handleHistoryNav('next');  break;
		                    case 9:  evt.preventDefault(); self._handleAutocomplete();      break;
		                }
		            };
		            
		            this._root    = root;
		            this._output  = output;
		            this._input   = line;
		            this._prompt  = prompt;
		            this._command = cmd;
		            
		        }
		    }

		];

	}));

}

var fs = require('fs'),
	CSS = ".hk-console {\n    padding: 5px;\n    background: #AAB2B7;\n    border-radius: $HK_BLOCK_BORDER_RADIUS;\n    overflow: auto;\n    font: $HK_CONSOLE_FONT_SIZE/1.2 $HK_MONOSPACE_FONT;\n}\n\n.hk-console output {\n    \n}\n\n.hk-console .output-item {\n    display: -webkit-box;\n    -webkit-box-orient: horizontal;\n    -webkit-box-align: stretch;\n    clear: both;\n}\n\n.hk-console .input-line {\n    \n}\n    \n.hk-console .prompt {\n    white-space: nowrap;\n    margin-right: 5px;\n    display: -webkit-box;\n    -webkit-box-back: center;\n    -webkit-box-orient: vertical;\n}\n    \n.hk-console .command-wrapper {\n    display: block;\n    -webkit-box-flex: 1;\n}\n    \n.hk-console span.command {\n    display: inline-block;\n}\n\n.hk-console input.command {\n    border: none;\n    background: none;\n    padding: 0;\n    margin: 0;\n    width: 100%;\n    font: inherit;\n    -webkit-appearance: textfield;\n    -webkit-user-select: text;\n    cursor: auto;\n    display: inline-block;\n    text-align: start;\n}\n\n.hk-console input.command:focus {\n    outline: none;\n}\n";

exports.attach = function(instance) {
	instance.appendCSS(CSS);
}
}).call(this,"/../lib/Console")
},{"domutil":15,"fs":32}],8:[function(require,module,exports){
exports.initialize = function(ctx, k, theme) {

	ctx.registerWidget('Container', ctx.Widget.extend(function(_sc, _sm) {

		return [

			function() {
	            
	            this._layout = null;
	            this._children = [];
	            
	            _sc.apply(this, arguments);
	        
	            this._container = this._getContainer();

	        },

	        'methods', {
	            getLayout: function() {
	                return this._layout;
	            },

	            setLayout: function(layout) {
	                this._layout = layout;
	                this.requestLayout();
	            },

	            requestLayout: function() {
	                // TODO: batch this stuff asynchronously
	                this.layoutImmediately();
	            },

	            layoutImmediately: function() {
	                if (this._layout) {
	                    this._layout(this, 0, 0, this.width, this.height);
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

	                this.requestLayout();

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
	                        
	                        this.requestLayout();

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
	            },

	            _applyBounds: function() {
	                _sm._applyBounds.call(this);
	                this.requestLayout();
	            }
	        }

	    ]

	}));

};

exports.attach = function(instance) {

};

},{}],9:[function(require,module,exports){
var du      = require('domutil'),
    rattrap = require('rattrap'),
    signal  = require('signalkit');

exports.initialize = function(ctx, k, theme) {

    var DIVIDER_SIZE = theme.getInt('HK_SPLIT_PANE_DIVIDER_SIZE');

    ctx.registerWidget('MultiSplitPane', ctx.Widget.extend(function(_sc, _sm) {

        return [

            function() {

                this._orientation   = k.SPLIT_PANE_HORIZONTAL;
                this._widgets       = [null];
                this._splits        = [];

                this.onPaneResize   = signal('onPaneResize');
                
                _sc.apply(this, arguments);

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
                    
                    this._layout();
                
                },
                
                setBounds: function(x, y, w, h) {
                    _sm.setBounds.call(this, x, y, w, h);
                    this._layout();
                },

                addSplit: function(ratio, widget) {

                    if (ratio < 0 || ratio > 1) {
                        throw new Error("ratio must be between 0 and 1");
                    }

                    var div = this.document.createElement('div');
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

                    this._layout();

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
                    }

                    this._widgets.splice(ix, 1);

                    var victimSplit = (ix === this._widgets.length) ? (ix - 1) : ix;
                    this._root.removeChild(this._splits[victimSplit].divider);
                    this._splits.splice(victimSplit, 1);
                    
                    this._layout();

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

                        this._layout();
                    }
                        
                    return existingWidget;

                },
                
                _buildStructure: function() {
                    
                    this._root = this.document.createElement('div');
                    this._root.className = 'hk-split-pane';
                    
                    this._ghost = this.document.createElement('div');
                    this._ghost.className = 'hk-split-pane-divider hk-split-pane-ghost';
                    
                    du.addClass(this._root, this._orientation === k.SPLIT_PANE_HORIZONTAL ? 'horizontal' : 'vertical');
                
                },
                
                _layout: function() {

                    var width       = this.width,
                        height      = this.height,
                        horizontal  = this._orientation === k.SPLIT_PANE_HORIZONTAL,
                        widgets     = this._widgets,
                        splits      = this._splits,
                        totalSpace  = (horizontal ? height : width) - (splits.length * DIVIDER_SIZE),
                        pos         = 0,
                        root        = this._root;

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
                                    widget.setBounds(0, pos, width, paneHeight);    
                                }
                                
                                divider.style.top = (pos + paneHeight) + 'px';
                                pos += paneHeight + DIVIDER_SIZE;
                                
                            } else {
                                
                                var paneWidth = Math.floor(totalSpace * (ratio - lastRatio));

                                if (widget) {
                                    widget.setBounds(pos, 0, paneWidth, height);    
                                }
                                       
                                divider.style.left = (pos + paneWidth) + 'px';
                                pos += paneWidth + DIVIDER_SIZE;
                                
                            }
                            
                            lastRatio = ratio;
                            
                        }

                        var lastWidget = widgets[widgets.length-1];
                        if (lastWidget) {
                            if (horizontal) {
                                lastWidget.setBounds(0, pos, width, height - pos);
                            } else {
                                lastWidget.setBounds(pos, 0, width - pos, height);
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

                            rattrap.startCapture({
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
                                    rattrap.stopCapture();
                                    self._root.removeChild(self._ghost);
                                    
                                    var p = (lastValid - min) / (max - min);
                                    if (isNaN(p)) p = 0;

                                    var minSplit = (splitIx === 0) ? 0 : self._splits[splitIx-1].ratio,
                                        maxSplit = (splitIx === self._splits.length-1) ? 1 : self._splits[splitIx+1].ratio;

                                    self._splits[splitIx].ratio = minSplit + (maxSplit - minSplit) * p;

                                    self._layout();

                                    self.onPaneResize.emit(self);
                                }
                            });

                        }
                    
                    });
                
                }
            
            }
        
        ];

    }));

}

exports.attach = function(instance) {

}
},{"domutil":15,"rattrap":30,"signalkit":31}],10:[function(require,module,exports){
exports.initialize = function(ctx, k, theme) {

	ctx.registerWidget('Panel', ctx.Container.extend(function(_sc, _sm) {

		return [

		    function() {
		        _sc.apply(this, arguments);
		    },

		    'methods', {
		        _buildStructure: function() {
		            this._root = this.document.createElement('div');
		            this._root.className = 'hk-panel';
		        }
		    }

		]

	}));

};

exports.attach = function(instance) {

};

},{}],11:[function(require,module,exports){
(function (__dirname){var du      = require('domutil'),
    rattrap = require('rattrap');

exports.initialize = function(ctx, k, theme) {

	var SPLIT_PANE_HORIZONTAL   = 'h',
	    SPLIT_PANE_VERTICAL     = 'v';

	//
	// Constants

	ctx.defineConstants({
	    SPLIT_PANE_HORIZONTAL   : SPLIT_PANE_HORIZONTAL,
	    SPLIT_PANE_VERTICAL     : SPLIT_PANE_VERTICAL
	});

	//
	// Widget

	ctx.registerWidget('SplitPane', ctx.Widget.extend(function(_sc, _sm) {

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
	                
	                this._root = this.document.createElement('div');
	                this._root.className = 'hk-split-pane';
	                
	                this._divider = this.document.createElement('div');
	                this._divider.className = 'hk-split-pane-divider';
	                
	                this._ghost = this.document.createElement('div');
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

	}));
}

var fs = require('fs'),
	css = ".hk-split-pane > .hk-split-pane-divider {\n\tposition: absolute;\n\tbackground: $HK_ROOT_BG_COLOR;\n}\n\n.hk-split-pane > .hk-split-pane-ghost {\n\tcolor: #ff3300;\n\topacity: 0.7;\n}\n\n.hk-split-pane.horizontal > .hk-split-pane-divider {\n\tleft: 0; right: 0;\n\theight: $HK_SPLIT_PANE_DIVIDER_SIZE;\n\tcursor: row-resize;\n}\n\n.hk-split-pane.vertical > .hk-split-pane-divider {\n\ttop: 0; bottom: 0;\n\twidth: $HK_SPLIT_PANE_DIVIDER_SIZE;\n\tcursor: col-resize;\n}\n";

exports.attach = function(instance) {
	instance.appendCSS(css);
}}).call(this,"/../lib/SplitPane")
},{"domutil":15,"fs":32,"rattrap":30}],12:[function(require,module,exports){
(function (__dirname){var du = require('domutil');

function TextCell(doc) {
    this.el = doc.createElement('div');
    this.el.className = 'text cell';
    this._text = '';
}

TextCell.prototype.setText = function(text) {
    this._text = '' + (text || '');
    this.el.textContent = this._text;
    return this;
}

TextCell.prototype.setAlign = function(align) {
    this.el.style.textAlign = align;
    return this;
}

TextCell.prototype.setMinWidth = function(minWidth) {
    this.el.style.minWidth = parseInt(minWidth, 10) + 'px';
    return this;
}

TextCell.prototype.setMaxWidth = function(maxWidth) {
    this.el.style.maxWidth = parseInt(maxWidth, 10) + 'px';
    return this;
}

exports.initialize = function(ctx, k, theme) {

    ctx.registerWidget('StatusBar', ctx.Widget.extend(function(_sc, _sm) {

        return [

            function() {
                _sc.apply(this, arguments);

                this._leftCells = [];
                this._rightCells = [];
            },

            'methods', {
                _buildStructure: function() {
                    
                    this._root = this.document.createElement('div');
                    this._root.className = 'hk-status-bar';
                
                    this._left = this.document.createElement('div');
                    this._left.className = 'left-cells';
                    this._root.appendChild(this._left);

                    this._right = this.document.createElement('div');
                    this._right.className = 'right-cells';
                    this._root.appendChild(this._right);

                },

                addTextCell: function(position, text) {

                    var cell = new TextCell(this.document);
                    cell.setText(text);

                    if (position.charAt(0) === 'l') {
                        this._leftCells.push(cell);
                        this._left.appendChild(cell.el);
                    } else if (position.charAt(0) === 'r') {
                        this._rightCells.push(cell);
                        this._right.appendChild(cell.el);
                    } else {
                        throw new Error("unknown status bar cell position: " + position);
                    }

                    return cell;

                }
            }

        ];

    }));

}

var fs = require('fs'),
    CSS = ".hk-status-bar {\n    background: #595959;\n    border-top: 1px solid #7D7D7D;\n    box-sizing: border-box;\n    padding: 0 5px;\n}\n\n.hk-status-bar .left-cells {\n    float: left;\n}\n\n.hk-status-bar .right-cells {\n    float: right;\n}\n\n.hk-status-bar .cell {\n    float: left;\n    height: 20px;\n}\n\n.hk-status-bar .cell.text {\n    color: white;\n    font-size: 11px;\n    font-family: Helvetica;\n    padding-top: 3px;\n    text-shadow: #202020 0 -1px 1px;\n}";

exports.attach = function(instance) {
    instance.appendCSS(CSS);
}
}).call(this,"/../lib/StatusBar")
},{"domutil":15,"fs":32}],13:[function(require,module,exports){
(function (__dirname){var du = require('domutil');

exports.initialize = function(ctx, k, theme) {

	ctx.registerWidget('TabPane', ctx.Widget.extend(function(_sc, _sm) {

		return [

		    function() {
		        this._tabs = [];
		        _sc.apply(this, arguments);
		        this._bind();
		    },

		    'methods', {

		        setBounds: function() {
		            _sm.setBounds.apply(this, arguments);
		            this._redraw();
		        },

		        // Querying

		        tabCount: function() {
		            return this._tabs.length;
		        },

		        activeIndex: function() {
		            for (var i = 0; i < this._tabs.length; ++i) {
		                if (this._tabs[i].active) {
		                    return i;
		                }
		            }
		            return -1;
		        },

		        activeWidget: function() {
		            var ix = this.activeIndex();
		            return ix >= 0 ? this._tabs[ix].pane : null;
		        },

		        indexOfWidget: function(widget) {
		            for (var i = 0; i < this._tabs.length; ++i) {
		                if (this._tabs[i].pane === widget) {
		                    return i;
		                }
		            }
		            return -1;
		        },

		        //
		        // Add/remove

		        addTab: function(title, widget, selectTab) {
		            
		            var tab = this.document.createElement('a');
		            tab.textContent = title;
		            
		            var newTab = {
		                title   : title,
		                ele     : tab,
		                pane    : widget,
		                active  : false
		            };
		            
		            this._tabs.push(newTab);
		            
		            this._tabBar.appendChild(tab);
		            
		            widget.setHidden(true);
		            this._attachChildViaElement(widget, this._tabContainer);
		            
		            if (this._tabs.length === 1 || selectTab) {
		                this.selectTabAtIndex(this._tabs.length - 1);
		            }
		            
		        },

		        removeTabAtIndex: function(ix) {
		            
		            if (ix < 0 || ix >= this._tabs.length) {
		                return null;
		            }

		            var tab = this._tabs[ix];
		            this._tabBar.removeChild(tab.ele);
		            this._removeChildViaElement(tab.pane, this._tabContainer);
		            this._tabs.splice(ix, 1);

		            if (tab.active && this._tabs.length > 0) {
		                this.selectTabAtIndex(ix < this._tabs.length ? ix : ix - 1);
		            }

		        },

		        removeActiveTab: function() {
		            return this.removeTabAtIndex(this.activeIndex());
		        },

		        removeWidget: function(widget) {
		            return this.removeTabAtIndex(this.indexOfWidget(widget));
		        },

		        //
		        // Select

		        selectTabAtIndex: function(ix) {
		            for (var i = 0; i < this._tabs.length; ++i) {
		                var tab = this._tabs[i];
		                if (i === ix) {
		                    du.addClass(tab.ele, 'active');
		                    tab.active = true;
		                    tab.pane.setHidden(false);
		                } else {
		                    du.removeClass(tab.ele, 'active');
		                    tab.active = false;
		                    tab.pane.setHidden(true);
		                }
		                this._redraw();
		            }
		        },

		        //
		        // Titles

		        setActiveTabTitle: function(title) {
		            this.setTitleAtIndex(this.activeIndex(), title);
		        },

		        setTitleForWidget: function(widget, title) {
		            this.setTitleAtIndex(this.indexOfWidget(widget), title);
		        },

		        setTitleAtIndex: function(ix, title) {

		            if (ix < 0 || ix >= this._tabs.length) {
		                return;
		            }

		            title = ('' + title);
		            this._tabs[ix].title = title;
		            this._tabs[ix].ele.textContent = title;

		            this._redraw();

		        },

		        //
		        // 

		        _buildStructure: function() {
		            
		            this._root = this.document.createElement('div');
		            this._root.className = 'hk-tab-pane';
		            
		            this._tabBar = this.document.createElement('nav');
		            this._tabBar.className = 'hk-tab-bar';
		            
		            this._tabContainer = this.document.createElement('div');
		            this._tabContainer.className = 'hk-tab-container';
		            
		            this._canvas = this.document.createElement('canvas');
		            this._canvas.className = 'hk-tab-canvas';
		            this._canvas.height = theme.TAB_SPACING * 2;
		            this._ctx = this._canvas.getContext('2d');
		            
		            this._root.appendChild(this._canvas);
		            this._root.appendChild(this._tabBar);
		            this._root.appendChild(this._tabContainer);
		            
		        },
		        
		        _bind: function() {
		            
		            var self = this;
		            
		            this._tabBar.addEventListener('click', function(evt) {
		                evt.preventDefault();
		                for (var i = 0; i < self._tabs.length; ++i) {
		                    if (self._tabs[i].ele === evt.target) {
		                        self.selectTabAtIndex(i);
		                        break;
		                    }
		                }
		            });
		            
		        },
		        
		        _redraw: function() {
		            var self = this;
		            
		            this._tabs.forEach(function(tab, i) {
		                tab.pane.setBounds(theme.TAB_SPACING,
		                                   theme.TAB_SPACING,
		                                   self.width - (2 * theme.TAB_SPACING),
		                                   self.height - (3 * theme.TAB_SPACING + theme.TAB_HEIGHT));
		                                                     
		                if (tab.active) {
		                    var width       = tab.ele.offsetWidth,
		                            height  = tab.ele.offsetHeight,
		                            left    = tab.ele.offsetLeft,
		                            top     = tab.ele.offsetTop,
		                            ctx     = self._ctx;

		                    width += theme.TAB_BORDER_RADIUS;

		                    if (i > 0) {
		                        left -= theme.TAB_BORDER_RADIUS;
		                        width += theme.TAB_BORDER_RADIUS;
		                    }

		                    self._canvas.style.left = '' + left + 'px';
		                    self._canvas.style.top = '' + (top + height) + 'px';
		                    self._canvas.width = width;
		                    
		                    ctx.fillStyle = theme.TAB_BACKGROUND_COLOR;

		                    var arcY = theme.TAB_SPACING - theme.TAB_BORDER_RADIUS;

		                    if (i == 0) {
		                        ctx.fillRect(0, 0, width - theme.TAB_BORDER_RADIUS, self._canvas.height);
		                        ctx.beginPath();
		                        ctx.arc(width, arcY, theme.TAB_BORDER_RADIUS, Math.PI, Math.PI / 2, true);
		                        ctx.lineTo(width - theme.TAB_BORDER_RADIUS, theme.TAB_SPACING);
		                        ctx.lineTo(width - theme.TAB_BORDER_RADIUS, 0);
		                        ctx.fill();
		                    } else {
		                        ctx.beginPath();
		                        ctx.moveTo(theme.TAB_BORDER_RADIUS, 0);
		                        ctx.lineTo(theme.TAB_BORDER_RADIUS, arcY);
		                        ctx.arc(0, arcY, theme.TAB_BORDER_RADIUS, 0, Math.PI / 2, false);
		                        ctx.lineTo(width, theme.TAB_SPACING);
		                        ctx.arc(width, arcY, theme.TAB_BORDER_RADIUS, Math.PI / 2, Math.PI, false);
		                        ctx.lineTo(width - theme.TAB_BORDER_RADIUS, 0);
		                        ctx.lineTo(theme.TAB_BORDER_RADIUS, 0);
		                        ctx.fill();
		                    }
		                }
		            });
		        }

		    }

		];

	}));

}

var fs = require('fs'),
    CSS = ".hk-tab-pane .hk-tab-bar {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: $HK_TAB_HEIGHT;\n}\n\n.hk-tab-pane .hk-tab-bar > a {\n\n  /* control-font mixin */\n  font: $HK_CONTROL_FONT_SIZE $HK_CONTROL_FONT;\n  line-height: 1;\n\n  background: $HK_TAB_BACKGROUND_COLOR;\n  display: block;\n  float: left;\n  margin-right: $HK_TAB_SPACING;\n  color: $HK_TEXT_COLOR;\n  text-decoration: none;\n  font-weight: bold;\n  padding: $HK_TAB_PADDING;\n  border-radius: $HK_TAB_BORDER_RADIUS;\n  min-width: 30px;\n  text-align: center; \n  \n}\n\n.hk-tab-pane .hk-tab-bar > a.active {\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n}\n\n.hk-tab-pane .hk-tab-container {\n  position: absolute;\n  top: $HK_TAB_HEIGHT + $HK_TAB_SPACING;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background: $HK_TAB_BACKGROUND_COLOR;\n  border-radius: 8px;\n}\n\n.hk-tab-pane .hk-tab-canvas {\n  position: absolute;\n}\n";

exports.attach = function(instance) {
	instance.appendCSS(CSS);
}}).call(this,"/../lib/TabPane")
},{"domutil":15,"fs":32}],14:[function(require,module,exports){
(function (__dirname){var du = require('domutil');

exports.initialize = function(ctx, k, theme) {

	var TOOLBAR_ITEM_CLASS = 'hk-toolbar-item';

	ctx.registerWidget('Toolbar', ctx.Widget.extend(function(_sc, _sm) {

		return [

	        function() {
	            _sc.apply(this, arguments);
	        },

	        'methods', {
	            addAction: function(action, align) {

	                align = align || k.TOOLBAR_ALIGN_LEFT;
	                var target = (align === k.TOOLBAR_ALIGN_LEFT) ? this._left : this._right;
	                
	                var buttonEl = this.document.createElement('a');
	                buttonEl.href = '#';
	                buttonEl.className = 'hk-button';

	                function sync() {
	                    buttonEl.textContent = action.getTitle();
	                    if (action.isEnabled()) {
	                        du.removeClass(buttonEl, 'disabled');
	                    } else {
	                        du.addClass(buttonEl, 'enabled');
	                    }
	                }

	                sync();

	                action.onchange.connect(sync);

	                buttonEl.className = 'hk-button-common hk-button ' + TOOLBAR_ITEM_CLASS;
	                buttonEl.style.width = 'auto';
	                buttonEl.style.height = 'auto';
	                buttonEl.style.position = 'relative';

	                buttonEl.addEventListener('click', function(evt) {
	                    evt.preventDefault();
	                    evt.stopPropagation();
	                    action();
	                });

	                target.appendChild(buttonEl);

	                return action;

	            },

	            _buildStructure: function() {

	                this._root = this.document.createElement('div');
	                
	                this._left = this.document.createElement('div');
	                this._left.className = 'hk-toolbar-items hk-toolbar-items-left';
	                this._root.appendChild(this._left);
	                
	                this._right = this.document.createElement('div');
	                this._right.className = 'hk-toolbar-items hk-toolbar-items-right';
	                this._root.appendChild(this._right);
	                
	                this._root.className = 'hk-toolbar';

	            }
	        }

	    ];

	}));

}

var fs = require('fs'),
    CSS = ".hk-toolbar {\n    \n}\n\n.hk-toolbar-items {\n\n}\n\n.hk-toolbar-items.hk-toolbar-items-left {\n    float: left;\n}\n\n.hk-toolbar-items.hk-toolbar-items-right {\n    float: right;\n}\n\n.hk-toolbar-items > .hk-toolbar-item {\n    margin-right: 2px;\n    display: block;\n    float: left;\n}\n\n.hk-toolbar-items > .hk-button-common {\n    border: 1px solid $HK_TOOLBAR_ITEM_BORDER_COLOR;\n    padding: $HK_TOOLBAR_V_PADDING 3px;\n}\n";

exports.attach = function(instance) {
	instance.appendCSS(CSS);
}}).call(this,"/../lib/Toolbar")
},{"domutil":15,"fs":32}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
var fs          = require('fs'),
    signals     = require('./lib/signals'),
    constants   = require('./lib/constants'),
    theme       = require('./lib/theme'),
    Instance    = require('./lib/Instance'),
    Context     = require('./lib/Context'),
    registry    = require('./lib/registry');

var hk = module.exports = {
    register    : registry.registerModule,
    init        : init,
    instance    : function(doc) { return new Instance(doc); }
};

var initialized = false;

signals.moduleRegistered.connect(function(mod) {
    if (initialized) {
        initializeModule(mod);
    }
});

function initializeModule(mod) {
    mod.initialize(Context, constants, theme);
}

function init() {
    if (initialized) {
        return;
    }
    registry.modules().forEach(initializeModule);
    initialized = true;
}

hk.register(require('./lib/Widget'));
hk.register(require('./lib/RootPane'));

},{"./lib/Context":17,"./lib/Instance":18,"./lib/RootPane":19,"./lib/Widget":20,"./lib/constants":21,"./lib/registry":22,"./lib/signals":23,"./lib/theme":24,"fs":32}],17:[function(require,module,exports){
var registry 	= require('./registry'),
	signals		= require('./signals'),
	constants 	= require('./constants');

// Context object is passed to each registered module's initialize()
// function, allowing them to access select registry methods and 
// all previously registered widgets.
var Context = module.exports = {
	
	registerWidget  : registry.registerWidget,
	
	defineConstant: function(name, value) {
		Object.defineProperty(constants, name, {
			enumerable	: true,
			writable	: false,
			value		: value
		});
	},

	defineConstants: function(constants) {
		for (var k in constants) {
			this.defineConstant(k, constants[k]);
		}
	}

};

signals.widgetRegistered.connect(function(name, ctor) {
	Context[name] = ctor;
});
},{"./constants":21,"./registry":22,"./signals":23}],18:[function(require,module,exports){
(function (__dirname){var fs 			= require('fs'),
	styleTag 	= require('style-tag'),
    action      = require('hudkit-action'),
	registry 	= require('./registry'),
	signals 	= require('./signals'),
	theme 		= require('./theme'),
	constants	= require('./constants'),
    slice       = Array.prototype.slice;

module.exports = Instance;

var RESET_CSS   = "/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, img, ins, kbd, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed, \nfigure, figcaption, footer, header, hgroup, \nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, \nfooter, header, hgroup, menu, nav, section {\n\tdisplay: block;\n}\nbody {\n\tline-height: 1;\n}\nol, ul {\n\tlist-style: none;\n}\nblockquote, q {\n\tquotes: none;\n}\nblockquote:before, blockquote:after,\nq:before, q:after {\n\tcontent: '';\n\tcontent: none;\n}\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}",
    BASE_CSS    = ".hk-root {\n\t-webkit-user-select: none;\n\tcursor: default;\n\tbackground: #101010;\n\tfont: 12px $HK_CONTROL_FONT;\n}\n\n.hk-root a {\n\ttext-decoration: none;\n}\n\n.hk-root * {\n\t-webkit-user-select: none;\n\tcursor: default;\n}\n\n.hk-button-common {\n\tfont: $HK_CONTROL_FONT_SIZE $HK_CONTROL_FONT;\n\tbackground: $HK_BUTTON_BG_COLOR;\n\tcolor: $HK_TEXT_COLOR;\n}\n\n.hk-button-common.disabled {\n\tcolor: #d0d0d0;\n}\n\n.hk-button-common:not(.disabled):active {\n\tbackground: $HK_CONTROL_ACTIVE_BG_COLOR;\n}";

function Instance(window) {

    this.window = window;
    this.document = window.document;
    
    this.appendCSS(RESET_CSS);
    this.appendCSS(BASE_CSS);

    registry.modules().forEach(function(mod) {
    	mod.attach(this);
    }, this);

    this.root = this.rootPane();

    var body = this.document.body;
    body.className = 'hk';
    body.appendChild(this.root.getRoot());

}

Instance.prototype.constants = Instance.prototype.k = constants;
Instance.prototype.action = action;

Instance.prototype.appendCSS = function(css) {

    css = css.replace(/\$(\w+)/g, function(m) {
        return theme.get(RegExp.$1);
    });

    return styleTag(this.document, css);

}

// when widget is registered make it available to all hudkit instances
signals.widgetRegistered.connect(function(name, ctor) {

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

});}).call(this,"/../node_modules/hudkit-core/lib")
},{"./constants":21,"./registry":22,"./signals":23,"./theme":24,"fs":32,"hudkit-action":27,"style-tag":28}],19:[function(require,module,exports){
(function (__dirname){var fs      = require('fs'),
    trbl    = require('trbl');

var DEFAULT_PADDING = 8;

exports.initialize = function(ctx, k, theme) {

    ctx.registerWidget('RootPane', ctx.Widget.extend(function(_sc, _sm) {

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

    }));

}

exports.attach = function(instance) {
    instance.appendCSS(".hk-root-pane {\n\ttop: 0;\n\tleft: 0;\n\tright: 0;\n\tbottom: 0;\n\toverflow: hidden;\n\tbackground-color: $HK_ROOT_BG_COLOR;\n}");
}
}).call(this,"/../node_modules/hudkit-core/lib/RootPane")
},{"fs":32,"trbl":29}],20:[function(require,module,exports){
(function (__dirname){var fs 		= require('fs'),
	Class   = require('classkit').Class,
	du 		= require('domutil');

exports.initialize = function(ctx, k, theme) {

    ctx.defineConstants({
        POSITION_MODE_MANUAL    : 'manual',
        POSITION_MODE_AUTO      : 'auto'
    });

    ctx.registerWidget('Widget', Class.extend(function(_sc, _sm) {

        return [

            function(hk, rect) {

                this._hk = hk;
                
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
                }
            
            }
        
        ];

    }));

}

exports.attach = function(instance) {
	instance.appendCSS(".hk-widget {\n\toverflow: hidden;\n\tbox-sizing: border-box;\n\t-moz-box-sizing: border-box;\n}\n\n.hk-position-manual {\n\tposition: absolute;\n}\n\n.hk-position-auto {\n\t/* placeholder only */\n}\n");
}
}).call(this,"/../node_modules/hudkit-core/lib/Widget")
},{"classkit":25,"domutil":26,"fs":32}],21:[function(require,module,exports){
module.exports = {};
},{}],22:[function(require,module,exports){
var signals = require('./signals');

module.exports = {
	registerModule	: registerModule,
	modules 		: modules,
	registerWidget	: registerWidget,
	widgets 		: widgets
};

var moduleList 			= [],
	widgetMap 			= {},
	moduleRegistered	= signals.moduleRegistered,
	widgetRegistered	= signals.widgetRegistered;

function registerModule(mod) {
	moduleList.push(mod);
	moduleRegistered.emit(mod);
}

function modules() {
	return moduleList;
}

function registerWidget(name, ctor) {
	if (name in widgetMap) {
		throw new Error("duplicate widget type: " + name);
	}
	widgetMap[name] = ctor;
	widgetRegistered.emit(name, ctor);
}

function widgets() {
	return widgetMap;
}

},{"./signals":23}],23:[function(require,module,exports){
var signal = require('signalkit');

function s(signalName) {
	exports[signalName] = signal(signalName);
}

s('moduleRegistered');
s('widgetRegistered');
},{"signalkit":31}],24:[function(require,module,exports){
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

    'HK_BLOCK_BORDER_RADIUS'        : '10px',

    'HK_TOOLBAR_HEIGHT'             : '18px',

    // ((($HK_TOOLBAR_HEIGHT - $HK_CONTROL_FONT_SIZE) / 2) - 1)
    'HK_TOOLBAR_V_PADDING'          : '3px',

    'HK_TOOLBAR_ITEM_BORDER_COLOR'  : '#A6B5BB',
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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

},{"signalkit":31}],28:[function(require,module,exports){
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
},{}],29:[function(require,module,exports){
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
},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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
},{"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":33}],32:[function(require,module,exports){

},{}],33:[function(require,module,exports){
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