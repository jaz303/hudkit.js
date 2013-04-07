;(function() {
  
  var hk = modulo.get('hk');
  
  var DEFAULT_PADDING = 8;
  
  var superKlass = hk.Widget.prototype;
  hk.RootPane = hk.Widget.extend({
    methods: {
      init: function() {
        
        this._padding         = [0, DEFAULT_PADDING, DEFAULT_PADDING, DEFAULT_PADDING];
        this._toolbarVisible  = true;
        this._toolbar         = null;
        this._rootWidget      = null;
        
        superKlass.init.apply(this, arguments);
        
        this._setupResizeHandler();
      
      },
      
      dispose: function() {
        this.setToolbar(null);
        this.setRootWidget(null);
        superKlass.dispose.call(this);
      },
      
      setPadding: function(padding) {
        this._padding = hk.parseTRBL(padding);
        this._layout();
      },
      
      setBackgroundColor: function(color) {
        this.root.style.backgroundColor = color;
      },
      
      setToolbar: function(widget) {
        if (widget === this._toolbar)
          return;
        
        if (this._toolbar) {
          this._removeChildViaElement(this._toolbar, this.root);
          this._toolbar = null;
        }
        
        if (widget) {
          this._toolbar = widget;
          this._attachChildViaElement(this._toolbar, this.root);
        }
        
        this._layout();
      },
      
      showToolbar: function() { this._toolbarVisible = true; this._layout(); },
      hideToolbar: function() { this._toolbarVisible = false; this._layout(); },
      toggleToolbar: function() { this._toolbarVisible = !this._toolbarVisible; this._layout(); },
      isToolbarVisible: function() { return this._toolbarVisible; },
      
      setRootWidget: function(widget) {
        if (widget === this._rootWidget)
          return;
        
        if (this._rootWidget) {
          this._removeChildViaElement(this._rootWidget, this.root);
          this._rootWidget = null;
        }
        
        if (widget) {
          this._rootWidget = widget;
          this._attachChildViaElement(this._rootWidget, this.root);
        }
        
        this._layout();
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
            left        = this._padding[3],
            top         = this._padding[0],
            width       = rect.width - (this._padding[1] + this._padding[3]),
            rootTop     = top,
            rootHeight  = rect.height - (2 * this._padding[0] + this._padding[2]);
        
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
  
})();