;(function(global, hk) {
  
  var NO_CONSTRUCT = {};
  function Widget() {}
  
  Widget.prototype = {
    init: function(rect) {
      
      this._parent = null;
      this._hidden = false;
      
      var root = this._buildStructure();
      if (root) this.root = root;
      if (!this.root) throw "widget root not built";
      hk.addClass(this.root, 'hk-widget');
      
      if (rect) {
        this.setBounds(rect.x, rect.y, rect.width, rect.height, true);
      } else {
        var size = this._defaultSize();
        this.setBounds(0, 0, size[0], size[1]);
      }
      
    },
    
    /**
     * Call on a widget when you're done with it and never want to use it again.
     * Widget will be removed from its parent and reference to root node nullified.
     * It's invalid to call any other methods on a Widget instance after it has been
     * dispose()'d.
     * Subclasses should override this method to unregister listeners and nullify
     * any references likely to cause memory leaks.
     */
    dispose: function() {
      if (this._parent) {
        this.removeFromParent();
      }
      this.root = null;
    },
    
    getRoot: function() { return this.root; },
    getParent: function() { return this._parent; },
    
    removeFromParent: function() {
      this.root.parentNode.removeChild(this.root);
      this._parent = null;
    },
    
    _attachToParentViaElement: function(parentWidget, ele) {
      
      if (this._parent) {
        this.removeFromParent();
      }
      
      ele = ele || parentWidget.getRoot();
      ele.appendChild(this.root);
      this._parent = parentWidget;
    
    },
    
    isHidden: function() { return this._hidden; },
    setHidden: function(hidden) {
      this._hidden = !!hidden;
      this.root.style.display = this._hidden ? 'none' : this._cssDisplayMode();
    },
    
    setRect: function(rect) {
      return this.setBounds(rect.x, rect.y, rect.width, rect.height);
    },
    
    /**
     * Set the position and size of this widget
     * Of all the public methods for manipulating a widget's size, setBounds()
     * is the one that does the actual work. If you need to override resizing
     * behaviour in a subclass (e.g. see hk.RootPane), this is the only method
     * you need to override.
     */
    setBounds: function(x, y, width, height) {
      this._setBounds(x, y, width, height);
      this._applyBounds();
    },
    
    /**
     * A widget's implementation of this method should create that widget's
     * HTML structure and either assign it to this.root or return it. There
     * is no need to assign the CSS class `hk-widget`; this is done by the
     * widget initialiser, but any additional CSS classes must be added by
     * your code.
     *
     * Shortly after it has called _buildStructure(), the initialiser will
     * call setBounds() - a method you may have overridden to perform
     * additional layout duties - so ensure that the HTML structure is
     * set up sufficiently for this call to complete.
     */
    _buildStructure: function() {
      throw "widgets must override Widget._buildStructure()";
    },
    
    _setBounds: function(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    },
    
    _applyBounds: function() {
      this.root.style.left = this.x + 'px';
      this.root.style.top = this.y + 'px';
      this.root.style.width = this.width + 'px';
      this.root.style.height = this.height + 'px';
    },
    
    /**
     * Call this method when you wish to explicitly take control of this widget's
     * positioning. This is useful, for example, when the widget needs to
     * participate in a float-based layout.
     *
     * This method should be used sparingly and as such it is marked as protected.
     * Ideally it should only be called by container widgets and layout managers.
     *
     * Whilst a widget is using manual bounds, it is illegal to attempt to adjust
     * its geometry via setBounds() and setRect()
     */
    _useManualBounds: function(flags) {
      if (flags & hk.MANUAL_BOUNDS_STATIC) { // TODO: rename this
        this.root.style.position = 'relative';
      }
      if (flags & hk.MANUAL_BOUNDS_POSITION) {
        this.root.style.left = '';
        this.root.style.top = '';
      }
      if (flags & hk.MANUAL_BOUNDS_SIZE) {
        this.root.style.width = '';
        this.root.style.height = '';
      }
    },
    
    _useAutoBounds: function() {
      this.root.style.position = '';
      this._applyBounds();
    },
    
    _defaultSize: function() {
      return [100, 100];
    },
    
    _cssDisplayMode: function() {
      return 'block';
    }
  };
  
  Widget.extend = function(features) {
    
    var widgetKlass = function(guard) {
      if (guard === NO_CONSTRUCT)
        return;
      this.init.apply(this, arguments);
    }
    
    widgetKlass.prototype = new this(NO_CONSTRUCT);
    widgetKlass.extend = this.extend;
    
    features = features || {};
    
    //
    // Methods
    
    var methods = features.methods || {};
    for (var m in methods) {
      widgetKlass.prototype[m] = methods[m];
    }
    
    return widgetKlass;
    
  }
  
  hk.Widget = Widget;
  
})(this, hk);