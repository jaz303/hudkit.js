
// function installDefaultTheme() {

//     var env = E.create();

//     E.defineMixins({
//         'border-box': function(ctx) {
//             ctx.attribs({
//                 boxSizing: 'border-box',
//                 mozBoxSizing: 'border-box'
//             });
//         },
//         'no-select': function(ctx) {
//             ctx.attribs({
//                 webkitUserSelect: 'none',
//                 cursor: 'default'
//             });
//         },
//         'control-font': function(ctx) {
//             ctx.attribs({
//                 font: '$HK_CONTROL_FONT_SIZE $HK_CONTROL_FONT',
//                 lineHeight: 1
//             });
//         },
//         'control-border': function(ctx) {
//             ctx.attribs({
//                 border: '1px solid $HK_CONTROL_BORDER_COLOR'
//             });
//         },
//         'button': function(ctx) {
//             ctx.include('control-font');
//             ctx.attribs({
//                 background: '$HK_BUTTON_BG_COLOR',
//                 color: '$HK_TEXT_COLOR'
//             });
//             ctx.rule('&.disabled', {
//                 color: '#d0d0d0'
//             });
//             ctx.rule('&:not(.disabled):active', {
//                 background: '$HK_CONTROL_ACTIVE_BG_COLOR'
//             });
//         },
//         'bordered-button': function(ctx) {
//             ctx.include('button');
//             ctx.include('control-border');
//         }
//     });

//     E.defineVariables({

//     };);

// }

