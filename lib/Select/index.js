var ctx             = require('../core'),
    theme           = require('../theme'),
    k               = require('../constants'),
    InlineWidget    = require('../InlineWidget'),
    du              = require('domutil');

ctx.registerWidget('Select', module.exports = InlineWidget.extend(function(_sc, _sm) {

    return [

        function(hk) {
            _sc.call(this, hk);
        },

        'methods', {

            dispose: function() {
                _sm.dispose.call(this);
            },
            
            _buildStructure: function() {
                this._root = this.document.createElement('select');
                this._root.type = 'text'
                this._root.className = 'hk-select';

                this._root.innerHTML = "<option>Choice 1</option><option>Choice 2</option><option>Choice 3</option>";

            }
        
        }

    ];

}));

ctx.registerCSS(require('fs').readFileSync(__dirname + '/style.unwise', 'utf8'));