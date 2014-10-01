var ctx     = require('../core');
var Widget  = require('../Widget');

var d       = require('dom-build');
var du      = require('domutil');

function style(el) {
    el.style.width = '100%';
    el.style.height = '100%';
}

function unstyle(el) {
    el.style.width = '';
    el.style.height = '';
}

var RootPane = module.exports = Widget.extend(function(_sc, _sm) {

    return [

        function() {

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

            setBackgroundColor: function(color) {
                this._root.style.backgroundColor = color;
            },

            setToolbar: function(widget) {

                if (widget === this._toolbar)
                    return;

                if (this._toolbar) {
                    this._removeChildViaElement(this._toolbar, this._toolbarWrapper);
                    unstyle(this._toolbar.getRoot());
                    this._toolbar = null;
                }

                if (widget) {
                    this._toolbar = widget;
                    style(this._toolbar.getRoot());
                    this._attachChildViaElement(this._toolbar, this._toolbarWrapper);
                }

                this.layout();

            },

            showToolbar: function() {
                this._toolbarVisible = true;
                this.layout();
            },
            
            hideToolbar: function() {
                this._toolbarVisible = false;
                this.layout();
            },
            
            toggleToolbar: function() {
                this._toolbarVisible = !this._toolbarVisible;
                this.layout();
            },
            
            isToolbarVisible: function() {
                return this._toolbarVisible;
            },

            setRootWidget: function(widget) {

                if (widget === this._rootWidget)
                    return;

                if (this._rootWidget) {
                    this._removeChildViaElement(this._rootWidget, this._rootWrapper);
                    unstyle(this._rootWidget.getRoot());
                    this._rootWidget = null;
                }

                if (widget) {
                    this._rootWidget = widget;
                    style(this._rootWidget.getRoot());
                    this._attachChildViaElement(this._rootWidget, this._rootWrapper);
                }

                this.layout();

            },

            setResizeDelay: function(delay) {
                this._resizeDelay = parseInt(delay, 10);
            },

            layout: function() {

                if (this._toolbar && this._toolbarVisible) {
                    du.removeClass(this.getRoot(), 'toolbar-hidden');
                    this._toolbar.show();
                } else {
                    du.addClass(this.getRoot(), 'toolbar-hidden');
                    if (this._toolbar) {
                        this._toolbar.hide();    
                    }
                }

                this._layoutChildren();

            },

            _buildStructure: function() {
                return d('.hk-root-pane',
                    d('.toolbar-wrapper!toolbarWrapper'),
                    d('.root-wrapper!rootWrapper')
                );
            },

            _layoutChildren: function() {

                if (this._toolbar && this._toolbarVisible) {
                    this._toolbar.layout();
                }

                if (this._rootWidget) {
                    this._rootWidget.layout();
                }

            },

            _setupResizeHandler: function() {

                var self    = this,
                    timeout = null;

                window.addEventListener('resize', function() {
                    if (self._resizeDelay <= 0) {
                        self._layoutChildren();    
                    } else {
                        if (timeout) {
                            clearTimeout(timeout);
                        }
                        timeout = setTimeout(function() {
                            self._layoutChildren();
                        }, self._resizeDelay);
                    }
                });

            }

        }

    ];

});

ctx.registerWidget('RootPane', RootPane);