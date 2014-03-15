var du = require('domutil');

exports.initialize = function(ctx, k, theme) {

    ctx.registerWidget('Button', ctx.InlineWidget.extend(function(_sc, _sm) {

        return [

            function(hk, type) {
                
                _sc.call(this, hk);

                this._addSignal('onAction');

                this._enabled = true;
                this._title = "";

                this._buttonType = type || 'rounded';
                this._buttonClass = '';

                this._baseClass = this._root.className;
                this._updateClass();

            },

            'methods', {

                dispose: function() {
                    this.setAction(null);
                    _sm.dispose.call(this);
                },

                //
                // Action

                bindAction: function(action) {

                    var self = this;

                    function sync() {
                        self.setTitle(action.getTitle());
                        self.setEnabled(action.isEnabled());
                    }

                    var unbindAction    = this.onAction.connect(action),
                        unbindSync      = action.onchange.connect(sync);

                    sync();

                    return function() {
                        unbindAction();
                        unbindSync();
                    }

                },

                //
                // Enabled

                isEnabled: function() {
                    return this._enabled;
                },

                setEnabled: function(enabled) {
                    enabled = !!enabled;
                    if (enabled !== this._enabled) {
                        this._enabled = enabled;
                        if (this._enabled) {
                            du.removeClass(this._root, 'disabled');
                        } else {
                            du.addClass(this._root, 'disabled');
                        }
                    }
                },

                //
                // Title

                getTitle: function() {
                    return this._title;
                },

                setTitle: function(title) {
                    title = '' + title;
                    if (title !== this._title) {
                        this._title = this._text.textContent = title;
                    }
                },

                //
                // Type

                getButtonType: function() {
                    return this._buttonType;
                },

                setButtonType: function(type) {
                    this._buttonType = type;
                    this._updateClass();
                },

                //
                // Class

                getButtonClass: function() {
                    return this._buttonClass;
                },

                setButtonClass: function() {
                    this._buttonClass = className || '';
                    this._updateClass();
                },

                //
                //
                
                _buildStructure: function() {

                    var self = this;
                    
                    this._root = this.document.createElement('a');
                    this._root.href = '#';
                    
                    this._text = this.document.createElement('span');
                    this._root.appendChild(this._text);

                    this._root.addEventListener('click', function(evt) {
                        
                        evt.preventDefault();
                        evt.stopPropagation();

                        if (self._enabled) {
                            self.onAction.emit(self);
                        }
                    
                    });

                },

                _updateClass: function() {

                    var className = this._baseClass + ' hk-button-common';
                    className += ' hk-' + this._buttonType + '-button';
                    className += ' ' + this._buttonClass;

                    if (!this._enabled) {
                        className += ' disabled';
                    }

                    this._root.className = className;

                },

                _applySizeHints: function() {
                    this._applyHintedProperty(this._root, 'width');
                    this._applyHintedProperty(this._root, 'height');
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
