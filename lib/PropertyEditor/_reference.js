// Refresh display on external property change
// (and accordingly, mute display updates when committing local changes to property values)

// Handle properties being added/removed
// (required for Firedoom - adding/removing components)

// Property groups

// Input types:
//  - text field should support validation options
//  - slider
//  - textarea
//  - vec2, vec3
//  - matrix, maybe
//  - select
//  - color

;(function() {
  
  function e(type, parent) {
    var element = document.createElement(type);
    if (parent) parent.appendChild(element);
    return element;
  }
  
  function t(text, parent) {
    var node = document.createTextNode(text);
    if (parent) parent.appendChild(node);
    return node;
  }
  
  function kPropertyNames(obj) { return Object.keys(obj); }
  function kPropertyTitle(obj, propName) { return propName; }
  function kGetPropertyValue(obj, propName) { return obj[propName]; }
  function kSetPropertyValue(obj, propName, value) { obj[propName] = value; }
  
  function PI(options) {
    
    options = options || {};
    
    this.propertyNames    = options.propertyNames || kPropertyNames;
    this.propertyTitle    = options.propertyTitle || kPropertyTitle;
    this.propertyEditor   = options.propertyEditor;
    this.getPropertyValue = options.getPropertyValue || kGetPropertyValue;
    this.setPropertyValue = options.setPropertyValue || kSetPropertyValue;
    this.subject          = options.object || null;
    
    this.root = e('table');
    this.root.className = 'property-inspector';
    
    this._head = e('thead', this.root);
    this._head.innerHTML = '<tr><th>Property</th><th>Value</th></tr>';

    this._body = e('tbody', this.root);
    this._editors = [];
    
    this.redraw();
    
  }
  
  PI.prototype = {
    setObject: function(obj) {
      if (obj !== this.subject) {
        this.subject = obj;
        this.redraw();
      }
    },
    
    redraw: function() {
      var self    = this,
          subject = this.subject;
          
      this._body.innerHTML = '';
      
      if (this.subject) {
        this._editors = this.propertyNames(this.subject).map(function(propName) {
          
          var editor = self.propertyEditor(subject, propName);
          if (typeof editor === 'string') {
            editor = {type: editor};
          }
          
          if (editor.type) {
            editor = self._createEditorForProperty(subject, propName, editor.type, editor);
          }
          
          if (!editor.cell) {
            throw "no editor cell defined for property " + propName;
          }
          
          var row = e('tr');
              
          var labelCell = document.createElement('th');
          labelCell.textContent = self.propertyTitle(subject, propName);
          
          row.appendChild(labelCell);
          row.appendChild(editor.cell);
          
          self._body.appendChild(row);
          
          return editor;
          
        });
      } else {
        this._editors = [];
      }
    },
    
    sync: function() {
      this._editors.forEach(function(ed) { ed.sync(); });
    },
    
    _createEditorForProperty: function(obj, propName, editorType, editorOptions) {
      
      var getValue = this.getPropertyValue,
          setValue = this.setPropertyValue;
      
      function get() { return getValue(obj, propName); }
      function set(v) { return setValue(obj, propName, v); }
      
      var editor = Editors[editorType](get, set, editorOptions);
      
      var cell = document.createElement('td');
      cell.appendChild(editor.editor);
      cell.className = editorType;
      
      editor.cell = cell;
      
      return editor;
      
    }
    
  };
  
  var Editors = {};
  
  function registerEditor(type, ctor) {
    Editors[type] = ctor;
  }
  
  //
  // Default Editors
  
  registerEditor('textfield', function(get, set, opts) {
    
    var input = e('input');
    input.type = 'text';
    
    function sync() {
      input.value = get();
    }
    
    function commit() {
      set(input.value);
      sync();
      existingValue = input.value;
    }
    
    var existingValue = null;
    
    input.addEventListener('focus', function() {
      existingValue = input.value;
    });
    
    input.addEventListener('blur', commit);
    
    input.addEventListener('keydown', function(evt) {
      if (evt.keyCode === 27) {
        input.value = existingValue;
      } else if (evt.keyCode === 13) {
        commit();
        evt.preventDefault();
      }
    });
    
    sync();
    
    return {
      editor    : input,
      sync      : sync
    }
    
  });
  
  registerEditor('checkbox', function(get, set, opts) {
    
    var input = e('input');
    input.type = 'checkbox';
    
    function sync() { input.checked = !!get(); }
    
    input.addEventListener('change', function() {
      set(!!input.checked);
    });
    
    sync();
    
    return {
      editor    : input,
      sync      : sync
    }
    
  });
  
  PI.registerEditor = registerEditor;
  window.PropertyInspector = PI;
  
})();

