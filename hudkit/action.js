;(function(exports) {
  "use strict";
  
  var ActionProto = {
    getTitle: function() {
      return this._title;
    },
    isEnabled: function() {
      return this._enabled;
    },
    setEnabled: function(en) {
      this._enabled = !!en;
    },
    toggleEnabled: function() {
      this.setEnabled(!this._enabled);
    },
    enable: function() {
      this.setEnabled(true);
    },
    disable: function() {
      this.setEnabled(false);
    }
  };
  
  ActionProto.__proto__ = Function.prototype;
  
  function createAction(title, actionFun) {
    
    if (actionFun.__proto__ == ActionProto) {
      return actionFun;
    }
    
    var fun = function() {
      if (fun._enabled) {
        return actionFun.apply(null, arguments);
      } else {
        return undefined;
      }
    }
    
    fun._enabled  = true;
    fun._title    = title;
    fun.__proto__ = ActionProto;
    
    return fun;
    
  }
  
  exports.hk.createAction = createAction;
  
})(this);