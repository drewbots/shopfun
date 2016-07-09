/*
 Position values can be set in posts.
 Example:
     <script>
         var _page_conf = {
             // image width and height
             image: {
                width: 6997,
                height: 200
             },

             // pointers and their targets
             targets: [
                 {
                    x: 90, // these are
                    y: 114, // target values
                    elem: "#pointer" //this is pointer element id for this target
                 },
                 {
                    x: 200,
                    y: 94,
                    elem: "#pointer2"
                 },
                 {
                    x: 80,
                    y: 172,
                    elem: "#pointer3"
                 },
                 {
                    x: 390,
                    y: 188,
                    elem: "#pointer4"
                 },
                 {
                    x: 590,
                    y: 188,
                    elem: "#pointer5"
                 }
             ]
         };
     </script>
 */

document.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, false);

var myScroll;

function loaded() {
    myScroll = new IScroll('#wrapper', {scrollX: true, scrollY: false, mouseWheel: true});
}

(function($,sr){

    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            };

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    }
    // smartresize
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

jQuery(function ($) {

    if(typeof _page_conf !== 'object'){
        throw new Error("Page config vars missing.");
        return;
    }


    var updatePointer = function() {
        var image  = _page_conf.image || ({width: 6997, height: 200});
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();

        // Get largest dimension increase
        var xScale = windowWidth / image.width;
        var yScale = windowHeight / image.height;
        var scale;
        var yOffset = 0;
        var xOffset = 0;

        if (xScale > yScale) {
            // The image fits perfectly in x axis, stretched in y
            scale = xScale;
            yOffset = (windowHeight - (image.height * scale)) / 2;
        } else {
            // The image fits perfectly in y axis, stretched in x
            scale = yScale;
            xOffset = (windowWidth - (image.width * scale)) / 2;
        }

        var arrayLength = _page_conf.targets.length;
        for (var i = 0; i < arrayLength; i++) {
            $(_page_conf.targets[i].elem).css({
                top: (_page_conf.targets[i].y) * scale + yOffset,
                left: (_page_conf.targets[i].x) * scale + xOffset
            });
        }
    };

    $('.js-menu, .js-menu2').on('click', function () {
        var bodyClass;
        if($(this).is('.js-menu'))
            bodyClass = 'menu-open';
        else
            bodyClass = 'bottom-open';

        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('body').removeClass(bodyClass);
        } else {
            $(this).addClass('active');
            $('body').addClass(bodyClass);
        }
    });

    $('.tooltip').each(function(i, elem){
        $(elem).tooltipster({
            // we detach the element from the page and give it to Tooltipster to serve as content
            content: $($(elem).attr('data-content')).detach(),
            // if you use a single element as content for several tooltips, set this option to true
            contentCloning: false,

            animation: 'fade',
            delay: 100,
            trigger: 'custom',

            trackOrigin: '20',
            interactive: 'true',

            triggerOpen: {
                click: true,
                mouseenter: true,
                touchstart: true,
                tap: true
            },
            triggerClose: {
                click: true,
                scroll: false,
                mouseleave: false,
                tap: false
            }

        });
    });


    $(window).smartresize(updatePointer);

    updatePointer();
});