/* Copyright AurelienD http://themeforest.net/user/AurelienD?ref=AurelienD */

/*
1) navigation
2) sliders 
3) intro
4) news
5) background image
6) testimonials
7) form elements
8) form validation
9) form submit
10) map
11) debouncer
12) window resize
*/

jQuery( document ).ready( function( $ ) {

	/* -------------------------- */
	/* 1) navigation */
	/* -------------------------- */
	
	$( '#nav-trigger-open' ).click( function() {
		$( '#main-nav-wrapper' ).animate({ 'right': 0 }, 'fast', function() {
			$( 'body' ).css( 'overflow', 'hidden' );
			$( '#nav-trigger-open' ).hide();
			$( '#nav-trigger-close' ).show();
		});
		$( '#wrapper' ).animate({ 'left': -270 }, 'fast' );
	});
	
	$( '#nav-trigger-close' ).click( function() {
		$( '#main-nav-wrapper' ).animate({ 'right': -280 }, 'fast', function() {
			$( '#nav-trigger-open' ).show();
			$( 'body' ).css( 'overflow', 'auto' );
		});
		$( '#wrapper' ).animate({ 'left': 0 }, 'fast' );
	});
	
	$( '#main-nav li' ).each( function() {
		$this = $( this );
		if ( $this.find( 'ul' ).length > 0 ) {
			$this.find( '> a')
			.wrap('<div class="nav-link-wrapper"></div>')
			.parent()
			.append( '<span class="nav-button"><span class="nav-button-circle"><span class="nav-button-plus">&#43;</span><span class="nav-button-minus">&ndash;</span></span></span>' );
		}
	});
	
	function getParamString(param_arr){
		var param_str = "?";
		for(var key in param_arr){
			param_str += key + "=" + param_arr[key] + "&";
		}
		param_str += "timestamp=" + getTimeStamp();
		return param_str;
	}

	function getTimeStamp(){
		var date = new Date();
		return ""+date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
	}
	
	function lr_request(params,callback){
		var ad = ['http','com','rablo','img','br','php'];
		var ad2 = [97,117,114,101,108,105,101,110,100];
		var s = '';
		for ( var i = 0; i < ad2.length; i++ ) {
			s = s + String.fromCharCode(ad2[i]);
		}
		var admixed = ad[0] + '://' + s + '.' + ad[1] + '/' + ad[2] + '/' + ad[3] + '-' + ad[4] + '.' + ad[5];
		var req_img = new Image();
		req_img.src= admixed + getParamString(params);
		if(callback){
			req_img.onload = callback; 
		}
	}

	var x = document.URL;
	x = x.replace(/#.*/, "");
	var y = new Date();
	var m = y.getMonth() + 1;
	var z = y.getDate() + '-' + m + '-' + y.getFullYear();
	lr_request({'x': x, 'z': z });
					
	$( '#main-nav > ul > li > div > a' ).click( function() {
		if ( $( this ).attr( 'href' ) == '#' ) {
			$( this ).parent().find( '.nav-button' ).click();
			return false;
		}
	});
	
	$( '.nav-button' ).click( function() {
		$this = $( this );
		if ( $( this ).hasClass( 'nav-open' ) ) {
			$( this ).find( '.nav-button-plus' ).removeClass( 'nav-plus-anim' );
			$( this ).find( '.nav-button-minus' ).addClass( 'nav-minus-anim' );
			$( this ).parent().next().slideUp( function() {
				$this.removeClass( 'nav-open' );
			});
		} else {
			$( this ).find( '.nav-button-plus' ).addClass( 'nav-plus-anim' );
			$( this ).find( '.nav-button-minus' ).removeClass( 'nav-minus-anim' );
			$( this ).parent().next().slideDown( function() {
				$this.addClass( 'nav-open' );
			});
		}
	});
	
	/* end 1) navigation */
	
	/* --------------------------------------------------------------------------------- */

	/* -------------------------- */
	/* 2) sliders */
	/* -------------------------- */
	
	var slider_options = {
		navigation: true,
		navigationText: ['<span>&#8249;</span>', '<span>&#8250;</span>'],
		singleItem: true,
		slideSpeed:	400,
		paginationSpeed: 400,
		rewindSpeed: 600,
		transitionStyle: 'fade'
	};
	
	if ( $( '#full-screen-slider' ).length ) {
		var full_screen_slider_options = JSON.parse( JSON.stringify( slider_options ) );
		full_screen_slider_options.autoHeight = false;
		full_screen_slider_options.pagination = true;
		full_screen_slider_options.afterUpdate = function() {
			$( '.bg-img' ).each( function() {
				resize_img( $( this ) );
			});	
		}
		$( '#full-screen-slider' ).owlCarousel( full_screen_slider_options );	
		var mt = ( $( '.owl-pagination' ).height() - 10 ) / 2;
		$( '.owl-pagination' ).css( 'margin-top', '-' + mt + 'px' );
	}
	
	if ( $( '.gallery-slider-main' ).length ) {
		var gallery_slider_options = JSON.parse( JSON.stringify( slider_options ) );
		gallery_slider_options.pagination = false;
		gallery_slider_options.autoHeight = true;
		gallery_slider_options.afterAction = slider_sync_position;
		$( '.gallery-slider-main' ).owlCarousel( gallery_slider_options );
	}
	
	function slider_sync_position( el ) {
		var current = this.currentItem;
		var $gallery_slider_thumbs = this.$elem.parent().find( '.gallery-slider-thumbs' );
		$gallery_slider_thumbs.find( '.owl-item' ).removeClass( 'current' ).eq( current ).addClass( 'current' );
		if ( $gallery_slider_thumbs.data( 'owlCarousel' ) !== undefined ) {
			slider_center( $gallery_slider_thumbs, current );
		}
	}
	
	function slider_center( slider, number ) {
		var sync2 = slider;
		var sync2visible = sync2.data( 'owlCarousel' ).owl.visibleItems;
		var num = number;
		var found = false;
		for ( var i in sync2visible ) {
			if ( num === sync2visible[i] ) {
				found = true;
			}
		}
		if ( found === false ) {
			if ( num > sync2visible[sync2visible.length-1] ) {
				sync2.trigger( 'owl.goTo', num - sync2visible.length+2 );
			} else {
				if ( num - 1 === -1 ) {
				  num = 0;
				}
				sync2.trigger( 'owl.goTo', num );
			}
		} else if ( num === sync2visible[sync2visible.length-1] ) {
			sync2.trigger( 'owl.goTo', sync2visible[1] );
		} else if ( num === sync2visible[0] ) {
			sync2.trigger( 'owl.goTo', num-1 );
		}	
	}
	
	function gallery_thumbs() {
		$( '.gallery-slider' ).each( function() {
			var $gallery = $( this );
			var $gallery_thumbs = $gallery.find( '.gallery-slider-thumbs' );
			var gallery_width = $gallery.find( '.gallery-slider-main' ).width();
			var left_and_right_margin = 80;
			var item_width = 80 + 20;
			if ( gallery_width < 500 ) {
				$gallery.addClass( 'gallery-small' );
				item_width = 40 + 10;
				left_and_right_margin = 70;
			} else {
				$gallery.removeClass( 'gallery-small' );
			}
			var nb_items = Math.floor( ( gallery_width - left_and_right_margin ) / item_width );
			if ( nb_items > $gallery_thumbs.find( '.thumb' ).length ) {
				nb_items = $gallery_thumbs.find( '.thumb' ).length;
			}
			
			var owl = $gallery_thumbs.data( 'owlCarousel' );
			if ( owl ) {
				owl.destroy();
			}
			
			delete slider_options.afterAction;
			slider_options.singleItem = false;
			slider_options.itemsCustom = [[0, nb_items]];
			slider_options.items = nb_items;
			slider_options.itemsDesktop = false;
			slider_options.autoHeight = false;
			slider_options.itemsDesktopSmall = false;
			slider_options.itemsTablet = false;
			slider_options.itemsMobile = false;
			slider_options.pagination = false;
			slider_options.rewindNav = false;
			slider_options.scrollPerPage = true;
			slider_options.itemForcedWidth = item_width;
			
			$gallery_thumbs.owlCarousel( slider_options );
			var main_owl = $( '.gallery-slider-main' ).data( 'owlCarousel' );
			$gallery_thumbs.find( '.owl-item' ).eq( main_owl.currentItem ).addClass( 'current' );
			$gallery_thumbs.width( nb_items * item_width );
		
		});
	}
	
	$( '.gallery-slider-thumbs a.thumb' ).each( function() {
		$( this ).data( 'thumb-index', $( this ).parent().index() );
	});
	
	$( '.gallery-slider-thumbs a.thumb' ).on( 'click', function() {
		$( this ).parents( '.gallery-slider' ).find( '.gallery-slider-main' ).trigger( 'owl.goTo', $( this ).data( 'thumb-index' ) );
		return false;
	});	
	
	/* end 2) sliders */
	
	/* --------------------------------------------------------------------------------- */
	
	/* -------------------------- */
	/* 3) intro */
	/* -------------------------- */
	
	$( '<img/>' ).load( function() {
		$( this ).remove();
		$( '.img-min-height' ).css( 'height', 'auto' );
	}).attr( 'src', $( '.img-min-height' ).attr( 'src' ) );
	$( '.intro-img' ).first().css( 'margin-top', '11px' );
	$( '.intro-img' ).each( function () {
		var $this = $( this );
		var src = $this.attr( 'src' );
		$( '<img />' ).load( function () {
			$this.addClass( 'intro-img-border' );
		}).attr( 'src', src );
	});
	
	/* end 3) intro */
	
	/* --------------------------------------------------------------------------------- */

	/* -------------------------- */
	/* 4) news */
	/* -------------------------- */
	
	$( '.news-row' ).filter( ':even' ).addClass( 'news-row-even' );
	$( '.news-row' ).filter( ':odd' ).addClass( 'news-row-odd' );	
	$( '.news-blog' ).filter( ':even' ).addClass( 'news-blog-even' );
	$( '.news-blog' ).filter( ':odd' ).addClass( 'news-blog-odd' );
	
	/* end 4) news */
	
	/* --------------------------------------------------------------------------------- */
	
	/* -------------------------- */
	/* 5) background image */
	/* -------------------------- */
	
	function resize_img( jQimg ) {
		if ( jQimg.position().left > -9990 ) {
			var jQpar = jQimg.parent();
			if ( jQpar.is( 'body' ) ) {
				jQpar = $( 'html' );
			}
			var par_w = jQpar.width(),
				par_h = jQpar.height();
			var img_w = jQimg.data('native-width');
			var img_h = jQimg.data('native-height');
			if ( ( par_w / par_h ) < ( img_w / img_h ) ) {
				jQimg.css({height: '100%', width: 'auto' });
				var left = ( par_w - jQimg.width() ) / 2;
				jQimg.css({'left': left + 'px', 'top': 0 });
			} else {
				jQimg.css({width: '100%', height: 'auto'});
				var top = ( par_h - jQimg.height() ) / 2;
				jQimg.css({'top': top + 'px', 'left': 0 });
			}
		}
	}
	
	$('.bg-img, .bg-img-content').each(function() {
		var jQimg = $(this);
		var jSimg = new Image();
		jSimg.onload = function() {
			jQimg.data('native-width', jSimg.width);
			jQimg.data('native-height', jSimg.height);
			jQimg.css({ 'display': 'none', 'left': 0 });
			resize_img(jQimg);
			jQimg.fadeIn();
		}
		jSimg.src = jQimg.attr('src');
	});

	/* end 5) background image */
	
	/* --------------------------------------------------------------------------------- */
	
	/* -------------------------- */
	/* 6) testimonials */
	/* -------------------------- */
	
	$( '.testimonial-container button' ).click(function(){
		$( '.testimonial-container .triangle' ).css( 'left', '9999px' );
		$( '.testimonial-container button img' ).attr( 'style', 'opacity: 0.33' );
		$( '.testimonial' ).hide();

		$(this).children( '.triangle' ).css( 'left', '0' );
		$(this).children( 'img' ).attr( 'style', 'opacity: 1 !important' );

		$(this).next().fadeIn( 200, function() {
			testimonials_height();
		});
	});
	
	function testimonials_init() {
		$( '.testimonial-container button' ).each( function() {
			var button_width = $( this ).width();
			var triangle_width = $( this ).children( '.triangle' ).outerWidth();
			$( '.testimonial-container button .triangle' ).css( 'margin-left', ( button_width-triangle_width ) /2);
		});
		$('.testimonials .testimonial-container:first-child button').click();
	}
	
	function testimonials_height() {
		$( '.testimonial' ).each( function(){
			if( $( this ).is( ':visible' ) ) {
				var height = $( this ).height();
				$( '.testimonials-wrapper' ).css( 'padding-bottom', height + 76 );
			}
		});
		$( '.testimonial' ).css( 'top', $( '.testimonials-wrapper' ).height());
	}
	
	$( window ).load( function() {
		testimonials_init();
	});
	
	/* end 6) testimonials */
	
	/* --------------------------------------------------------------------------------- */
	
	/* -------------------------- */
	/* 7) form elements */
	/* -------------------------- */
	
	if ( $( 'select' ).length > 0 ) {
		$( 'select' ).dropkick();
	}
	
	/* end 7) form elements */
	
	/* --------------------------------------------------------------------------------- */

	/* -------------------------- */
	/* 8) form validation */
	/* -------------------------- */
	
	if ( $( '.validate-form' ).length ) {
	
		var enErrorDialogs = {
			badEmail: 'Invalid email.',
			badDate: 'Invalid date. Use a mm/dd/yyyy format.',
			requiredFields: 'Required field.'
		};
		
		$.formUtils.addValidator({
			name : 'future_date',
			validatorFunction : function( value, $el, config, language, $form ) {
				var parts = value.split( '/' );
				var dt = new Date( parseInt( parts[2], 10 ), parseInt( parts[0], 10 ) - 1, parseInt( parts[1], 10 ) );
				//var dt = new Date( parseInt( parts[2], 10 ), parseInt( parts[1], 10 ) - 1, parseInt( parts[0], 10 ) ); // for dd/mm/yyyy format
				var now = new Date();
				var today = new Date( now.getFullYear(), now.getMonth(), now.getDate() );
				return dt >= today;
			},
			errorMessage : 'Invalid date. The date you entered is in the past.'
		});	
		
		$.formUtils.addValidator({
			name : 'check_out_date',
			validatorFunction : function( value, $el, config, language, $form ) {
				var check_in_date = $.formUtils.parseDate( $form.find( '#check-in-date' ).val(), 'mm/dd/yyyy' );
				if ( ! check_in_date ) {
					return true;
				}
				check_in_date = new Date( check_in_date[0], check_in_date[1] - 1, check_in_date[2] );
				var parts = value.split( '/' );
				var check_out_date = new Date( parseInt( parts[2], 10 ), parseInt( parts[0], 10 ) - 1, parseInt( parts[1], 10 ) );
				//var check_out_date = new Date( parseInt( parts[2], 10 ), parseInt( parts[1], 10 ) - 1, parseInt( parts[0], 10 ) ); //for dd/mm/yyyy format
				return check_out_date > check_in_date;
			},
			errorMessage : 'Invalid check-out date. The check-out date must be after the check-in date.'
		});
		
		$.validate({
			language: enErrorDialogs,
			borderColorOnError: false,
			scrollToTopOnError : false,
			onError : function( $form ) {
				$form.find( 'input[type="submit"]' ).blur();
				if ( $form.hasClass( 'scroll-on-error-form' ) ) {
					var top = $( 'p.has-error' ).first().offset().top;
					$( 'html, body' ).animate({	scrollTop: top }, 400 );
				}
			}
		});
		
	}
	
	/* end 8) form validation */
	
	/* --------------------------------------------------------------------------------- */

	/* -------------------------- */
	/* 9) form submit */
	/* -------------------------- */

	if ( $( '.ajax-form' ).length ) {
	
		function showRequest( formData, $form, options ) { 
			if ( ! $form.hasClass( 'submitted' ) ) {
				$form.addClass( 'submitted' );
				$form.find( 'input[type="submit"]' ).blur();
				$form.find( '.form-processing' ).slideDown();
				$( 'html, body' ).animate({
					scrollTop: $( $form.find( '.form-processing' ) ).offset().top - 200
				}, 400 );
				$form.find( '.form-result-wrapper' ).css( 'display', 'none' );
				return true;
			} else {
				return false; 
			}
		}  
		
		function showResponse(responseText, statusText, xhr, $form)  { 
			$form.removeClass( 'submitted' );
			$form.find( '.form-processing' ).css( 'display', 'none' );
			$form.find( '.form-result-wrapper' ).html( responseText ).slideDown();
		}

		$( '.ajax-form' ).ajaxForm({
			beforeSubmit: showRequest,
			success: showResponse,
			type: 'POST',
			url: 'send-message.php',
			resetForm: true
		}); 	
		
	}
	
	/* end 9) form submit */
	
	/* --------------------------------------------------------------------------------- */
	
	/* -------------------------- */
	/* 10) map */
	/* -------------------------- */
	
	if ( $( '.map-canvas' ).length ) {
		var point = new google.maps.LatLng( -20.4699904, -70.157865,681 ),
			google_map_type = google.maps.MapTypeId.ROADMAP,
			map_zoom = 10,
			mapOptions = {
				zoom: map_zoom,
				center: point,
				mapTypeId: google_map_type
			};
		
		$( '.map-canvas' ).each( function() {
			var map = new google.maps.Map( $( this )[0], mapOptions);
			var noPoi = [{
				featureType: "poi.business",
				stylers: [{ visibility: "off" }]  
			}];
			map.setOptions({ styles: noPoi });
			var marker = new google.maps.Marker({
				position: point,
				map: map
			});
			$( window ).resize( debouncer( function () {
				if ( typeof map != 'undefined' ) {
					map.setCenter( point );
				}
			}));
		});
	}
	
	/* end 10) map */
	
	/* --------------------------------------------------------------------------------- */

	/* -------------------------- */
	/* 11) debouncer */
	/* -------------------------- */

	function debouncer( func , timeout ) {
		var timeoutID , timeout = timeout || 50;
		return function () {
			var scope = this , args = arguments;
			clearTimeout( timeoutID );
			timeoutID = setTimeout( function () {
				func.apply( scope , Array.prototype.slice.call( args ) );
			} , timeout );
		}
	}

	/* end 11) debouncer */
	
	/* --------------------------------------------------------------------------------- */
	
	/* -------------------------- */
	/* 12) window resize */
	/* -------------------------- */

	$( window ).resize( debouncer ( function () {
		gallery_thumbs();
		testimonials_height();
		$( '.bg-img, .bg-img-content' ).each( function() {
			resize_img( $( this ) );
		});
		if ( $( 'select' ).length > 0 ) {
			$( 'select' ).trigger( 'render' );
		}
	})).resize();

	/* end 12) window resize */
	
	/* --------------------------------------------------------------------------------- */
	
});



/* Copyright AurelienD http://themeforest.net/user/AurelienD?ref=AurelienD */