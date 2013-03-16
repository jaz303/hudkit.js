;(function(global, hk) {
  
  var NO_CONSTRUCT = {};
  function Widget() {}
  
  function makeCSSClassFun(klass) {
    return function() { return klass; }
  }
  
  Widget.prototype = {
    init: function() {
      
      var root = this._buildStructure();
      if (root) this.root = root;
      if (!this.root) throw "widget root not built";
      
      hk.addClass(this.root, 'hk-widget ' + this._widgetCSSClass());
      
      this._parent = null;
      
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
    
    setRect: function(rect) {
      return this.setBounds(rect.x, rect.y, rect.width, rect.height);
    },
    
    setBounds: function(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this._applyBounds();
    },
    
    _buildStructure: function() {
      return document.createElement('div');
    },
    
    _widgetCSSClass: function() {
      return '';
    },
    
    _applyBounds: function() {
      this.root.style.left = this.x + 'px';
      this.root.style.top = this.y + 'px';
      this.root.style.width = this.width + 'px';
      this.root.style.height = this.height + 'px';
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
    
    //
    // Widget CSS class
    
    if ('widgetCSSClass' in features) {
      widgetKlass.prototype._widgetCSSClass = makeCSSClassFun(features.widgetCSSClass);
    }
    
    return widgetKlass;
    
  }
  
  hk.Widget = Widget;
  
})(this, hk);