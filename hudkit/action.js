;(function() {
  "use strict";
  
  var hk = modulo.get('hk');
  
  var ActionProto = {
    getTitle: function() { return this._title; },
    setTitle: function(title) { this._title = title; this._notify(); },
    
    addObserver: function(obs) { this._observers.push(obs); },
    removeObserver: function(obs) { hk.remove(this._observers, obs); },
    
    isEnabled: function() { return this._enabled; },
    toggleEnabled: function() { this.setEnabled(!this._enabled); },
    enable: function() { this.setEnabled(true); },
    disable: function() { this.setEnabled(false); },
    
    setEnabled: function(en) { 
      en = !!en;
      if (en != this._enabled) {
        this._enabled = en;
        this._notify()
      }
    },
    
    _notify: function() {
      var os = this._observers;
      for (var i = os.length - 1; i >= 0; --i) {
        os[i]();
      }
    }
  };
  
  ActionProto.__proto__ = Function.prototype;
  
  function createActionFunction(fun) {
    if (!fun) {
      throw "can't create action - no function given";
    }
    
    var actionFun = function() {
      if (actionFun._enabled) {
        return fun.apply(null, arguments);
      } else {
        return undefined;
      }
    }
    
    actionFun._enabled    = true;
    actionFun._title      = "";
    actionFun._observers  = [];
    actionFun.__proto__   = ActionProto;
    
    return actionFun;
  }
  
  function createAction(spec) {
    
    if (spec.__proto__ == ActionProto) {
      return spec;
    }
    
    if (typeof spec == 'function') {
      spec = { action: spec };
    }
    
    var action = createActionFunction(spec.action);
    
    if ('title' in spec)    action._title = spec.title;
    if ('enabled' in spec)  action._enabled = spec.enabled;
    
    return action;
    
  }
  
  hk.createAction = createAction;
  
})();