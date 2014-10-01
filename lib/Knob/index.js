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