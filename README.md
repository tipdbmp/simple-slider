### Simple Slider
> a simple slider

##### Use/Import

You need to add the files from the  [`simple-slider`][1] directory to your app/script.

#### Usage

A slider has the following configurable properties; those are the default values:
```javascript
var default_ss = SimpleSlider.$new({
    box: { width: 200, height: 20 },
    line: { width: 180, height: 5 },
    handle: { width: 5, height: 20 },

    value: { initial: 50, min: 0, max: 100, step: undefined, current: 0 },
    callback: undefined,
});
```

```box``` property: specifies the width and height of the slider as a whole.

```line``` property: specifies the width and height of the rectangle in which the ```handle``` can move.

```handle``` property: specifies the width and height of the handle that's used to adjust the value of the slider.

```value``` property: specifies the range of numbers the slider is restricted to, if ```step``` is defined the handle will snap to the neareast snap value

```callback``` property: is a ```function (value) { ... }``` that get's called whenever the slider's value changes


After you've created a slider you need to add it to the DOM:
```javascript
Node.appendChild(default_ss.$root);
```

```SimpleSlider.$root``` property: is the root of the slider.


You can set/get the value of the slider using the methods:
```javascript
SimpleSlider.set_value(<some-numeric-value>);
var current_slider_value = SimpleSlider.get_value();
```


The sliders uses following css classes for styling:
```css
.slider-box { ... }
.slider-line { ... }
.slider-handle { ... }
```

#### Demo
See the [demo](https://tipdbmp.github.io/simple-slider/).


[1]: https://github.com/tipdbmp/simple-slider/blob/master/simple-slider/