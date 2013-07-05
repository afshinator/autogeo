// 

var autoGEO = (function ($, my) {

	// vars for only this module
    var bAudioLoaded = false;






    // my.settings wraps the app settings and presets data
    //      init() -    get all settings from LocalStorage, return them as key vals
    //          specifically for now: AUDIO, GEOLOCATION
    //      get()   - return all settings as key-vals
    //      set(key, val)   - set a particular key to a value
    //      save()  - save all settings out to locastorage.
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



    //
    // check LocalStorage for presets, get the presets
    // if geolocation was set in the presets, do it immediately,
    function checkLocalStorage() {
        var presets;

        if ( !store.enabled ) {
            log("err", "No local storage available (for presets)");
        } else {
            // Get saved settings/presets
            presets = store.get('autoGEO');

            if ( presets ) {        // Presets/settings found

                // --- AUDIO
                my.data.audio = presets.audio;

                // --- GEOLOCATION
                my.data.geolocation = presets.geolocation;

                if (my.data.geolocation) {
                    // uncomment next line if you want the preset to auto kickoff geolocation
                    // my.doGeolocationAndSuntimes(my.data.uiElt$['geoloc_btn']);
                    //geolocChkbx$.attr('checked', true);
                } else {
                    // TODO: disable geolocation button
                    //geolocChkbx$.attr('checked', false);
                }

            } else {            // No presets were there
                my.log("log", "No AutoGEO app PRESET settings saved in this browsers localstorage.");
            }
        }

        if (my.data.audio) {
            // Audio is on either through app default or presets   
            my.data.uiElt$['audio_toggle'].attr('checked', true);   // Set the audio checkbox
            initAudio();                                            // Load Audio & get them ready for play
            my.data.sounds['startup_11'].volume(0.2).play();        // Play startup sound
        } else {
            my.data.uiElt$['audio_toggle'].attr('checked', false);
        }

    }





    // Return negative-number safe x modulus y math operation
    // Need this fx because modulus negative numbers is broken in JS
    my.mod = function(x, y) {
        return ( ( x % y ) + y ) % y;
    };



    //
    // playAudio() - Play whichSound at howLoud volume if Audio checkbox is clicked on
    //  Will also load the sounds if they haven't been loaded at startup.
    my.playAudio = function(whichSound, howLoud) {
        if ( my.data.audio === false) { return; } // Audio checkbox indicates no sound so do nothing.
        // else audio is enabled...
        // Upon app startup, if presets indicated no audio, then sounds were not loaded,
        // Since audio checkbox on now, see if we need to load sounds before playing indicated sound
        if ( bAudioLoaded === false ) {
            initAudio();
        }

        // Now we're ready to play whatever sound
        my.data.sounds[whichSound].volume(howLoud).play();        // Play startup sound
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
        } else if ($.browser.ipad || $.browser.iphone || $.browser.android ) {
            b = "Mobile";
        } else {
            b = "Unknown";
        }

        my.log("log", "Browser check: " + b + " v" + v, true);
    }





    //
    // initAudio() - Load in the audio files, save them for later quick access
    //   called by checkLocalStorage() after checking presets
    function initAudio() {
        var prefix = 'snd/';
        var files = [               // all sounds below corresponds to filenames
                'drip1', 'icedispense', 'klik1', 'spring1', 'startup_11',
                'whoosh1', 'whoosh4', 'plink_06', 'chime'
            ];

        for (i = 0; i < files.length; i += 1 ) {
            my.log("l", "--loaded sound: " + files[i]);
            my.data.sounds[files[i]] = new Howl({               // TODO: error handler if snd doesnt load
                urls: [prefix + files[i] + '.mp3', prefix + files[i] + '.ogg'],
                autoplay: false
            });
        }

        bAudioLoaded = true;
    }




    //
    // my.initBrowser() - Called by the view
    my.initBrowser = function() {
        browserCheck();         // Log what browser, version we're running on

        var settings = my.settings.init();     // Get app setting presets from localstorage

        if ( settings.audio === true ) {
            // Audio is on either through default or app settings previously stored in localstorage
            my.log('l', 'Setting for AUDIO is on - kicking off initAudio()...');
            my.data.uiElt$['audio_toggle'].attr('checked', true);   // Set the audio checkbox
            initAudio();                                            // Load Audio & get them ready for play
            my.data.sounds['startup_11'].volume(0.2).play();        // Play startup sound
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