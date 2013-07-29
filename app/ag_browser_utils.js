// ag_browser_utils.js

var autoGEO = (function ($, my) {

    // Return negative-number safe x modulus y math operation
    // Need this fx because modulus negative numbers is broken in JS
    my.mod = function(x, y) {
        return ( ( x % y ) + y ) % y;
    };


    // 
    // Wrap txt with a <span> for Bootstrap class that format the text nicely
    // see http://twitter.github.io/bootstrap/components.html#labels-badges
    // Assumes: logging system is up.
    my.label = function(label, txt) {
        var wrappedTxt = '<span class="label';

        switch(label) {
            case "default":
                wrappedTxt += '">';                 break;
            case "success":
                wrappedTxt += ' label-success">';   break;
            case "warning":
                wrappedTxt += ' label-warning">';   break;
            case "important":
                wrappedTxt += ' label-important">'; break;
            case "error":
                wrappedTxt += ' label-important">'; break;
            case "info":
                wrappedTxt += ' label-info">';      break;
            case "inverse":
                wrappedTxt += ' label-inverse">';   break;

            default: // error case - just gonna return the text without wrapping
                return txt;
        }

        wrappedTxt += txt;
        wrappedTxt += '</span>';

        return wrappedTxt;
    };




    // my.audio wraps all the AUDIO stuff including loading the files and playing individual sounds
    //      init()              - load all the sound files so they are ready to play  (uses HOWLER.js)
    //      play(which, volume) - play a given sound at given volume
    //
    my.audio = function() {
        var view = new my.ViewConstructor();
        var muted = true;
        var isLoaded = false;
        var prefix = 'snd/';        // path prefix
        var files = [               // all sounds below corresponds to filenames
                'drip1', 'arrival_horns', 'klik1', 'spring1', 'chime2', 'alert_23',
                'whoosh1', 'whoosh4', 'chime', 'tick6', 'bebeblip', 'notify2'
            ];
        var sounds = {};            // will hold loaded in files as Howler objects

        return {
            init:   function(mute) {
                        var element = "#audio_toggle";      // The HTML element, in this case Audio checkbox

                        muted = mute;
                        // assert ( isLoaded === false ) ; should only need to call this function once in the app, upon startup
                        for (var i = 0; i < files.length; i += 1 ) {
                            sounds[files[i]] = new Howl({               // TODO: error handler if snd doesnt load
                                urls: [prefix + files[i] + '.mp3', prefix + files[i] + '.ogg'],
                                autoplay: false
                            });
                        }
                        isLoaded = true;
                        my.log("l", "Loaded " + (i+1) + " sound files.");

                        // Currently I believe the best place to do actual selection of html element is here, not in the view
                        // Shortcut looking for it since we know its located in the header
                        view.init( my.data.uiElt$['header'].find(element), my.audioView );

                        return this;
                    },
            play:   function(whichSound, volume) { // Play whichSound at volume, if Audio is enabled
                        if ( muted === true ) { return this; } // Audio setting is off, do nothing.

                        if ( isLoaded === false ) {
                            my.log('l', 'Loading audio after app startup.');
                            init();
                        }

                        sounds[whichSound].volume(volume).play();
                        return this;
                    },
            isMuted: function() {
                        return (muted === true);
                    },
            mute: function() {
                        Howler.mute();        // mute all sounds, not sure if this actually stops them
                        muted = true;
                        return this;
            },
            unmute: function() {
                        Howler.unmute();            // unmute all sounds
                        muted = false;
                        return this;
                    }
        };
    }();



    //
    // timeWatcher - Track and put up the current time, 
    //               handle the 24 hourly rulers of the day when geolocation & suntimes are derived
    my.timeWatcher = function() {
        var clock$;
        var haveSuntimes = false;       // set to true when geolocation & sunset/rise are done
        var timeNow;                    // updated current time, moment object available as public property


        var updateTime = function() {
            timeNow = moment();             // Get & save current time

            var now = '<i class="icon-time"></i> ' + timeNow.format('dddd MMMM Do YYYY, h:mm a');   // bootstrap icons
            now = my.label("default", now);                         // bootstrap styling "labels"

            clock$.html(now);       // Put up the new time

            if ( haveSuntimes === true ) {
                // tell geomanticTime to check ranges...
            }
        };

        function init() {
            if (clock$ === undefined) {                 // the very first time
                clock$ = $("#currenttime");
                my.data.uiElt$['currenttime'] = clock$; // cache it as part of the 'global' my object.
                my.log('l', "Clock initialized");
            }

            updateTime();                           // Put up the current time
            setInterval(updateTime, 10000);         // Set up a timer to update the time every 10 seconds            
        }

        return {
            now     : function() { return timeNow; },                   // moment object
            geomanticTimeReady : function() { haveSuntimes = true; },   // Time divisions in 12 day & night hours are done
            init : init

        };
    }();




    //
    // 
    my.loadHTMLintoTab = function(filename, whereToInject$, whenDone) {
        // the code for thecall here and below is to abort incomplete AJAX requests
        var thecall = null;             // will not be null if there is a call for it in progress

        thecall = $.ajax(filename, {
            dataType: 'html',
            beforeSend: function() {
                whereToInject$.html('<h2>Loading file : ' + filename + '<h2>');
                my.log("log", 'Attempting to load :' + filename, true);
                if (thecall) {
                    thecall.abort();
                    my.log("log", 'Aborting first request for:' + filename, true);
                }
            },
            error : function(a,b) {
                if (b.statusText != 'abort'){           // TODO: result ????  should be a or b ??
                    whereToInject$.html('<h2>Had trouble loading : ' + filename + '<h2>');
                    my.log('err', 'Failed to load in & inject: '+ b, true);
                }

            },
            complete: function() {
                thecall = null;
            },
            success : function(result) {
                my.log("log", 'Successful file load:' + filename, true);

                var defaults = {                    // for slimscroller
                    height: '300px',
                    distance: '4px',
                    railVisible: true,
                    wheelStep: 10
                };

                whereToInject$.html( result );     // inject loaded html into the tab selector passed in

                // attach slimScroll to first div found after the container tab div
                whereToInject$.find('div').slimScroll( defaults );

                // if the 3rd parameter was passed in, execute it
                if (whenDone) { whenDone(); }
            }
        });
    };



    //
    // browserCheck() - Get the browser type and version, log it.
    // Doesn't serve much of a purpose at this point except to just log this info
    // Requires: logging system to be set up.
    //  TODO: add this information to a SESSION
    function browserCheck() {
        var b;
        var v = $.browser.version;

        if ( $.browser.msie ) {
            b = "Internet Explorer";
        } else if ( $.browser.webkit ) {
            b = "Webkit (Safari, Chrome, or Opera?)";
        } else if ( $.browser.mozilla ) {
            b = "Mozilla (Firefox)";
        } else if ($.browser.ipad ) {
            b = "iPad";
        } else if ($.browser.iphone) {
            b = "iPhone";
        } else if ($.browser.android) {
            b = "Android";
        } else {
            b = "Unknown";
        }

        my.log("log", "Browser check: " + b + " v" + v, true);
    }




    //
    // my.initBrowser() - 
    //      Get and log browser version,  get app presets from localstorage, initialize AUDIO
    //      if presets indicate it then load up all sounds and kick off Geolocation if need be.
    // 
    my.initBrowser = function() {
        var presetKeyVals;

        // assert ( my.log is up and running)

        browserCheck();                         // Just logs Browser make & version app is running on
            my.progressBar.increase();
        presetKeyVals = my.presets.init();      // Get app setting presets from localstorage,

        my.settings.init( presetKeyVals ) ;     // Initialize app settings (audio, geoloc) using presets
            my.progressBar.increase();
        //
        // Based on settings (which we got from presets) kick off audio and geolocation - or not.

        // The way this is right now, even if presets indicate no audio, sound files are still loaded
        if ( presetKeyVals.audio === true ) {
            my.log('l', 'APP PRESETS: for AUDIO is ON - kicking off initAudio()...');
            my.audio.init(false);                   // Load Audio files & get them ready for play
            my.audio.play('klik1', 0.2);       // cache
            my.audio.play('tick6', 0.2);       // cache the sound

        }
        else {
            my.log('l', 'APP PRESETS: for AUDIO is OFF - still loading sound files.');
            my.audio.init(true);                    // Init audio with mute on
        }

        my.progressBar.increase();

        if ( presetKeyVals.geolocation === true ) {
            my.log('l', 'APP PRESETS: for GEOLOCATION is ON - Going to wait for user to press button to kick it off.');
            // uncomment next line if you want the preset to auto kickoff geolocation
            // my.doGeolocationAndSuntimes(my.data.uiElt$['geoloc_btn']);
            //geolocChkbx$.attr('checked', true);
        } else {
            my.log('l', 'APP PRESETS: for GEOLOCATION is OFF - Can still use it by just clicking button!');
            // TODO: disable geolocation button
            //geolocChkbx$.attr('checked', false);
        }


    };


    return my;
}(jQuery, autoGEO || {}));