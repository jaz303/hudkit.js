;(function() {
  
  var hk = modulo.get('hk');
  
  var TOOLBAR_ITEM_CLASS = 'hk-toolbar-item';
  
  var superKlass = hk.Widget.prototype;
  hk.Toolbar = hk.Widget.extend({
    methods: {
      init: function() {
        superKlass.init.apply(this, arguments);
      },
      
      addAction: function(action) {
        
        action = hk.createAction(action);
        
        var actionButton = new hk.Button();
        actionButton.setAction(action);
        actionButton._setPositionMode(hk.POSITION_MODE_AUTO_SIZE | hk.POSITION_MODE_FLOWING);

        hk.addClass(actionButton.getRoot(), TOOLBAR_ITEM_CLASS);
        
        this._attachChildViaElement(actionButton, this.root);
        
        return action;
        
      },
      
      addSeparator: function() {
        
      },
      
      _buildStructure: function() {
        this.root = document.createElement('div');
        this.root.className = 'hk-toolbar';
      }
    }
  });
  
})();