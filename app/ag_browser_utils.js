// 

var autoGEO = (function ($, my) {

	// vars for only this module
    var bAudioLoaded = false;


    // my.settings wraps the app settings and presets data
    //      init()          -  get all settings from LocalStorage, return them as key vals
    //                          specifically for now: AUDIO, GEOLOCATION
    //      get()           - return all settings as key-vals
    //      set(key, val)   - set a particular key to a value
    //      save()          - save all settings out to locastorage.
    my.settings = function() {
        var audio = true;                       // default values that will be over-written by what presets are in localstorage
        var geolocation = true;

        return {
            init:   function() {                // get all setting from LocalStorage, return them as key vals
                        if ( !store.enabled ) { // store comes from store.js
                            log("err", "No local storage available (for presets)");
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
            get:    function() {                // return all settings as key-vals
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




    // my.audio wraps all the AUDIO stuff including loading the files and playing individual sounds
    //      init()              - load all the sound files so they are ready to play  (uses HOWLER.js)
    //      play(which, volume) - play a given sound at given volume
    //
    my.audio = function() {
        var View = new my.viewConstructor($("#audio_toggle"));
        var isLoaded = false;
        var prefix = 'snd/';        // path prefix
        var files = [               // all sounds below corresponds to filenames
                'drip1', 'icedispense', 'klik1', 'spring1', 'startup_11',
                'whoosh1', 'whoosh4', 'plink_06', 'chime'
            ];
        var sounds = {};            // will hold loaded in files as Howler objects

        return {
            init:   function() {
                        // assert ( isLoaded === false )
                        for (var i = 0; i < files.length; i += 1 ) {
                            sounds[files[i]] = new Howl({               // TODO: error handler if snd doesnt load
                                urls: [prefix + files[i] + '.mp3', prefix + files[i] + '.ogg'],
                                autoplay: false
                            });
                            my.log("l", "-- loaded sound file: " + files[i]);
                        }
                        isLoaded = true;
                        return this;
            },
            play:   function(whichSound, volume) { // Play whichSound at volume, if Audio is enabled
                        if ( my.settings.get()['audio'] === false ) { return; } // Audio setting is off, do nothing.

                        if ( isLoaded === false ) {
                            my.log('l', 'Loading audio after app startup.');
                            init();
                        }

                        sounds[whichSound].volume(volume).play();
                        return this;
            },
            mute: function() {
                        Howler.mute();        // mute all sounds, not sure if this actually stops them
                        return this;
            },
            unmute: function() {
                        Howler.unmute();            // unmute all sounds
                        return this;
            }
        };
    }();




    // Return negative-number safe x modulus y math operation
    // Need this fx because modulus negative numbers is broken in JS
    my.mod = function(x, y) {
        return ( ( x % y ) + y ) % y;
    };




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
    //      if presets indicate it then load up all sounds and kick of Geolocation.
    // 
    my.initBrowser = function() {
        browserCheck();                         // Log browser, version we're running on

        var settings = my.settings.init();     // Get app setting presets from localstorage

        if ( settings.audio === true ) {
            // Audio is on either through default or app settings previously stored in localstorage
            my.log('l', 'Setting for AUDIO is on - kicking off initAudio()...');
            my.data.uiElt$['audio_toggle'].attr('checked', true);   // Set the audio checkbox
            my.audio.init();                                        // Load Audio & get them ready for play    
            my.audio.play('startup_11', 0.2);                       // Play startup sound
        }
        else {
            my.data.uiElt$['audio_toggle'].attr('checked', false);
        }

        if ( settings.geolocation === true ) {
            // my.log('l', 'Setting for geolocation is on - kicking it off...');            
            // uncomment next line if you want the preset to auto kickoff geolocation
            // my.doGeolocationAndSuntimes(my.data.uiElt$['geoloc_btn']);
            //geolocChkbx$.attr('checked', true);
        } else {
            // TODO: disable geolocation button
            //geolocChkbx$.attr('checked', false);
        }

        // checkLocalStorage();    // Check for app presets in LocalStorage
    };


    return my;
}(jQuery, autoGEO || {}));