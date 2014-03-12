var du = require('domutil');

var CHECKBOX_SIZE = 12;

exports.initialize = function(ctx, k, theme) {

    ctx.registerWidget('Checkbox', ctx.InlineWidget.extend(function(_sc, _sm) {

        return [

            function(hk) {
                this._value = false;
                _sc.call(this, hk);
            },

            'methods', {

                dispose: function() {
                    _sm.dispose.call(this);
                },

                getValue: function() {
                    return this._value;
                },

                setValue: function(v) {
                    this._value = !!v;
                    if (this._value) {
                        this._root.setAttribute('checked', 'checked');
                    } else {
                        this._root.removeAttribute('checked');
                    }
                },
                
                _buildStructure: function() {
                    
                    this._root = this.document.createElement('input');
                    this._root.type = 'checkbox'
                    this._root.className = 'hk-check-box';
                    
                    var self = this;
                    this._root.addEventListener('change', function(evt) {
                        self._value = self._root.checked;
                        // TODO: trigger listeners
                    });

                }
            
            }

        ];

    }));

}

function drawblob(doc, width, height, cb) {
    var canvas = doc.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    cb(ctx);
    return canvas.toDataURL();
}

exports.attach = function(instance) {

    var unchecked = drawblob(instance.document, CHECKBOX_SIZE, CHECKBOX_SIZE, function(ctx) {
        ctx.fillStyle = instance.theme.get('HK_BUTTON_BG_COLOR');
        ctx.fillRect(0, 0, CHECKBOX_SIZE, CHECKBOX_SIZE);
        ctx.strokeStyle = instance.theme.get('HK_TOOLBAR_ITEM_BORDER_COLOR');
        ctx.strokeRect(0, 0, CHECKBOX_SIZE, CHECKBOX_SIZE);
    });

    var checked = drawblob(instance.document, CHECKBOX_SIZE, CHECKBOX_SIZE, function(ctx) {
        ctx.fillStyle = instance.theme.get('HK_BUTTON_BG_COLOR');
        ctx.fillRect(0, 0, CHECKBOX_SIZE, CHECKBOX_SIZE);
        ctx.strokeStyle = instance.theme.get('HK_TOOLBAR_ITEM_BORDER_COLOR');
        ctx.strokeRect(0, 0, CHECKBOX_SIZE, CHECKBOX_SIZE);
        ctx.fillStyle = instance.theme.get('HK_CONTROL_ACTIVE_BG_COLOR');
        ctx.fillRect(2, 2, CHECKBOX_SIZE - 4, CHECKBOX_SIZE - 4);
    });

    var style = [
        ".hk-check-box {",
        "  font-size: " + (CHECKBOX_SIZE) + "px;",
        "  width: " + (CHECKBOX_SIZE) + "px;",
        "  height: " + (CHECKBOX_SIZE) + "px;",
        "  margin: 0;",
        "  padding: 0;",
        "  -webkit-appearance: none;",
        "  background: url(\"" + unchecked + "\") no-repeat center center;",
        "}",
        ".hk-check-box:focus {",
        "  outline: none;",
        "}",
        ".hk-check-box:checked {",
        "  background-image: url(\"" + checked + "\");",
        "}"
    ].join("\n");

    instance.appendCSS(style);

}
