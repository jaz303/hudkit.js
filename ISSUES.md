This is more convenient for now, will switch to GH issues if people start using this library...

## Traits

I'd like to rip out the class-based inheritance model and substitute traits instead.

## Block/inline widgets

__Block__ widgets are always absolutely positioned, and positioned/sized explicitly by their parent container.

__Inline__ widgets are more complicated. Inline is in fact a slight misnomer - it really means the widgets _flow_ inside their parent; whether the actual mechanism for achieving this is `inline`, `inline-block` or `block` is immaterial. We can't simply use CSS for this, however, for a number of reasons.

  * some parent widgets (e.g. `ButtonBar` with vertical orientation) may require `block` layout for child widgets, whereas `inline-block` is more suitable for `Toolbar` (scoped `.hk-inline-widget` selectors are a potential solution for this).

  * it might be a requirement to give a specific widget, say, a fixed width, whilst the rest of the widgets inside a parent should assume their default/auto widths.

  * canvas-backed inline widgets need to set the canvas size explicitly.

There are two general solution paths:

  1. expose a general Javascript API for assigning extra classes to widgets and delegating the layout issues entirely CSS.

  2. provide 2 methods for inline widgets e.g. `widget.setLayoutSizingHints(hints)` and `widget.setUserSizingHints(hints)`, each receiving a set of constraints, where the latter (provided by the user) overrides the former (provided by the parent container). Each widget can then interpret and apply the union of these constraints however it so wishes.

Approach 1 is more 'pure' but it doesn't address the canvas issue. Approach 2 is more appealing to me at the moment as it abstracts CSS, and one of hudkit's goals is ultimately to be retargetable to other rendering engines (e.g. SDL).

I ended implementing inline widgets; it works ok so far. I would still like to find a flexible solution that doesn't involve making a distinction between block/inline widgets.

## TODO

  * Horizontal slider to support rounding/increments. Knob too.
  * <del>Toolbar size should be set in code and be adjustable</del>
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

  * Text area
  * XY-pad
  * List view
  * Form
  * Dialog
  * Popover
    * Color-picker
  * Slideout/over
  * Node editor
  * Graph view
  * Menus - not sure if necessary
  * <del>Check-box</del>
  * <del>Slider</del>
  * <del>Knob</del>
  * <del>Text field</del>
  * <del>Property inspector</del>
  * <del>Tree view</del>
  * <del>Drop-down/select</del>
