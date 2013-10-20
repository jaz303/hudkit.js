var Widget  = require('./Widget'),
    theme   = require('./theme');

var du      = require('domutil');

module.exports = Widget.extend(function(_sc, _sm) {

    return [

        function() {
            this._tabs = [];
            _sc.apply(this, arguments);
            this._bind();
        },

        'methods', {

            setBounds: function() {
                _sm.setBounds.apply(this, arguments);
                this._redraw();
            },

            // Querying

            tabCount: function() {
                return this._tabs.length;
            },

            activeIndex: function() {
                for (var i = 0; i < this._tabs.length; ++i) {
                    if (this._tabs[i].active) {
                        return i;
                    }
                }
                return -1;
            },

            activeWidget: function() {
                var ix = this.activeIndex();
                return ix >= 0 ? this._tabs[ix].pane : null;
            },

            indexOfWidget: function(widget) {
                for (var i = 0; i < this._tabs.length; ++i) {
                    if (this._tabs[i].pane === widget) {
                        return i;
                    }
                }
                return -1;
            },

            //
            // Add/remove

            addTab: function(title, widget, selectTab) {
                
                var tab = document.createElement('a');
                tab.textContent = title;
                
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
                
                if (this._tabs.length === 1 || selectTab) {
                    this.selectTabAtIndex(this._tabs.length - 1);
                }
                
            },

            removeTabAtIndex: function(ix) {
                
                if (ix < 0 || ix >= this._tabs.length) {
                    return null;
                }

                var tab = this._tabs[ix];
                this._tabBar.removeChild(tab.ele);
                this._removeChildViaElement(tab.pane, this._tabContainer);
                this._tabs.splice(ix, 1);

                if (tab.active && this._tabs.length > 0) {
                    this.selectTabAtIndex(ix < this._tabs.length ? ix : ix - 1);
                }

            },

            removeActiveTab: function() {
                return this.removeTabAtIndex(this.activeIndex());
            },

            removeWidget: function(widget) {
                return this.removeTabAtIndex(this.indexOfWidget(widget));
            },

            //
            // Select

            selectTabAtIndex: function(ix) {
                for (var i = 0; i < this._tabs.length; ++i) {
                    var tab = this._tabs[i];
                    if (i === ix) {
                        du.addClass(tab.ele, 'active');
                        tab.active = true;
                        tab.pane.setHidden(false);
                    } else {
                        du.removeClass(tab.ele, 'active');
                        tab.active = false;
                        tab.pane.setHidden(true);
                    }
                    this._redraw();
                }
            },

            //
            // Titles

            setActiveTabTitle: function(title) {
                this.setTitleAtIndex(this.activeIndex(), title);
            },

            setTitleForWidget: function(widget, title) {
                this.setTitleAtIndex(this.indexOfWidget(widget), title);
            },

            setTitleAtIndex: function(ix, title) {

                if (ix < 0 || ix >= this._tabs.length) {
                    return;
                }

                title = ('' + title);
                this._tabs[ix].title = title;
                this._tabs[ix].ele.textContent = title;

                this._redraw();

            },

            //
            // 

            _buildStructure: function() {
                
                this._root = document.createElement('div');
                this._root.className = 'hk-tab-pane';
                
                this._tabBar = document.createElement('nav');
                this._tabBar.className = 'hk-tab-bar';
                
                this._tabContainer = document.createElement('div');
                this._tabContainer.className = 'hk-tab-container';
                
                this._canvas = document.createElement('canvas');
                this._canvas.className = 'hk-tab-canvas';
                this._canvas.height = theme.TAB_SPACING * 2;
                this._ctx = this._canvas.getContext('2d');
                
                this._root.appendChild(this._canvas);
                this._root.appendChild(this._tabBar);
                this._root.appendChild(this._tabContainer);
                
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
                    tab.pane.setBounds(theme.TAB_SPACING,
                                       theme.TAB_SPACING,
                                       self.width - (2 * theme.TAB_SPACING),
                                       self.height - (3 * theme.TAB_SPACING + theme.TAB_HEIGHT));
                                                         
                    if (tab.active) {
                        var width       = tab.ele.offsetWidth,
                                height  = tab.ele.offsetHeight,
                                left    = tab.ele.offsetLeft,
                                top     = tab.ele.offsetTop,
                                ctx     = self._ctx;

                        width += theme.TAB_BORDER_RADIUS;

                        if (i > 0) {
                            left -= theme.TAB_BORDER_RADIUS;
                            width += theme.TAB_BORDER_RADIUS;
                        }

                        self._canvas.style.left = '' + left + 'px';
                        self._canvas.style.top = '' + (top + height) + 'px';
                        self._canvas.width = width;
                        
                        ctx.fillStyle = theme.TAB_BACKGROUND_COLOR;

                        var arcY = theme.TAB_SPACING - theme.TAB_BORDER_RADIUS;

                        if (i == 0) {
                            ctx.fillRect(0, 0, width - theme.TAB_BORDER_RADIUS, self._canvas.height);
                            ctx.beginPath();
                            ctx.arc(width, arcY, theme.TAB_BORDER_RADIUS, Math.PI, Math.PI / 2, true);
                            ctx.lineTo(width - theme.TAB_BORDER_RADIUS, theme.TAB_SPACING);
                            ctx.lineTo(width - theme.TAB_BORDER_RADIUS, 0);
                            ctx.fill();
                        } else {
                            ctx.beginPath();
                            ctx.moveTo(theme.TAB_BORDER_RADIUS, 0);
                            ctx.lineTo(theme.TAB_BORDER_RADIUS, arcY);
                            ctx.arc(0, arcY, theme.TAB_BORDER_RADIUS, 0, Math.PI / 2, false);
                            ctx.lineTo(width, theme.TAB_SPACING);
                            ctx.arc(width, arcY, theme.TAB_BORDER_RADIUS, Math.PI / 2, Math.PI, false);
                            ctx.lineTo(width - theme.TAB_BORDER_RADIUS, 0);
                            ctx.lineTo(theme.TAB_BORDER_RADIUS, 0);
                            ctx.fill();
                        }
                    }
                });
            }

        }

    ]

});