function init(window, document) {
    global.window = window;
    global.document = document;

    var hk = require('../');

    var root = hk.init();
    root.setResizeDelay(0);

    var split = new hk.MultiSplitPane();
    split.setOrientation(hk.SPLIT_PANE_VERTICAL);
    
    var b1 = new hk.Box();
    b1.setBackgroundColor('red');
    split.setWidgetAtIndex(0, b1);

    var b2 = new hk.Box();
    b2.setBackgroundColor('green');
    split.addSplit(0.5, b2);

    var b3 = new hk.Box();
    b3.setBackgroundColor('orange');
    split.addSplit(0.75, b3);

    var s2 = new hk.MultiSplitPane();
    s2.setOrientation(hk.SPLIT_PANE_HORIZONTAL);

    var b4 = new hk.Box();
    b4.setBackgroundColor('pink');
    s2.setWidgetAtIndex(0, b4);

    var b5 = new hk.Box();
    b5.setBackgroundColor('green');
    s2.addSplit(0.33, b5);

    var b6 = new hk.Box();
    b6.setBackgroundColor('blue');
    s2.addSplit(0.66, b6);

    split.addSplit(0.25, s2);

    split.removeWidgetAtIndex(2);

    root.setRootWidget(split);

}

exports.init = init;