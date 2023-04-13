var minShadow = 5;
var maxShadow = 150;
var minStrength = 0.1;
var maxStrength = 0.15;
var deintensify = 1.5;

function calculateShadows(calcX,calcY) {

   if(calcX > 1) {
      calcX = 1;
   }
   if(calcX < -1) {
      calcX = -1;
   }
   if(calcY > 1) {
      calcY = 1;
   }
   if(calcY < -1) {
      calcY = -1;
   }

  var shadows = "";
  
  // First set of shadows give the 3D effect to the text.
  for (var i = 1; i < 10; i++) {
    shadows += i == 1 ? "" : ", ";
    shadows += "0 " + i + "px 0 rgb("+ (195 - i * 5) + "," + (195 - i * 5) + "," + (195 - i * 5) + ")";
  }

  // Second set of shadows controlled by mouse position or device tilt
  for (var j = minShadow; j < maxShadow; j *= deintensify) {
    var opacity = maxStrength - (j - minShadow) / maxShadow * (maxStrength - minStrength);
    shadows += ", " + (calcX * j) + "px " + (calcY * j + 5) + "px " + j + "px rgba(0,0,0," + opacity + ")";
    // shadows += j < 100 ? ", " : "";
  }
  
//   console.log(shadows);

  return shadows;
  
}

if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i)) {
   
   window.addEventListener('mousemove',function(e) {

     var baseX = (e.x - window.innerWidth / 2) * -1;
     var baseY = (e.y - window.innerHeight / 2) * -1;

     $('.test').css('text-shadow', calculateShadows(baseX/(window.innerWidth / 2),baseY/(window.innerHeight / 2)));

   });
   
} else {
   
   window.addEventListener('deviceorientation',function(e){

      var sensitivity = 15;

      var baseX = e.gamma;
      var baseY = e.beta;

      $('.test').css('text-shadow', calculateShadows(baseX/sensitivity,baseY/sensitivity));

   });
   
}

/*

 Horizontal Scroll Slider

 Version: 0.0.1
 Author: Alexandre Buffet
 Website: https://www.alexandrebuffet.fr
*/
!(function($) {

   'use strict';
 
   var $slider = $('.scroll-slider'),
       $slides = $('.scroll-slide'),
       $sliderWrapper = $('.scroll-wrapper'),
       $firstSlide = $slides.first();

   var settings = {},
       resizing = false,
       scrollController = null,
       scrollTween = null,
       scrollTimeline = null,
       progress = 0,
       scrollScene = null;

   function scrollSlider(options) {

       // Default
       settings = $.extend({
           slider: '.scroll-slider',
           sliderWrapper: '.scroll-wrapper',
           slides: '.scroll-slide',
           slideWidth: null,
           slideHeight: null,
       }, options);

       // Set dimensions
       setDimensions();
       
       // On resize        
       $(window).on( 'resize', function() {
         clearTimeout(resizing);
         resizing = setTimeout(function() {
           setDimensions();
         }, 250); 
       });
     
   }

   function setDimensions() {

       settings.slideWidth = $firstSlide.width();
       settings.slideHeight = $firstSlide.height();
     
       console.log(settings.slideWidth);
       console.log(settings.slideHeight);

       // Calculate slider width and height
       settings.sliderWidth = Math.ceil((settings.slideWidth * $slides.length));
       settings.sliderHeight = $firstSlide.outerHeight(true);

       // Set slider width and height
       $sliderWrapper.width(settings.sliderWidth);
       //$sliderWrapper.height(settings.sliderHeight);

       // Set scene
       setScene();

       //resizing = false;
   }

   function setScene() {

     var xDist = -$slides.width() * ( $slides.length - 1 ),
         tlParams = { x: xDist, ease: Power2.easeInOut };
             
     if (scrollScene != null && scrollTimeline != null) {
         
         progress = 0;
         scrollScene.progress(progress);

         scrollTimeline = new TimelineMax();
         scrollTimeline.to( $sliderWrapper, 2, tlParams );
       
         scrollScene.setTween(scrollTimeline);
       
         scrollScene.refresh();
       
     } else {
         // Init ScrollMagic controller
         scrollController = new ScrollMagic.Controller();

         //Create Tween
         scrollTimeline = new TimelineMax();
         scrollTimeline.to( $sliderWrapper, 2, tlParams );
         scrollTimeline.progress( progress );
       
         // Create scene to pin and link animation
         scrollScene = new ScrollMagic.Scene({
             triggerElement: settings.slider,
             triggerHook: "onLeave",
             duration: settings.sliderWidth
         })
         .setPin(settings.slider)
         .setTween(scrollTimeline)
         .addTo(scrollController)
         .on('start', function (event) {
           scrollTimeline.time(0);
         });
     }
       
   }
   
 $(document).ready(function() {
   scrollSlider(); 
 });
   
})(jQuery);

