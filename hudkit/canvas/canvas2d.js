;(function(global, hk) {
  
  var superKlass = hk.Widget.prototype;
  
  hk.Canvas2D = hk.Widget.extend({
    methods: {
      init: function() {
        superKlass.init.apply(this, arguments);
      },
      
      _applyBounds: function() {
        this.root.style.left = this.x + 'px';
        this.root.style.top = this.y + 'px';
        this.root.width = this.width;
        this.root.height = this.height;
      },
      
      _buildStructure: function() {
        this.root = document.createElement('canvas');
        this.root.className = 'hk-canvas';
        this.context = this.root.getContext('2d');
      },
    }
  });
  
})(this, hk);