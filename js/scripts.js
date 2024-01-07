(function( $ ) {
	$(document).ready(function() {
        $.ajaxSetup ({
			// Disable caching of AJAX responses
			cache: false
		});
		
		$('.slider').sss({
			slideShow : true, // Set to false to prevent SSS from automatically animating.
			startOn : 0, // Slide to display first. Uses array notation (0 = first slide).
			transition : 800, // Length (in milliseconds) of the fade transition.
			speed : 6000, // Slideshow speed in milliseconds.
			showNav : true // Set to false to hide navigation arrows.
		});

		// Load SnazzyMenu on each page load
		$("#nav-placeholder").load("http://www.cottonstates.org/nav.htm");
			
		// Inject the footer on each page load
		$("#footer-placeholder").load("http://www.cottonstates.org/footer.htm");

		// Handle navigation switches from mobile to desktop/landscape
		// setOrientation is now called as the last step of getOrientation. No need for var assignment in prod.
		//let orientation = getOrientation();
		//console.log("Orientation: " + orientation.o + ", Width: " + orientation.w + "px, Height: " + orientation.h + "px");
		setTimeout(function() {
			getOrientation();
		}, 500);
		
		$(window).on('resize', getOrientation);
		
		// Toggle mobile nav menu overlay on trigger click
		$(document).on('click', '.mobile-nav .menu-trigger .menu-btn', toggleMobileNavMenu);
		
		// History page scripts
        if ($('body').hasClass('history-page')) {
            $( '#tab-block' ).tabs();
        }
		
		// Players' Field page scripts
        if ($('body').hasClass('field-page')) {
            $('#playersFieldTable').tablesort();
        }

	// END DOCUMENT READY
	});
	
	// Get Device Orientation functionality
	function getOrientation() {
		let displayOrientation = '';
		let displayWidth = document.documentElement.clientWidth;
		let displayHeight = document.documentElement.clientHeight;
		
		if (displayWidth > displayHeight) {
			displayOrientation = 'landscape';
		} else {
			displayOrientation = 'portrait';
		}
		
		let orientation = { o:displayOrientation, w:displayWidth, h:displayHeight }
		
		//return orientation with timeout to allow for correct page rendering
		setTimeout(function() {
			setOrientation(orientation.o);
		}, 500);
	}
	
	// Set Orientation Specific Layout
	function setOrientation(newOrientation) {
		if (newOrientation == 'landscape') {
			// Adjust body classes for page style/layout changes
			$('body').hasClass('portrait') ? $('body').removeClass('portrait') : '';
			$('body').addClass('landscape');
			
			// Remove mobile styling from nav element
			if ($('#mobileMenuHolder').hasClass('active')) {
				$('#mobileMenuHolder').removeClass('active');
				$('#mobileMenuHolder').addClass('inactive');
			}
			$('#menu-main-nav').hasClass('portrait') ? $('#menu-main-nav').removeClass('portrait') : '';
			
			// Move the menu so it can be opened correctly
			$('#menu-main-nav').appendTo('#nav-placeholder nav .snazzymenu');
			
			// Init SnazzyMenu for landscape/desktop mode
			// Code from: https://www.jqueryscript.net/demo/responsive-sticky-mega-nav-snazzy/
			//setTimeout(function() {
				$('.snazzymenu').snazzyMenu({
					colClasses: true,
					breakpoint: 768,
					position: 'right', // or 'top'
					sticky: true,
					homeBtn:'<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24" y="0"/></g><g><g><rect height="1.5" width="4" x="14" y="12"/><rect height="1.5" width="4" x="14" y="15"/><path d="M20,7h-5V4c0-1.1-0.9-2-2-2h-2C9.9,2,9,2.9,9,4v3H4C2.9,7,2,7.9,2,9v11c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V9 C22,7.9,21.1,7,20,7z M11,7V4h2v3v2h-2V7z M20,20H4V9h5c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2h5V20z"/><circle cx="9" cy="13.5" r="1.5"/><path d="M11.08,16.18C10.44,15.9,9.74,15.75,9,15.75s-1.44,0.15-2.08,0.43C6.36,16.42,6,16.96,6,17.57V18h6v-0.43 C12,16.96,11.64,16.42,11.08,16.18z"/></g></g></svg>&nbsp;Entries&nbsp;Closed',
					locationBtn:'http://maps.google.com/maps?hl=en&gs_nf=1&cp=8&gs_id=w&xhr=t&bav=on.2,or.r_gc.r_pw.r_qf.,cf.osb&biw=1600&bih=779&um=1&ie=UTF-8&q=bayou+desiard+country+club&fb=1&gl=us&hq=bayou+desiard+country+club&hnear=0x862e4876e598840b:0x98ced239c9b8b4c9,Monroe,+LA&sa=',
					locationLabel:'3501 Forsythe Ave, Monroe, LA',
					menuBtn: true,
					toggleBtn: 'plus' // or 'caret'
				});
			//}, 1000);
		} else if (newOrientation == 'portrait') {
			// Adjust body classes for page style/layout changes
			$('body').hasClass('landscape') ? $('body').removeClass('landscape') : '';
			$('body').addClass('portrait');
			
			// De-initialize desktop menu
			$('body>xx').snazzyMenu();
			
			// Move the menu so it can be opened correctly
			$('#menu-main-nav').prependTo('#mobileMenuHolder');
			$('#menu-main-nav').addClass('portrait');
		} else {
			console.log("Unknown screen orientation detection error. Defaulting to mobile navigation.");

			// Adjust body classes for page style/layout changes
			$('body').hasClass('landscape') ? $('body').removeClass('landscape') : '';
			$('body').addClass('portrait');
			
			// De-initialize desktop menu
			$('body>xx').snazzyMenu();
			
			// Move the menu so it can be opened correctly
			$('#menu-main-nav').prependTo('#mobileMenuHolder');
			$('#menu-main-nav').addClass('portrait');
		}

		return true;
	}
	
	// Toggle the mobile nav menu screen cover
	function toggleMobileNavMenu() {
		if ($('.portrait #mobileMenuHolder').hasClass('inactive')) {
			
			// If menu isn't open, open it
			$('.portrait #mobileMenuHolder').removeClass('inactive');
			$('.portrait #mobileMenuHolder').addClass('active');
			$('.portrait #menu-main-nav').addClass('portrait');
			
			$('.menu-trigger .menu-btn').html('<span style="font-size: 15px; vertical-align: middle;">CLOSE</span> X').addClass('close-btn');
		} else {
			// If menu is open, close it
			$('.portrait #mobileMenuHolder').removeClass('active');
			$('.portrait #mobileMenuHolder').addClass('inactive');
			
			$('.menu-trigger .menu-btn').html('MENU').removeClass('close-btn');
		}
	}
	
})( jQuery );
