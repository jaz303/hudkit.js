;(function(global, hk) {
  
  var superKlass = hk.Widget.prototype;
  
  hk.Box = hk.Widget.extend({
    widgetCSSClass: 'hk-box',
    
    methods: {
      init: function() {
        superKlass.init.apply(this, arguments);
        this.setBackgroundColor('white');
      },
      
      setBackgroundColor: function(color) {
        this.root.style.backgroundColor = color;
      }
    }
  });
  
})(this, hk);