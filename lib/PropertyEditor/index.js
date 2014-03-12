// TODO: binding
// TODO: transform functions (esp. for text fields)
// TODO: veto functionality for updates

function makeSimpleEditor(hk, builder, get, set, options) {

    var widget = hk[builder]();

    function sync() {
        widget.setValue(get());
    }

    // TODO: find widget change to options.set()
    //widget.onChange.connect(set)

    for (var arg in options) {
        var setter = 'set' + arg[0].toUpperCase() + arg.substring(1);
        widget[setter](options[arg]);
    }

    return { widget: widget, sync: sync };

}

var editors = {
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

exports.initialize = function(ctx, k, theme) {

    var PropertyEditor = ctx.BlockWidget.extend(function(_sc, _sm) {

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

            	setDelegate: function(d) {
            		
            		if (d === this._delegate) {
            			return;
            		}

                    if (this._delegate) {
                        this._teardown();
                    }

                    this._delegate = d;
                    this._table.innerHTML = '';

                    if (d) {
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

                    var useGroupHeaders = (typeof this._delegate.getPropertyGroupTitle === 'function');

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

                    var header = this.document.createElement('thead'),
                        row = this.document.createElement('tr'),
                        col = this.document.createElement('th');

                    col.setAttribute('colspan', 2);
                    col.textContent = this._delegate.getPropertyGroupTitle(ix);

                    row.appendChild(col);
                    header.appendChild(row);

                    return header;

                },

                _appendGroupEditors: function(tbody, groupIx) {

                    var properties = this._delegate.getPropertyGroupPropertyNames(groupIx);
                    properties.forEach(function(name) {

                        var row = this.document.createElement('tr');
                        tbody.appendChild(row);

                        var cap = this.document.createElement('th');
                        row.appendChild(cap);
                        cap.textContent = this._delegate.getPropertyCaption(name);
                        
                        var cell = this.document.createElement('td');
                        row.appendChild(cell);

                        var editor = this._buildPropertyInput(
                            name,
                            this._delegate.getPropertyType(name),
                            this._delegate.getPropertyOptions(name)
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
                        function set(v) { d.setPropertyValue(name, v); },
                        options || {}
                    );

                },

                _teardown: function() {
                    // TODO:
                    // unbind all event listeners
                    // detach all widgets from parent
                    // dispose all widgets
                    this._properties = null;
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

}

var fs = require('fs'),
	css = fs.readFileSync(__dirname + '/style.unwise', 'utf8');

exports.attach = function(instance) {
	instance.appendCSS(css);
}