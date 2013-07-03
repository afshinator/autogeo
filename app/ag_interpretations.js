// ag_Interpretations -  
//

var autoGEO = (function ($, my) {

	var interptForm$ = null;		// Will point to the radio button list of interpretations

	var lastShown = null;			// Will reflect last shown (but not necessarily run) interpretation

	// To help keep track of what interpretations have already been run (& have been implemented)
	var interptStatus = [
		{ 'done' : false, 'desc' : '<h4>Correct Placement</h4><p>In some traditions, there is a pattern of certain figures in the houses that verify the reliability of a reading.  If a figure appears in that house, it swears the event will come to pass.  This is often the first check that is made in interpretation.</p><p>Although it doesn\'t necessary mean the reading is invalid if it does not happen, it\'s good to get at least one figure to be in \'correct placement\'.</p><p>This small table below shows which houses \'should\' contain which figures.</p><div align="center"><table id="littleFigs" width="200px" border="0" cellspacing="0" cellpadding="0"><tr align="center"><th scope="col"><img src="img/fig8.gif" alt="Tristicia" width="12" /></th><th scope="col"><img src="img/fig2.gif" alt="Rubeus" width="12" /></th><th scope="col"><img src="img/fig5.gif" alt="Amissio" width="12" /></th><th scope="col"><img src="img/fig15.gif" alt="Via" width="12" /></th><th scope="col"><img src="img/fig4.gif" alt="Albus" width="12" /></th><th scope="col"><img src="img/fig14.gif" alt="Caput Draconis" width="12" /></th><th scope="col"><img src="img/fig1.gif" alt="Latecia" width="12" /></th><th scope="col"><img src="img/fig11.gif" alt="puer" width="12" /></th></tr><tr><td><img src="img/fig12.gif" alt="Fortuna Major" width="12" align="right" /></td><td> </td><td><img src="img/fig6.gif" alt="Conjunctio" width="12" align="right" /></td><td> </td><td> </td><td><img src="img/fig9.gif" alt="Carcer" width="12" align="left" /></td><td> </td><td><img src="img/fig3.gif" alt="Fortuna Minor" width="12" align="left" /></td></tr><tr><td> </td><td><img src="img/fig13.gif" alt="Puella" width="12" align="right" /></td><td> </td><td> </td><td> </td><td> </td><td><img src="img/fig7.gif" alt="Cauda Draconis" width="12" /></td><td> </td></tr><tr><td> </td><td> </td><td> </td><td><img src="img/fig10.gif" alt="Acquisitio" width="12" align="right" /></td><td> </td><td> </td><td> </td><td> </td></tr></table></div>'}, // 0
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt 1'},// 1
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt 2'},// 2
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt3'},// 3
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt4'},// 4
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt5'},// 5
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt6'},
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt7'},
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt8'},
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt9'},
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt10'},
		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt11'}
	];



	// Correct Placement - 
	// Pattern starting from house 1 is:
	// puer, laeticia, cap draco, albus, via, amissio, reub, 
	// trist, f minor, carcer, conjunct, fmajor, caud d, puella, acquisitio
	interptStatus[0].interpret = function() {
		var chart = my.data.chart;		// vars are cheap!  Using this for shorthand
		var html = "";					// what is going to be returned as results/html to inject
		var i;							// iteration

		// figures in the houses they 'should' be
		var stdByWhichToMeasure = [ 11, 1, 14, 4, 15, 5, 2, 8, 3, 9, 6, 12, 7, 13, 10];
		// assert(stdByWhichToMeasure.length === 15)

		for ( i=0; i < 15; i += 1 ) {
			if ( chart[i] === stdByWhichToMeasure[i] ) {
				html += ( '<p>' + my.data.figs[chart[i]].name + ' correctly placed in House ' + (i+1) + '</p>' );
			}
		}

		my.log('l', 'interpt result --->' + html);
		return ( (html.length === 0) ? 'None of the houses have figures that are \"correctly placed\"' : html );
	};



	//
	// Set up handling click on interpt radio buttons.  called by initTabs()
	// Click on interpt radio btn should show description, but not do the interpt if house isnt derived
	my.initInterpretations = function() {
		interptForm$ = my.data.uiElt$['interpts'].find('#interptForm input:radio');
		interptText$ = my.data.uiElt$['interpts'].find('#interptText');

		//
		// handle click on Interpretation vertical radio button list; 
		interptForm$.click(function() {
			var whichInterpt = $(this).val();
			var interptResults = null;

			my.playAudio('klik1', 0.6);
// my.log('l', 'Interpretation ' + whichInterpt + ' clicked.');

			// delegate checking for if interpts has already run, whether chart is derived yet, etc... to ...
			interptResults = checkAndRunInterpt(whichInterpt);	// will return null if there is nothing to show

			if (  interptResults !== null ) {
				interptText$.html(interptResults);
				lastShown = whichInterpt;
			} else {
				my.log('e', 'checkAndRunInterpt() returned null!! Should only happen when an interpt is not implemented ');
			}
		});
	};


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
		var done = interptStatus[which].done;

		if ( done === null ) {
			my.log('e', 'Interpt "' + which + '" clicked on, but not yet implemented!');
			return null;
		}
		else {		// ok, interpt is implemented,
			// if this interpts has already run, or the chart hasn't been derived then just get the description
			if (  !chartIsDerived() || done === true ) {
				return runInterpt(which, true);	// run Interpt with flag for no processing, just get html to show
			}
			else {	// no hasn't run yet, and chart has been derived				
				return runInterpt(which, false);// run Interpt with processing of chart, return html to inject
			}

		}
	}


	//	
	//	runInterpt(which, bJustDescription) - Returns html related to the interpt to inject, makes sure to not run already ran interpt
	//	which				- which interpts to run
	//	bJustDescription	- true if we dont want to actually process the chart, just return description of interpt
	//						(for when interpts has already run)
	function runInterpt(which, bJustDescription) {
		var desc;			// Description of interprt
		var iResult = '';	// The output of the interpretation run on a completed chart

		// Check to see if this interpt is the same as the last one run
		if ( which === lastShown ) {
			// description is already showing, and therefore already run, so do nothing, show nothing new
			my.log('l', '!click on same interpt already showing ' + which);
			return null;
		}
		else {
			// my.log('l', 'processing interpt ' + which);
			desc = interptStatus[which].desc;

			if ( bJustDescription === false ) {
				// Do the interpretation which adds stuff to inject into html variable
				// assert ( typeof interptStatus[which].interpret === "function"  )
				iResult += ( typeof interptStatus[which].interpret === "function" ) ?  interptStatus[which].interpret() : "";		// where the action happens
				interptStatus[which].done = true;
				my.playAudio('spring1', 0.4);
				my.log('i', iResult);				// todo: shouldn't really be logging this from here.
			}

			return desc + iResult;
		}
	}



    return my;

}(jQuery, autoGEO || {}));