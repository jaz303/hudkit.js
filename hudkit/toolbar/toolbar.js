;(function() {
  
  var hk = modulo.get('hk');
  
  hk.TOOLBAR_ALIGN_LEFT     = 1,
  hk.TOOLBAR_ALIGN_RIGHT    = 2;
  
  var TOOLBAR_ITEM_CLASS    = 'hk-toolbar-item';
  
  var superKlass = hk.Widget.prototype;
  hk.Toolbar = hk.Widget.extend(function() {
    
    hk.Widget.apply(this, arguments);
  
  }, {
    methods: {
      addAction: function(action, align) {
        
        align = align || hk.TOOLBAR_ALIGN_LEFT;
        var target = (align == hk.TOOLBAR_ALIGN_LEFT) ? this._left : this._right;
        
        action = hk.createAction(action);
        
        var actionButton = new hk.Button();
        actionButton.setAction(action);
        actionButton._setPositionMode(hk.POSITION_MODE_AUTO_SIZE | hk.POSITION_MODE_FLOWING);

        hk.addClass(actionButton.getRoot(), TOOLBAR_ITEM_CLASS);
        
        this._attachChildViaElement(actionButton, target);
        
        return action;
        
      },
      
      addSeparator: function() {
        
      },
      
      _buildStructure: function() {
        this.root = document.createElement('div');
        
        this._left = document.createElement('div');
        this._left.className = 'hk-toolbar-items hk-toolbar-items-left';
        this.root.appendChild(this._left);
        
        this._right = document.createElement('div');
        this._right.className = 'hk-toolbar-items hk-toolbar-items-right';
        this.root.appendChild(this._right);
        
        this.root.className = 'hk-toolbar';
      }
    }
  });
  
})();