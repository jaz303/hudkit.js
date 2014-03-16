var ctx         = require('../core'),
    theme       = require('../theme'),
    k           = require('../constants'),
    BlockWidget = require('../BlockWidget');

ctx.registerWidget('Canvas2D', module.exports = BlockWidget.extend(function(_sc, _sm) {

    return [

        function() {
            _sc.apply(this, arguments);
        },

        'methods', {
            getContext: function() {
                return this._context;
            },
            
            getCanvas: function() {
                return this._root;
            },

            _applySize: function() {
                this._root.width = this.width;
                this._root.height = this.height;
            },
            
            _buildStructure: function() {
                this._root = this.document.createElement('canvas');
                this._root.setAttribute('tabindex', 0);
                this._root.className = 'hk-canvas hk-canvas-2d';
                this._context = this._root.getContext('2d');
            }
        }

    ];

}));

ctx.registerCSS(require('fs').readFileSync(__dirname + '/style.unwise', 'utf8'));