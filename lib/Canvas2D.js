var Widget = require('./Widget');

module.exports = Widget.extend(function(_sc, _sm) {

    return [

        function() {
            _sc.apply(this, arguments);
        },

        'methods', {
            getContext: function() { return this._context; },
            getCanvas: function() { return this._root; },

            _applySize: function() {
                this._root.width = this.width;
                this._root.height = this.height;
            },
            
            _buildStructure: function() {
                this._root = document.createElement('canvas');
                this._root.setAttribute('tabindex', 0);
                this._root.className = 'hk-canvas hk-canvas-2d';
                this._context = this._root.getContext('2d');
            }
        }

    ]

});