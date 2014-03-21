var ctx             = require('../core'),
    theme           = require('../theme'),
    k               = require('../constants'),
    InlineWidget    = require('../InlineWidget'),
    du              = require('domutil'),
    rattrap         = require('rattrap'),
    signal          = require('signalkit');

var DEFAULT_SIZE    = 18,
    GAP_SIZE        = Math.PI / 6,
    RANGE           = (Math.PI * 2) - (2 * GAP_SIZE),
    START_ANGLE     = Math.PI / 2 + GAP_SIZE,
    END_ANGLE       = Math.PI / 2 - GAP_SIZE;

ctx.registerWidget('Knob', module.exports = InlineWidget.extend(function(_sc, _sm) {

    return [

        function(hk) {

            this._size = DEFAULT_SIZE;

            _sc.call(this, hk);

            this._minValue = 0;
            this._maxValue = 100;
            this._dragDirection = k.HORIZONTAL;
            this._value = 0;
            this._ctx = this._root.getContext('2d');

            this._addSignal('onChange');
            
            this._bind();
            this._update();

        },

        'mixins', ['ValueWidget', 'ValueRange'],

        'methods', {

            dispose: function() {
                _sm.dispose.call(this);
            },

            _setValue: function(v) {

                if (v < this._minValue) v = this._minValue;
                if (v > this._maxValue) v = this._maxValue;

                if (v === this._value) {
                    return false;
                }

                this._value = v;

                this._update();

                return true;

            },
            
            _buildStructure: function() {
                
                this._root = this.document.createElement('canvas');
                this._root.width = this._size;
                this._root.height = this._size;
                this._root.className = 'hk-knob';

            },

            _bind: function() {

                var self = this;

                this._root.addEventListener('mousedown', function(evt) {

                    var startX      = evt.pageX,
                        startY      = evt.pageY;
                        startV      = self.getValue(),
                        horizontal  = (self._dragDirection === k.HORIZONTAL);

                    var stopCapture = rattrap.startCapture(self.document, {
                        cursor: horizontal ? 'col-resize' : 'row-resize',
                        mousemove: function(evt) {

                            var delta;
                            if (horizontal) {
                                delta = evt.pageX - startX;
                            } else {
                                delta = startY - evt.pageY;
                            }
                            
                            if (self._setValue(startV + delta)) {
                                self._broadcastChange();
                            }

                        },
                        mouseup: function(evt) {
                            stopCapture();
                        }
                    });
                
                });

            },

            _update: function() {

                var ctx         = this._ctx,
                    filledRatio = (this._value - this._minValue) / (this._maxValue - this._minValue),
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

            },

            _applySizeHints: function() {

                var requestedWidth = this._getHintedProperty('width'),
                    requestedHeight = this._getHintedProperty('height');

                if (requestedWidth === null && requestedHeight === null) {
                    this._size = DEFAULT_SIZE;
                } else if (requestedWidth === null) {
                    this._size = requestedHeight;
                } else if (requestedHeight === null) {
                    this._size = requestedWidth;
                } else {
                    this._size = Math.min(requestedWidth, requestedHeight);
                }

                this._root.width = this._size;
                this._root.height = this._size;

                this._update();

            }
        
        }

    ];

}));

ctx.registerCSS(require('fs').readFileSync(__dirname + '/style.unwise', 'utf8'));