;(function(global, hk) {
  
  var CONTEXTS = [ "webgl", "experimental-webgl", "moz-webgl", "webkit-3d" ];
  
  var superKlass = hk.Widget.prototype;
  hk.Canvas3D = hk.Widget.extend({
    methods: {
      init: function() {
        superKlass.init.apply(this, arguments);
      },
      
      getContext: function() {
        return this._context;
      },
      
      _applyBounds: function() {
        this.root.style.left = this.x + 'px';
        this.root.style.top = this.y + 'px';
        this.root.width = this.width;
        this.root.height = this.height;
      },
      
      _buildStructure: function() {
        
        this.root = document.createElement('canvas');
        this.root.className = 'hk-canvas hk-canvas-3d';
        
        this._context = null;
        for (var i = 0; i < CONTEXTS.length; ++i) {
          try {
            this._context = this.root.getContext(CONTEXTS[i]);
            if (this._context) {
              break;
            }
          } catch (e) {}
        }
        
        if (!this._context) {
          throw "could not create hk.Canvas3D - WebGL not available";
        }
        
      },
    }
  });
  
})(this, hk);