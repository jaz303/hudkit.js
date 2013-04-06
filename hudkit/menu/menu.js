;(function() {
  
  var hk = modulo.get('hk');
  
  function HKMenuActionItem(action) {
    this.action = action;
    this.root = document.createElement('a');
    this.root.href = '#';
    this.root.className = 'hk-menu-action-item';
    this.root.addEventListener('click', action);
    this.revalidate();
  }
  
  HKMenuActionItem.prototype = {
    revalidate: function() {
      this.root.innerText = this.action.getTitle();
      // TODO: enabled state
    }
  }
  
  function HKMenu(opts) {
    opts = opts || {};
    this.title = opts.title || "Untitled";
    
    this.root = document.createElement('menu');
    this.root.className = 'hk-menu';
    
    this.items = [];
  }
  
  HKMenu.prototype = {
    getTitle: function() { return this.title; },
    setTitle: function(t) { this.title = t; },
    
    addAction: function(action) {
      var item = new HKMenuActionItem(action);
      this.items.push(item);
      this.root.appendChild(item.root);
    },
    
    addMenu: function(menu) {
      
    },
    
    addSeparator: function() {
      
    },
    
    revalidate: function() {
      for (var i = 0; i < this.items.length; ++i) {
        this.items[i].revalidate();
      }
    }
  };
  
  hk.createMenu = function(options) {
    return new HKMenu(options);
  }
  
})();