// TODO: editable items
// TODO: deletable items
// TODO: observation
// TODO: flair
// TODO: multiple selection
// TODO: separate actuator icon/link
// TODO: refresh
// TODO: context menu
// TODO: drag and drop (move, reorder)
exports.initialize = function(ctx, k, theme) {

    ctx.registerWidget('TreeView', ctx.Widget.extend(function(_sc, _sm) {

        return [

            function() {

                this._busy = false;
                this._delegate = null;
                this._selected = null;

                _sc.apply(this, arguments);

            },

            'methods', {

                setDelegate: function(delegate) {

                    if (delegate === this._delegate)
                        return;

                    this._delegate = delegate;

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

                        var li = self._itemForEvent(evt);

                        if (!li)
                            return;

                        // selection
                        self._setSelection(li);

                        // handle expansion
                        if (li.treeViewContainer) {
                            if (li.treeViewChildrenLoaded) {
                                li.classList.toggle('expanded');
                            } else {
                                self._loadChildren(li);        
                            }
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
                                li.classList.add('expanded');
                                self._busy = false;
                            }, 0);

                        }
                    });

                },

                _createNodeForItem: function(item) {

                    var li          = this.document.createElement('li'),
                        isContainer = this._delegate.itemIsContainer(item);

                    li.classList.add(isContainer ? 'hk-tree-view-container' : 'hk-tree-view-leaf');

                    var itemClass = this._delegate.itemClass(item);
                    if (itemClass) {
                        li.classList.add(itemClass);    
                    }

                    var txt = this.document.createElement('a');
                    txt.href = '#';
                    txt.textContent = this._delegate.itemTitle(item);

                    li.appendChild(txt);
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

                    if (item === this._selected) {
                        return;
                    }

                    if (this._selected) {
                        this._selected.classList.remove('selected');
                    }

                    this._selected = item;

                    if (this._selected) {
                        this._selected.classList.add('selected');
                    }

                },

                _itemForEvent: function(evt) {
                    if (evt.target.nodeName.toLowerCase() === 'a') {
                        return evt.target.parentNode;
                    } else {
                        return null;
                    }
                }

            }

        ];

    }));

};

var fs = require('fs'),
    CSS = fs.readFileSync(__dirname + '/style.unwise', 'utf8');

exports.attach = function(instance) {
    instance.appendCSS(CSS);
}