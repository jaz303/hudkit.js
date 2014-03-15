var du = require('domutil');

// TODO: do we need a way of handling escape key to reset
// TODO: there are a whole pile of event handlers we could expose via signals:
//       onKeyDown, onKeyUp, onKeyPress, onFocus, onBlur, onInput. That's a lot
//       of overhead - worth investigating lazy-loading via getters?

exports.initialize = function(ctx, k, theme) {

    ctx.registerWidget('TextField', ctx.InlineWidget.extend(function(_sc, _sm) {

        return [

            function(hk) {
                _sc.call(this, hk);
                this._addSignal('onChange');
                this._addSignal('onAction');
                this._value = '';
            },

            'mixins', ['ValueWidget'],

            'methods', {

                dispose: function() {
                    _sm.dispose.call(this);
                },

                _setValue: function(v) {
                    if (v !== this._value) {
                        this._value = this._root.value = v;
                        return true;
                    } else {
                        return false;
                    }
                },
                
                _buildStructure: function() {

                    var self = this;
                    
                    this._root = this.document.createElement('input');
                    this._root.type = 'text'
                    this._root.className = 'hk-text-field';

                    this._root.addEventListener('change', function(evt) {
                        // normal rules don't apply here.
                        // textfield value is guaranteed to have changed so
                        // just sync property and broadcast the change.
                        self._value = self._root.value;
                        self._broadcastChange();
                    });

                    var ready = true;
                    
                    this._root.addEventListener('keydown', function(evt) {
                        if (ready && evt.which === 13) {
                            ready = false;
                            // sync the value here before firing action because
                            // keydown is fired before "change" (enter key causes
                            // change event)
                            self._value = self._root.value;
                            self.onAction.emit(this, self._value);
                        }
                        evt.stopPropagation();
                    });

                    this._root.addEventListener('keyup', function(evt) {
                        ready = true;
                        evt.stopPropagation();
                    });

                    this._root.addEventListener('keypress', function(evt) {
                        evt.stopPropagation();
                    });
                },

                _applySizeHints: function() {
                    this._applyHintedProperty(this._root, 'width');
                    this._applyHintedProperty(this._root, 'height');
                }
            
            }

        ];

    }));

}

var fs = require('fs'),
    CSS = fs.readFileSync(__dirname + '/style.unwise', 'utf8');

exports.attach = function(instance) {
    instance.appendCSS(CSS);
}
