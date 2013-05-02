;(function() {
  
  var hk = modulo.get('hk');
  
  var Widget = Base.extend(function(rect) {
      
    this._positionMode = hk.POSITION_MODE_DEFAULT;
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
    
  }, {
    methods: {
      /**
       * Call on a widget when you're done with it and never want to use it again.
       *
       * There is no need to remove this widget's root from the DOM, this guaranteed
       * to have happened by the time dispose() is called. However, container widgets
       * *must* remove all of their children (non-recursively).
       *
       * Subclasses should override this method to unregister listeners, remove child
       * widgets and nullify any references likely to cause memory leaks.
       */
      dispose: function() {
        this.root = null;
      },

      getRoot: function() { return this.root; },

      getParent: function() { return this._parent; },
      setParent: function(p) { this._parent = p; },

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

        if (this._positionMode & hk.POSITION_MODE_AUTO_SIZE) {
          this.root.style.width = 'auto';
          this.root.style.height = 'auto';
        } else {
          this._applyPosition();
        }

        if (this._positionMode & hk.POSITION_MODE_FLOWING) {
           this.root.style.position = 'relative';
           this.root.style.left = '';
           this.root.style.top = '';
        } else {
          this.root.style.position = '';
          this._applySize();
        }

      },

      _applyPosition: function() {
        this.root.style.left = this.x + 'px';
        this.root.style.top = this.y + 'px';
      },

      _applySize: function() {
        this.root.style.width = this.width + 'px';
        this.root.style.height = this.height + 'px';
      },

      /**
       * Call this method when you wish to explicitly take control of this widget's
       * positioning. This is useful, for example, when the widget needs to
       * participate in a float-based layout.
       *
       * POSITION_MODE_DEFAULT    - absolute position, explicit size
       * POSITION_MODE_AUTO_SIZE  - width and height set to 'auto'
       * POSITION_MODE_FLOWING    - position set to 'relative'
       *
       * This method should be used sparingly and as such it is marked as protected.
       * Ideally it should only be called by container widgets and layout managers,
       * who should set the position mode of every child that is added to them.
       *
       * Calls to setBounds() will respect the current position mode.
       *
       * @param newMode bitmask of hk.POSITION_MODE_* constants
       */
      _setPositionMode: function(newMode) {

        if (newMode == this._positionMode)
          return;

        this._positionMode = newMode;
        this._applyBounds();

      },

      _defaultSize: function() {
        return [100, 100];
      },

      _cssDisplayMode: function() {
        return 'block';
      },

      _attachChildViaElement: function(childWidget, ele) {

        // TODO: it would probably be better if we just asked the
        // child to remove itself from the its current parent here
        // but that pre-supposes a standard interface for removing
        // elements from "containers", which we don't have yet. And
        // I'm not willing to commit to an interface that hasn't yet
        // proven to be required...
        var existingParent = childWidget.getParent();
        if (existingParent) {
          throw "can't attach child widget - child already has a parent!";
        }

        ele = ele || this.getRoot();
        ele.appendChild(childWidget.getRoot());
        childWidget.setParent(this);

      },

      _removeChildViaElement: function(childWidget, ele) {

        ele = ele || this.getRoot();
        ele.removeChild(childWidget.getRoot());
        childWidget.setParent(null);

      }
    }
  });
  
  hk.Widget = Widget;
  
})();