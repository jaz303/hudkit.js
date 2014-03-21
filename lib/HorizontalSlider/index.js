var ctx             = require('../core'),
    theme           = require('../theme'),
    k               = require('../constants'),
    InlineWidget    = require('../InlineWidget'),
    du              = require('domutil'),
    rattrap         = require('rattrap');

ctx.registerWidget('HorizontalSlider', module.exports = InlineWidget.extend(function(_sc, _sm) {

    return [

        function(hk) {

            _sc.call(this, hk);

            this._minValue = 0;
            this._maxValue = 100;
            this._value = 50;
            this._caption = '';

            this._addSignal('onChange');
            
            this._bind();
            this._update();

        },

        'mixins', ['ValueWidget', 'ValueRange'],

        'methods', {

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
                
                this._root = this.document.createElement('div');
                this._root.className = 'hk-horizontal-slider';
                
                this._fill = this.document.createElement('div');
                this._fill.className = 'fill';

                this._captionEl = this.document.createElement('div');
                this._captionEl.className = 'caption';

                this._root.appendChild(this._fill);
                this._root.appendChild(this._captionEl);

            },

            _bind: function() {

                var self = this;

                this._root.addEventListener('mousedown', function(evt) {

                    var rect = self._root.getBoundingClientRect();

                    function updateFromEvent(evt) {
                        
                        var offset = evt.pageX - rect.left;
                        
                        if (offset < 0) offset = 0;
                        if (offset > rect.width) offset = rect.width;

                        if (self._setValue(self._offsetToValue(rect, offset))) {
                            self._broadcastChange();
                        }
                        
                    }
                    
                    var stopCapture = rattrap.startCapture(self.document, {
                        cursor: 'col-resize',
                        mousemove: function(evt) {
                            updateFromEvent(evt);
                            self._updateCaption(self.getValue());
                        },
                        mouseup: function(evt) {
                            stopCapture();
                            updateFromEvent(evt);
                            self._updateCaption(self._caption);
                        }
                    });
                
                });

            },

            _update: function() {
                var percentage = ((this._value - this._minValue) / (this._maxValue - this._minValue)) * 100;
                this._fill.style.width = percentage + '%';
            },

            _updateCaption: function(caption) {
                this._captionEl.textContent = caption;
            },

            _offsetToValue: function(rect, offset) {
                return this._minValue + ((offset / rect.width) * (this._maxValue - this._minValue));
            },

            _applySizeHints: function() {
                this._applyHintedProperty(this._root, 'width');
                this._applyHintedProperty(this._root, 'height');
            }
        
        }

    ];

}));

ctx.registerCSS(require('fs').readFileSync(__dirname + '/style.unwise', 'utf8'));