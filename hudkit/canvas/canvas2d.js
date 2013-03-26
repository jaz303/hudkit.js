;(function(global, hk) {
  
  var superKlass = hk.Widget.prototype;
  hk.Canvas2D = hk.Widget.extend({
    methods: {
      init: function() {
        superKlass.init.apply(this, arguments);
      },
      
      getContext: function() { return this._context; },
      getCanvas: function() { return this.root; },
      
      _applyBounds: function() {
        this.root.style.left = this.x + 'px';
        this.root.style.top = this.y + 'px';
        this.root.width = this.width;
        this.root.height = this.height;
      },
      
      _buildStructure: function() {
        this.root = document.createElement('canvas');
        this.root.className = 'hk-canvas hk-canvas-2d';
        this._context = this.root.getContext('2d');
      },
    }
  });
  
})(this, hk);