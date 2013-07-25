// 

var autoGEO = (function ($, my) {

	// my.statusMsg()
	//		Put a little status message up with some animation
	my.statusMsg = function(msg, bErr, icon) {
		var smallIcon = icon || 'icon-info-sign';		// default icon

		var msg2 = '<i class=' + smallIcon + '></i> ' + msg;
		my.data.uiElt$['statusMsg'].stop()
									.css( {opacity: 1.0})
									.slideDown()
									.html( (bErr === true) ? my.label('error', msg2) : my.label('warning', msg2) )
									.animate( {opacity: 0.25}, 5500, 'linear',
										function() {
											my.data.uiElt$['statusMsg'].slideUp();
										});
	};



	//
	// initTabs() - Enable the tabs, inject HTML into tabs, setup handlers for click on interpts
	function initTabs() {
		var localBelowHeader$ = my.data.uiElt$['belowHeader'];

		my.data.uiElt$['figtab'] = localBelowHeader$.find('#figtab');			// About the Figures tab
		my.data.uiElt$['housetab'] = localBelowHeader$.find('#housetab');		// About the Houses tab	
		my.data.uiElt$['time'] = localBelowHeader$.find('#time');				// Time Transits & Rulers tab
		my.data.uiElt$['planets'] = localBelowHeader$.find('#planets');			// About the Planets tab	
		my.data.uiElt$['questions'] = localBelowHeader$.find('#questions');		// Questions & Houses tab
		my.data.uiElt$['interpts'] = localBelowHeader$.find('#interpts');		// Interpretations tab	
		my.data.uiElt$['about'] = localBelowHeader$.find('#about');				// About tab	

		// Activate all the tabs
		localBelowHeader$.find('#appTabs a').click(function (e) {
			e.preventDefault();
			$(this).tab('show');
		});

		// Gets & injects the html for the TIME TRANSITS AND RULERS tab
		var file = './ajax/geomantic-hours.html';
		my.loadRulerTimesTable(file);
			my.progressBar.increase(5);

		// Questions in their Houses tab
		file = './ajax/classicquestions.html';
		my.loadQuestions(file);
			my.progressBar.increase(5);

		// Planets Tab
		file = './ajax/planets.html';
		my.loadHTMLintoTab(file, my.data.uiElt$['planets'] ); // can add 3rd parameter method to run when done
			my.progressBar.increase(5);

		// Interpretations tab
        var defaults = {                    // for slimscroller
            height: '300px',
            distance: '4px',
            railVisible: true,
            wheelStep: 10
        };

		my.data.uiElt$['interpts'].find('#interptText').slimScroll( defaults );

		// About tab
		my.data.uiElt$['about'].find('div').slimScroll( defaults ); // had trouble with attaching slimscroll to tab div, but it works attached to inner

		my.initInterpretations();
			my.progressBar.increase(5);
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

				// if (my.log) { my.log('i', 'el$ = ' + el$); }
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
			//el$.attr('checked', true);
			el$.bootstrapSwitch('setState', true);
		}
		else {
			//el$.attr('checked', false);
			el$.bootstrapSwitch('setState', false);
		}

		el$.on('switch-change', function(e, data) {
			var $el = $(data.el);
			var value = data.value;
			if ( value === true ) {
				my.settings.set('audio', true);
				my.audio.unmute().play('spring1', 0.2);
			}
			else {
				my.settings.set('audio', false);
				my.audio.mute();
			}
		});
	};


	my.progressBarView = function(el$) {
		alert(el$.attr('style'));
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

			my.progressBar.increase();

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

			my.progressBar.increase();
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
					function(){$(this).parent().addClass('overEffect1');  },
					function(){$(this).parent().removeClass('overEffect1'); }
				).click(function(e) {
					if (e.shiftKey) {					// only show figure info if shift key is pressed at same time as single-click
						var whichFigure = $(this).data("id");

						my.log('l', 'Shift-Click on ' + my.data.figs[whichFigure].name);
						my.audio.play('tick6', 0.6);
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




	my.castingInput = function() {
		var el$;
		var spaceBarPress = [];		// will be array of 16 integers that indicate how many times space bar was hit

		var minClicksPerLine;
		var justClickedInTheFirstTime;
		var castingInProgress;
		var linesCast;
		var abortedCast = false;		// not really used yet...
		var count;

		my.data.uiElt$['castingInput'] = my.data.uiElt$['home'].find('#castingInput');

		function reset() {
			for (var i = 0 ; i < 16 ; i += 1) {		// erase however much of the four mothers was previously generated
				spaceBarPress[i] = 0;
			}

			justClickedInTheFirstTime = true;
			castingInProgress = false;
			linesCast = 0;
		}


		function abortCasting() {
			my.data.knownMothers = 0;
			reset();
			abortedCast = true;
			castingInProgress = false;
			// my.statusMsg('Casting Aborted!', false, 'icon-exclamation-sign');
			el$.val("Casting Aborted - Start over.");
		}


		function init(minSpacesPerLine) {
			el$ = my.data.uiElt$['castingInput'];
			minClicksPerLine = minSpacesPerLine || 6;		// default to 6

			reset();
			el$.fadeIn('slow');				// was hidden via css

			el$.on('blur', function() {
				if ( castingInProgress === true) {
					my.log('log', 'Casting aborted.');
					abortCasting();
				} else {
					my.log('log', 'Input field lost focus, casting wasnt in progress though.');
					if ( abortedCast === true ) { el$.val("Click in here to start."); }
				}
			});

			el$.on('focus', function() {
				my.log('log', "Space bar input field received focus.");

				if ( my.data.quesitedHouse === 0 ) {
					my.log('log', "Space bar input field received focus for manual divination, but no House of the quesited selected.  Its ok.");
					my.audio.play('notify2', 0.5);
					my.statusMsg('No House of the Quesited Selected!', true, 'icon-flag');
					// play a warning sound
				} else {
					my.log('log', "Get ready to Cast.");
					// my.statusMsg('Get ready to Cast.');
				}

				el$.val("Focus on your question, ENTER to start");
			}).keypress(handleKeyPress);

			return this;
		}


		function handleKeyPress(e) {
			var parseFourLines = function() {
				var figure = ((spaceBarPress[linesCast-1] % 2 ) * 8) + ((spaceBarPress[linesCast-2] % 2) * 4)+ ((spaceBarPress[linesCast-3] % 2) * 2) + (spaceBarPress[linesCast-4] % 2);
				// my.log('i', 'Figure parsed to: ' + figure);
				return figure;
			};

			// e.preventDefault();
			el$.val("");	// Whatever they typed, erase it!

			// Initial case of where they just click in and hit ENTER key to start
			if ( justClickedInTheFirstTime && ( e.which === 13 ) ) {	// 13 is enter key
				el$.val("Start!");
				castingInProgress = true;
				abortedCast = false;  // just in case it was set to true from a previous attempt
				justClickedInTheFirstTime = false;
				count = 0;

				return;
			}

			if ( castingInProgress === true ) {

				if ( e.which === 13 ) {					// ENTER key, but not the first time
					if ( count < minClicksPerLine ) {
						my.log('err', 'Casting aborted because settings require at least ' + minClicksPerLine + ' hits per line. Be careful also not to go too fast, or hit ENTER twice by mistake.');
						my.audio.play('bebeblip', 0.5);
						el$.trigger('blur');			// blur handler calls abortCasting()
					} else {							// ENTER was hit and there are a valid # of space bar hits
						spaceBarPress[linesCast] = count;
						linesCast += 1;

						// my.log('log', 'line ' + linesCast + ' -- count: ' + count);

						count = 0;

						if ( linesCast % 4 === 0 ) {
							my.figSelected( parseFourLines() );			// will generate whole chart when we hit four mothers
						}


						if ( linesCast > 15 ) {							// Finished with all 16 lines
							// Chart was already generated by call to my.figSelected() above
							castingInProgress = false;
							el$.val('Done. Now go to Interpretations.');
							el$.off('keypress');
							el$.blur();
							// TODO: save the keypress information (the actual number of clicks which is in the spaceBarArray[]
						} else {
							el$.val( linesCast + ' done, ' + (16-linesCast) + ' lines left, keep going');
						}
					}
					return;
				}

				if ( e.which === 32 ) {					// Space bar 
					count += 1;
				}
			}

		}


		return {
			init: init
		};
	};



	//  only called upon app startup
	my.initView = function() {
		my.chart.init();

		initTabs();							// Load html and inject into appropriate tabs
			my.progressBar.increase();
		initButtonsAndControls();			// Audio checkbox and Geolocation button handlers
			my.progressBar.increase();
		initClockAndTime();					// Date and Time, geolocation in header
			my.progressBar.increase(5);
		// initChart();						// Set up handlers inside the chart
			my.progressBar.increase(5);
		initGeomanticFigures();				// Load the geomantic figures
			my.progressBar.increase(5);

		my.castingInput().init();				//
			my.progressBar.increase(5);


		my.data.uiElt$['geoFigures'].css('visibility', 'visible' ).fadeIn(3500, function() {
			my.data.uiElt$['audio_toggle'].css('visibility', 'visible');
			my.data.uiElt$['geoloc_btn'].css('visibility', 'visible');
			$('.invisible').css('opacity', '1.0').css('visibility', 'visible').fadeIn(6000);	// css class invisible are all the other elements I want to show after app startup
			my.progressBar.increase(5);
			my.progressBar.end();
			my.statusMsg("Welcome.  AutoGeomancy is ready!", false, "icon-ok");		// Status Message was initialized by the browser.

			if ( my.data.shiftKeyDown === true ) {
				my.log('log', 'Shift key pressed, skipping startup modal dialog.');
			}
			else {
				$('#myModal').modal('show');
			}
		});


	};


    return my;
}(jQuery, autoGEO || {}));