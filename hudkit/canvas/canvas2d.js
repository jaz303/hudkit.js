;(function() {
  
  var hk = modulo.get('hk');
  
  var superKlass = hk.Widget.prototype;
  hk.Canvas2D = hk.Widget.extend(function() {
    hk.Widget.apply(this, arguments);
  }, {
    methods: {
      getContext: function() { return this._context; },
      getCanvas: function() { return this.root; },
      
      _applySize: function() {
        this.root.width = this.width;
        this.root.height = this.height;
      },
      
      _buildStructure: function() {
        this.root = document.createElement('canvas');
        this.root.setAttribute('tabindex', 0);
        this.root.className = 'hk-canvas hk-canvas-2d';
        this._context = this.root.getContext('2d');
      },
    }
  });
  
})();