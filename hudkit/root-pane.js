;(function(global, hk) {
  
  var DEFAULT_PADDING = 0;
  
  var superKlass = hk.Widget.prototype;
  hk.RootPane = hk.Widget.extend({
    methods: {
      init: function() {
        
        this._padding         = DEFAULT_PADDING;
        this._toolbarVisible  = true;
        this._toolbar         = null;
        this._rootWidget      = null;
        
        superKlass.init.apply(this, arguments);
        
        this._setupResizeHandler();
      
      },
      
      setPadding: function(padding) {
        this._padding = hk.parseInt(padding);
        this._layout();
      },
      
      setBackgroundColor: function(color) {
        this.root.style.backgroundColor = color;
      },
      
      setToolbar: function(widget) {
        
        if (widget == this._toolbar) {
          return;
        }
        
        if (this._toolbar) {
          this._toolbar.removeFromParent();
          this._toolbar = null;
        }
        
        if (widget) {
          widget._attachToParentViaElement(this, this.root);
          this._toolbar = widget;
          this._layout();
        }
        
      },
      
      showToolbar: function() { this._toolbarVisible = true; this._layout(); },
      hideToolbar: function() { this._toolbarVisible = false; this._layout(); },
      toggleToolbar: function() { this._toolbarVisible = !this._toolbarVisible; this._layout(); },
      isToolbarVisible: function() { return this._toolbarVisible; },
      
      setRootWidget: function(widget) {
        
        if (widget == this._rootWidget) {
          return;
        }
        
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
      
      setBounds: function(x, y, width, height) {
        /* no-op; root widget always fills its containing DOM element */
      },
      
      _buildStructure: function() {
        this.root = document.createElement('div');
        this.root.className = 'hk-root-pane';
      },
      
      _layout: function() {
        
        var rect        = this.root.getBoundingClientRect(),
            left        = this._padding,
            top         = this._padding,
            width       = rect.width - (2 * this._padding),
            rootTop     = top,
            rootHeight  = rect.height - (2 * this._padding);
        
        if (this._toolbar && this._toolbarVisible) {
          
          this._toolbar.setHidden(false);
          this._toolbar.setBounds(left + hk.theme.TOOLBAR_MARGIN_LEFT,
                                  top + hk.theme.TOOLBAR_MARGIN_TOP,
                                  width - (hk.theme.TOOLBAR_MARGIN_LEFT + hk.theme.TOOLBAR_MARGIN_RIGHT),
                                  hk.theme.TOOLBAR_HEIGHT);
          
          var delta = hk.theme.TOOLBAR_HEIGHT + hk.theme.TOOLBAR_MARGIN_BOTTOM + hk.theme.TOOLBAR_MARGIN_TOP;
          rootTop += delta;
          rootHeight -= delta;
        
        } else if (this._toolbar) {
          this._toolbar.setHidden(true);
        }
        
        if (this._rootWidget) {
          this._rootWidget.setBounds(left, rootTop, width, rootHeight);
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