// ag_Interpretations -  
//

var autoGEO = (function ($, my) {

	var interptForm$ = null;		// Will point to the radio button list of interpretations

	var lastShown = null;			// Will reflect last shown (but not necessarily run) interpretation

	// To help keep track of what interpretations have already been run (& have been implemented)
	// TODO: hold more info???
	var interptStatus = {
		'a' : false,
		'b' : false,
		'c' : false,
		'd' : false,
		'e' : false,
		'f' : false,				
	}

/*
	var interptStatus = [
		{ 'status' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt'},
	];
*/



	// used locally to make code more readable!
	function chartIsDerived() {
		return ( ( my.data.knownMothers > 3 ) ? true : false );
	}


	// checkAndRunInterpt(which)
	// Checks to see if interpts is implemented, if not then error out
	// Then run interpretation with flag to indicate whether to actually process chart info and return
	// html to inject, or just return html to show without any processing (in case it was already run.)
	function checkAndRunInterpt(which) {
		// First do sanity check - is interpt implemented?
		var status = interptStatus[which];

		my.log('i', 'in runInterpt ' + which + ', which has already run? ' + status );

		if ( status == null ) {
			my.log('e', 'interpt "' + which + '" not yet implemented!');
			return null;
		} 
		else { 		// ok, interpt is implemented, 
			// now has it already run?
			if ( status === true ) {
				return runInterpt(which, true);	// run Interpt with flag for no processing, just get html to show
			} 
			else {	// no hasn't run yet
				return runInterpt(which, false); 	// run Interpt with processing of chart, return html to inject
			} 

		}
	}


	//	Returns html related to the interpt to inject
	//	which 				- which interpts to run
	// 	bJustDescription	- true if we dont want to actually process the chart, just return description of interpt
	//						(for when interpts has already run)
	function runInterpt(which, bJustDescription) {
		// Check to see if this interpt is the same as the last one run
		if ( which === lastShown ) {
			// description is already showing, and therefore already run, so do nothing, show nothing new
			return null;
			my.log('i', '!already at this interpt ' + which);			
		} else {
			my.log('i', 'processing interpt ' + which);
		}
	}



	my.initInterpretations = function() {
		interptForm$ = my.data.uiElt$['interpts'].find('#interptForm input:radio');
		interptText$ = my.data.uiElt$['interpts'].find('#interptText');

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