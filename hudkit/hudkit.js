if (typeof modulo === 'undefined') {
  window.modulo = {
    get     : function(k) { return window[k]; },
    set     : function(k, v) { window[k] = v; },
    global  : function() { return window; }
  };
}

;(function() {
  
  var activeCapture = null;
  
  // Constants from jQuery
  var rclass = /[\t\r\n]/g;
  var core_rnotwhite = /\S+/g;
  
  function makeCaptureHandler(fn) {
    return function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      fn(evt);
    }
  }
  
  var hk = {
    POSITION_MODE_DEFAULT   : 0,
    POSITION_MODE_AUTO_SIZE : 1,
    POSITION_MODE_FLOWING   : 2,
    POSITION_MODE_MANUAL    : 3,
    
    root                    : null,
    rootPane                : null,
    
    // Initialise hudkit.js with a given root element.
    init: function(root) {
      hk.rootPane = new hk.RootPane();
      hk.root = root || document.body;
      hk.root.className = 'hk';
      hk.root.appendChild(hk.rootPane.getRoot());
      return hk.rootPane;
    },
    
    log: function() {
      console.log.apply(console, arguments);
    },
    
    parseInt: function(val) {
      var i = parseInt(val, 10);
      if (isNaN(i)) throw "not an integer: " + i;
      return i;
    },
    
    remove: function(ary, obj) {
      var ix = ary.indexOf(obj);
      if (ix >= 0) {
        ary.splice(ix, 1);
      }
      return ix;
    },
    
    isDOMNode: function(thing) {
      if (typeof Node === 'object') {
        return thing instanceof Node;
      } else {
        return (typeof thing === 'object')
                && (typeof thing.nodeType === 'number')
                && (typeof thing.nodeName === 'string');
      }
    },
    
    //
    // Basic CSS stuff
    
    // from jQuery
    hasClass: function(ele, className) {
      className = " " + className + " ";
      return (" " + ele.className + " ").replace(rclass, " ").indexOf(className) >= 0;
    },
    
    // from jQuery
    addClass: function(ele, value) {
      var classes = (value || "").match(core_rnotwhite) || [],
          cur = ele.className ? (" " + ele.className + " ").replace(rclass, " ") : " ";
      
      if (cur) {
        var j = 0, clazz;
        while ((clazz = classes[j++])) {
          if (cur.indexOf(" " + clazz + " ") < 0) {
            cur += clazz + " ";
          }
        }
        ele.className = cur.trim();
      }
    },
    
    // from jQuery
    removeClass: function(ele, value) {
      var classes = (value || "").match(core_rnotwhite) || [],
          cur = ele.className ? (" " + ele.className + " ").replace(rclass, " ") : " ";
          
      if (cur) {
        var j = 0, clazz;
        while ((clazz = classes[j++])) {
          while (cur.indexOf(" " + clazz + " ") >= 0) {
            cur = cur.replace(" " + clazz + " ", " ");
          }
          ele.className = value ? cur.trim() : "";
        }
        
      }
    },
    
    //
    // Event capturing
    
    startCapture: function(events) {
      if (activeCapture) throw "cannot capture events, capture is already in progress";
      activeCapture = document.createElement('div');
      activeCapture.className = 'hk-capture-overlay';
      document.body.appendChild(activeCapture);
      for (var k in events) {
        if (k == 'cursor') {
          activeCapture.style.cursor = events[k];
        } else {
          activeCapture.addEventListener(k, makeCaptureHandler(events[k]));
        }
      }
    },
    
    stopCapture: function() {
      if (activeCapture) {
        document.body.removeChild(activeCapture);
        activeCapture = null;
      }
    }
    
  };
  
  // Theme and metrics are mirrored from the SCSS file
  // < ideal but will do for now.
  // TODO: autogenerate this somehow
  hk.theme = {
    DIALOG_PADDING              : 6,
    DIALOG_HEADER_HEIGHT        : 24,
    DIALOG_TRANSITION_DURATION  : 200,
    SPLIT_PANE_DIVIDER_SIZE     : 10,
    TOOLBAR_HEIGHT              : 18,
    
    // The following properties are defined in Javascript only...
    TOOLBAR_MARGIN_TOP          : 8,
    TOOLBAR_MARGIN_RIGHT        : 8,
    TOOLBAR_MARGIN_BOTTOM       : 8,
    TOOLBAR_MARGIN_LEFT         : 8,
  };
  
  modulo.set('hk', hk);
  
})();