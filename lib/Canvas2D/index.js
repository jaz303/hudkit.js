var ctx     = require('../core');
var k       = require('../constants');
var Widget  = require('../Widget');

var d       = require('dom-build');

ctx.registerWidget('Canvas2D', module.exports = Widget.extend(function(_super) {

    return [

        function(hk) {
            _super.constructor.call(this, hk);
            this._context = this._root.getContext('2d');
        },

        'methods', {
            getContext: function() {
                return this._context;
            },
            
            getCanvas: function() {
                return this._root;
            },

            layout: function() {
                var rect = this._root.getBoundingClientRect();
                this._root.width = rect.width;
                this._root.height = rect.height;
            },
            
            _buildStructure: function() {
                return d('canvas.hk-canvas.hk-canvas-2d', {tabindex: 0});
            }
        }

    ];

}));
