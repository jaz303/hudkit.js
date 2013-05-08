;(function() {
  
  var hk = modulo.get('hk');
  
  var supr = hk.Widget.prototype;
  hk.CodeEditor = hk.Widget.extend(function() {
    
    this._changeTimeout = 750;
    this._changeTimeoutId = null;
    this._muted = false;
    
    this._addSignal('contentChanged');
    
    hk.Widget.apply(this, arguments);
    this._setupHandlers();
    
  }, {
    methods: {
      dispose: function() {
        clearTimeout(this._changeTimeoutId);
        this.contentChanged.disconnectAll();
        // TODO: teardown ACE editor
        supr.dispose.apply(this);
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
        this.root = document.createElement('div');
        this.root.className = 'hk-code-editor';
        
        this._editRoot = document.createElement('div');
        this._editRoot.style.position = 'absolute';
        this._editRoot.style.top = '5px';
        this._editRoot.style.left = '5px';
        this._editRoot.style.bottom = '5px';
        this._editRoot.style.right = '5px';
        this.root.appendChild(this._editRoot);
        
        this._editor = ace.edit(this._editRoot);
        this._editor.setTheme("ace/theme/cobalt");
        this._editor.getSession().setMode("ace/mode/javascript");

        var session = this._editor.getSession();
        session.setUseWorker(false);
      },
      
      _setupHandlers: function() {
        var self = this;
        
        this._editor.on('change', function() {
          clearTimeout(self._changeTimeoutId);
          if (self._muted) return;
          self._changeTimeoutId = setTimeout(function() {
            if (self._muted) return;
            self.contentChanged.emit();
          }, self._changeTimeout);
        });
      },
      
      _applyBounds: function() {
        supr._applyBounds.apply(this, arguments);
        if (this._editor) {
          this._editor.resize();
        }
      }
    }
  });
  
})();