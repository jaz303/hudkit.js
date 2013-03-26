;(function(global, hk) {
  
  var superKlass = hk.Widget.prototype;
  hk.Button = hk.Widget.extend({
    methods: {
      init: function() {
        this._action = null;
        superKlass.init.apply(this, arguments);
      },
      
      dispose: function() {
        this.setAction(null);
        superKlass.dispose.apply(this);
      },
      
      setAction: function(action) {
        
        if (this._action) {
          // TODO: remove this as listener from action
          this._action = null;
        }
        
        if (action) {
          action = hk.createAction(action);
          this._action = action;
          // TODO: add this as listener to action
        }
      
      },
      
      _buildStructure: function() {
        this.root = document.createElement('button');
        this.root.innerText = "Hello!";
        this.root.className = 'hk-button';
      }
    }
  });
  
})(this, hk);