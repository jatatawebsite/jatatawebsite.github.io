jQuery( document ).ready( function( $ ) {

	function datepicker_button_titles() {
		$('.ui-datepicker-header .ui-datepicker-prev').each(function () {
			$(this).prop('title', 'Previous month');
		});
		$('.ui-datepicker-header .ui-datepicker-next').each(function () {
			$(this).prop('title', 'Next month');
		});
	}
	
	$( '.input-datepicker' ).datepicker({
		buttonText: '',
		dateFormat: 'mm/dd/yy',
        prevText: '&lsaquo;',
        nextText: '&rsaquo;',
        firstDay: 1,
        minDate: 0,
		onChangeMonthYear: function () {
            setTimeout(function () {
                datepicker_button_titles();
            }, 10);
        },
		showOn: 'both',
		onClose: function() {
			$( '.input-datepicker' ).parent().find( 'button' ).attr( 'tabindex', '-1' );
		},
		beforeShow: function (elm, obj) {
            // Handle calendar position before showing it.
            var calendar = obj.dpDiv;
            setTimeout(function () {
				var direction = "top+16";
				var at = "bottom";
				if ( ( $(elm).offset().top - $(window).scrollTop() > calendar.height() + 12 ) && ( $(window).innerHeight() - ( $(elm).offset().top - $(window).scrollTop() + $(elm).outerHeight() ) < calendar.height() + 12 ) ){ 
					direction = "bottom-17";
					at = "top";
				}
				calendar.position({
					my: 'left ' + direction,
					at: 'left ' + at,
					collision: 'none',
					of: elm
				});
                datepicker_button_titles();
            }, 10);
			if ( $( elm ).attr( 'id' ) == 'check-out-date' ) {
				var min_check_out = 0;
				if ( check_in_date ) {
					min_check_out = new Date( check_in_date );							
					min_check_out.setDate( min_check_out.getDate() + 1 );
				}
				$(elm).datepicker( 'option', 'minDate', min_check_out );
			}
		},
		onSelect: function() {
            $(this).trigger( 'change' );
        }
	});

	var check_in_date = null, check_out_date = null;
	
	$( '#check-in-date' ).change(function () {
        check_in_date = $(this).datepicker( 'getDate' );
		if ( check_in_date && check_out_date && ( check_in_date.getTime() >= check_out_date.getTime() ) ) {
			$( '#check-out-date' ).datepicker( 'setDate', null );
            check_out_date = null;
        }
    });
	
	$( '#check-out-date' ).datepicker( 'option', {
		beforeShowDay: function (date) {
			if ( check_in_date && ( date.getTime() < check_in_date.getTime() ) ) { //&& new Date(date).setHours(1) > new Date().setHours(0, 0, 0))) {
                return [false, '', ''];
            }
			return [true, '', ''];
		}
	}).change(function () {
        check_out_date = $(this).datepicker( 'getDate' );
    });
	
	/*
	var i = -1;
	$( '.input-datepicker' ).each( function() {
		console.log( i );
		$( this ).parent().find( 'button' ).attr( 'tabindex', i );
		i--;
	});
	*/
	
	
});