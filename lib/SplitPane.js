var Widget  = require('./widget');
var util    = require('./util');
var theme   = require('./theme');
var k       = require('./constants');

var du      = require('domutil');
var rattrap = require('rattrap');

var DIVIDER_SIZE = theme.SPLIT_PANE_DIVIDER_SIZE;

module.exports = Widget.extend(function(_sc, _sm) {

    return [

        function() {

            this._widgets       = [null, null];
            this._hiddenWidgets = [false, false];
            this._split         = 0.5;
            this._orientation   = k.SPLIT_PANE_HORIZONTAL;
            
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
                du.addClass(this._root, this._orientation == k.SPLIT_PANE_HORIZONTAL ? 'horizontal' : 'vertical');
                
                this._layout();
            
            },
            
            setBounds: function(x, y, w, h) {
                _sm.setBounds.call(this, x, y, w, h);
                this._layout();
            },
            
            setSplit: function(split) {
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
                
                du.addClass(this._root, this._orientation == k.SPLIT_PANE_HORIZONTAL ? 'horizontal' : 'vertical');
            
            },
            
            _layout: function() {

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

                if (this._orientation === k.SPLIT_PANE_HORIZONTAL) {
                    
                    var divt  = Math.floor(this._split * (this.height - DIVIDER_SIZE)),
                        w2t   = divt + DIVIDER_SIZE,
                        w2h   = this.height - w2t;
                    
                    this._divider.style.left = '';
                    this._divider.style.top = divt + 'px';
                    
                    if (ws[0]) ws[0].setBounds(0, 0, this.width, divt);
                    if (ws[1]) ws[1].setBounds(0, w2t, this.width, w2h);
                
                } else if (this._orientation === k.SPLIT_PANE_VERTICAL) {
                    
                    var divl  = Math.floor(this._split * (this.width - DIVIDER_SIZE)),
                        w2l   = divl + DIVIDER_SIZE,
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
                    
                    var rootPos         = self._root.getBoundingClientRect(),
                        offsetX         = evt.offsetX,
                        offsetY         = evt.offsetY,
                        lastValidSplit  = self._split;
                    
                    function moveGhost() {
                        if (self._orientation === k.SPLIT_PANE_VERTICAL) {
                            self._ghost.style.left = Math.floor(lastValidSplit * (rootPos.width - DIVIDER_SIZE)) + 'px';
                            self._ghost.style.top = '';
                        } else if (self._orientation === k.SPLIT_PANE_HORIZONTAL) {
                            self._ghost.style.left = '';
                            self._ghost.style.top = Math.floor(lastValidSplit * (rootPos.height - DIVIDER_SIZE)) + 'px';
                        }
                    }
                            
                    self._root.appendChild(self._ghost);
                    moveGhost();
                    
                    rattrap.startCapture({
                        cursor: (self._orientation === k.SPLIT_PANE_VERTICAL) ? 'col-resize' : 'row-resize',
                        mousemove: function(evt) {
                            if (self._orientation === k.SPLIT_PANE_VERTICAL) {
                                var left    = evt.pageX - offsetX,
                                    leftMin = (rootPos.left),
                                    leftMax = (rootPos.right - DIVIDER_SIZE);
                                if (left < leftMin) left = leftMin;
                                if (left > leftMax) left = leftMax;
                                
                                lastValidSplit = (left - leftMin) / (rootPos.width - DIVIDER_SIZE);
                                moveGhost();
                            } else {
                                var top     = evt.pageY - offsetY,
                                    topMin  = (rootPos.top),
                                    topMax  = (rootPos.bottom - DIVIDER_SIZE);
                                if (top < topMin) top = topMin;
                                if (top > topMax) top = topMax;
                                
                                lastValidSplit = (top - topMin) / (rootPos.height - DIVIDER_SIZE);
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
    
    ]

});