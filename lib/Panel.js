var Container = require('./Container');

module.exports = Container.extend(function(_sc, _sm) {

    return [

        function() {
            _sc.apply(this, arguments);
        },

        'methods', {
            _buildStructure: function() {
                this._root = document.createElement('div');
                this._root.className = 'hk-panel';
            }
        }

    ]

});