;(function(global, hk) {
  
  var superKlass = hk.Widget.prototype;
  hk.RootPane = hk.Widget.extend({
    methods: {
      init: function() {
        this._rootWidget = null;
        superKlass.init.apply(this, arguments);
        this._setupResizeHandler();
      },
      
      setRootWidget: function(widget) {
        
        if (this._rootWidget) {
          this._rootWidget.removeFromParent();
          this._rootWidget = null;
        }
        
        if (widget) {
          widget._attachToParentViaElement(this, this.root);
          this._rootWidget = widget;
          this._layout();
        }
        
      },
      
      setBounds: function() {
        /* no-op; root widget always fills its containing DOM element */
      },
      
      _buildStructure: function() {
        this.root = document.createElement('div');
        this.root.className = 'hk-root-pane';
      },
      
      _layout: function() {
        if (this._rootWidget) {
          var rect = this.root.getBoundingClientRect();
          this._rootWidget.setBounds(0, 0, rect.width, rect.height);
        }
      },
      
      _setupResizeHandler: function() {
        var self    = this,
            timeout = null;
        
        window.addEventListener('resize', function() {
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(function() { self._layout(); }, 300);
        });
      }
    }
  });
  
})(this, hk);