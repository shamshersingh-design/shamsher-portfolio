 
var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = "";
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) {
        delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName("typewrite");
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute("data-type");
        var period = elements[i].getAttribute("data-period");
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
}; 
 
// create funMouse function 
function funMouse() {




    // get canvas
    const canvas = document.querySelector(".js--canvas");
    const canvasContext = canvas.getContext("2d");




    // set canvas size
    let canvasWidth = (canvas.width = window.innerWidth);
    let canvasHeight = (canvas.height = window.innerHeight);




    // get mouse position
    let mouseX = canvasWidth / 2;
    let mouseY = canvasHeight / 2;




    // create circles
    let circle = {
        radius: 12,
        lastX: mouseX,
        lastY: mouseY
    };

    let miniCircle = {
        radius: 3,
        lastX: mouseX,
        lastY: mouseY
    };




    // get all data-hover elements
    // obvi this is better one a web page with more than one anchor tag
    const elements = [...document.querySelectorAll("a")];




    // resize canvas function
    var resizeCanvas = function resizeCanvas() {
        canvasWidth = canvas.width = window.innerWidth;
        canvasHeight = canvas.height = window.innerHeight;
    };




    // create var holding mouseRender function
    var mouseRender = function mouseRender() {


        // clear canvas so no colours or styles overlap
        canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);


        // get circles x-coordinate and y-coordinate based on mouse coordinates
        // the small circle has a slight delay due to the last parms passed
        circle.lastX = lerp(circle.lastX, mouseX, 0.5);
        circle.lastY = lerp(circle.lastY, mouseY, 0.5);

        miniCircle.lastX = lerp(miniCircle.lastX, mouseX, 0.1);
        miniCircle.lastY = lerp(miniCircle.lastY, mouseY, 0.1);


        // create first circle
        canvasContext.beginPath();
        canvasContext.arc(
            circle.lastX,
            circle.lastY,
            circle.radius,
            0,
            Math.PI * 2,
            false
        );
        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = "black";
        canvasContext.stroke();
        canvasContext.closePath();


        // create small/second circle
        canvasContext.beginPath();
        canvasContext.arc(
            miniCircle.lastX,
            miniCircle.lastY,
            miniCircle.radius,
            0,
            Math.PI * 2,
            false
        );
        canvasContext.fillStyle = "black";
        canvasContext.fill();
        canvasContext.closePath();


        // render/draw mouse by calling requestAnimationFrame() and passing itself through
        requestAnimationFrame(mouseRender);
    };




    // mouseInit function
    var mouseInit = function mouseInit() {


        // render/draw mouse by calling requestAnimationFrame() and passing mouseRender
        requestAnimationFrame(mouseRender);


        // on mouse move update coordinates
        window.addEventListener("mousemove", function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });


        // update canvas size on window resize
        window.addEventListener("resize", resizeCanvas, false);


        // style mouse on hover function
        function on() {
            canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            canvasContext.beginPath();
            canvasContext.arc(
                circle.lastX,
                circle.lastY,
                circle.radius,
                0,
                Math.PI * 2,
                false
            );
            canvasContext.lineWidth = 3;
            canvasContext.strokeStyle = "#000000";
            canvasContext.stroke();
            canvasContext.closePath();

            requestAnimationFrame(on);
        }


        // style mouse off hover
        // should be the same are prior to any hover
        // i noticed if i don't do this then the on styles will stay even after hover
        function off() {
            canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            canvasContext.beginPath();
            canvasContext.arc(
                circle.lastX,
                circle.lastY,
                circle.radius,
                0,
                Math.PI * 2,
                false
            );
            canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = "black";
            canvasContext.stroke();
            canvasContext.closePath();

            canvasContext.beginPath();
            canvasContext.arc(
                miniCircle.lastX,
                miniCircle.lastY,
                miniCircle.radius,
                0,
                Math.PI * 2,
                false
            );
            canvasContext.fillStyle = "black";
            canvasContext.fill();
            canvasContext.closePath();

            requestAnimationFrame(off);
        }


        // using TweenMax.min.js by GSAP addin easing for radius for circle
        // https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js
        let tween = TweenMax.to(circle, 0.25, {
            radius: circle.radius * 2.5,
            ease: Power1.easeInOut,
            paused: true
        });


        // for each hover element add mouseenter and mouseleave actions
        elements.forEach((el) => {
            el.addEventListener("mouseenter", () => {
                on();
            }, false);
            el.addEventListener("mouseleave", () => {
                off();
            }, false);
            el.addEventListener("mouseenter", () => {
                tween.play();
            }, false);
            el.addEventListener("mouseleave", () => {
                tween.reverse();
            }, false);
        });
    };


    // tbh this is from ReGGae's pen that is added in the html comment at the top
    // from my understanding it does a bunch of math to figure out a smooth position update, including the delay on the mini circle
    // my [very poor] translation of this math:
    // shape.lastX = lerp(shape.lastX, mouseX, delay);
    // above === below
    // return (1 - delay) * shape.lastX + delay * mouseX;
    var lerp = function lerp(a, b, n) {
        return (1 - n) * a + n * b;
    };


    //init the mouse function
    mouseInit();
}


// run fun mouse to have this cursor
funMouse(); 


$(document).ready(function() {

    $(document).on("click", ".filter-button", function() {
        var value = $(this).attr('data-filter');

        if (value == "all") {
            //$('.filter').removeClass('hidden');
            $('.filter').show('1000');
        } else {
            //            $('.filter[filter-item="'+value+'"]').removeClass('hidden');
            //            $(".filter").not('.filter[filter-item="'+value+'"]').addClass('hidden');
            $(".filter").not('.' + value).hide('3000');
            $('.filter').filter('.' + value).show('3000');

        }
    });

    if ($(".filter-button").removeClass("active")) {
        $(this).removeClass("active");
    }
    $(this).addClass("active");

    $('.button-group').each(function(i, buttonGroup) {
        var $buttonGroup = $(buttonGroup);
        $buttonGroup.on('click', 'button', function() {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $(this).addClass('is-checked');
        });
    });
});
// filter buttons
//$('.filters-button-group').on( 'click', 'button', function() {


// debounce so filtering doesn't happen every millisecond
function debounce(fn, threshold) {
    var timeout;
    return function debounced() {
        if (timeout) {
            clearTimeout(timeout);
        }

        function delayed() {
            fn();
            timeout = null;
        }
        timeout = setTimeout(delayed, threshold || 100);
    }
}

$(window).bind("load", function() {
    $('#all').click();
}); 