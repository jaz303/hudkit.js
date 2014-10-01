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
