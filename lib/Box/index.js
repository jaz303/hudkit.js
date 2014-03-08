exports.initialize = function(ctx, k, theme) {

    ctx.registerWidget('Box', ctx.BlockWidget.extend(function(_sc, _sm) {

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

    }));

}

exports.attach = function(instance) {
    // no styles here
}
