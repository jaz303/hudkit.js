var ctx             = require('../core'),
    theme           = require('../theme'),
    k               = require('../constants'),
    BlockWidget    	= require('../BlockWidget'),
    du 				= require('domutil');

ctx.registerWidget('TabPane', module.exports = BlockWidget.extend(function(_sc, _sm) {

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
	            
	            var tab = this.document.createElement('a');
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
	            
	            this._root = this.document.createElement('div');
	            this._root.className = 'hk-tab-pane';
	            
	            this._tabBar = this.document.createElement('nav');
	            this._tabBar.className = 'hk-tab-bar';
	            
	            this._tabContainer = this.document.createElement('div');
	            this._tabContainer.className = 'hk-tab-container';
	            
	            this._canvas = this.document.createElement('canvas');
	            this._canvas.className = 'hk-tab-canvas';
	            this._canvas.height = theme.getInt('HK_TAB_SPACING') * 2;
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

	            var tabSpacing 	= theme.getInt('HK_TAB_SPACING'),
	            	tabHeight 	= theme.getInt('HK_TAB_HEIGHT'),
	            	tabRadius 	= theme.getInt('HK_TAB_BORDER_RADIUS'),
	            	bgColor 	= theme.get('HK_TAB_BACKGROUND_COLOR');

	            this._tabs.forEach(function(tab, i) {
	                tab.pane.setBounds(tabSpacing,
	                                   tabSpacing,
	                                   self.width - (2 * tabSpacing),
	                                   self.height - (3 * tabSpacing + tabHeight));
	                                                     
	                if (tab.active) {
	                    var width       = tab.ele.offsetWidth,
	                            height  = tab.ele.offsetHeight,
	                            left    = tab.ele.offsetLeft,
	                            top     = tab.ele.offsetTop,
	                            ctx     = self._ctx;

	                    width += tabRadius;

	                    if (i > 0) {
	                        left -= tabRadius;
	                        width += tabRadius;
	                    }

	                    self._canvas.style.left = '' + left + 'px';
	                    self._canvas.style.top = '' + (top + height) + 'px';
	                    self._canvas.width = width;
	                    
	                    ctx.fillStyle = bgColor;

	                    var arcY = tabSpacing - tabRadius;

	                    if (i == 0) {
	                        ctx.fillRect(0, 0, width - tabRadius, self._canvas.height);
	                        ctx.beginPath();
	                        ctx.arc(width, arcY, tabRadius, Math.PI, Math.PI / 2, true);
	                        ctx.lineTo(width - tabRadius, tabSpacing);
	                        ctx.lineTo(width - tabRadius, 0);
	                        ctx.fill();
	                    } else {
	                        ctx.beginPath();
	                        ctx.moveTo(tabRadius, 0);
	                        ctx.lineTo(tabRadius, arcY);
	                        ctx.arc(0, arcY, tabRadius, 0, Math.PI / 2, false);
	                        ctx.lineTo(width, tabSpacing);
	                        ctx.arc(width, arcY, tabRadius, Math.PI / 2, Math.PI, false);
	                        ctx.lineTo(width - tabRadius, 0);
	                        ctx.lineTo(tabRadius, 0);
	                        ctx.fill();
	                    }
	                }
	            });
	        }

	    }

	];

}));

ctx.registerCSS(require('fs').readFileSync(__dirname + '/style.unwise', 'utf8'));