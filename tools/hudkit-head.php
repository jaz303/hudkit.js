<?php
$HUDKIT_STYLESHEETS = array(
  'hudkit/reset.css',
  'hudkit/hudkit.css',
);

$HUDKIT_JAVASCRIPTS = array(
  'vendor/jf-signal/lib/signal.js',
  'vendor/jf-classkit/lib/classkit.js',
  'hudkit/hudkit.js',
  'hudkit/action.js',
  'hudkit/widget.js',
  'hudkit/button.js',
  'hudkit/box.js',
  'hudkit/root-pane.js',
  'hudkit/split-pane.js',
  'hudkit/code-editor/code-editor.js',
  'hudkit/console/console.js',
  'hudkit/dialog/dialog.js',
  'hudkit/canvas/canvas2d.js',
  'hudkit/canvas/canvas3d.js',
  'hudkit/toolbar/toolbar.js',
);
?>

<? foreach ($HUDKIT_STYLESHEETS as $css) { ?>
  <link rel='stylesheet' href='<?= $HUDKIT_BASE ?><?= $css ?>'></link>
<? } ?>
<? foreach ($HUDKIT_JAVASCRIPTS as $js) { ?>
  <script src='<?= $HUDKIT_BASE ?><?= $js ?>'></script>
<? } ?>
