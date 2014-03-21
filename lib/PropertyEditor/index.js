var ctx             = require('../core'),
    theme           = require('../theme'),
    k               = require('../constants'),
    BlockWidget     = require('../BlockWidget');

function makeSimpleEditor(hk, builder, get, set, config) {

    var widget = hk[builder]();

    function sync() {
        widget.setValue(get());
    }

    var cancel = widget.onChange.connect(function(src, val) {
        if (!set(val)) {
            widget.setValue(get());
        };
    });

    for (var arg in config) {
        var setter = 'set' + arg[0].toUpperCase() + arg.substring(1);
        widget[setter](config[arg]);
    }

    return {
        widget      : widget,
        sync        : sync,
        teardown    : cancel
    };

}

var editors = {
    checkbox: function(hk, get, set, options) {
        return makeSimpleEditor(hk, 'checkbox', get, set, options);
    },
    knob: function(hk, get, set, options) {
        return makeSimpleEditor(hk, 'knob', get, set, options);
    },
    text: function(hk, get, set, options) {
        return makeSimpleEditor(hk, 'textField', get, set, options);
    },
    slider: function(hk, get, set, options) {
        return makeSimpleEditor(hk, 'horizontalSlider', get, set, options);
    }
};

var PropertyEditor = module.exports = BlockWidget.extend(function(_sc, _sm) {

    return [

        function(hk, rect) {

            this._delegate = null;
            this._properties = null;

            _sc.call(this, hk, rect);

        },

        'methods', {

            getDelegate: function() {
                return this._delegate;
            },

            setDelegate: function(newDelegate) {
                
                if (newDelegate === this._delegate) {
                    return;
                }

                this._table.innerHTML = '';
                this._properties = null;

                if (this._delegate) {
                    this._teardown();
                }

                this._delegate = newDelegate || null;

                if (this._delegate) {

                    var self = this;
                    
                    // bind to receive notifications about property values changing
                    var cancel1 = this._delegate.onPropertyChange(function(src, evt) {
                        self._properties[evt.property].sync();
                    });

                    // TODO: bind to receive notifications of new/removed properties
                    // var cancel2 = ...;

                    this._delegateCancel = function() {
                        cancel1();
                        // cancel2();
                    }

                    this._rebuild();

                }

            },

            _buildStructure: function() {
                
                this._root = this.document.createElement('div');
                this._root.className = 'hk-property-editor';

                this._table = this.document.createElement('table');

                this._root.appendChild(this._table);

            },

            _rebuild: function() {

                this._properties = {};
                
                var d = this._delegate;

                var groupCount = (typeof d.getPropertyGroupCount === 'function')
                                    ? d.getPropertyGroupCount()
                                    : 1;

                var useGroupHeaders = (typeof d.getPropertyGroupTitle === 'function');

                var groupHeader = null;
                for (var i = 0; i < groupCount; ++i) {
                    
                    if (useGroupHeaders && (groupHeader = this._buildGroupHeader(i))) {
                        this._table.appendChild(groupHeader);
                    }

                    var tbody = this.document.createElement('tbody');
                    this._table.appendChild(tbody);
                    this._appendGroupEditors(tbody, i);

                }

            },

            _buildGroupHeader: function(ix) {

                var title = this._delegate.getPropertyGroupTitle(ix);
                if (typeof title !== 'string') {
                    return null;
                }

                var header = this.document.createElement('thead'),
                    row = this.document.createElement('tr'),
                    col = this.document.createElement('th');

                col.setAttribute('colspan', 2);
                col.textContent = title;

                row.appendChild(col);
                header.appendChild(row);

                return header;

            },

            _appendGroupEditors: function(tbody, groupIx) {

                var properties = this._delegate.getPropertyNames(groupIx);
                properties.forEach(function(name) {

                    var desc = this._delegate.getPropertyDescriptor(name);

                    var row = this.document.createElement('tr');
                    tbody.appendChild(row);

                    var cap = this.document.createElement('th');
                    row.appendChild(cap);
                    cap.textContent = desc.caption || '';
                    
                    var cell = this.document.createElement('td');
                    row.appendChild(cell);

                    var editor = this._buildPropertyInput(
                        name,
                        desc.type || 'text',
                        desc.config || {}
                    );

                    // store widget instance, sync fn etc
                    this._properties[name] = editor;

                    this._attachChildViaElement(editor.widget, cell);
                    editor.sync();

                }, this);

                return tbody;

            },

            _buildPropertyInput: function(name, type, options) {

                var d = this._delegate;

                return editors[type](
                    this._hk,
                    function get() { return d.getPropertyValue(name); },
                    function set(v) { return d.setPropertyValue(name, v); },
                    options || {}
                );

            },

            _teardown: function() {
                this._delegateCancel();
                for (var k in this._properties) {
                    var prop = this._properties[k];
                    prop.teardown();
                    this._removeChild(prop.widget);
                    prop.widget.dispose();
                }
            }
        
        }

    ];

});

PropertyEditor.registerEditor = function(type, builder) {
    if (type in editors) {
        throw new Error("duplicate editor type: " + type);
    }
    editors[type] = builder;
}

ctx.registerWidget('PropertyEditor', PropertyEditor);
ctx.registerCSS(require('fs').readFileSync(__dirname + '/style.unwise', 'utf8'));