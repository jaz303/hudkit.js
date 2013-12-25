module.exports = function(hk, k, theme) {

    //
    // Widget

    hk.Box = hk.Widget.extend(function(_sc, _sm) {

        return [

            function() {
                _sc.apply(this, arguments);
                this.setBackgroundColor('white');
            },

            'methods', {
                
                setBackgroundColor: function(color) {
                    this._root.style.backgroundColor = color;
                },

                _buildStructure: function() {
                    this._root = document.createElement('div');
                    this._root.className = 'hk-box';
                }

            }

        ]

    });

};