;(function(exports) {
  
  var hk = {
    root: null,
    
    init: function(root) {
      hk.root = root;
      root.className = "hk";
    }
  };
  
  exports.hk = hk;
  
})(this);