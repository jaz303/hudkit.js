var ctx     = require('../core'),
    Widget  = require('../Widget');

var d       = require('dom-build');

var Box = module.exports = Widget.extend(function(_super) {

    return [

        function(hk, color) {
            _super.constructor.call(this, hk);
            this.setBackgroundColor(color || 'white');
        },

        'methods', {
            
            setBackgroundColor: function(color) {
                this._root.style.backgroundColor = color;
            },

            _buildStructure: function() {
                return d('.hk-box');
            }

        }

    ];

});

ctx.registerWidget('Box', Box);