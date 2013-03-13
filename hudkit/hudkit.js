;(function(exports) {
  
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
    root: null,
    
    // Initialise hudkit.js with a given root element.
    init: function(root) {
      hk.root = root || document.body;
      root.className = "hk";
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
  };
  
  exports.hk = hk;
  
})(this);