;(function() {
  
  function Signal(source, name) {
    this._source = source;
    this._name = name;
    this._handlerName = 'on' + (name.charAt(0).toUpperCase()) + name.substring(1);
    this._handlers = [];
  };
  
  Signal.prototype.connect = function(fnOrObject, name) {
    this._handlers.push(this._functionForDescriptor(fnOrObject, name));
  };
  
  Signal.prototype.disconnect = function(fn) {
    var ix = this._handlers.indexOf(fn);
    if (ix >= 0) {
      this._handlers.splice(ix, 1);
    }
  };
  
  Signal.prototype.disconnectAll = function() {
    this._handlers.splice(0, this._handlers.length);
  };
  
  Signal.prototype.emit = function(evt) {
    evt = evt || {};
    evt.source = this._source;
    for (var i = this._handlers.length - 1; i >= 0; --i) {
      this._handlers[i](evt);
    }
  };
  
  Signal.prototype._functionForDescriptor = function(fnOrObject, name) {
    if (typeof fnOrObject === 'function') {
      return fnOrObject;
    } else {
      return fnOrObject.method(name || this._handlerName);
    }
  }
  
  Signal.createSignalBox = function(source, signals) {
    var box = {};
    source = source || box;
    for (var i = 0; i < signals.length; ++i) {
      box[signals[i]] = new Signal(source, signals[i]);
    }
  }
  
  window.Signal = Signal;
  
})();