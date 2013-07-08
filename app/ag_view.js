// 

var autoGEO = (function ($, my) {

	// my.statusMsg()
	//		Put a little status message up with some animation
	my.statusMsg = function(msg, bErr) {
		my.data.uiElt$['statusMsg'].stop()
									.css( {opacity: 1.0})
									.slideDown()
									.html( (bErr === true) ? my.label('warning', msg) : my.label('info', msg) )
									.animate( {left: '+=90px', top: '+=150px', opacity: 0.25}, 5500, 'linear',
										function() {
											$(this).slideUp();
										});
	};



	//
	// initTabs() - Enable the tabs, inject HTML into tabs, setup handlers for click on interpts
	function initTabs() {
		// Activate all the tabs
		$('#appTabs a').click(function (e) {
			e.preventDefault();
			$(this).tab('show');
		});

		// Gets & injects the html for the TIME TRANSITS AND RULERS tab
		var file = './ajax/geomantic-hours.html';
		my.loadRulerTimesTable(file);

		// Questions in their Houses tab
		file = './ajax/classicquestions.html';
		my.loadQuestions(file);

		// Planets Tab
		file = './ajax/planets.html';
		my.loadHTMLintoTab(file, my.data.uiElt$['planets'] ); // can add 3rd parameter method to run when done

		// Interpretations tab
        var defaults = {                    // for slimscroller
            height: '300px',
            distance: '4px',
            railVisible: true,
            wheelStep: 10
        };
		my.data.uiElt$['interpts'].find('#interptText').slimScroll( defaults );
		my.initInterpretations();
	}



		/* CHECKBOX CODE REMINDER:
		// to set $("form #mycheckbox").attr('checked', true);
		// to check  $('form #mycheckbox').is(':checked');
		*/

	my.ViewConstructor = function(element$) {
		var el$ = element$;

		return {
			init: function(el, fx, elAncestor, tag) {
				el$ = el$ || el;		// choose el$ to be itself if its already set, or else el if first parameter is not undefined

				if ( el$ === undefined && elAncestor !== undefined) {	// 3rd parameter is where we can start looking for it
					el$ = elAncestor$.find(tag);
				}

				my.log('i', 'el$ = ' + el$);
				if (fx) { fx(el$);}
			},
			exec: function(fx, params) {
				// assert fx === function
				fx(params);
			}
		};
	};


	// The view for audio consists of the checkbox for turning sound on/off
	//
	my.audioView = function(el$) {
		// initial state of checkbox, 
		if (! my.audio.isMuted() ) {
			el$.attr('checked', true);
		}
		else {
			el$.attr('checked', true);
		}

		// click handler for audio on/off checkbox 
		el$.click(function() {
			if ( $(this).is(':checked') ) {				// Audio toggled  on
//				my.settings.set('audio', true);			// my.data.audio = true;
				my.audio.unmute().play('spring1', 0.2);
			}
			else
			{								// Audio toggled off
//				my.settings.set('audio', false);			// my.data.audio = false;
				my.audio.mute();
			}
		});
	};






	//
	// initButtonsAndControls() - Event handlers for Geolocation button and Audio On/Off checkbox
	function initButtonsAndControls() {
/*
		// Click handler for AUDIO on/off checkbox
		audioChkbx$.click(function() {
			if ( $(this).is(':checked') ) {	// Audio toggled  on
				my.settings.set('audio', true);			// my.data.audio = true;
				my.audio.unmute().play('spring1', 0.2);
			}
			else
			{								// Audio toggled off
				my.settings.set('audio', false);			// my.data.audio = false;
				my.audio.mute();
			}
		});
*/

		// Click handler for GEOLOCATION button
		my.data.uiElt$['geoloc_btn'].click(function(e) {
			e.preventDefault();
			my.audio.play('klik1', 0.2);
//			my.log('l', "Geolocation button was pressed");
			my.doGeolocationAndSuntimes(my.data.uiElt$['geoloc_btn']);
		});



		// Click and Hover handlers for Planetary list 
		my.data.uiElt$['planetlist'].find('li').hover(
			function() {
				$(this).addClass('overEffect1');
			},
			function() {
				$(this).removeClass('overEffect1');
			})
			.click(function(e) {
				if (e.shiftKey) {					// only show figure info if shift key is pressed at same time as single-click
					var whichFigure = $(this).data("id");

					my.log('l', 'Shift-Click on planet:' + whichFigure);
					my.audio.play('klik1', 0.2);
					// TODO: at this time it makes no difference what planet they click on
					// TODO: I dont understand why eq(4) isnt the right tab!
					$('#appTabs li:eq(5) a').tab('show');
				}
			});
	}



	//
	// initClockAndTime() -  Get the clock up
	function initClockAndTime() {
		var clock$ = my.data.uiElt$['currenttime'];

		var updateTime = function() {
			my.data.now = moment();				// Get & save current time

			var now = '<i class="icon-time"></i> ' + my.data.now.format('dddd MMMM Do YYYY, h:mm a');	// bootstrap icons
			now = my.label("default", now);							// bootstrap styling "labels"

			clock$.html(now);		// Put up the new time, clock$ available through closure
			// my.log('i', "clock updated! " + now);
		};


		if (clock$ === undefined) {					// the very first time
			clock$ = $("#currenttime");
			my.data.uiElt$['currenttime'] = clock$;	// cache it as part of the 'global' my object.
			my.log('l', "Clock initialized");
		}

		updateTime();							// Put up the current time
		setInterval(updateTime, 10000);			// Set up a timer to update the time every 10 seconds
	}



	// called by function initGeomanticFigures() 
	// Load Geomantic figures image files and put them in the Figures Panel, to be clicked on...
	// Assusmes we already read in the the figures data info from json 
	function initFigPanel() {
		var geoFiguresList$ = $("#geoFigures ul");

		for (var i=0; i < my.data.figs.length; i++) {
			geoFiguresList$.append( '<li><img src="' +
										my.data.figs[i].src +
										'" class="figureImg' +
										'" alt="' + my.data.figs[i].name +
										'" data-id="' + i +
										// TODO: I dont know if there's any need to add callbacks dynamically...
										'" ondblclick="autoGEO.figSelected(' + i + ');"></img></li>' );

			// save shortcut to jquery object representing this image for future ref.
			my.data.figs[i].selector$ = geoFiguresList$.find('img[alt="' +  my.data.figs[i].name + '"]');
		}


		// Add handler to shift-click on a figure brings up info about it.
		geoFiguresList$.find('.figureImg')
				.hover(
					function(){$(this).parent().addClass('overEffect1'); },
					function(){$(this).parent().removeClass('overEffect1'); }
				).click(function(e) {
					if (e.shiftKey) {					// only show figure info if shift key is pressed at same time as single-click
						var whichFigure = $(this).data("id");

						my.log('l', 'Shift-Click on ' + my.data.figs[whichFigure].name);
						my.audio.play('klik1', 0.2);
						my.data.uiElt$['figtab'].load('ajax/figinfo.html #' + whichFigure);	// use anchor within html file to load just the part we want
						$('#appTabs li:eq(1) a').tab('show');
					}
				});
	}


	//
	// Load Geomantic Figure data from file in JSON,
	// upon success, call fx to load images from files and populate figures panel
	function initGeomanticFigures() {
		var json;
		var file = './ajax/geomantic-figures.json';		// TODO: hardcoded filename

		$.ajax(file, {
			dataType: 'json',
			beforeSend: function() {
				// Add options to load from somewhere else here...
				my.log("log", 'Attempting to load Geomantic figures from:' + file, true);
			},
			error : function(a,b) {
				my.log('err', 'Failed to JSON in Geomantic Figures ' + b, true);
			},
			success : function(result) {
				my.log("log", 'Loaded Geomantic figures from files successfully.', true);
				my.data.figs = result.figs;		// TODO: make sure this data persists
				// assert result.figs[0].name === my.data.figs[0].name === "populus"
				// now that we have all the data loaded, lets load the img files for the figs
				initFigPanel();					// load images of figures and fill panel
			}
		});
	}



	// ag_chart.js holds code that deals with logic of figure combining and building the 
	// chart data structure.  Here we just set up handlers for background effects.
	// TODO: load the chart in dynamically.
	function initChart() {
		my.data.uiElt$['ChartTable'].hover(
			function() {
				$(this).addClass('chartHover').addClass('transpt');

			},
			function() {
				$(this).removeClass('chartHover').removeClass('transpt');
			}
		);


		my.data.uiElt$['ChartTable'].find('.house').hover(
			function() {
				$(this).addClass('overEffect1');
			},
			function() {
				$(this).removeClass('overEffect1');
			})
			.click(function(e) {
				if (e.shiftKey) {					// only show figure info if shift key is pressed at same time as single-click
					var whichFigure = $(this).attr("id");
					whichFigure = whichFigure.substring(5);

					my.log('l', 'Shift-Click on house:' + whichFigure);
					my.audio.play('klik1', 0.2);
					my.data.uiElt$['housetab'].load('ajax/houseinfo.html #' + whichFigure);	// use anchor within html file to load just the part we want
					$('#appTabs li:eq(2) a').tab('show');
				}
			});


		my.data.uiElt$['ChartTable'].on("dblclick", '.house', function() {
			var house = ( $(this).attr('id').slice(5) ) * 1;	// get which house, turn into number

			if ( my.data.knownMothers < 4 ) {				// dont do if chart is already derived
				if ( house < 13 ) {
					my.log('l', 'House of chosen double click on : ' + house);
					my.setQuesitedHouse(house, $(this));
				}
			}
		});
	}




	//  only called upon app startup
	my.initView = function() {

		initTabs();							// Load html and inject into appropriate tabs
		initButtonsAndControls();			// Audio checkbox and Geolocation button handlers
		initClockAndTime();					// Date and Time, geolocation in header
		initChart();						// Set up handlers inside the chart
		initGeomanticFigures();				// Load the geomantic figures
	};


    return my;
}(jQuery, autoGEO || {}));