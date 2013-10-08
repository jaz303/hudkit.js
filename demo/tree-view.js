function init(window, document) {
    global.window = window;
    global.document = document;

    var hk = require('../');

    var root = hk.init();
    root.setResizeDelay(0);

    var split = new hk.SplitPane();
    split.setOrientation(hk.SPLIT_PANE_VERTICAL);

    var b1 = new hk.TreeView(),
        b2 = new hk.Box();

    b2.setBackgroundColor('#505050');

    split.setLeftWidget(b1);
    split.setRightWidget(b2);
    split.setSplit(0.25);

    var status = new hk.StatusBar();

    status.addTextCell('left', 'Line 23, Column 49');
    status.addTextCell('right', 'Spaces: 4').setMinWidth(100).setAlign('center');
    status.addTextCell('right', 'JavaScript').setMinWidth(100).setAlign('center');

    var panel = new hk.Panel();
    panel.addChild('split', split);
    panel.addChild('status', status);

    panel.setLayout(function(p, x, y, w, h) {
        p.split.setBounds(0, 0, w, h - 28);
        p.status.setBounds(0, h - 20, w, 20);
    });

    root.setRootWidget(panel);

}

exports.init = init;