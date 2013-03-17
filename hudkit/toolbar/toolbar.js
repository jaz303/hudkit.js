;(function(global, hk) {
  
  var superKlass = hk.Widget.prototype;
  hk.Toolbar = hk.Widget.extend({
    methods: {
      init: function() {
        superKlass.init.apply(this, arguments);
      },
      
      _buildStructure: function() {
        this.root = document.createElement('div');
        this.root.className = 'hk-toolbar';
      }
    }
  });
  
})(this, hk);