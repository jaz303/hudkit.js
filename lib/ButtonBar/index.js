var ctx     = require('../core'),
    k       = require('../constants'),
    Widget  = require('../Widget');

var d       = require('dom-build');

ctx.registerWidget('ButtonBar', module.exports = Widget.extend(function(_super) {

    return [

        function(hk) {
            _super.constructor.call(this, hk);
            this._buttons = [];
        },

        'methods', {
            addButton: function(button) {
                
                button.setButtonType('button-bar');
                
                this._attachChildViaElement(button, this._root);
                this._buttons.push(button);

                return this;
            
            },
            
            _buildStructure: function() {
                return d('.hk-button-bar');
            }
        }

    ];

}));