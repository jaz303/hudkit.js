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