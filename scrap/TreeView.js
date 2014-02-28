var Widget = require('./Widget');

var data = [
    { title: "Foobar" },
    { title: "Foobaz" },
    { title: "Bleem!", children: [
        { title: "Child 1" },
        { title: "Child 2" },
        { title: "Child 3" }
    ] }
];

var defaultDelegate = {

    // TODO: flair for item
    // TODO: icon for item
    // TODO: color for item
    // TODO: background color for item

    rootItems: function(cb) {
        setTimeout(function() {
            cb(false, data);
        }, 0);
    },

    titleForItem: function(item) {
        return item.title;
    },

    isContainer: function(item) {
        return 'children' in item;
    },

    itemChildren: function(item, cb) {
        setTimeout(function() {
            cb(false, item.children);
        }, 0);
    }

};

function TreeViewItem() {

    this.el = document.createElement('li');
    this.childrenLoaded = false;

    this._titleEl = document.createElement('span');
    this.el.appendChild(this._titleEl);

}

TreeViewItem.prototype.setTitle = function(title) {
    this._titleEl.textContent = title;
}

TreeViewItem.prototype.setContainer = function(container) {
    this.el.className = container ? 'container' : '';
}

module.exports = Widget.extend(function(_sc, _sm) {

    return [

        function() {
            
            _sc.apply(this, arguments);

            this._delegate = null;
            this._rootContainer = null;

            this.setDelegate(defaultDelegate);

            var self = this;

            this._root.addEventListener('click', function(evt) {
                var node = self._findTargetNode(evt.target);
                console.log(node);
            });

            this._root.addEventListener('dblclick', function(evt) {
                var node = self._findTargetNode(evt.target);
                console.log(node);
            });

        },

        'methods', {

            setDelegate: function(delegate) {

                if (delegate === this._delegate)
                    return;

                if (this._delegate) {
                    this._root.removeChild(this._rootContainer);
                    this._rootContainer = null;
                    this._delegate = null;
                }

                if (delegate) {
                    this._delegate = delegate;
                    this._rootContainer = document.createElement('ul');
                    this._root.appendChild(this._rootContainer);

                    this._delegate.rootItems(function(err, items) {
                        items.forEach(function(i) {
                            this._rootContainer.appendChild(this._buildListItem(i).el);
                        }, this);
                    }.bind(this));
                }

            },

            _buildStructure: function() {
                this._root = document.createElement('div');
                this._root.className = 'hk-tree-view';
            },

            _buildListItem: function(item) {

                var listItem = new TreeViewItem();
                listItem.setTitle(this._delegate.titleForItem(item));
                listItem.setContainer(this._delegate.isContainer(item));

                return listItem;

            },

            _findTargetNode: function(node) {
                while (node) {
                    var nn = node.nodeName.toLowerCase();
                    if (nn === 'li') {
                        return node;
                    } else if (nn === 'ul' || nn === 'div') {
                        break;
                    }
                    node = node.parentNode;
                }
                return null;
            }

        }

    ]

});