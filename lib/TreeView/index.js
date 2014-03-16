var ctx         = require('../core'),
    theme       = require('../theme'),
    k           = require('../constants'),
    BlockWidget = require('../BlockWidget'),
    du          = require('domutil');

// TODO: refresh
// TODO: context menu

// TODO: observation
// TODO: deletable items

// TODO: drag and drop (move, reorder)

// TODO: some sort of guard object that can only ever be
// executing/waiting for a single callback, and operation
// can be cancelled... based on the following...

function cancellable(fn, ifCancelled) {
    var cancelled = false, fn = function() {
        if (cancelled) {
            if (ifCancelled) {
                ifCancelled();
            }
        } else {
            return fn.apply(null, arguments);    
        }
    }
    return [fn, function() { cancelled = true; }];
}

var TreeView = module.exports = BlockWidget.extend(function(_sc, _sm) {

    return [

        function() {

            this._busy = false;
            this._delegate = null;
            this._selected = [];

            _sc.apply(this, arguments);

        },

        'methods', {

            setDelegate: function(delegate) {
                
                // FIXME: for completeness this should handle being
                // busy when called; changing delegates is a rare 
                // operation but should be handled gracefully.
                // idea: this._busy could be a cancellation function.

                if (delegate === this._delegate)
                    return;

                this._delegate = delegate;
                this._selected = false;

                this._wrapper.innerHTML = '';

                if (this._delegate) {
                    this._loadRootItems();
                }

            },

            _buildStructure: function() {

                var self = this;

                this._root = this.document.createElement('div');
                this._root.className = 'hk-tree-view';

                this._wrapper = this.document.createElement('ul');
                this._wrapper.className = 'hk-tree-view-items';
                
                this._wrapper.addEventListener('click', function(evt) {

                    evt.preventDefault();
                    evt.stopPropagation();

                    // click on icon to toggle expanded state
                    if (evt.target.className.match(/icon/)) {
                        var li = evt.target.parentNode.parentNode;
                        if (li.treeViewContainer) {
                            if (li.treeViewChildrenLoaded) {
                                du.toggleClass(li, 'expanded');
                            } else {
                                self._loadChildren(li);
                            }
                            return;
                        }
                    }

                    // otherwise, select
                    var li = self._itemForEvent(evt);

                    if (!li)
                        return;

                    if (evt.shiftKey) {
                        self._toggleSelection(li);
                    } else {
                        self._setSelection(li);
                    }

                });

                this._wrapper.addEventListener('dblclick', function(evt) {

                    evt.preventDefault();
                    evt.stopPropagation();

                    var li = self._itemForEvent(evt);

                    if (!li)
                        return;
                    
                    self._delegate.itemActivated(li.treeViewItem);    
                
                });

                this._root.appendChild(this._wrapper);

            },

            _loadRootItems: function() {

                if (this._busy)
                    return;

                this._busy = true;

                var self = this;
                this._delegate.rootItems(function(err, roots) {
                    if (err) {
                        // TODO: handle error
                    } else {
                        self._appendItems(self._wrapper, roots);
                    }
                    self._busy = false;
                });

            },

            _loadChildren: function(li) {

                if (this._busy)
                    return;

                this._busy = true;

                var self = this;
                this._delegate.childrenForItem(li.treeViewItem, function(err, children) {
                    if (err) {
                        // TODO: handle error
                        self._busy = false;
                    } else {

                        var list = self.document.createElement('ul');
                        li.appendChild(list);
                        li.treeViewChildrenLoaded = true;

                        self._appendItems(list, children);

                        setTimeout(function() {
                            du.addClass(li, 'expanded');
                            self._busy = false;
                        }, 0);

                    }
                });

            },

            _createNodeForItem: function(item) {

                var li          = this.document.createElement('li'),
                    isContainer = this._delegate.itemIsContainer(item);

                du.addClass(li, isContainer ? 'hk-tree-view-container' : 'hk-tree-view-leaf');
                
                var itemClass = this._delegate.itemClass(item);
                if (itemClass) {
                    du.addClass(li, itemClass);
                }

                var itemEl = this.document.createElement('div');
                itemEl.className = 'item';

                var icon = this.document.createElement('span');
                icon.className = 'icon';
                icon.innerHTML = '&nbsp;';
                itemEl.appendChild(icon);

                var title = this.document.createElement('span');
                title.className = 'title';
                title.textContent = this._delegate.itemTitle(item);
                itemEl.appendChild(title);

                var flair = this._delegate.itemFlair(item);
                if (flair.length > 0) {
                    var flairWrapper = this.document.createElement('div');
                    flairWrapper.className = 'hk-tree-view-flair';
                    flair.forEach(function(f) {
                        var flairEl = this.document.createElement('span');
                        flairEl.className = f.className;
                        if ('text' in f) {
                            flairEl.textContent = f.text;
                        } else if ('html' in f) {
                            flairEl.innerHTML = f.html;
                        }
                        flairWrapper.appendChild(flairEl);
                    }, this);
                    itemEl.appendChild(flairWrapper);
                }

                li.appendChild(itemEl);
                li.treeViewItem = item;
                li.treeViewContainer = isContainer;
                li.treeViewChildrenLoaded = false;

                return li;

            },

            _appendItems: function(wrapper, items) {
                items.map(function(r) {
                    return this._createNodeForItem(r);
                }, this).forEach(function(n) {
                    wrapper.appendChild(n);
                });
            },

            _setSelection: function(item) {
                this._clearSelection();
                this._addToSelection(item);
            },

            _toggleSelection: function(item) {
                var ix = this._selected.indexOf(item);
                if (ix < 0) {
                    this._addToSelection(item);
                } else {
                    this._removeFromSelection(item);
                }
            },

            _clearSelection: function() {
                for (var i = 0; i < this._selected.length; ++i) {
                    du.removeClass(this._selected[i], 'selected');
                }
                this._selected = [];
            },

            _removeFromSelection: function(item) {
                this._removeSelectedIndex(this._selected.indexOf(item));
            },

            _removeSelectedIndex: function(ix) {
                if (ix < 0 || ix >= this._selected.length) {
                    return;
                }
                du.removeClass(this._selected[ix], 'selected');
                this._selected.splice(ix, 1);
            },

            _addToSelection: function(item) {

                if (this._selected.indexOf(item) >= 0) {
                    return;
                }

                this._selected.push(item);
                du.addClass(item, 'selected');

            },

            _itemForEvent: function(evt) {

                var nn = evt.target.nodeName.toLowerCase();

                // ignore direct clicks on li because this means user clicked
                // dead space to left of expanded node.
                if (nn === 'ul' || nn === 'li') {
                    return null;
                }

                var curr = evt.target;
                while (curr && curr.nodeName.toLowerCase() !== 'li') {
                    curr = curr.parentNode;
                }

                return curr || null;

            }

        }

    ];

});

ctx.registerCSS(require('fs').readFileSync(__dirname + '/style.unwise', 'utf8'));
ctx.registerWidget('TreeView', TreeView);