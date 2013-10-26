var Widget  = require('./widget');
var util    = require('./util');
var theme   = require('./theme');
var k       = require('./constants');

var du      = require('domutil');
var rattrap = require('rattrap');
var signal  = require('signalkit');

var DIVIDER_SIZE = theme.SPLIT_PANE_DIVIDER_SIZE;

module.exports = Widget.extend(function(_sc, _sm) {

    return [

        function() {

            this._orientation   = k.SPLIT_PANE_HORIZONTAL;
            this._widgets       = [null];
            this._splits        = [];

            this.onResize       = signal('onResize');
            
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
                
                this._root = document.createElement('div');
                this._root.className = 'hk-split-pane';
                
                this._ghost = document.createElement('div');
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

                                self.onResize.emit(self);
                            }
                        });

                    }
                
                });
            
            }
        
        }
    
    ]

});