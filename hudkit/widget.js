;(function(global, hk) {
  
  function Widget() {
    this.init.apply(this, arguments);
  }
  
  Widget.prototype = {
    init: function() {
      
      var root = this._buildStructure();
      if (root) this.root = root;
      if (!this.root) throw "widget root not built";
      
      hk.addClass(this.root, 'hk-widget');
      
    },
    
    getRoot: function() {
      return this.root;
    },
    
    setBounds: function(x, y, width, height) {
      this.root.style.left = x + 'px';
      this.root.style.top = y + 'px';
      this.root.style.width = width + 'px';
      this.root.style.height = height + 'px';
    },
    
    _buildStructure: function() {
      return document.createElement('div');
    },
  };
  
  hk.Widget = Widget;
  
})(this, hk);