//   SunriseSunset Class (2013-04-21)  from http://pastebin.com/f6Ut6rXx
//
// OVERVIEW
//
//   Implementation of http://williams.best.vwh.net/sunrise_sunset_algorithm.htm, and then some
//
//
// DESCRIPTION
//
//   Provides sunrise and sunset times for specified date and position.
//   All dates are UTC.  Year is 4-digit.  Month is 1-12.  Day is 1-31.
//   Longitude is positive for east, negative for west. Latitude is
//   positive for north, negative for south.


var autoGEO = (function ($, my) {

    // findAndSetSuntime()
    // Given what day, and whether Sunrise or Sunset, set the date objects time to sunrise or sunset on that day.
    // Requries d to already be instantiated Date() , and geolocation has run successfully
    function findAndSetSuntimeOnDate(whatDay, bSunRise, d) {
        var thatDaysSunInfo = new SunriseSunset( whatDay.getFullYear(), whatDay.getMonth()+1, whatDay.getDate(), my.data.latitude, my.data.longitude );

        var rawTime;

        if ( bSunRise ) {
            rawTime = thatDaysSunInfo.sunriseLocalHours( -( whatDay.getTimezoneOffset() ) / 60 );
        } else {
            rawTime = thatDaysSunInfo.sunsetLocalHours( -( whatDay.getTimezoneOffset() ) / 60 );
        }

        d.setHours(Math.abs(rawTime));
        d.setMinutes(Math.abs((rawTime % 1)* 60));     // mod 1 gives just decimal part of number
    }


    // Get the sunrise and sunset times of the day passed in, and sunrise of day after that,
    // then set the global variables
    function setSunTimes(whatDay) {               // sets global sunrise/set times, returns html with same
        my.data.sunrisetoday = new Date(whatDay);
        my.data.sunsettoday = new Date(whatDay);

        var tomoro = new Date(whatDay);
        tomoro.setDate(tomoro.getDate() + 1);       // add a day

        my.data.sunrise2moro = new Date(tomoro);

        findAndSetSuntimeOnDate(whatDay, true, my.data.sunrisetoday);
        findAndSetSuntimeOnDate(whatDay, false, my.data.sunsettoday);
        findAndSetSuntimeOnDate(tomoro, true, my.data.sunrise2moro);

        var mTodaySunrise = moment(my.data.sunrisetoday).format('dddd MMMM Do YYYY, h:mm a');
        var mTodaySunset = moment(my.data.sunsettoday).format('dddd MMMM Do YYYY, h:mm a');
        var mTomoroSunrise = moment(my.data.sunrise2moro).format('dddd MMMM Do YYYY, h:mm a');

        my.log("l", 'SUNRISE:' + mTodaySunrise + ', SUNSET: ' + mTodaySunset + ', 2MORO:' + mTomoroSunrise);

        var output = 'sunrise:' + moment(my.data.sunrisetoday).format('h:mm a')+ ', sunset:' + moment(my.data.sunsettoday).format('h:mm a');
        output = '<i class="icon-certificate"></i> ' + output;
        output = my.label("default", output);

        return output;
    }



    // Return true if the time right now is within 'real Today' instead of 'geo Today' ?
    // Geo today is defined from sunrise on one day until sunrise the next day, so it crosses 'real day' boundaries
    // Assumes my.timeWatcher has been initialized, and Geolocation has run.
    my.isNowWithinRealToday = function() {
        var sunrise = new Date();                       // set to now, real-today
        var now = my.timeWatcher.now();

        findAndSetSuntimeOnDate(sunrise, true, sunrise);      // Set to sunrise time for real-today      

        if ( now.isBefore(sunrise) ) {
            // we're still in yesterday, date-wise, with respect to geomantic definition of a day
            my.log('l', 'Time is after midnight and before sunrise today.');
            return false;
        } else {
            return true;
        }
    };




    // 
    // Compensates for difference between today, and 'today' in geomantic definiton,
    // (geo-today includes the times from midnight till sunrise next real day.)
    // then call getSunTimes() to determines the sunrise and sunset times and set the global variables to geo-today
    my.prepareSunTimes = function() {
        // Is current time today before sunrise in the morning today?
        var a = new Date();                             // Set to now

        if ( my.isNowWithinRealToday() === false ) {
            // Set it to yesterday to get correct info for 'today' from getSunTimes()
            a.setDate(a.getDate() - 1);
        }

        // Now call setSunTimes to get sunrise/set times with correct version of 'today' in variable, and return it.
        return setSunTimes(a);
    };




// original code below
	var SunriseSunset = function( utcFullYear, utcMonth, utcDay, latitude, longitude ) {
		this.zenith = 90 + 50/60;	//   offical      = 90 degrees 50'
									//   civil        = 96 degrees
									//   nautical     = 102 degrees
									//   astronomical = 108 degrees

		this.utcFullYear = utcFullYear;
		this.utcMonth = utcMonth;
		this.utcDay = utcDay;
		this.latitude = latitude;
		this.longitude = longitude;

		this.rising = true; // set to true for sunrise, false for sunset
		this.lngHour = this.longitude / 15;
	};

SunriseSunset.prototype = {
    sin: function( deg ) { return Math.sin( deg * Math.PI / 180 ); },
    cos: function( deg ) { return Math.cos( deg * Math.PI / 180 ); },
    tan: function( deg ) { return Math.tan( deg * Math.PI / 180 ); },
    asin: function( x ) { return (180/Math.PI) * Math.asin(x); },
    acos: function( x ) { return (180/Math.PI) * Math.acos(x); },
    atan: function( x ) { return (180/Math.PI) * Math.atan(x); },

    getDOY: function() {
        var month = this.utcMonth,
            year = this.utcFullYear,
            day = this.utcDay;

        var N1 = Math.floor( 275 * month / 9 );
        var N2 = Math.floor( (month + 9) / 12 );
        var N3 = (1 + Math.floor((year - 4 * Math.floor(year / 4 ) + 2) / 3));
        var N = N1 - (N2 * N3) + day - 30;
        return N;
    },

    approximateTime: function() {
        var doy = this.getDOY();
        if ( this.rising ) {
            return doy + ((6 - this.lngHour) / 24);
        } else {
            return doy + ((18 - this.lngHour) / 24);
        }
    },

    meanAnomaly: function() {
        var t = this.approximateTime();
        return (0.9856 * t) - 3.289;
    },

    trueLongitude: function() {
        var M = this.meanAnomaly();
        var L = M + (1.916 * this.sin(M)) + (0.020 * this.sin(2 * M)) + 282.634;
        return L % 360;
    },

    rightAscension: function() {
        var L = this.trueLongitude();
        var RA = this.atan(0.91764 * this.tan(L));
        RA %= 360;

        var Lquadrant  = (Math.floor( L/90)) * 90;
        var RAquadrant = (Math.floor(RA/90)) * 90;
        RA = RA + (Lquadrant - RAquadrant);
        RA /= 15;

        return RA;
    },

    sinDec: function() {
        var L = this.trueLongitude(),
            sinDec = 0.39782 * this.sin(L);

        return sinDec;
    },

    cosDec: function() {
        return this.cos(this.asin(this.sinDec()));
    },

    localMeanTime: function() {
        var cosH = (this.cos(this.zenith) - (this.sinDec() * this.sin(this.latitude))) / (this.cosDec() * this.cos(this.latitude));

        if (cosH >  1) {
            return "the sun never rises on this location (on the specified date)";
        } else if (cosH < -1) {
            return "the sun never sets on this location (on the specified date)";
        } else {
            var H = this.rising ? 360 - this.acos(cosH) : this.acos(cosH);
            H /= 15;
            var RA = this.rightAscension();
            var t = this.approximateTime();
            var T = H + RA - (0.06571 * t) - 6.622;
            return T;
        }
    },

    hoursRange: function( h ) {
        return (h+24) % 24;
    },

    UTCTime: function() {
        var T = this.localMeanTime();
        var UT = T - this.lngHour;
        return this.hoursRange( UT );
        //if ( UT < 0 ) UT += 24;
        //return UT % 24;
    },

    sunriseUtcHours: function() {
        this.rising = true;
        return this.UTCTime();
    },

    sunsetUtcHours: function() {
        this.rising = false;
        return this.UTCTime();
    },

    sunriseLocalHours: function(gmt) {
        return this.hoursRange( gmt + this.sunriseUtcHours() );
    },

    sunsetLocalHours: function(gmt) {
        return this.hoursRange( gmt + this.sunsetUtcHours() );
    },

    // utcCurrentHours is the time that you would like to test for daylight, in hours, at UTC
    // For example, to test if it's daylight in Tokyo (GMT+9) at 10:30am, pass in
    // utcCurrentHours=1.5, which corresponds to 1:30am UTC.
    isDaylight: function( utcCurrentHours ) {
        var sunriseHours = this.sunriseUtcHours(),
            sunsetHours = this.sunsetUtcHours();

        if ( sunsetHours < sunriseHours ) {
            // Either the sunrise or sunset time is for tomorrow
            if ( utcCurrentHours > sunriseHours ) {
                return true;
            } else if ( utcCurrentHours < sunsetHours ) {
                return true;
            } else {
                return false;
            }
        }

        if ( utcCurrentHours >= sunriseHours ) {
            return utcCurrentHours < sunsetHours;
        }

        return false;
    }
};


	return my;
}(jQuery, autoGEO || {}));