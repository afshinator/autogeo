// ag_Interpretations -  
//

var autoGEO = (function ($, my) {

	var interptForm$ = null;		// Will point to the radio button list of interpretations

	var lastShown = null;			// Will reflect last shown (but not necessarily run) interpretation

	// To help keep track of what interpretations have already been run (& have been implemented)
	var interptStatus = [
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt 0'},
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt 1'},
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt 2'},
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt3'},
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt4'},
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt5'},
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt6'},
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt7'},
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt8'},
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt9'},
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt10'},
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt11'}
	];


	// used locally to make code more readable!
	function chartIsDerived() {
		return ( ( my.data.knownMothers > 3 ) ? true : false );
	}


	//
	// checkAndRunInterpt(which) - 
	// Checks to see if interpts is implemented, if not then error out
	// Then run interpretation with flag to indicate whether to actually process chart info and return
	// html to inject, or just return html to show without any processing (in case it was already run.)
	function checkAndRunInterpt(which) {
		// First do sanity check - is interpt implemented?
		var status = interptStatus[which].done;

		my.log('i', 'in runInterpt ' + which + ', which has already run? ' + status );

		if ( status === null ) {
			my.log('e', 'interpt "' + which + '" not yet implemented!');
			return null;
		}
		else {		// ok, interpt is implemented,
			// if this interpts has already run, or the chart hasn't been derived then just get the description
			if ( status === true || !chartIsDerived() ) {
				return runInterpt(which, true);	// run Interpt with flag for no processing, just get html to show
			}
			else {	// no hasn't run yet, and chart has been derived
				return runInterpt(which, false);// run Interpt with processing of chart, return html to inject
			}

		}
	}


	//	Returns html related to the interpt to inject
	//	which				- which interpts to run
	//	bJustDescription	- true if we dont want to actually process the chart, just return description of interpt
	//						(for when interpts has already run)
	function runInterpt(which, bJustDescription) {
		var html;		// for stuff to return

		// Check to see if this interpt is the same as the last one run
		if ( which === lastShown ) {
			// description is already showing, and therefore already run, so do nothing, show nothing new
			my.log('i', '!click on same interpt already showing ' + which);
			return null;
		}
		else {
			my.log('i', 'processing interpt ' + which);
			html = interptStatus[which].desc;

			if ( bJustDescription === false ) {
				my.log('i', 'Now actually running interpt ' + which);
				// Do the interpretation, and add stuff to html variable

				// if what is returned !== null
				interptStatus[which].done = true;
			}

			return html;
		}
	}




	my.initInterpretations = function() {
		interptForm$ = my.data.uiElt$['interpts'].find('#interptForm input:radio');
		interptText$ = my.data.uiElt$['interpts'].find('#interptText');

		//
		// handle click on Interpretation vertical radio button list
		interptForm$.click(function() {
			var whichInterpt = $(this).val();
			var interptResults = null;

			my.playAudio('klik1', 0.2);
			my.log('l', 'Interpretation ' + whichInterpt + ' clicked.');

			interptResults = checkAndRunInterpt(whichInterpt);	// will return null if there is nothing to show

			if (  interptResults !== null ) {
				interptText$.html(interptResults);
				lastShown = whichInterpt;
			}
		});
	};


    return my;

}(jQuery, autoGEO || {}));