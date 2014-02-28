var du = require('domutil');

exports.initialize = function(ctx, k, theme) {

    ctx.registerWidget('Button', ctx.Widget.extend(function(_sc, _sm) {

        return [

            function(hk, rect, type) {

                if (typeof rect === 'string') {
                    type = rect;
                    rect = null;
                }
                
                this._action = null;
                this._buttonType = type || 'rounded';
                this._buttonClass = '';

                _sc.call(this, hk, rect);

                this._updateClass();

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

                    this._sync();

                },

                getButtonType: function() {
                    return this._buttonType;
                },

                setButtonType: function(type) {
                    this._buttonType = type;
                    this._updateClass();
                },

                getButtonClass: function() {
                    return this._buttonClass;
                },

                setButtonClass: function() {
                    this._buttonClass = className || '';
                    this._updateClass();
                },
                
                _buildStructure: function() {
                    
                    this._root = this.document.createElement('a');
                    this._root.href = '#';

                    this._text = this.document.createElement('span');
                    this._root.appendChild(this._text);

                    this._updateClass();

                },

                _defaultPositionMode: function() {
                    return k.POSITION_MODE_AUTO;
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

                },

                _updateClass: function() {

                    var className = 'hk-button-common';
                    className += ' hk-' + this._buttonType + '-button';
                    className += ' ' + this._buttonClass;

                    if (this._action && !this._action.isEnabled()) {
                        className += ' disabled';
                    }

                    this._root.className = className;

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
