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