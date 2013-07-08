/*

**/

var autoGEO = (function ($, my) {

	// share variable across the app via autoGEO.data.name
	my.data = {
		name : "afshin",
//		presets : {},								// key:value --> app presets like audio/geolocation/... ?
		uiElt$ : {},								// key:html elts  --> val: jquery selections; for cross app quick access
		containerWidth : $(".container").width(),	// Containing div drawing area width, modified by window resize
		knownMothers: 0,							// # of chart mothers that have been divined/entered...
		quesitedHouse : 0,							// will hold the # of the House of Quesited
//		audio : true,								// will be tied to UI checkbox, preset
//		geolocation: true,							// will be tied to UI checkbox, preset
		now: undefined,								// time right now updated by the clock, moment object
		latitude: undefined,						// Result of geolocation
		longitude: undefined,						// Result of geolocation
		sunrisetoday: undefined,					// All 3 derived after geolocation, in ag_sunrisesunset.js
		sunsettoday: undefined,						//		used to divide day and night into 12 sections....
		sunrise2moro: undefined,					//		will be Date() objects
		snapshot: undefined,						// url pointing to google pic of geolocation define area
//		sounds : {},								// will hold howler sounds loaded from file.
		chart: [],									// Will hold the built chart
		figs : []
	};


	// logPanel[] will contain JQuery selections of the logs elements, set in initLog()
	var	logPanel = [];								// global to this module (file)


    // my.presets() - App presets saved (presumabely at some point) to localStorage
    //      init() - Load the presets from localstorage if they exists, if not then set defaults. returns presets
    //      get() - Returns presets as key vals 
    //      set(key, val) - Sets a certain preset
    //      save - Saves presets to Localstorage
    my.presets = function() {
        var audio = true;                       // default values that will be over-written by what presets are in localstorage
        var geolocation = true;

        return {
            init:   function() {                // get all setting from LocalStorage, return them as key vals
                        if ( !store.enabled ) { // store comes from store.js
                            my.log("err", "No local storage available (for presets)");
                        } else {
                            var presets = store.get('autoGEO');         // get key vals for our app ??? TODO
                            if ( presets ) {    // presets found in localstorage
                                audio = presets.audio;
                                geolocation = presets.geolocation;
                            }
                            else {            // No presets were there
                                my.log("log", "No app PRESETS found in localstorage. Going with defaults.");
                            }
                        }
                        return { 'audio':audio, 'geolocation':geolocation};
            },
            getAll:    function() {             // return all settings as key-vals
                        return { 'audio':audio, 'geolocation':geolocation};
            },
            set:    function(key, val) {        // set a specific setting
                        if ( key === 'audio') { audio = val; }
                        else if ( key === 'geolocation') { geolocation = val; }
                        else {
                            my.log('e', 'my.setting.set() received an unknown app setting key value:' + key);
                        }
            },
            save:   function() {                // save all settings to LocalStorage
                        store.set('autoGEO', { 'audio':audio, 'geolocation':geolocation});
            }
        };
    }();


    my.settings = function() {
        var audio = true;                  // defaults
        var geolocation = true;

        return {
            init:   function(keyVals) {
                if ( keyVals ) {
                    audio = keyVals['audio'];
                    geolocation = keyVals['geolocation'];
                }
            },
            getAll:    function() {     // return all settings as key-vals
                return { 'audio':audio, 'geolocation':geolocation};
            },
            set:    function(key,val) { // set a specific setting
                if ( key === 'audio') { audio = val; }
                else if ( key === 'geolocation') { geolocation = val; }
                else {
                    my.log('e', 'my.setting.set() received an unknown app setting key value:' + key);
                }
            }
        };
    }();



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

			if (which === 1 ) {
				// for log, Add the augmented msg to the beginning of the list so latest info is at top
				(logPanel[which].txt$).prepend(msg);
			} else {
				(logPanel[which].txt$).append(msg);
			}

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
			my.statusMsg('Error caught - check log!', true);
			console.log("ERROR:" + msg);
			clickOnAndAppendIfNotActive(2);
		}
	};



	// Get access to logs html elements as JQuery selections and save for future reference.
	// Also attach little scrolls bars to each log
	function initLog() {
		var accordion$ = my.data.uiElt$['belowHeader'].find('#accordion1');	// The Log parent element
		var defaults;

		// logPanel[] is global to this module/file only
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




	// ------ Main Program Execution 

	// Some html elements will be accessed over and over again, and across the app, so get the
	// referece to them now and store it away so it can provide quick acess later.

	// These are basic divisions to speed up caching other elements later
	my.data.uiElt$['header'] = $('header');
	my.data.uiElt$['belowHeader'] = $('#belowHeader');

	my.data.uiElt$['statusMsg'] = $('#statusMsg');
	my.data.uiElt$['ChartTable'] = $('#ChartTable');
	my.data.uiElt$['shieldChart'] = $('#shieldChart');
	my.data.uiElt$['geoloc_btn'] = $('#geoloc_btn');
	my.data.uiElt$['planetlist'] = $('.planetlist');	// In the header
	my.data.uiElt$['audio_toggle'] = $("#audio_toggle");
	my.data.uiElt$['questionBox'] = $("#questionBox");	// Textarea on home tab where questions are entered
	my.data.uiElt$['home'] = $('#home');				// Home tab	
	my.data.uiElt$['figtab'] = $('#figtab');			// About the Figures tab
	my.data.uiElt$['housetab'] = $('#housetab');		// About the Houses tab	
	my.data.uiElt$['time'] = $('#time');				// Time Transits & Rulers tab
	my.data.uiElt$['planets'] = $('#planets');			// About the Planets tab	
	my.data.uiElt$['questions'] = $('#questions');		// Questions & Houses tab
	my.data.uiElt$['interpts'] = $('#interpts');		// Interpretations tab	


	if ( my.initView === undefined ){
		my.log("err", "Inside App.js, initView not yet defined!", true);
	} else {
		my.statusMsg("Welcome to AutoGeomancy!");		// Status Message was initialized by the browser.

		initLog();						// Put together logging system for program output, app events, & errors
		my.initBrowser();				// Find browser make/version, Get app presets for Audio & Geolocation		

		my.initView();
	}


	return my;
}(jQuery, autoGEO || {}));