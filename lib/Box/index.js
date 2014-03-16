var ctx         = require('../core'),
    theme       = require('../theme'),
    k           = require('../constants'),
    BlockWidget = require('../BlockWidget');

var Box = module.exports = BlockWidget.extend(function(_sc, _sm) {

    return [

        function(hk, rect, color) {
            if (typeof rect === 'string') {
                color = rect;
                rect = null;
            }
            _sc.call(this, hk, rect);
            this.setBackgroundColor(color || 'white');
        },

        'methods', {
            
            setBackgroundColor: function(color) {
                this._root.style.backgroundColor = color;
            },

            _buildStructure: function() {
                this._root = this.document.createElement('div');
                this._root.className = 'hk-box';
            }

        }

    ];

});

ctx.registerWidget('Box', Box);