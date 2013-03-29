;(function(global, hk) {
  
  var superKlass = hk.Widget.prototype;
  hk.CodeEditor = hk.Widget.extend({
    methods: {
      init: function() {
        this._changeTimeout = 750;
        this._changeTimeoutId = null;
        superKlass.init.apply(this, arguments);
        this._setupHandlers();
      },
      
      setChangeTimeout: function(timeout) {
        this._changeTimeout = timeout;
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
      },
      
      _setupHandlers: function() {
        var self = this;
        
        this._editor.on('change', function() {
          clearTimeout(self._changeTimeoutId);
          self._changeTimeoutId = setTimeout(function() {
          }, self._changeTimeout);
        });
      },
      
      _applyBounds: function() {
        superKlass._applyBounds.apply(this, arguments);
        if (this._editor) {
          this._editor.resize();
        }
      }
    }
  });
  
})(this, hk);