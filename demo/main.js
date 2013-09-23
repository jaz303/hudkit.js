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

    var editor = new hk.CodeEditor();
    var console = new hk.Console();
    

    leftSplit.setTopWidget(editor);
    leftSplit.setBottomWidget(console);
    leftSplit.setSplit(0.7);

    rightSplit.setTopWidget(tabs);
    rightSplit.setBottomWidget(b4);
    rightSplit.setSplit(0.7);

    root.setRootWidget(outerSplit);

    console.newCommand(true);
    // console.ready();


}

exports.init = init;