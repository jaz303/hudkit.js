var Widget = require('./Widget');

function TextCell() {
    this.el = document.createElement('div');
    this.el.className = 'text cell';
    this._text = '';
}

TextCell.prototype.setText = function(text) {
    this._text = '' + (text || '');
    this.el.textContent = this._text;
    return this;
}

TextCell.prototype.setAlign = function(align) {
    this.el.style.textAlign = align;
    return this;
}

TextCell.prototype.setMinWidth = function(minWidth) {
    this.el.style.minWidth = parseInt(minWidth, 10) + 'px';
    return this;
}

TextCell.prototype.setMaxWidth = function(maxWidth) {
    this.el.style.maxWidth = parseInt(maxWidth, 10) + 'px';
    return this;
}

module.exports = Widget.extend(function(_sc, _sm) {

    return [

        function() {
            _sc.apply(this, arguments);

            this._leftCells = [];
            this._rightCells = [];
        },

        'methods', {
            _buildStructure: function() {
                
                this._root = document.createElement('div');
                this._root.className = 'hk-status-bar';
            
                this._left = document.createElement('div');
                this._left.className = 'left-cells';
                this._root.appendChild(this._left);

                this._right = document.createElement('div');
                this._right.className = 'right-cells';
                this._root.appendChild(this._right);

            },

            addTextCell: function(position, text) {

                var cell = new TextCell();
                cell.setText(text);

                if (position.charAt(0) === 'l') {
                    this._leftCells.push(cell);
                    this._left.appendChild(cell.el);
                } else if (position.charAt(0) === 'r') {
                    this._rightCells.push(cell);
                    this._right.appendChild(cell.el);
                } else {
                    throw new Error("unknown status bar cell position: " + position);
                }

                return cell;

            }
        }

    ]

});