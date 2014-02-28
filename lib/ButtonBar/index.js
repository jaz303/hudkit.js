exports.initialize = function(ctx, k, theme) {

    ctx.registerWidget('ButtonBar', ctx.Widget.extend(function(_sc, _sm) {

        return [

            function() {
                _sc.apply(this, arguments);
                this._buttons = [];
            },

            'methods', {
                addButton: function(button) {
                    
                    button.setButtonType('button-bar');
                    button._setPositionMode(k.POSITION_MODE_AUTO);
                    
                    this._attachChildViaElement(button, this._root);
                    this._buttons.push(button);

                    return this;
                
                },
                
                _buildStructure: function() {
                    this._root = this.document.createElement('div');
                    this._root.className = 'hk-button-bar';
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
