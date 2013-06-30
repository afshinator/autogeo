/*

**/

var autoGEO = (function ($, my) {

	// share variable across the app via autoGEO.data.name
	my.data = {
		name : "afshin",
		presets : {},								// key:value --> app presets like audio/geolocation/... ?
		uiElt$ : {},								// key:html elts  --> val: jquery selections; for cross app quick access
		containerWidth : $(".container").width(),	// Containing div drawing area width, modified by window resize
		knownMothers: 0,							// # of chart mothers that have been divined/entered...
		quesitedHouse : 0,							// will hold the # of the House of Quesited
		audio : true,								// will be tied to UI checkbox, preset
		geolocation: true,							// will be tied to UI checkbox, preset
		now: undefined,								// time right now updated by the clock, moment object
		latitude: undefined,						// Result of geolocation
		longitude: undefined,						// Result of geolocation
		sunrisetoday: undefined,					// All 3 derived after geolocation, in ag_sunrisesunset.js
		sunsettoday: undefined,						//		used to divide day and night into 12 sections....
		sunrise2moro: undefined,					//		will be Date() objects
		snapshot: undefined,						// url pointing to google pic of geolocation define area
		sounds : {},								// will hold howler sounds loaded from file.
		chart: [],									// Will hold the built chart
		figs : []
	};

	//	log	: function(){}							// ag_view.js	- log messages and errors
	//	initBrowser : function()					// ag_browser_utils.js - get presets from locastorage, ...
	//	playAudio : function(whichSound, howLoud)	// ag_browser_utils.js - Play indicated sound if Audio is on
	//	label : function(label, txt)				// app.js - format the text nice with bootstrap sytle
	//	figSelected : function(){}					// app.js -  handle double click from geo figures panel		
	//	doGeolocationAndSuntimes: fx(btn$)			// ag_rulers.js - after btn click or presets confirm do geolocation
	//	prepareSunTimes : function()				// ag_sunrisesunset.js - After geolocation, find & store sunrise sunset times
	//	initView :  function() {}					// ag_view.js	- init the log, header, and load geo figs into panel
	//	generateChart : function(){}				// ag_chart.js	- derive rest of chart from four mothers



	// 
	// Wrap txt with a <span> for Bootstrap class that format the text nicely
	// see http://twitter.github.io/bootstrap/components.html#labels-badges
	// Assumes: logging system is up.
	my.label = function(label, txt) {
		var wrappedTxt = '<span class="label';

		switch(label) {
			case "default":
				wrappedTxt += '">';					break;
			case "success":
				wrappedTxt += ' label-success">';	break;
			case "warning":
				wrappedTxt += ' label-warning">';	break;
			case "important":
				wrappedTxt += ' label-important">';	break;
			case "info":
				wrappedTxt += ' label-info">';		break;
			case "inverse":
				wrappedTxt += ' label-inverse">';	break;

			default: my.log("err", "my.Label(" + label + ", ...) not valid. Text not wrapped");
				return txt;
		}

		wrappedTxt += txt;
		wrappedTxt += '</span>';

		return wrappedTxt;
	};



	// ------ Main Program Execution 

	// Some html elements will be accessed over and over again, and across the app, so get the
	// referece to them now and store it away so it can provide quick acess later.
	my.data.uiElt$['ChartTable'] = $('#ChartTable');
	my.data.uiElt$['shieldChart'] = $('#shieldChart');	
	my.data.uiElt$['geoloc_btn'] = $('#geoloc_btn');
	my.data.uiElt$['planetlist'] = $('.planetlist');
	my.data.uiElt$['audio_toggle'] = $("#audio_toggle");
	my.data.uiElt$['home'] = $('#home');				// Home tab	
	my.data.uiElt$['figtab'] = $('#figtab');			// About the Figures tab
	my.data.uiElt$['housetab'] = $('#housetab');		// About the Houses tab	
	my.data.uiElt$['time'] = $('#time');				// Time Transits & Rulers tab
	my.data.uiElt$['questions'] = $('#questions');		// Questions & Houses tab
	my.data.uiElt$['settings'] = $('#settings');		// Program Options tab


	if ( my.initView === undefined ){
		my.log("err", "Inside App.js, initView not yet defined!", true);
	} else {
		my.initView();
	}


	return my;
}(jQuery, autoGEO || {}));