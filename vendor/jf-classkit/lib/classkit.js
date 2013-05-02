(function(exports) {
  
  function Base() {};
  
  Base.prototype.method = function(name) {
    var self = this, method = this[name];
    return function() { return method.apply(self, arguments); }
  }
  
  Base.prototype.lateBoundMethod = function(name) {
    var self = this;
    return function() { return self[name].apply(self, arguments); }
  }
  
  Base.extend = function(ctor, features) {
    
    ctor.prototype = Object.create(this.prototype);
    
    for (var k in this) {
      ctor[k] = this[k];
    }
    
    Object.defineProperty(ctor, 'sup', {
      configurable: false,
      enumerable: false,
      value: this
    });
    
    features = features || {};
    
    if (features.methods) {
      var methods = features.methods;
      for (var methodName in methods) {
        ctor.prototype[methodName] = methods[methodName];
      }
    }
    
    return ctor;
    
  };
  
  exports.Base = Base;
  
})(typeof exports == 'undefined' ? this : exports);