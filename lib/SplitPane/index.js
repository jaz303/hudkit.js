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