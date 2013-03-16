;(function(global, hk) {
  
  hk.SPLIT_PANE_HORIZONTAL    = 1;
  hk.SPLIT_PANE_VERTICAL      = 2;
  
  var superKlass = hk.Widget.prototype;
  hk.SplitPane = hk.Widget.extend({
    methods: {
      init: function() {
        this._widgets = [null, null];
        this._split = 0.5;
        superKlass.init.apply(this, arguments);
        this.setOrientation(hk.SPLIT_PANE_HORIZONTAL);
      },
      
      setOrientation: function(orientation) {
        if (orientation == hk.SPLIT_PANE_HORIZONTAL) {
          hk.removeClass(this.root, 'vertical');
          hk.addClass(this.root, 'horizontal');
        } else if (orientation == hk.SPLIT_PANE_VERTICAL) {
          hk.removeClass(this.root, 'horizontal');
          hk.addClass(this.root, 'vertical');
        } else {
          throw "unknown SplitPane orientation: " + orientation;
        }
        this._orientation = orientation;
        this._layout();
      },
      
      setBounds: function(x, y, w, h) {
        superKlass.setBounds.call(this, x, y, w, h);
        this._layout();
      },
      
      setLeftWidget   : function(widget) { this.setWidgetAtIndex(0, widget); },
      setTopWidget    : function(widget) { this.setWidgetAtIndex(0, widget); },
      setRightWidget  : function(widget) { this.setWidgetAtIndex(1, widget); },
      setBottomWidget : function(widget) { this.setWidgetAtIndex(1, widget); },
      
      setWidgetAtIndex: function(ix, widget) {
        
        var existingWidget = this._widgets[ix];
        
        if (this._widgets[ix]) {
          this._widgets[ix].removeFromParent();
          this._widgets[ix] = null;
        }
        
        if (widget) {
          this._widgets[ix] = widget;
          widget._attachToParentViaElement(this, this.root);
          this._layout();
        }
        
        return existingWidget;
        
      },
      
      _buildStructure: function() {
        this.root = document.createElement('div');
        this.root.className = 'hk-split-pane';
        
        this._divider = document.createElement('div');
        this._divider.className = 'hk-split-pane-divider';
        
        this.root.appendChild(this._divider);
      },
      
      _layout: function() {
        if (this._orientation == hk.SPLIT_PANE_VERTICAL) {
          
          var divt  = Math.floor(this._split * this.height - (hk.SPLIT_PANE_DIVIDER_SIZE / 2)),
              w2t   = divt + hk.SPLIT_PANE_DIVIDER_SIZE,
              w2h   = this.height - w2t;
          
          this._divider.style.left = '';
          this._divider.style.top = divt + 'px';
          
          if (this._widgets[0]) this._widgets[0].setBounds(0, 0, this.width, divt);
          if (this._widgets[1]) this._widgets[1].setBounds(w2t, 0, this.width, w2h);
        
        } else if (this._orientation == hk.SPLIT_PANE_HORIZONTAL) {
          
          var divl  = Math.floor(this._splt * this.width - (hk.SPLIT_PANE_DIVIDER_SIZE / 2)),
              w2l   = divl + hk.SPLIT_PANE_DIVIDER_SIZE,
              w2w   = this.width - w2l;
            
          this._divider.style.left = divl + 'px';
          this._divider.style.top = '';
          
          if (this._widgets[0]) this._widgets[0].setBounds(0, 0, divl, this.height);
          if (this._widgets[1]) this._widgets[1].setBounds(w2l, 0, w2w, this.height);
          
        }
      }
    }
  });
  
})(this, hk);