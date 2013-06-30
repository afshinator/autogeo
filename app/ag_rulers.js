// 

var autoGEO = (function ($, my) {
	var lengthOfAnHour = 0;
	var dayHours = [];
	var nightHours = [];

	var currentTimeSlot$ = null;		// Will be set in initGeoTimeDivisions() to indicate the 'hour' we are in now


	//
	// initGeoTimeDivisions() - Calculate the 12 Day & 12 Night Time intervals and display them.
	// Also sets currentTimeSlot$ so that we can get current ruler information later.
	// Called after geolocation finishes successfully, relies on sunup/down times
	function initGeoTimeDivisions() {
		var a = moment(my.data.sunrisetoday);
		var b = moment(my.data.sunsettoday);
		var c = moment(my.data.sunrise2moro);

		var secsInOneDayHour = ( b.diff(a, 'seconds') ) / 12;
		var secsInOneNightHour = ( c.diff(b, 'seconds') ) / 12;

		var timeholder$;							// selector for html elt
		var tempMoment = moment(a);					// will be manipulated to find range
		var rangeEnd = moment();
		var now = moment();

		// 'day' hours - from sunrise to sunset
		for ( i = 0 ; i < 12 ; i +=1 ) {
			timeholder$ = my.data.uiElt$['time'].find('#geoTime_timeHolder' + (i+1));
			tempMoment.add( 'seconds', ( i * secsInOneDayHour ) );
			rangeEnd = tempMoment.clone();
			rangeEnd.add( 'seconds', secsInOneDayHour - 60);
			timeholder$.html( tempMoment.format("h:mm a") + ' - ' + rangeEnd.format("h:mm a") ) ;

			if ( now.isBefore(rangeEnd) && now.isAfter(tempMoment) ) {
				currentTimeSlot$ = timeholder$.closest('tr');
				currentTimeSlot$.addClass('gradient3');
			}

			tempMoment.subtract( 'seconds', ( i * secsInOneDayHour ) ); // reset
		}

		// 'night' hours - from sunset today until sunrise the next day
		tempMoment = moment(b);
		for ( i = 0 ; i < 12 ; i +=1 ) {
			timeholder$ = my.data.uiElt$['time'].find('#geoTime_timeHolder' + (i+13));
			tempMoment.add( 'seconds', ( i * secsInOneNightHour ) );
			rangeEnd = tempMoment.clone();
			rangeEnd.add( 'seconds', secsInOneNightHour - 60);
			timeholder$.html( tempMoment.format("h:mm a") + ' - ' + rangeEnd.format("h:mm a") ) ;

			if ( now.isBefore(rangeEnd) && now.isAfter(tempMoment) ) {
				currentTimeSlot$ = timeholder$.closest('tr');
				currentTimeSlot$.addClass('gradient3');
			}

			tempMoment.subtract( 'seconds', ( i * secsInOneNightHour ) ); // reset
		}

		// highlight the day of week column in time transits table;  This should be the planetary ruler of geotoday
		// The planetary ruler of the hour is set in getAndDisplayRulers()
		(my.data.uiElt$['time']).find( '.geoTime_Col' + (a.day()+1)  ).addClass("gradient3");
	}



	//
	// getAndDisplayRulers() - Check if time right now is within real-today or geo-today,
	// SET RULER OF DAY in header, get ruler of the hour info embedded in html, mark planetary RULER OF HOUR 
	// Assumes currentTimeSlot$ has been set
	function getAndDisplayRulers() {
		var geoToday = moment().day();
		var rulerStr;
		var planetaryRulerForHour;
		var geofigureRulerForHour;

		if ( my.isNowWithinRealToday() === false ) {
			geoToday = my.mod( ( geoToday - 1 ), 7 );		// my.mod deals with modulus negative numbers well
			my.log('l', 'Right now we are in geo-today, not real-today! (0 is sunday) Day #' + geoToday);
		} else {
			my.log('l', 'Right now we are in real-today, not geo-today. (0 is sunday) Day #' + geoToday);
		}

		// Mark the planetary ruler of the day in planetlist in header, based on todays date,
		// and whether we're in geo-today or real-today
		my.data.uiElt$['planetlist'].find('li:eq(' + geoToday + ')').addClass('transform1').addClass('gradient4');

		// Now get data embedded in HTML for each time interval indicating the rulers
		if (currentTimeSlot$ === null ) {				// assert
			my.log('error', 'getAndDisplayRulers() - currentTimeSlot$ should not be null! Cant get hourly ruler.' );
		} else {
			// the first td found after the tr referred to by currentTimeSlot$ holds the time range info instead of
			// the rulers, so at this point we have to add 1 to geoToday to get the right index.
			geoToday = ( geoToday + 1 );
			rulerStr = ( currentTimeSlot$.find('td:eq(' + geoToday + ')').data('ruler') ) + "";  // convert to string

			planetaryRulerForHour = (rulerStr.charAt(0));
			geofigureRulerForHour = (rulerStr.slice(1)) * 1;

			my.log('l', 'planetaryRulerForHour : ' +  planetaryRulerForHour + ' -- geofigureRulerForHour : ' +  my.data.figs[geofigureRulerForHour].name);

			my.data.uiElt$['planetlist'].find('li:eq(' + planetaryRulerForHour + ')').addClass('gradient5');

			// Highlight geomantic figure that rules this hour by adding same class we used for planetary ruler of the hour
			my.data.figs[geofigureRulerForHour].selector$.addClass('gradient5');

			// TODO: save the hourly rulers info
		}
	}



	//
	// Load the html for Time transits and Rulers info
	my.loadRulerTimesTable = function(filename) {
		my.loadHTMLintoTab(filename, my.data.uiElt$['time']);

		// Nothing else left to do until wait for geolocation to get kicked off
	};



	//
	// called after checklocalStorage() loads presets and sees that geolocation is on, or
	// called after user clicks the geolocation button.
	//    btn$ = jquery selector for the geolocation button
	my.doGeolocationAndSuntimes = function(btn$) {
		function geosuccess(position) {
			var location;

			my.data.latitude = position.coords.latitude;			// set app variables
			my.data.longitude = position.coords.longitude;

			// btn$.prop("disabled", true);							// disable geolocation button
			// btn$.addClass('hideIt');
			btn$.remove();	// remove it to free up space, also unbinds the click hnadler for it

			location = 'Long:'+ my.data.longitude + ' Lat:' + my.data.latitude;
			my.log("log", location);

			location = '<i class="icon-globe"></i> ' + location;	// bootstrap icons
			location = my.label("default", location);				// bootstrap styling "labels"

			$("#currentlocation").html(location);
			my.playAudio('icedispense', 0.1);


			// google map based on geolocation data
			my.data.snapshot = "http://maps.googleapis.com/maps/api/staticmap?center=" + my.data.latitude + "," + my.data.longitude + "&zoom=12&size=200x200&sensor=false";
			// TODO: put this somewhere else?
			var img = new Image();
			img.src = my.data.snapshot;
			$("#testpic").append(img);

			// Get sunrise and sundown times for today...
			$("#suntimes").html(my.prepareSunTimes());

			initGeoTimeDivisions();
			getAndDisplayRulers();
		}

		function geoerror(error) {
			switch(error.code) {
				case error.PERMISSION_DENIED:
					my.log("err", "Geolocation failed - User didnt share location!");
					my.log("info", "Geolocation failed - Make sure to confirm that you want to allow it when your browser pops up a dialog to ask.");
					break;
				case error.POSITION_UNAVAILABLE:
					my.log("err", "Geolocation failed - Couldn't detect position!");
					break;
				case error.TIMEOUT:
					my.log("err", "Geolocation failed - Getting location timed out!");
					break;
				default: my.log("err", "Geolocation failed - Unknown error!");
					break;
			}
		}


		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(geosuccess, geoerror);
		} else {
			my.log("err", "Geolocation not enabled on this browser!");
		}
	};




	return my;

}(jQuery, autoGEO || {}));