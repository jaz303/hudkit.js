var Widget = require('./widget');
var util   = require('./util');
var theme  = require('./theme');

var DEFAULT_PADDING = 8;

module.exports = Widget.extend(function(_sc, _sm) {

    return [

        function() {

            this._padding           = [DEFAULT_PADDING, DEFAULT_PADDING, DEFAULT_PADDING, DEFAULT_PADDING];
            this._toolbarVisible    = true;
            this._toolbar           = null;
            this._rootWidget        = null;
            this._resizeDelay       = 500;

            _sc.apply(this, arguments);

            this._setupResizeHandler();

        },

        'methods', {

            dispose: function() {
                this.setToolbar(null);
                this.setRootWidget(null);
                _sm.dispose.call(this);
            },

            setPadding: function(padding) {
                this._padding = util.parseTRBL(padding);
                this._layout();
            },

            setBackgroundColor: function(color) {
                this._root.style.backgroundColor = color;
            },

            setToolbar: function(widget) {

                if (widget === this._toolbar)
                    return;

                if (this._toolbar) {
                    this._removeChildViaElement(this._toolbar, this._root);
                    this._toolbar = null;
                }

                if (widget) {
                    this._toolbar = widget;
                    this._attachChildViaElement(this._toolbar, this._root);
                }

                this._layout();

            },

            showToolbar: function() {
                this._toolbarVisible = true;
                this._layout();
            },
            
            hideToolbar: function() {
                this._toolbarVisible = false;
                this._layout();
            },
            
            toggleToolbar: function() {
                this._toolbarVisible = !this._toolbarVisible;
                this._layout();
            },
            
            isToolbarVisible: function() {
                return this._toolbarVisible;
            },

            setRootWidget: function(widget) {

                if (widget === this._rootWidget)
                    return;

                if (this._rootWidget) {
                    this._removeChildViaElement(this._rootWidget, this._root);
                    this._rootWidget = null;
                }

                if (widget) {
                    this._rootWidget = widget;
                    this._attachChildViaElement(this._rootWidget, this._root);
                }

                this._layout();

            },

            setBounds: function(x, y, width, height) {
                /* no-op; root widget always fills its containing DOM element */
            },

            setResizeDelay: function(delay) {
                this._resizeDelay = parseInt(delay, 10);
            },

            _buildStructure: function() {
                this._root = document.createElement('div');
                this._root.className = 'hk-root-pane';
            },

            _layout: function() {
                
                var rect        = this._root.getBoundingClientRect(),
                    left        = this._padding[3],
                    top         = this._padding[0],
                    width       = rect.width - (this._padding[1] + this._padding[3]),
                    rootTop     = top,
                    rootHeight  = rect.height - (this._padding[0] + this._padding[2]);
                
                if (this._toolbar && this._toolbarVisible) {
                    
                    this._toolbar.setHidden(false);
                    this._toolbar.setBounds(left,
                                            top,
                                            width,
                                            theme.TOOLBAR_HEIGHT);
                    
                    var delta = theme.TOOLBAR_HEIGHT + theme.TOOLBAR_MARGIN_BOTTOM;
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

                var self = this,
                    timeout = null;

                window.addEventListener('resize', function() {
                    if (self._resizeDelay <= 0) {
                        self._layout();    
                    } else {
                        if (timeout) clearTimeout(timeout);
                        timeout = setTimeout(function() { self._layout(); }, self._resizeDelay);
                    }
                });

            }

        }

    ];

});