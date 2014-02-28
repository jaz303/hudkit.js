;(function() {
  
  var hk = modulo.get('hk');
  
  var SHOW_HIDDEN         = 1,
      SHOW_VISIBLE        = 2,
      SHOW_ANIMATING      = 3;
                          
  var ABSOLUTE_MIN_W      = 200,
      ABSOLUTE_MIN_H      = 200;
      
  var ROLLED_HEIGHT       = (2 * hk.theme.DIALOG_PADDING) + hk.theme.DIALOG_HEADER_HEIGHT,
      HORIZONTAL_PADDING  = (2 * hk.theme.DIALOG_PADDING),
      VERTICAL_PADDING    = (3 * hk.theme.DIALOG_PADDING) + hk.theme.DIALOG_HEADER_HEIGHT,
      CONTENT_TOP         = ROLLED_HEIGHT,
      CONTENT_LEFT        = hk.theme.DIALOG_PADDING;
      
  hk.DIALOG_RESIZE_NONE         = 0;  
  hk.DIALOG_RESIZE_HORIZONTAL   = 1;
  hk.DIALOG_RESIZE_VERTICAL     = 2;
  hk.DIALOG_RESIZE_ANY          = 3;
  
  function Dialog() {
    
    var root = document.createElement('div');
    root.className = 'hk-dialog';
    
    var header = document.createElement('header');
    header.className = 'hk-dialog-header';
    
    var title = document.createElement('span');
    title.className = 'hk-dialog-title';
    
    var closeButton = document.createElement('a');
    closeButton.href = '#';
    closeButton.className = 'hk-dialog-close';
    
    var shadeButton = document.createElement('a');
    shadeButton.href = '#';
    shadeButton.className = 'hk-dialog-shade';
    
    var resizeHorizontal = document.createElement('div');
    resizeHorizontal.className = 'hk-dialog-resize-handle hk-dialog-resize-horizontal';
    
    var resizeVertical = document.createElement('div');
    resizeVertical.className = 'hk-dialog-resize-handle hk-dialog-resize-vertical';
    
    var resizeAny = document.createElement('div');
    resizeAny.className = 'hk-dialog-resize-handle hk-dialog-resize-any';
    
    header.appendChild(title);
    header.appendChild(closeButton);
    header.appendChild(shadeButton);
    root.appendChild(header);
    root.appendChild(resizeHorizontal);
    root.appendChild(resizeVertical);
    root.appendChild(resizeAny);
    
    this.root = root;
    this.header = header;
    this.closeButton = closeButton;
    this.shadeButton = shadeButton;
    this.title = title;
    
    //
    // Event handlers
    
    this._setupDragHandler();
    this._setupResizeHandler();
    this._setupCloseHandler();
    this._setupShadeHandler();
    
    this._visible = false;
    this._showState = SHOW_HIDDEN;
    hk.addClass(this.root, 'hidden hiding');
    
    this._rolled = false;
    
    this._content = null;
    
    this.setPosition(0, 0);
    this.setMinimumSize(null, null);
    this.setMaximumSize(null, null);
    this.setResizePolicy(hk.DIALOG_RESIZE_ANY);
    this.setSize(400, 400);
    
    this.setTitle("New Dialog");
    
    hk.root.appendChild(this.root);
    
  }
  
  Dialog.prototype = {
    
    setTitle: function(title) {
      this.title.innerText = title;
    },
    
    setContent: function(newContent) {

      if (this._content) {
        // TODO: remove
        this._content = null;
      }
      
      if (newContent) {
        var contentRoot = newContent.getRoot();
        hk.addClass(contentRoot, 'hk-dialog-content');
        this.root.appendChild(contentRoot);
        this._content = newContent;
        this._adjustContentBounds();
      }
      
    },
    
    setResizePolicy: function(policy) {
      this._resizePolicy = policy;
      this._applyResizePolicy(policy);
    },
    
    setPosition: function(x, y) {
      this.x = x;
      this.y = y;
      this.root.style.left = x + 'px';
      this.root.style.top = y + 'px';
    },
    
    setMinimumSize: function(width, height) {
      this.minimumWidth = width;
      this.minimumHeight = height;
    },
    
    setMaximumSize: function(width, height) {
      this.maximumWidth = width;
      this.maximumHeight = height;
    },
    
    setSize: function(width, height) {
      width = Math.max(ABSOLUTE_MIN_W, width);
      if (this.minimumWidth) width = Math.max(width, this.minimumWidth);
      if (this.maximumWidth) width = Math.min(width, this.maximumWidth);
      
      height = Math.max(ABSOLUTE_MIN_H, height);
      if (this.minimumHeight) height = Math.max(height, this.minimumHeight);
      if (this.maximumHeight) height = Math.min(height, this.maximumHeight);
      
      this.width = width;
      this.height = height;
      
      this.root.style.width = width + 'px';
      if (!this._rolled) {
        this.root.style.height = height + 'px';
      }
      
      this._adjustContentBounds();
      
    },
    
    show: function() {
      if (this._visible) return;
      this._visible = true;
      this._transitionToVisibleState();
    },
    
    hide: function() {
      if (!this._visible) return;
      this._visible = false;
      this._transitionToVisibleState();
    },
    
    roll: function() {
      if (this._rolled) return;
      this._rolled = true;
      this._applyResizePolicy(hk.DIALOG_RESIZE_NONE);
      this.root.style.height = ROLLED_HEIGHT + 'px';
    },
    
    unroll: function() {
      if (!this._rolled) return;
      this._rolled = false;
      this._applyResizePolicy(this._resizePolicy);
      this.root.style.height = this.height + 'px';
    },
    
    fireClose: function() {
      this.hide();
    },
    
    fireToggleRoll: function() {
      if (this._rolled) {
        this.unroll();
      } else {
        this.roll();
      }
    },
    
    _setupDragHandler: function() {
      var self = this;

      var dragging = null;
      this.header.addEventListener('mousedown', function(evt) {
        dragging = [evt.pageX - self.x, evt.pageY - self.y];
        hk.addClass(self.root, 'active-dragging');
        hk.startCapture({
          cursor: "move",
          mousemove: function(evt) {
            self.setPosition(evt.pageX - dragging[0], evt.pageY - dragging[1]);
          },
          mouseup: function() {
            hk.removeClass(self.root, 'active-dragging');
            dragging = null;
            hk.stopCapture();
          }
        });
      });
    },
    
    _setupResizeHandler: function() {
      var self = this;
      
      this.root.addEventListener('mousedown', function(evt) {
        if (hk.hasClass(evt.target, 'hk-dialog-resize-handle')) {
          
          var initialWidth      = self.width,
              initialHeight     = self.height,
              initialX          = evt.pageX,
              initialY          = evt.pageY,
              resizeX           = true,
              resizeY           = true,
              cursor            = 'se-resize';
              
          if (evt.target.className.indexOf('-horizontal') >= 0) {
            cursor = 'e-resize';
            resizeY = false;
          }
          
          if (evt.target.className.indexOf('-vertical') >= 0) {
            cursor = 's-resize';
            resizeX = false;
          }
          
          hk.startCapture({
            cursor: cursor,
            mousemove: function(evt) {
              var newWidth  = initialWidth + (resizeX ? (evt.pageX - initialX) : 0),
                  newHeight = initialHeight + (resizeY ? (evt.pageY - initialY) : 0);
              self.setSize(newWidth, newHeight);
            },
            mouseup: function() {
              hk.stopCapture();
            }
          });
        }
      });
    },
    
    _setupCloseHandler: function() {
      var self = this;
      
      this.closeButton.addEventListener('mousedown', function(evt) {
        evt.stopPropagation();
      });
      
      this.closeButton.addEventListener('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        self.fireClose();
      });
    },
    
    _setupShadeHandler: function() {
      var self = this;
      
      this.shadeButton.addEventListener('mousedown', function(evt) {
        evt.stopPropagation();
      });
      
      this.shadeButton.addEventListener('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        self.fireToggleRoll();
      });
    },
    
    _transitionToVisibleState: function() {
      
      if (this._showState == SHOW_ANIMATING) {
        return;
      }
      
      var self = this,
          root = this.root;
      
      if (this._visible && this._showState == SHOW_HIDDEN) {
        this._showState = SHOW_ANIMATING;
        hk.removeClass(root, 'hidden');
        setTimeout(function() {
          hk.removeClass(root, 'hiding');
          setTimeout(function() {
            self._showState = SHOW_VISIBLE;
            self._transitionToVisibleState();
          }, hk.theme.DIALOG_TRANSITION_DURATION);
        }, 0);
      } else if (!this._visible && this._showState == SHOW_VISIBLE) {
        this._showState = SHOW_ANIMATING;
        hk.addClass(root, 'hiding');
        setTimeout(function() {
          hk.addClass(root, 'hidden');
          self._showState = SHOW_HIDDEN;
          self._transitionToVisibleState();
        }, hk.theme.DIALOG_TRANSITION_DURATION);
      }
      
    },
    
    _applyResizePolicy: function(policy) {
      hk.removeClass(this.root, 'hk-dialog-resizable-horizontal hk-dialog-resizable-vertical hk-dialog-resizable-any');
      
      var resizeClass = '';
      if (policy & hk.DIALOG_RESIZE_HORIZONTAL) resizeClass += ' hk-dialog-resizable-horizontal';
      if (policy & hk.DIALOG_RESIZE_VERTICAL)   resizeClass += ' hk-dialog-resizable-vertical';
      if (policy == hk.DIALOG_RESIZE_ANY)       resizeClass += ' hk-dialog-resizable-any';
      
      hk.addClass(this.root, resizeClass);
    },
    
    _adjustContentBounds: function() {
      if (this._content) {
        this._content.setBounds(CONTENT_LEFT,
                                CONTENT_TOP,
                                this.width - HORIZONTAL_PADDING,
                                this.height - VERTICAL_PADDING);
      }
    }
  };
  
  hk.Dialog = Dialog;
  
})();