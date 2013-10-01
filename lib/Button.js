var Widget = require('./Widget');

var du = require('domutil');

module.exports = Widget.extend(function(_sc, _sm) {

    return [

        function() {
            
            this._action = null;
            _sc.apply(this, arguments);

            var self = this;
            this._root.addEventListener('click', function(evt) {
                
                evt.preventDefault();
                evt.stopPropagation();
                
                if (self._action)
                    self._action(self);
            
            });

        },

        'methods', {

            dispose: function() {
                this.setAction(null);
                _sm.dispose.call(this);
            },

            getAction: function() {
                return this._action;
            },

            setAction: function(action) {

                if (action === this._action)
                    return;

                if (this._action) {
                    this._actionUnbind();
                    this._action = null;
                }

                if (action) {
                    this._action = action;
                    this._actionUnbind = this._action.onchange.connect(this._sync.bind(this));
                }

            },
            
            _buildStructure: function() {
                
                this._root = document.createElement('a');
                this._root.href = '#';
                this._root.className = 'hk-button';
            
                this._text = document.createElement('span');

                this._root.appendChild(this._text);

            },

            _sync: function() {

                var title   = "",
                    enabled = true;

                if (this._action) {
                    title = this._action.getTitle();
                    enabled = this._action.isEnabled();
                }

                this._text.textContent = title;
                if (enabled) {
                    du.removeClass(this._root, 'disabled');
                } else {
                    du.addClass(this._root, 'disabled');
                }

            }
        
        }

    ]

});