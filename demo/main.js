function init(window, document) {
    global.window = window;
    global.document = document;

    var hk = require('../');

    var root = hk.init();

    var outerSplit  = new hk.SplitPane(),
        leftSplit   = new hk.SplitPane(),
        rightSplit  = new hk.SplitPane();

    outerSplit.setOrientation(hk.SPLIT_PANE_VERTICAL);
    leftSplit.setOrientation(hk.SPLIT_PANE_HORIZONTAL);
    rightSplit.setOrientation(hk.SPLIT_PANE_HORIZONTAL);

    outerSplit.setLeftWidget(leftSplit);
    outerSplit.setRightWidget(rightSplit);
    outerSplit.setSplit(0.42);

    var canvas = new hk.Canvas2D();

    var tabs = new hk.TabPane();
    tabs.addTab('Canvas', canvas);
    tabs.addTab('Foobar', new hk.Canvas2D());
    tabs.addTab('BazBleem', new hk.Box());

    var b4 = new hk.Box();

    var editor = new hk.Box();
    var term = new hk.Console();
    
    leftSplit.setTopWidget(editor);
    leftSplit.setBottomWidget(term);
    leftSplit.setSplit(0.7);

    rightSplit.setTopWidget(tabs);
    rightSplit.setBottomWidget(b4);
    rightSplit.setSplit(0.7);

    var toolbar = new hk.Toolbar();

    var a1 = hk.action(function() {
        console.log("FOO");
    }, {title: 'Foo'});

    var a2 = hk.action(function() {
        console.log("BAR");
    }, {title: 'Bar'});

    toolbar.addAction(a1);
    toolbar.addAction(a2);

    root.setToolbar(toolbar);
    root.setRootWidget(outerSplit);

    console.newCommand(true);
    // console.ready();


}

exports.init = init;