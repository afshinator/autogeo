// ag_Interpretations -  
//

var autoGEO = (function ($, my) {

	var interptForm$ = null;		// Will point to the radio button list of interpretations

	var lastShown = null;			// Will reflect last shown (but not necessarily run) interpretation

	// To help keep track of what interpretations have already been run (& have been implemented)
	var interptStatus = [
		{ 'done' : false, 'desc' : '<h3>Correct Placement</h3><p>In some traditions, there is a pattern of certain figures in the houses that verify the reliability of a reading.  If a figure appears in that house, it swears the event will come to pass.  This is often the first check that is made in interpretation.</p><p>Although it doesn\'t necessary mean the reading is invalid if it does not happen, it\'s good to get at least one figure to be in \'correct placement\'.</p><p>This small table below shows which houses \'should\' contain which figures.</p><div align="center"><table id="littleFigs" width="200px" border="0" cellspacing="0" cellpadding="0"><tr align="center"><th scope="col"><img src="img/fig8.gif" alt="Tristicia" width="12" /></th><th scope="col"><img src="img/fig2.gif" alt="Rubeus" width="12" /></th><th scope="col"><img src="img/fig5.gif" alt="Amissio" width="12" /></th><th scope="col"><img src="img/fig15.gif" alt="Via" width="12" /></th><th scope="col"><img src="img/fig4.gif" alt="Albus" width="12" /></th><th scope="col"><img src="img/fig14.gif" alt="Caput Draconis" width="12" /></th><th scope="col"><img src="img/fig1.gif" alt="Latecia" width="12" /></th><th scope="col"><img src="img/fig11.gif" alt="puer" width="12" /></th></tr><tr><td><img src="img/fig12.gif" alt="Fortuna Major" width="12" align="right" /></td><td> </td><td><img src="img/fig6.gif" alt="Conjunctio" width="12" align="right" /></td><td> </td><td> </td><td><img src="img/fig9.gif" alt="Carcer" width="12" align="left" /></td><td> </td><td><img src="img/fig3.gif" alt="Fortuna Minor" width="12" align="left" /></td></tr><tr><td> </td><td><img src="img/fig13.gif" alt="Puella" width="12" align="right" /></td><td> </td><td> </td><td> </td><td> </td><td><img src="img/fig7.gif" alt="Cauda Draconis" width="12" /></td><td> </td></tr><tr><td> </td><td> </td><td> </td><td><img src="img/fig10.gif" alt="Acquisitio" width="12" align="right" /></td><td> </td><td> </td><td> </td><td> </td></tr></table></div>'}, // 0
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

			my.playAudio('klik1', 0.2);
			my.log('l', 'Interpretation ' + whichInterpt + ' clicked.');

			// delegate checking for if interpts has already run, whether chart is derived yet, etc... to ...
			interptResults = checkAndRunInterpt(whichInterpt);	// will return null if there is nothing to show

			if (  interptResults !== null ) {
				interptText$.html(interptResults);
				lastShown = whichInterpt;
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
		var status = interptStatus[which].done;

		my.log('l', 'in runInterpt ' + which + ', which has already run? ' + status );

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


	//	
	//	runInterpt(which, bJustDescription) - Returns html related to the interpt to inject, makes sure to not run already ran interpt
	//	which				- which interpts to run
	//	bJustDescription	- true if we dont want to actually process the chart, just return description of interpt
	//						(for when interpts has already run)
	function runInterpt(which, bJustDescription) {
		var html;		// for stuff to return

		// Check to see if this interpt is the same as the last one run
		if ( which === lastShown ) {
			// description is already showing, and therefore already run, so do nothing, show nothing new
			my.log('l', '!click on same interpt already showing ' + which);
			return null;
		}
		else {
			my.log('l', 'processing interpt ' + which);
			html = interptStatus[which].desc;

			if ( bJustDescription === false ) {
				// Do the interpretation, and add stuff to html variable
				html += interpret(which);			// yet another fx called to delegate the interpt
				interptStatus[which].done = true;
			}

			return html;
		}
	}



	//
	// interpret(which) - After all the error check with other fx, this is the fx that actually 
	//		runs the interpretation and returns a string thats to be show.
	//
	//	which - from 0 to 11? corresponds to radio buttons from top down
	function interpret(which) {



	}




    return my;

}(jQuery, autoGEO || {}));