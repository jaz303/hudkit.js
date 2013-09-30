function init(window, document) {
    global.window = window;
    global.document = document;

    var hk = require('../');

    var root = hk.init();

    var buttons = new hk.ButtonBar();

    var split = new hk.SplitPane();
    split.setOrientation(hk.SPLIT_PANE_VERTICAL);

    var b1 = new hk.Box(),
        b2 = new hk.Box();

    b1.setBackgroundColor('#303030');
    b2.setBackgroundColor('#505050');

    split.setLeftWidget(b1);
    split.setRightWidget(b2);

    var panel = new hk.Panel();
    panel.addChild('buttons', buttons);
    panel.addChild('split', split);

    panel.setLayout(function(c, x, y, width, height) {
        
        if (c.buttons)
            c.buttons.setBounds(0, 0, 20, height);

        if (c.split)
            c.split.setBounds(28, 0, width - 28, height);
    
    });

    root.setRootWidget(panel);

    document.addEventListener('keypress', function(evt) {
        if (String.fromCharCode(evt.charCode) == 't') {
            split.toggleWidgetAtIndex(0);
        }
    });

    // var outerSplit  = new hk.SplitPane(),
    //     leftSplit   = new hk.SplitPane(),
    //     rightSplit  = new hk.SplitPane();

    // outerSplit.setOrientation(hk.SPLIT_PANE_VERTICAL);
    // leftSplit.setOrientation(hk.SPLIT_PANE_HORIZONTAL);
    // rightSplit.setOrientation(hk.SPLIT_PANE_HORIZONTAL);

    // outerSplit.setLeftWidget(leftSplit);
    // outerSplit.setRightWidget(rightSplit);
    // outerSplit.setSplit(0.42);

    // var canvas = new hk.Canvas2D();

    // var tabs = new hk.TabPane();
    // tabs.addTab('Canvas', canvas);
    // tabs.addTab('Foobar', new hk.Canvas2D());
    // tabs.addTab('BazBleem', new hk.Box());

    // var b4 = new hk.Box();

    // var editor = new hk.Box();
    // var term = new hk.Console();
    
    // leftSplit.setTopWidget(editor);
    // leftSplit.setBottomWidget(term);
    // leftSplit.setSplit(0.7);

    // rightSplit.setTopWidget(tabs);
    // rightSplit.setBottomWidget(b4);
    // rightSplit.setSplit(0.7);

    // var toolbar = new hk.Toolbar();

    // var a1 = hk.action(function() {
    //     console.log("FOO");
    // }, {title: 'Foo'});

    // var a2 = hk.action(function() {
    //     console.log("BAR");
    // }, {title: 'Bar'});

    // toolbar.addAction(a1);
    // toolbar.addAction(a2);

    // root.setToolbar(toolbar);
    // root.setRootWidget(outerSplit);

    // console.newCommand(true);
    // // console.ready();


}

exports.init = init;