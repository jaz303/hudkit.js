This is more convenient for now, will switch to GH issues if people start using this library...

## TODO

  * Move constants to instance prototype
  * Modules should follow node conventions and return something useful
  * Console auto-complete
  * Console history
  * Icons in buttons/anywhere else
  * Split pane - min/max size policy
  * Split pane - resize policy (proportional, one pane fixed)
  * Split pane - absolute pixel size support

## Bugs

I'm sure there are plenty...

## Issues

  * Buttons have a stringly-typed "type" attribute which applies a CSS class to style the button in a certain way i.e. rounded, rectangular, toolbar, button-bar. In the future we may need to support tri-state, or even multi-state buttons - ie buttons where behaviour is different but at the moment there is no tidy way for the type attribute to alter button behaviour. Not sure if this is worth worrying about, the Button widget is so simmple that it's trivial to create a new widget with the desired behaviour and then just reuse the CSS.

  * Need a way to define behaviours e.g. tooltips

  * Position mode - should it be possible to make a single dimension (e.g. width/height)
    explicit, while leaving the other auto?

  * Toolbar should support either fixed-size or auto-sized widgets. To do this, widgets should gain a method: `supportsAutoSize` or something. Non-auto-sized widgets will be wrapped in a floating container item with an explicit size set. Auto-sized widgets should generally detect that they are inside a toolbar (using CSS) and restyle themselves appropriately.

## Future Widgets

  * Check-box
  * Color-picker
  * Slider
  * Knob
  * XY-pad
  * Text field
  * Text area
  * Form
  * Property inspector
  * Tree view
  * List view
  * Drop-down/select
  * Slideout/over
  * Popover
  * Grid
  * Graph view
  * Node editor
  * Dialog
  * Menus - not sure if necessary