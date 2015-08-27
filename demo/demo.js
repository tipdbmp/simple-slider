window.onload = function() {
    'use strict';

    var $document = document;
    $document.title = 'simple slider demo';

    var $body = $document.body;
    var $ = Dom.$node;

    var $value = $('span', '0');

    var default_ss = SimpleSlider.$new({
        callback: function(value) {
            $value.textContent = Math.floor(value);
        },
    });

    var $canvas = $('canvas');
    var width = $canvas.width = 300;
    var height = $canvas.height = 300;
    var pen = $canvas.getContext("2d");

    var styled_ss = SimpleSlider.$new({
        box: { width: 100, height: 30 },
        line: { width: 80, height: 3 },
        handle: { width: 10, height: 10 },
        value: { initial: 100, min: 20, max: 100, },
        callback: function(value) {
            var radius = value;

            pen.clearRect(0, 0, width, height);
            pen.beginPath();
            pen.arc(width / 2, height / 2, radius, 0, 2 * Math.PI, false);
            pen.fill();
        },
    });

    var $step = $('span', '1');

    var ss_with_step = SimpleSlider.$new({
        box: { width: 600, height: 30 },
        line: { width: 560, height: 3 },
        handle: { width: 10, height: 20 },
        value: { initial: 1, min: 1, max: 10, step: 1 },
        callback: function(value) {
            $step.textContent = value;
        },
    });

    Dom.node_push($body,
        $('div',
            $('h3', 'Default:'),
            default_ss.$root,
            $('span.default-value', 'value: ', $value)),

        $('hr.section-separator'),

        $('div',
            $('h3', 'Styled:'),
            $('div.styled-slider',
                styled_ss.$root, $canvas)),

        $('hr.section-separator'),

        $('div',
            $('h3', 'With Step:'),
            ss_with_step.$root,
            $('span.default-value', 'step: ', $step)),

        ''
    );
};