// 

var autoGEO = (function ($, my) {

	// will contain JQuery selections of the logs elements, set in initLog(), so that we
	// wont have to do a bunch of redundant JQuery selections everytime we log.
	var	logPanel = [];			// global to this module (file)

	var audioChkbx$ = $("#audio_toggle");



	// my.log() -- 
	//		to :  "info" or "log" or "err"       (the type of log message)
	//		msg : message to be outputed
	//		bShowstopper : whether this is a fatal situation! (or just special in the case of "log"), 
	//						default is false
	my.log = function(to, msg, bShowstopper) {
		function clickOnAndAppendIfNotActive(which) {
			var count = -1;

			if ( which !== 1 ) {	// only want to click open geolog or error because app log is updated too often.
				// if this is not the currently open collapsible, then trigger the click on its anchor so it can close the others...
				if (  !( (logPanel[which].active$).hasClass('in') ) ) {
					(logPanel[which].a$).click();
				}
			}

			// add bootstrap span classes for labeling colors...
			if ( (to === "err") || (to === "error") ) {			// to, bShowstopper, msg defined in outer fx
				if (bShowstopper) {
					msg = my.label("important", msg);
				} else {
					msg = my.label("warning", msg);
				}
			}
			else if ( (to === "log") || (to === "l") ){
				if (bShowstopper) {
					msg = my.label("success", msg);
				} else {
					msg = my.label("info", msg);
				}
			}
			else {
				// no label formatting for "info" logs
			}

			msg = '<p>' + msg + '</p>';

			// Add the augmented msg to the beginning of the list so latest info is at top
			(logPanel[which].txt$).prepend(msg);

			// use the counter itself to keep track of count of msgs in collapsible
			count = ((logPanel[which].count$).text()) * 1;	// multiply casts it to number
			count += 1;
			(logPanel[which].count$).text(count);
		}

		// bShowstopper is an optional argument, set it to false by default
		if (typeof bShowstopper === "undefined" || bShowstopper === null || bShowstopper === "false") {
			bShowstopper = false;
		}

		if ( (to === "info") || ( to === "i" ) ) {
			clickOnAndAppendIfNotActive(0);
		}
		else if ( (to === "log") || (to === "l") ) {
			console.log(msg);
			clickOnAndAppendIfNotActive(1);

		}
		else if ( (to === "err") || (to === "error") ) {
			console.log("ERROR:" + msg);
			clickOnAndAppendIfNotActive(2);
		}
	};



	// Get access to logs html elements as JQuery selections and save for future reference.
	// Also attach little scrolls bars to each log
	function initLog() {
		var accordion$ = $("#accordion1");		// The Log parent element
		var defaults;

		logPanel[0] = {					// log
				txt$ : accordion$.find("#logInfo"),
				a$ : accordion$.find("a:first"),
				active$ : accordion$.find("#collapseOne"),
				count$ : accordion$.find(".log-stats:eq(0) span")
		};

		logPanel[1] = {					// info
				txt$ : accordion$.find("#logSys"),
				a$ : accordion$.find("a:eq(1)"),
				active$ : accordion$.find("#collapseTwo"),
				count$ : accordion$.find(".log-stats:eq(1) span")
		};

		logPanel[2] = {					// err
				txt$ : accordion$.find("#logErr"),
				a$ : accordion$.find("a:eq(2)"),
				active$ : accordion$.find("#collapseThree"),
				count$ : accordion$.find(".log-stats:eq(2) span")
		};


		// attach the cute little scroll bars to the 3 log windows
		// http://rocha.la/jQuery-slimScroll
		defaults = {
			distance: '4px',
			railVisible: true,
			wheelStep: 10,
			start: 'bottom'
		};

		logPanel[0].txt$.slimScroll( defaults );
		logPanel[0].active$.collapse('hide');
		logPanel[1].txt$.slimScroll( defaults );
		logPanel[2].txt$.slimScroll( defaults );

	}



	//
	// initTabs() - Enable the tabs, tab switching
	function initTabs() {
		// Handler lets you pick between the different tabs
		$('#appTabs a').click(function (e) {
			e.preventDefault();
			$(this).tab('show');
		});

		// Gets & injects the html for the TIME TRANSITS AND RULERS tab
		var file = './ajax/geomantic-hours.html';
		my.loadRulerTimesTable(file);

		file = './ajax/classicquestions.html';
		my.loadQuestions(file);
	}



		/* CHECKBOX CODE REMINDER:
		// to set $("form #mycheckbox").attr('checked', true);
		// to check  $('form #mycheckbox').is(':checked');
		*/


	//
	// initButtonsAndControls() - Event handlers for Geolocation button and Audio On/Off checkbox
	function initButtonsAndControls() {
		// Click handler for AUDIO on/off checkbox
		audioChkbx$.click(function() {
			if ( $(this).is(':checked') ) {	// Audio toggled  on
				my.data.audio = true;
				Howler.unmute();			// unmute all sounds  
				my.playAudio('spring1', 0.2);
			}
			else
			{								// Audio toggled off
				my.data.audio = false;
				Howler.mute();				// mute all sounds, not sure if this actually stops them

				// loop through all sounds, stop them in case mute() just lowered their volume...
				for (var snd in my.data.sounds) {
					if (my.data.sounds.hasOwnProperty(snd)) {
						my.data.sounds[snd].stop();
					}
				}
			}
		});


		// Click handler for GEOLOCATION button
		my.data.uiElt$['geoloc_btn'].click(function(e) {
			e.preventDefault();
			my.playAudio('klik1', 0.2);
			my.log('l', "Geolocation button was pressed");
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

					my.log('l', 'Shift-Click on house:' + whichFigure);
					my.playAudio('klik1', 0.2);
					my.data.uiElt$['housetab'].load('ajax/houseinfo.html #' + whichFigure);	// use anchor within html file to load just the part we want
					$('#appTabs li:eq(2) a').tab('show');
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

		//my.data.uiElt$['figtab'].load('ajax/figinfo.html');

		// Add handler to shift-click on a figure brings up info about it.
		geoFiguresList$.find('.figureImg')
				.hover(
					function(){$(this).parent().addClass('overEffect1'); },
					function(){$(this).parent().removeClass('overEffect1'); }
				).click(function(e) {
					if (e.shiftKey) {					// only show figure info if shift key is pressed at same time as single-click
						var whichFigure = $(this).data("id");

						my.log('l', 'Shift-Click on ' + my.data.figs[whichFigure].name);
						my.playAudio('klik1', 0.2);
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
				$(this).addClass('chartHover');
			},
			function() {
				$(this).removeClass('chartHover');
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
					my.playAudio('klik1', 0.2);
					my.data.uiElt$['housetab'].load('ajax/houseinfo.html #' + whichFigure);	// use anchor within html file to load just the part we want
					$('#appTabs li:eq(2) a').tab('show');
				}
			});

	}




	//  only called upon app startup
	my.initView = function() {
		initLog();							// Put together logging system
		my.initBrowser();					// Get App presets, browser make/version, catch resize event
		initTabs();							// Load html and inject into appropriate tabs
		initButtonsAndControls();			// Audio checkbox and Geolocation button handlers
		initClockAndTime();					// Date and Time, geolocation in header
		initChart();						// Set up handlers inside the chart
		initGeomanticFigures();				// Load the geomantic figures
	};


    return my;
}(jQuery, autoGEO || {}));