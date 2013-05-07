;(function() {
  
  var hk = modulo.get('hk');
  
  var superKlass = hk.Widget.prototype;
  hk.TabPane = hk.Widget.extend(function() {
    
    this._tabs = [];
    
    hk.Widget.apply(this, arguments);
    
    this._bind();
  
  }, {
    methods: {
      setBounds: function() {
        superKlass.setBounds.apply(this, arguments);
        this._redraw();
      },
      
      addTab: function(title, widget) {
        
        var tab = document.createElement('a');
        tab.innerText = title;
        
        var newTab = {
          title   : title,
          ele     : tab,
          pane    : widget,
          active  : false
        };
        
        this._tabs.push(newTab);
        
        this._tabBar.appendChild(tab);
        
        widget.setHidden(true);
        this._attachChildViaElement(widget, this._tabContainer);
        
        if (this._tabs.length == 1) {
          this.selectTabAtIndex(0);
        }
        
      },
      
      selectTabAtIndex: function(ix) {
        for (var i = 0; i < this._tabs.length; ++i) {
          var tab = this._tabs[i];
          if (i == ix) {
            hk.addClass(tab.ele, 'active');
            tab.active = true;
            tab.pane.setHidden(false);
          } else {
            hk.removeClass(tab.ele, 'active');
            tab.active = false;
            tab.pane.setHidden(true);
          }
          this._redraw();
        }
      },
      
      _buildStructure: function() {
        
        this.root = document.createElement('div');
        this.root.className = 'hk-tab-pane';
        
        this._tabBar = document.createElement('nav');
        this._tabBar.className = 'hk-tab-bar';
        
        this._tabContainer = document.createElement('div');
        this._tabContainer.className = 'hk-tab-container';
        
        this._canvas = document.createElement('canvas');
        this._canvas.className = 'hk-tab-canvas';
        this._canvas.height = hk.theme.TAB_SPACING * 2;
        this._ctx = this._canvas.getContext('2d');
        
        this.root.appendChild(this._canvas);
        this.root.appendChild(this._tabBar);
        this.root.appendChild(this._tabContainer);
        
      },
      
      _bind: function() {
        
        var self = this;
        
        this._tabBar.addEventListener('click', function(evt) {
          evt.preventDefault();
          for (var i = 0; i < self._tabs.length; ++i) {
            if (self._tabs[i].ele === evt.target) {
              self.selectTabAtIndex(i);
              break;
            }
          }
        });
        
      },
      
      _redraw: function() {
        var self = this;
        
        this._tabs.forEach(function(tab, i) {
          tab.pane.setBounds(hk.theme.TAB_SPACING,
                             hk.theme.TAB_SPACING,
                             self.width - (2 * hk.theme.TAB_SPACING),
                             self.height - (3 * hk.theme.TAB_SPACING + hk.theme.TAB_HEIGHT));
                             
          if (tab.active) {
            var width   = tab.ele.offsetWidth,
                height  = tab.ele.offsetHeight,
                left    = tab.ele.offsetLeft,
                top     = tab.ele.offsetTop,
                ctx     = self._ctx;

            width += hk.theme.TAB_BORDER_RADIUS;

            if (i > 0) {
              left -= hk.theme.TAB_BORDER_RADIUS;
              width += hk.theme.TAB_BORDER_RADIUS;
            }

            self._canvas.style.left = '' + left + 'px';
            self._canvas.style.top = '' + (top + height) + 'px';
            self._canvas.width = width;
            
            ctx.fillStyle = hk.theme.TAB_BACKGROUND_COLOR;

            var arcY = hk.theme.TAB_SPACING - hk.theme.TAB_BORDER_RADIUS;

            if (i == 0) {
              ctx.fillRect(0, 0, width - hk.theme.TAB_BORDER_RADIUS, self._canvas.height);
              ctx.beginPath();
              ctx.arc(width, arcY, hk.theme.TAB_BORDER_RADIUS, Math.PI, Math.PI / 2, true);
              ctx.lineTo(width - hk.theme.TAB_BORDER_RADIUS, hk.theme.TAB_SPACING);
              ctx.lineTo(width - hk.theme.TAB_BORDER_RADIUS, 0);
              ctx.fill();
            } else {
              ctx.beginPath();
              ctx.moveTo(hk.theme.TAB_BORDER_RADIUS, 0);
              ctx.arc(0, arcY, hk.theme.TAB_BORDER_RADIUS, 0, Math.PI / 2, false);
              ctx.lineTo(width, hk.theme.TAB_SPACING);
              ctx.arc(width, arcY, hk.theme.TAB_BORDER_RADIUS, Math.PI / 2, Math.PI, false);
              ctx.lineTo(hk.theme.TAB_BORDER_RADIUS, 0);
              ctx.fill();
            }
          }
        });
      }
    }
  });
  
})();