;(function() {
  
  var hk = modulo.get('hk');
  
  var superKlass = hk.Widget.prototype;
  hk.Button = hk.Widget.extend({
    methods: {
      init: function() {
        this._action = null;
        superKlass.init.apply(this, arguments);
        
        var self = this;
        
        this.root.addEventListener('click', function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
          if (self._action) self._action(self);
        });
        
        this._handleActionChanged = function() { self._update(); }
      },
      
      dispose: function() {
        this.setAction(null);
        this._handleActionChanged = null;
        superKlass.dispose.apply(this);
      },
      
      getAction: function() {
        return this._action;
      },
      
      setAction: function(action) {
        
        if (action === this._action)
          return;
        
        if (this._action) {
          this._action.removeObserver(this._handleActionChanged);
          this._action = null;
        }
        
        if (action) {
          action = hk.createAction(action);
          this._action = action;
          this._action.addObserver(this._handleActionChanged);
        }
        
        this._update();
      
      },
      
      _buildStructure: function() {
        this.root = document.createElement('a');
        this.root.href = '#';
        this.root.className = 'hk-button';
      },
      
      _update: function() {
        
        var title   = "",
            enabled = true;
        
        if (this._action) {
          title = this._action.getTitle();
          enabled = this._action.isEnabled();
        }
        
        this.root.innerText = title;
        if (enabled) {
          hk.removeClass(this.root, 'disabled');
        } else {
          hk.addClass(this.root, 'disabled');
        }
        
      }
    }
  });
  
})();