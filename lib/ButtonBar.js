var Widget  = require('./Widget'),
    k       = require('./constants');

module.exports = Widget.extend(function(_sc, _sm) {

    return [

        function() {
            _sc.apply(this, arguments);
            this._buttons = [];
        },

        'methods', {
            addButton: function(button) {
                button._setPositionMode(k.POSITION_MODE_AUTO);
                this._attachChildViaElement(button, this._root);
                this._buttons.push(button);
                return this;
            },
            
            _buildStructure: function() {
                this._root = document.createElement('div');
                this._root.className = 'hk-button-bar';
            }
        }

    ]

});