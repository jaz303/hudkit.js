var du      = require('domutil'),
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
	css = fs.readFileSync(__dirname + '/style.unwise', 'utf8');

exports.attach = function(instance) {
	instance.appendCSS(css);
}