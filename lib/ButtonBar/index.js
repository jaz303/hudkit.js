var ctx         = require('../core'),
    theme       = require('../theme'),
    k           = require('../constants'),
    BlockWidget = require('../BlockWidget');

ctx.registerWidget('ButtonBar', module.exports = BlockWidget.extend(function(_sc, _sm) {

    return [

        function() {
            _sc.apply(this, arguments);
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
                this._root = this.document.createElement('div');
                this._root.className = 'hk-button-bar';
            }
        }

    ];

}));

ctx.registerCSS(require('fs').readFileSync(__dirname + '/style.unwise', 'utf8'));