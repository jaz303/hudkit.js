var du = require('domutil');

exports.initialize = function(ctx, k, theme) {

    ctx.registerWidget('WIDGET', ctx.Widget.extend(function(_sc, _sm) {

        return [

            function() {
                
                _sc.apply(this, arguments);

            },

            'methods', {

                _buildStructure: function() {
                    
                    this._root = this.document.createElement('div');

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
