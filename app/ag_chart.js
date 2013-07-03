// 

var autoGEO = (function ($, my) {

	// passed in n corresponds to geomantic figure and should be between 0 and 15
	function isValidGeoFigure(n) {
		if ( (n < 16)  && (n > -1) ) { return true; }
		else {
			my.log("err", "Got some funky Figure number : " + n);
			return false;
		}
	}



	// Check if nth geomantic figures' xth line from top is a 1; return false if not 
	// If x==1, then we're checking the top (fire) line, etc...
	function isLineOne(x, n) {
		var comparator;

		if ( !isValidGeoFigure(n) || (x < 1) || (x > 4) ) {
			my.log("err", isLineOne(" + x + ", " + n + ")+ " invalid!");
		}
		else {
			comparator = Math.pow(2, (x-1));	// comparator will be either 1, 2, 4, or 8
			return ( n & comparator );
		}
	}



	// Combine two geomantic figures to produce a new one, return the new one
	// Combining involving XOR between each of the four lines in a figure
	function combineFigures(a, b) {
		if ( !isValidGeoFigure(a) || !isValidGeoFigure(b)) {
			my.log("err", "combineFigures(" + a + ", " + b + ")");
		}
		else {
			return ( a ^ b );
		}
	}



	// Genreate chart (in internal data structure) from 4 mothers
	// Assumes four mothers are already in data structure
	my.generateChart = function() {
		var c = my.data.chart;			// vars are cheap!  Using this for shorthand

		c[4] =	( isLineOne(1, c[0]) ? 1 : 0 ) +
				( isLineOne(1, c[1]) ? 2 : 0 ) +
				( isLineOne(1, c[2]) ? 4 : 0 ) +
				( isLineOne(1, c[3]) ? 8 : 0 );

		c[5] =	( isLineOne(2, c[0]) ? 1 : 0 ) +
				( isLineOne(2, c[1]) ? 2 : 0 ) +
				( isLineOne(2, c[2]) ? 4 : 0 ) +
				( isLineOne(2, c[3]) ? 8 : 0 );

		c[6] =	( isLineOne(3, c[0]) ? 1 : 0 ) +
				( isLineOne(3, c[1]) ? 2 : 0 ) +
				( isLineOne(3, c[2]) ? 4 : 0 ) +
				( isLineOne(3, c[3]) ? 8 : 0 );

		c[7] =	( isLineOne(4, c[0]) ? 1 : 0 ) +
				( isLineOne(4, c[1]) ? 2 : 0 ) +
				( isLineOne(4, c[2]) ? 4 : 0 ) +
				( isLineOne(4, c[3]) ? 8 : 0 );

		c[8] = combineFigures(c[0], c[1]);				// House 9
		c[9] = combineFigures(c[2], c[3]);				// House 10
		c[10] = combineFigures(c[4], c[5]);				// House 11
		c[11] = combineFigures(c[6], c[7]);				// House 12


		c[12] = combineFigures(c[8], c[9]);				// House 13	Right witness
		c[13] = combineFigures(c[10], c[11]);			// House 14 Left witness

		c[14] = combineFigures(c[12], c[13]);			// The Judge

		c[15] = combineFigures(c[0], c[14]);			// The Reconciler

		my.data.sounds['chime'].volume(0.1).play();		// sound

		my.statusMsg("Chart derived!");
		// my.log("info", "Chart derived!");
	};




	//
	// called upon double-click of one of the figures in the figure list
	my.figSelected = function(i) {
		// build image tag for geo figure passed in 
		function img(n) {
			return '<img src="' + my.data.figs[n].src + '" alt="' + my.data.figs[n].name + '"></img>';
		}

		var table$ = my.data.uiElt$['ChartTable'];		// we're going to be looking within this element

		// keep filling up the mother spots in the chart until we get all four mothers
		if (my.data.knownMothers < 4) {
			table$.find( '#chart' + (my.data.knownMothers+1) ).html(img(i));
			my.data.chart[my.data.knownMothers] = i;					// holds chart contents

			my.log("log", "Figure : " + i + " " + my.data.figs[i].name + " chosen for House " + (my.data.knownMothers + 1), false);
			my.data.knownMothers += 1;

			my.data.sounds['whoosh4'].volume(0.1).play();		// sound
			// all four mothers are chosen, so kick off deriving the whole chart
			if (my.data.knownMothers > 3) {
				my.generateChart();				// derive chart & store in internal data structure

				// fill up UI table with chart results
				for (i=5; i<17; i++) {
					table$.find( '#chart' + i ).html(img(my.data.chart[i-1]));
				}

				// make the reconciler image smaller
				table$.find('#chart16 img').attr("width","65%");
			}
		}
		else {
			// TODO: all figures chosen, should probably unbind the double-click form the figure images
			//my.log('err', 'Stop doubleclicking on figures fool!');
		}
	};


	// setQuesitedHouse(house, house$) - called by dblclick handler of chart or click on questions list
	//			house - number of house selected for house of quested to set.
	//			house$ - optional argument;  (for quesited house selection from questions list)
	my.setQuesitedHouse = function(house, house$) {
		my.playAudio('whoosh1', 0.2);

		// If quesited House has been previously set, get rid of UI effect
		if ( my.data.quesitedHouse !== 0 ) {
			var $t = my.data.uiElt$['ChartTable'].find('#chart' + my.data.quesitedHouse );
			$t.removeClass('gradient4');
		}

		// if 2nd arg is not passed in, search for and find the html element of the house selected
		if ( house$ === undefined ) {
			house$ = my.data.uiElt$['ChartTable'].find('#chart' + house );
		}

		house$.addClass('gradient4');
		my.data.quesitedHouse = house;
		my.statusMsg('House of Quesited Selected');
		// my.log('i', 'House of Quesited set: ' + house);
	};


    return my;

}(jQuery, autoGEO || {}));