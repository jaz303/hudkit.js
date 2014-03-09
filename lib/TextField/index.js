var du = require('domutil');

exports.initialize = function(ctx, k, theme) {

    ctx.registerWidget('TextField', ctx.InlineWidget.extend(function(_sc, _sm) {

        return [

            function(hk) {
                _sc.call(this, hk);
                this._value = '';
            },

            'methods', {

                dispose: function() {
                    _sm.dispose.call(this);
                },

                getValue: function() {
                    return this._value;
                },

                setValue: function(v) {
                    this._value = v;
                    this._root.value = v;
                },
                
                _buildStructure: function() {
                    this._root = this.document.createElement('input');
                    this._root.type = 'text'
                    this._root.className = 'hk-text-field';

                    this._root.addEventListener('keydown', function(evt) {
                        evt.stopPropagation();
                    });

                    this._root.addEventListener('keyup', function(evt) {
                        evt.stopPropagation();
                    });

                    this._root.addEventListener('keypress', function(evt) {
                        evt.stopPropagation();
                    });
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
