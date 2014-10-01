var ctx         = require('../core');
var Widget      = require('../Widget');

var CommandBox  = require('command-box');
var d           = require('dom-build');

var Console = module.exports = Widget.extend(function(_super) {

    return [

        function(hk, color) {
            
            _super.constructor.call(this, hk);
        
            this._console = new CommandBox(this._root);

        },

        'delegate', {
            print           : '_console',
            printText       : '_console',
            printError      : '_console',
            printSuccess    : '_console',
            printHTML       : '_console',
            printObject     : '_console',
            setFormatter    : '_console',
            setEvaluator    : '_console',
            setPrompt       : '_console',
            echoOn          : '_console',
            echoOff         : '_console',
            setEcho         : '_console',
            notReady        : '_console',
            ready           : '_console',
            focus           : '_console',
            clearCommand    : '_console',
            newCommand      : '_console'
        },

        'methods', {

            _buildStructure: function() {
                return d('.hk-console');
            }

        }

    ];

});

ctx.registerWidget('Console', Console);