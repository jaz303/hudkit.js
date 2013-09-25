var Widget = require('./Widget');

var ace = require('brace');

require('brace/mode/javascript');
require('brace/theme/cobalt');

module.exports = Widget.extend(function(_sc, _sm) {

    return [

        function() {

            this._changeTimeout = 750;
            this._changeTimeoutId = null;
            this._muted = false;

            // TODO: signal
            
            _sc.apply(this, arguments);
            
            this._setupHandlers();
        
        },

        'methods', {
            dispose: function() {
                clearTimeout(this._changeTimeoutId);
                // TODO: teardown ACE editor
                _sm.dispose.call(this);
            },
            
            setChangeTimeout: function(timeout) {
                this._changeTimeout = timeout;
            },
            
            muteChangeEvents: function() {
                this._muted = true;
            },
            
            unmuteChangeEvents: function() {
                this._muted = false;
            },
            
            getValue: function() {
                return this._editor.getValue();
            },
            
            setValue: function(newValue) {
                this._editor.setValue(newValue, 1);
            },
            
            getEditor: function() {
                return this._editor;
            },
            
            _buildStructure: function() {
                
                this._root = document.createElement('div');
                this._root.className = 'hk-code-editor';
                
                this._editRoot = document.createElement('div');
                this._editRoot.style.position = 'absolute';
                this._editRoot.style.top = '5px';
                this._editRoot.style.left = '5px';
                this._editRoot.style.bottom = '5px';
                this._editRoot.style.right = '5px';
                this._root.appendChild(this._editRoot);
                
                this._editor = ace.edit(this._editRoot);
                
                var session = this._editor.getSession();
                // session.setUseWorker(false);

            },
            
            _setupHandlers: function() {
                var self = this;
                
                this._editor.on('change', function() {
                    
                    clearTimeout(self._changeTimeoutId);
                    
                    if (self._muted)
                        return;
                    
                    self._changeTimeoutId = setTimeout(function() {
                        if (self._muted)
                            return;
                        // self.contentChanged.emit();
                    }, self._changeTimeout);
                
                });
            },
            
            _applyBounds: function() {
                _sm._applyBounds.apply(this, arguments);
                if (this._editor) {
                    this._editor.resize();
                }
            }
        }

    ]

});