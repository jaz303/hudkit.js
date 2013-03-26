;(function(global, hk) {
  
  var CONTEXTS = [ "webgl", "experimental-webgl", "moz-webgl", "webkit-3d" ];
  
  var superKlass = hk.Widget.prototype;
  hk.Canvas3D = hk.Widget.extend({
    methods: {
      init: function() {
        this._context = null;
        superKlass.init.apply(this, arguments);
      },
      
      /**
       * Returns the WebGL context.
       * This method should not be called until the widget has been added to the DOM
       */
      getContext: function() {
        if (!this._context) {
          this._context = this._createContext();
        }
        return this._context;
      },
      
      getCanvas: function() {
        return this.root;
      },
      
      _applyBounds: function() {
        this.root.style.left = this.x + 'px';
        this.root.style.top = this.y + 'px';
        this.root.width = this.width;
        this.root.height = this.height;
        
        if (this._context) {
          this._context.viewport(0, 0, this._context.drawingBufferWidth, this._context.drawingBufferHeight);
        }
      },
      
      _buildStructure: function() {
        this.root = document.createElement('canvas');
        this.root.className = 'hk-canvas hk-canvas-3d';
      },
      
      _createContext: function() {
        var context = null;
        for (var i = 0; i < CONTEXTS.length; ++i) {
          try {
            context = this.root.getContext(CONTEXTS[i]);
            if (context) {
              break;
            }
          } catch (e) {}
        }
        
        if (!context) {
          throw "could not create context - WebGL is not available";
        }
        
        return context;
      }
    }
  });
  
})(this, hk);