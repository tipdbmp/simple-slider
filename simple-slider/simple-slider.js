var SimpleSlider = (function(/*Dom*/) {
    'use strict';

//     var $ = Dom.$node;
    var embed;

    var traits = {
        set_value: set_value,
        get_value: get_value,

        _set_value_from_handle_x: _set_value_from_handle_x,
        _handle_x_to_value: _handle_x_to_value,
    };

    var proto = {
        box: { width: 200, height: 20 },
        line: { width: 180, height: 5 },
        handle: { width: 5, height: 20 },

        value: { initial: 50, min: 0, max: 100, step: undefined, current: 0 },

        handle_grab_offset: { x: 0, y: 0 },

        callback: undefined,
    };

    function $new(args) {
        var self = embed(Object.create(traits), proto, args);

        self.line.width_2 = self.line.width / 2;
        self.line.height_2 = self.line.height / 2;

        self.handle.width_2 = self.handle.width / 2;
        self.handle.height_2 = self.handle.height / 2;

        self.handle.x = 0;
        self.handle.min_x = -self.handle.width_2;
        self.handle.max_x = self.line.width - self.handle.width_2;

        self.handle.y = (-self.handle.height_2) + (self.line.height_2);


//         self.$root = self.$box
//           = $('div.slider-box',
//                 $('div.slider-box-content',
//                     self.$line = $('div.slider-line', {}, {mousedown: on_slider_line_mousedown},
//                         self.$handle = $('div.slider-handle', {}, {mousedown:on_handle_grab}))));

        self.$root = self.$box = document.createElement('div');
        self.$box.setAttribute('class', 'slider-box');

        var $slider_box_content = document.createElement('div');
        $slider_box_content.setAttribute('class', 'slider-box-content');

        self.$line = document.createElement('div');
        self.$line.setAttribute('class', 'slider-line');
        self.$line.addEventListener('mousedown', on_slider_line_mousedown, false);

        self.$handle = document.createElement('div');
        self.$handle.setAttribute('class', 'slider-handle');
        self.$handle.addEventListener('mousedown', on_handle_grab, false);

        self.$box.appendChild($slider_box_content);
            $slider_box_content.appendChild(self.$line);
                self.$line.appendChild(self.$handle);


        self.$box.style.width = self.box.width + 'px';
        self.$box.style.height = self.box.height + 'px';

        self.$line.style.width = self.line.width + 'px';
        self.$line.style.height = self.line.height + 'px';

        self.$handle.style.width = self.handle.width + 'px'
        self.$handle.style.height = self.handle.height + 'px';
        self.$handle.style.top = self.handle.y + 'px';

        self.set_value(self.value.initial);


        function on_slider_line_mousedown(event) {
//             console.log('slider line clicked');

            var new_handle_x = event.offsetX;
            self._set_value_from_handle_x(new_handle_x);
        }

        function on_handle_grab(event) {
//             console.log('handle grab');

            // prevent the $line mousedown's handler (on_slider_line_mousedown)
            // from getting called
            event.stopPropagation();

            self.handle_grab_offset.x = event.offsetX;
            self.handle_grab_offset.y = event.offsetY;

            document.addEventListener('mouseup', on_handle_release, false);
            document.addEventListener('mousemove', on_handle_move, false);

            document.body.classList.add('simple-slider-disable-text-selection', 'simple-slider-cursor-pointer');
        }

        function on_handle_release(event) {
            document.removeEventListener('mouseup', on_handle_release, false);
            document.removeEventListener('mousemove', on_handle_move, false);

            document.body.classList.remove('simple-slider-disable-text-selection', 'simple-slider-cursor-pointer');
        }

        function on_handle_move(event) {
            var mouse_x = event.clientX - self.handle_grab_offset.x;
            var mouse_y = event.clientY - self.handle_grab_offset.y;

            var line_rect  = self.$line.getClientRects()[0];
            var line_x = line_rect.left;
//             var line_y = line_rect.top;

            var handle = self.handle;

            handle.x = mouse_x - line_x;
            handle.x = clamp(handle.x, handle.min_x, handle.max_x);

            // TODO: vertical slider?
//             handle.y = mouse_y - line_y;
//             handle.y = clamp(handle.y, handle.min_y, handle.max_y);

            self._set_value_from_handle_x(self.handle.x);

            self.$handle.style.left = handle.x + 'px';
            self.$handle.style.top = handle.y + 'px';
        }

        return self;
    }

    function _set_value_from_handle_x(handle_x) {
        var value = this._handle_x_to_value(handle_x);
        this.set_value(value);
    }

    function _handle_x_to_value(handle_x) {
        var result = map(
            handle_x,
            this.handle.min_x, this.handle.max_x,
            this.value.min, this.value.max
        );
        return result;
    }

    function set_value(value) {
        value = clamp(value, this.value.min, this.value.max);

        if (typeof this.value.step !== 'undefined') {
            value = round_to_nearest(value, this.value.step);
        }

        this.value.current = value;

        // value to handle.x
        this.handle.x = map(
            this.value.current,
            this.value.min, this.value.max,
            this.handle.min_x, this.handle.max_x
        );

        if (typeof this.callback === 'function') {
//                 callback.call(this, this.value.current);
            this.callback(this.value.current);
        }

        this.$handle.style.left = this.handle.x + 'px';
    }

    function get_value() {
        return this.value.current;
    }


    // helper functions

    function norm(x, a, b) {
        var result = (x - a) / (b - a);
        return result;
    }

    function lerp(t, a, b) {
        var result =
        // a + t * (b - a);
        // a + t * b - t * a;
        // t * b + a - t * a;
        // t * b + a * (1 - t);
        (1 - t) * a + t * b;
        return result;
    }

    function map(x, a, b, c, d) {
        var result = lerp(norm(x, a, b), c, d);
        return result;
    }

    function clamp(x, a, b) {
        var result = Math.min(Math.max(x, a), b);
        return result;
    }

    function round_to_nearest(n, m) {
        var result = Math.round(n / m) * m;
        return result;
    }

    embed = (function() {
        // http://jsperf.com/isobject4
        function is_object(value)   { return value !== null && typeof value === 'object'; }

        function is_function(value) { return typeof value === 'function'; }

        var is_array = Array.isArray;

        var slice = [].slice;

        var get_prototype_of = Object.getPrototypeOf;
        var get_own_property_descriptor = Object.getOwnPropertyDescriptor;
        var define_property = Object.defineProperty;

        function embed(dst /*, ...objects */) {
            for (
                var object_index = 1, objects_count = arguments.length;
                object_index < objects_count;
                object_index++
            ) {
                var obj = arguments[object_index];

                if (!is_object(obj) && !is_function(obj)) { continue; }

                var want_define_property = !is_array(obj);

                var slots = Object.keys(obj);
                for (
                    var slot_index = 0, slots_count = slots.length;
                    slot_index < slots_count;
                    slot_index++
                ) {
                    var slot = slots[slot_index];
                    var src = obj[slot];

                    if (is_object(src)) {
                        if (!is_object(dst[slot])) {
                            dst[slot] = is_array(src) ? [] : Object.create(get_prototype_of(src));
                        }
                        embed(dst[slot], src);
                    }
                    else {
                        if (want_define_property) {
                            define_property(dst, slot, get_own_property_descriptor(obj, slot));
                        }
                        else {
                            dst[slot] = src;
                        }
                    }
                }
            }
            return dst;
        }

        return embed;
    }());

    var SimpleSlider = {
        traits: traits,
        proto: proto,
        $new: $new,
    };

    return SimpleSlider;
}(/*Dom*/));