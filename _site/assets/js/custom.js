(function ($) {
    setTimeout(function(){
		    $('body').addClass('loaded');
	   }, 3000);

    function isElementInViewport(elem) {
        var $elem = $(elem);
        // Get the scroll position of the page.
        var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
        var viewportTop = $(scrollElem).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        // Get the position of the element on the page.
        var elemTop = Math.round( $elem.offset().top );
        var elemBottom = elemTop + $elem.height();

        return ((elemTop < viewportBottom) && (elemBottom > viewportTop));
    }
    $(".main").onepage_scroll({
        sectionContainer: "section",
        responsiveFallback: 768,
        animationTime: 1000,
        easing: "ease",
        updateURL: false,
        loop: false,
        pagination: false,
        //beforeMove: null,
        beforeMove: function(index){
            if($('#portfolio').hasClass('active')){
                $('ul.projects li').each(function(){
                    $(this).removeClass('open');
                });
                //gateway.slideUp();
            }
        },
        afterMove: function(index) {
          if($('#profile').hasClass('active')){
              $('.chart').easyPieChart({
                easing: "easeInOut",
                barColor: "#2C9DF9",
                trackColor: "#eee",
                scaleColor: false,
                animate: 2000,
                lineWidth: 4,
                size: 90,
                onStep: function(from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                }
            });
           }
        }
    });

    // PORTFOLIO
    $.fn.Gateway = function() {
        $.ajaxSetup({ cache: true });
        var gatewayHeight = window.innerHeight,

            gateway = $('<div class="gateway-show"></div>'),
            loading = $('<div class="portfolio-loading"><ul class="spinner"><li></li><li></li><li></li></ul></div>'),
            $window = $( window ), winsize, $body = $( 'html, body' );
        //var gatewayHeight = gateway.outerHeight() + 110;
        gateway.append(loading);
        gateway.on('click', '.gatewayClose', function(e){
            e.preventDefault();
            gateway.prev().removeClass('open');
            gateway.parent().removeClass('active');
            gateway.slideUp();
        });
        return this.each(function(){
            $('.portfolio-trigger').on( 'click', function(e){
                e.preventDefault();
                var $this = $(this),
                    newFolder = $this.data('folder'),
                    newHTML = 'work/' + newFolder + '/index.html',
                    //targetId  = $(this).attr('id'),
                    scrollToPosition = $(gateway).offset().top,
                    parent = $(this).parent().parent().parent().parent().parent();

                $('ul.projects li').each(function(){
                    $(this).removeClass('open');
                });
                if(parent.next().hasClass('gateway-show')){
                    gateway.slideToggle("600");

                }else{
                    gateway.insertAfter(parent).css('display', 'block');
                }
                if(gateway.css('display') === 'block'){
                    gateway.prev().addClass('open');
                    gateway.parent().addClass('active').css('margin-top', function(){
                        if ($(window).height() > 960) {
                           //alert('greater than ' + $(window).height());
                            return '0px';
                        } else {
                            //alert('less than ' + $(window).height());
                            return ($(window).height() - 960) + 'px';
                        }
                    });
                    $('#nav').css({'background-color':'rgba(40, 48, 65, 0.8)'});
                    //$body.animate({scrollTop: scrollToPosition - $(window).height() });
                }


                // $body.animate({
                //     console.log("scroll up");
                //     scrollTop: gateway.offset().top - $(".grids .open").height()-110,
                //
                //     //scrollTop:gateway.offset().top - ($(".grids .open").height() - $(window).height())
                // }, 600, function() {
                //     gateway.css('height', 'auto');
                //     gateway.fadeIn('slow');
                // });

               //gateway.html(loading).load("assets/lib/portfolio.html #article_"+targetId);
                gateway.html(loading).load(newHTML);
                return false;
             });
        });
    };


    $('ul.projects').Gateway();


    //GOOGLE MAPS
    function CustomMarker(latlng, map) {
        this.latlng_ = latlng;
        this.setMap(map);
    }
    CustomMarker.prototype = new google.maps.OverlayView();
    CustomMarker.prototype.draw = function() {
        var me = this;
        // Check if the div has been created.
        var div = this.div_;
        if (!div) {
          // Create a overlay text DIV
          div = this.div_ = document.createElement('DIV');
          // Create the DIV representing our CustomMarker
          div.style.border = "none";
          div.style.position = "absolute";
          div.style.paddingLeft = "0px";
          div.style.cursor = 'pointer';

          var dv = document.createElement("div");
          dv.className='pin bounce';
          div.appendChild(dv);

          var dvx= document.createElement("div");
          dvx.className='pulse';
          div.appendChild(dvx);

          google.maps.event.addDomListener(div, "click", function (event) {
            google.maps.event.trigger(me, "click");
          });

          // Then add the overlay to the DOM
          var panes = this.getPanes();
          panes.overlayImage.appendChild(div);
        }
        // Position the overlay
        var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
        if (point) {
          div.style.left = point.x + 'px';
          div.style.top = point.y + 'px';
        }
    };
    CustomMarker.prototype.remove = function () {
        // Check if the overlay was on the map and needs to be removed.
        if (this.div_) {
            this.div_.parentNode.removeChild(this.div_);
            this.div_ = null;
        }
    };
    CustomMarker.prototype.getPosition = function () {
      return this.latlng_;
    };

    function initialize() {
     var loc, map, marker, infobox, mapStyle, styledMap, myLatlng, myCenter, mapOptions;
    //       var locations = [
    //          ['London Office', 51.52600, -0.08027, 2],
    //          ['Kigali Office', -33.923036, 151.259052, 1]
    //        ];
    loc = new google.maps.LatLng(51.65170, -0.07316);
    // Set styles.
    mapStyle = [
        {
          "featureType": "water",
         "elementType": "geometry",
         "stylers": [{
         "color": "#000000"
     }, {
         "lightness": 17
     }]
    }, {
     "featureType": "landscape",
         "elementType": "geometry",
         "stylers": [{
         "color": "#000000"
     }, {
         "lightness": 20
     }]
    }, {
     "featureType": "road.highway",
         "elementType": "geometry.fill",
         "stylers": [{
         "color": "#000000"
     }, {
         "lightness": 17
     }]
    }, {
     "featureType": "road.highway",
         "elementType": "geometry.stroke",
         "stylers": [{
         "color": "#000000"
     }, {
         "weight": 0.2
     }, {
         "lightness": 29
     }]
    }, {
     "featureType": "road.arterial",
         "elementType": "geometry",
         "stylers": [{
         "color": "#000000"
     }, {
         "lightness": 18
     }]
    }, {
     "featureType": "road.local",
         "elementType": "geometry",
         "stylers": [{
         "color": "#000000"
     }, {
         "lightness": 16
     }]
    }, {
     "featureType": "poi",
         "elementType": "geometry",
         "stylers": [{
         "color": "#000000"
     }, {
         "lightness": 21
     }]
    }, {
     "featureType": "all",
         "elementType": "labels.text.stroke",
         "stylers": [{
         "visibility": "on"
     }, {
         "color": "#000000"
     }, {
         "lightness": 16
     }]
    }, {
     "featureType": "all",
         "elementType": "labels.text.fill",
         "stylers": [{
         "color": "#000000"
     }, {
         "lightness": 40
     }]
    }, {
     "featureType": "all",
         "elementType": "labels.icon",
         "stylers": [{
         "visibility": "off"
     }]
    }, {
     "featureType": "transit",
         "elementType": "geometry",
         "stylers": [{
         "color": "#000000"
     }, {
         "lightness": 19
     }]
    }, {
     "featureType": "administrative",
         "elementType": "geometry.fill",
         "stylers": [{
         "color": "#000000"
     }, {
         "lightness": 20
     }]
    }, {
     "featureType": "administrative",
         "elementType": "geometry.stroke",
         "stylers": [{
         "color": "#000000"
     }, {
         "weight": 1.2
     }, {
         "lightness": 17
     }]
    }];
    styledMap = new google.maps.StyledMapType(mapStyle);

    // Map properties.
    myLatlng = new google.maps.LatLng(51.65170, -0.07316);
    myCenter = new google.maps.LatLng(51.65170, -0.07316);
    mapOptions = {
        backgroundColor: "#f5f5f5",
        zoom: 19,
        zoomControl:true,
        zoomControlOptions: { style: google.maps.ZoomControlStyle.SMALL },
        disableDoubleClickZoom: false,
        mapTypeControl: false,
        scaleControl: false,
        scrollwheel: false,
        streetViewControl: false,
        draggable : true,
        overviewMapControl: false,
        overviewMapControlOptions: {
           opened: false
           },
        center: myCenter,
        scrollwheel: false,
        disableDefaultUI: true
    };

    marker = new CustomMarker(map.getCenter(), map);
    marker.setMap(map);
    infobox = new InfoBox({
        content: document.getElementById("infobox"),
        disableAutoPan: false,
        maxWidth: 376,
        pixelOffset: new google.maps.Size(20, -325),
        zIndex: null,
        boxStyle: {
            opacity: 1,
            width: "376px"
        },
        closeBoxMargin: "",
        closeBoxURL: "",
        infoBoxClearance: new google.maps.Size(1, 1)
    });


    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    // Open infobox on marker click.
    google.maps.event.addListener(marker, 'click', function() {
         infobox.open(map, this);
         map.panTo(loc);
    });
    // Center map after browser resize.
    google.maps.event.addDomListener(window, 'resize', function() {
        map.setCenter(myCenter);
    });
    google.maps.event.addDomListener(window, 'orientationchange', function() {
        google.maps.event.trigger(map, 'resize');
        map.setCenter(myCenter);
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('resize', true, false, window,0);
        window.dispatchEvent(evt);
    });

    }
    google.maps.event.addDomListener(window, 'load', initialize);

    //WEATHER CARD
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes();
    $.simpleWeather({
        location: 'London, UK',
        woeid: '',
        unit: 'c',
        success: function(weather) {
            html = '<ul class="weather"><li><span>'+weather.city+'</span>'+time+'</li>';
            html += '<li><i class="icon-'+weather.code+'"></i> <span>'+weather.temp+'&deg;'+weather.units.temp+'</span></li></ul>';


          $("#weather").html(html);
        },
        error: function(error) {
          $("#weather").html('<p>'+error+'</p>');
        }
    });


    // Placeholder support
    $.support.placeholder = (function(){
        var i = document.createElement('input');
        return 'placeholder' in i;
        return false
    })();
    // Hide labels by default if placeholders are supported
    if($.support.placeholder) {
        $('.form li:not(.options)').each(function(){
            $(this).addClass('js-hide-label');
        });
        // Code for adding/removing classes here
        $('.form li:not(.options)').find('input, textarea').on('keyup blur focus click', function(e){
            // Cache our selectors
            var $this = $(this),
                $parent = $this.parent();

            if (e.type == 'keyup') {
                if( $this.val() == '' ) {
                    $parent.addClass('js-hide-label');
                } else {
                    $parent.removeClass('js-hide-label');
                }
            }
            else if (e.type == 'blur') {
                if( $this.val() == '' ) {
                    $parent.addClass('js-hide-label');
                }
                else {
                    $parent.removeClass('js-hide-label').addClass('js-unhighlight-label');
                }
            }
            else if (e.type == 'focus') {
                if( $this.val() !== '' ) {
                    $parent.removeClass('js-unhighlight-label');
                }
            }
            else if (e.type == 'click'){
                if( $this.val() !== '' ) {
                    $parent.removeClass('js-unhighlight-label');
                }
            }
        });
    }
      function setupLabel() {
        if ($('.label_check input').length) {
            $('.label_check').each(function () {
                $(this).removeClass('c_on');
            });
            $('.label_check input:checked').each(function () {
                $(this).parent('label').addClass('c_on');
            });
        }
        if ($('.label_radio input').length) {
            $('.label_radio').each(function () {
                $(this).removeClass('r_on');
            });
        $('.label_radio input:checked').each(function () {
            $(this).parent('label').addClass('r_on');
        });
    }
    };

    $('.label_check, .label_radio').on('click', function () {
        setupLabel();
    });
    $('ul.list-group li.enquiry').hide();
    $('#iwant .label_radio').on('click', function () {
        if ($('input[name=projSubject]:checked').val() == "quote") {
        $('ul.list-group li.enquiry').fadeIn(300);
        $('ul.list-group li:last-child').hide();
    } else {
            $('ul.list-group li.enquiry').fadeOut(300);
            $('ul.list-group li:last-child').show();
        }
    });

    //BUDGET SLIDER
    function createSlider(){
      $( "#budget-slider" ).slider({
        range: "min", value: 1500,
        min: 500, max: 5000,
        step: 500, slide: function(event, ui) {
            $("#projBudget").val("£" + ui.value);
        }
      });
      $("#projBudget").val("£" + $("#budget-slider").slider("value"));
    };

    //setupLabel();
    createSlider();

    //text -slider
    function textRotator(el) {
      var words = $(el),
        total = words.length - 1,
        position = 0,
        current = null,
        timer = null;
      $(el).first().addClass('active');
      var autoSlide = function() {
        words.removeClass('active');
        if (position === total) {
          position = 0;
        } else {
          position = position + 1;
        }
        //console.log(position);
        words.eq(position).addClass('active');
      };
      timer = setInterval(autoSlide, 3000);
    };
    textRotator('.change-text span');

    if (screen.width <= 480) {
      $('#profile').addClass('mobile');
    }

})(jQuery);
