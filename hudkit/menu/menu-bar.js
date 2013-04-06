;(function() {
  
  var hk = modulo.get('hk');
  
  function createMenuActuator(bar, menu) {
    var actuator = document.createElement('a');
    actuator.href = '#';
    actuator.innerText = menu.getTitle();
    actuator.addEventListener('click', function(evt) {
      evt.preventDefault();
      alert("click");
    });
    return actuator;
  }
  
  function HKMenuBar() {
    this.items = [];
    this.root = document.createElement('nav');
    this.root.className = 'hk-menu-bar';
  }
  
  HKMenuBar.prototype = {
    getRoot: function() {
      return this.root;
    },
    addMenu: function(item) {
      this.root.appendChild(createMenuActuator(this, item));
    },
    addSpace: function() {
      
    }
  };
  
  hk.createMenuBar = function() {
    return new HKMenuBar();
  };
  
})();