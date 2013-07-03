// 

var autoGEO = (function ($, my) {

	// vars for only this module
    var bAudioLoaded = false;


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
    // catchBrowserResize() - Deal with browser resize event(s)
    // Resizing the browser fires many sporadic resize events.  We want to only catch the last resize
    // event in the series and then deal with it.
    // Requires: logging system to be set up.
    function catchBrowserResize() {
        $(window).smartresize(function(){
            var w = $("body").width();
            my.data.containerWidth = w;
            // TODO: do whatever depends on browser resize...
            if (my.log === undefined) {
                console.log('(no log fx)smartresize called: '+ w);
            } else {
                my.log("log", "Browser Resize events caught; width:" + w);
            }
        });
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
    // check LocalStorage for presets, get the presents
    // if geolocation was set in the presets, do it!
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




    //
    // my.initBrowser() - Called by the view
    my.initBrowser = function() {
        browserCheck();         // Log what browser, version we're running on
        catchBrowserResize();   // Deal with browser resizes
        checkLocalStorage();    // Check for app presets in LocalStorage
    };


    return my;
}(jQuery, autoGEO || {}));