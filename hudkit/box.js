;(function() {
  
  var hk = modulo.get('hk');
  
  var superKlass = hk.Widget.prototype;
  
  hk.Box = hk.Widget.extend(function() {
    hk.Widget.apply(this, arguments);
    this.setBackgroundColor('white');
  }, {
    methods: {
      setBackgroundColor: function(color) {
        this.root.style.backgroundColor = color;
      },
    
      _buildStructure: function() {
        this.root = document.createElement('div');
        this.root.className = 'hk-box';
      }
    }
  });
  
})();