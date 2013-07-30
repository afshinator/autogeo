// 

var autoGEO = (function ($, my) {

	my.chart = function() {
		var divShieldChart$;
		var tableChartTable$;
		var knownMothers;
		var houseOfQuesited = 0;		// default case, no house selected
		var houseOfQuesitor = 1;		// default case, 1st house 
		var house = [];				// Will hold the built chart + reconciler


		function reset() {
			var i = 0;

			knownMothers = 0;

			for (i = 0; i < 17; i += 1) {
				house[i] = 99;			// reset contents of each house & reconciler
			}
		}


		function init() {
			reset();			// set defaults
			// 1. Get access to html elements..
			var localHeaderCache$ = my.data.uiElt$['header'];	// header cached in app.js, first thing on startup

			/*jshint multistr: true */
			var schart = '<table id="ChartTable"><tr>\
				<td></td><td class="house" id="chart8"><img src="./img/figempty.png" alt="8th House"></td>\
				<td></td><td class="house" id="chart7"><img src="./img/figempty.png" alt="7th House"></td>\
				<td></td><td class="house" id="chart6"><img src="./img/figempty.png" alt="6th House"></td>\
				<td></td><td class="house" id="chart5"><img src="./img/figempty.png" alt="5th House"></td>\
				<td></td><td class="house" id="chart4"><img src="./img/figempty.png" alt="4th Mother"></td>\
				<td></td><td class="house" id="chart3"><img src="./img/figempty.png" alt="3rd Mother"></td>\
				<td></td><td class="house" id="chart2"><img src="./img/figempty.png" alt="2nd Mother"></td>\
				<td></td><td class="house" id="chart1"><img src="./img/figempty.png" alt="1st Mother"></td>\
				<td></td></tr><tr>\
				<td></td><td></td><td class="house" id="chart12"><img src="./img/figempty.png" alt="12th House"></td>\
				<td></td><td></td><td></td><td class="house" id="chart11"><img src="./img/figempty.png" alt="11th House"></td>\
				<td></td><td></td><td></td><td class="house" id="chart10"><img src="./img/figempty.png" alt="10th House"></td>\
				<td></td><td></td><td></td><td class="house" id="chart9"><img src="./img/figempty.png" alt="9th House"></td>\
				<td></td><td></td></tr><tr><td></td><td></td><td></td><td></td>\
				<td class="house witness lwitness" id="chart14"><img src="./img/figempty.png" alt="Left Witness"></td>\
				<td></td><td></td><td></td><td></td><td></td><td></td><td></td>\
				<td class="house witness rwitness" id="chart13"><img src="./img/figempty.png" alt="Right Witness"></td>\
				<td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>\
				<td class="house judge" id="chart15"><img src="./img/figempty.png" alt="The Judge"></td><td></td><td></td><td></td><td></td><td></td><td></td>\
				<td class="house" id="chart16"><img src="./img/figempty.png" alt="The Reconciler" width="60%"></td>\
				<td></td></tr></table>';	// TODO: ugly string to inject... is there a better way?

			divShieldChart$ = localHeaderCache$.find('#shieldChart');
			divShieldChart$.append(schart);							// Inject the html to build chart

			tableChartTable$ = localHeaderCache$.find('#ChartTable');

			if ( my.data.shiftKeyDown === false ) {
				// If shift key is down at startup time, hide the chart & fade it in
				divShieldChart$.hide();  // initView() unhides them
				divShieldChart$.css('visibility', 'visible' ).fadeIn(3000);
			}

			activateHandlers();

			my.data.uiElt$['shieldChart'] = divShieldChart$;	// TODO: will I even need to set these ?
			my.data.uiElt$['ChartTable'] = tableChartTable$;

			return this;
		} // init()



		function activateHandlers() {
			// Add over effect on houses, if shift-click to tab
			tableChartTable$.find('.house').hover(
				function() {
					$(this).addClass('overEffect1');
				},
				function() {
					$(this).removeClass('overEffect1');
				})
				.click(function(e) {
					if (e.shiftKey) {					// only show figure info if shift key is pressed at same time as single-click
						var whichFigure = $(this).attr("id");
						whichFigure = whichFigure.substring(5);

						my.log('l', 'Shift-Click on house:' + whichFigure);
						my.audio.play('klik1', 0.2);
						my.data.uiElt$['housetab'].load('ajax/houseinfo.html #' + whichFigure);	// use anchor within html file to load just the part we want
						$('#appTabs li:eq(2) a').tab('show');
					}
				});

			// On doubleclick of a house, set the house of the quesited, or quesitor if ctrl was held
			tableChartTable$.on("dblclick", '.house', function(e) {
				var house = ( $(this).attr('id').slice(5) ) * 1;	// get which house, turn into number

				if ( knownMothers < 4 ) {				// do only if chart is not derived
					if ( house < 13 ) {
						if (e.ctrlKey) {
							// House of Quesitor Changed
							setQHouse(false, house, $(this));
							my.log('l', 'House of Quesitor chosen,  double click on : ' + house);
						}
						else {
							my.log('l', 'House of Quesited chosen,  double click on : ' + house);
							// setQuesitedHouse(house, $(this));
							setQHouse(true, house, $(this));
						}
					}
				}
			});
/*
			// one-time event to show instructions on chart
			divShieldChart$.one("mouseover", function() {
				var that = $(this);

				$(this).addClass('chartOverlay1')
						.animate( {opacity: 0.25}, 5500, 'linear',
										function() {
											that.removeClass('chartOverlay1');
											that.css('opacity', 1.0);
										}
								);
			});
*/
		}



		// generateChart() - Given four mothers are already in data structure, generate rest of chart + reconciler
		// - at this point only called by newMother()
		// - array house is not 0 based, house[0] is the reconciler, house[1] is house 1, etc...
		function generateChart() {
			function isValidGeoFigure(n) {		// n is between 0 and 15, 0 is populus...
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

			// Code for Generating houses from mothers starts here...
			// Assert : houses 1-4 are filled with figures
			if ( house[1] > 15 || house[2] > 15 || house[3] > 15 || house[4] > 15 ) {
				my.log('err', 'In generateChart(), one of the 4 mothers doesnt seem to be valid.');
			}
			else {	// ok, looks like we've got real figures in there...
				house[5] =	( isLineOne(1, house[1]) ? 1 : 0 ) + ( isLineOne(1, house[2]) ? 2 : 0 ) + ( isLineOne(1, house[3]) ? 4 : 0 ) + ( isLineOne(1, house[4]) ? 8 : 0 );
				house[6] =	( isLineOne(2, house[1]) ? 1 : 0 ) + ( isLineOne(2, house[2]) ? 2 : 0 ) + ( isLineOne(2, house[3]) ? 4 : 0 ) + ( isLineOne(2, house[4]) ? 8 : 0 );
				house[7] =	( isLineOne(3, house[1]) ? 1 : 0 ) + ( isLineOne(3, house[2]) ? 2 : 0 ) + ( isLineOne(3, house[3]) ? 4 : 0 ) + ( isLineOne(3, house[4]) ? 8 : 0 );
				house[8] =	( isLineOne(4, house[1]) ? 1 : 0 ) + ( isLineOne(4, house[2]) ? 2 : 0 ) + ( isLineOne(4, house[3]) ? 4 : 0 ) + ( isLineOne(4, house[4]) ? 8 : 0 );
				house[9] = combineFigures(house[1], house[2]);
				house[10] = combineFigures(house[3], house[4]);
				house[11] = combineFigures(house[5], house[6]);
				house[12] = combineFigures(house[7], house[8]);
				house[13] = combineFigures(house[9], house[10]);				// Right Witness
				house[14] = combineFigures(house[11], house[12]);				// Left Witness
				house[15] = combineFigures(house[13], house[14]);				// Judge
				house[0] = combineFigures(house[houseOfQuesitor || 1], house[15]);	// Reconciler
			}
		}


		// newMother(figure, showImmediately)
		//		figure - geomantic figure that was either just double-clicked on or cast with space-bar; 0 is populus...
		//		showImmediately - true if we want it to show; false will wait until chart is generated to show all
		function newMother(figure, showImmediately) {
			var i;		// for iteration 

			// builds image tag for geo figure passed in 
			function img(n) {
				return '<img src="' + my.data.figs[n].src + '" alt="' + my.data.figs[n].name + '"></img>';
			}

			if ( tableChartTable$ === undefined ) {
				my.log('err', 'In chart object, looks like init() wasnt called before newMother()!');
			} else {
				if ( knownMothers < 4 ) {	// as long as we don't have all 4 mothers chosen...
					knownMothers += 1;

					// if flag to show now... 
					if ( showImmediately === true ) {
						// Put image of mother in next available place 
						tableChartTable$.find( '#chart' + ( knownMothers ) ).html(img(figure));
					}

					// fill chart data structure
					house[knownMothers] = figure;		// house[0] is reconciler to be handled later
					my.log("log", "Figure : " + figure + " " + my.data.figs[figure].name + " chosen for House " + knownMothers, false);

					my.audio.play('whoosh4', 0.1);		// sound

					// if we have all four mothers, 
					if ( knownMothers > 3 ) {
						generateChart();										// generate chart data structure
						my.audio.play('arrival_horns', 0.1);					// sound
						my.statusMsg("Chart derived!");

						for (i = 1; i < 16; i += 1) {
							tableChartTable$.find( '#chart' + i )
									.html(img(house[i]))
									.find('img')
										.hide()
										.fadeIn(3000);
						}
						tableChartTable$.find('#chart16').html(img(house[0]));			// reconciler
						tableChartTable$.find('#chart16 img').attr('width', '65%');		// reduce its size

						var currentTime = my.timeWatcher.now();
						my.log('i', "Chart cast on " + currentTime.format('dddd') + ', ' + currentTime.format('MMMM Do YYYY, h:mm a'));
						// now log the ruler information here
					}
				}
			}
		}


		// setQHouse(isQuesited, house, house$)
		//		isQuesited - boolean, true for Quesited, false for Quesitor (aka querent)
		//		house - set house of quesitor/quesited to this
		//		house$ - optional, click handler for double click has it so why search again, except if we come form questions list
		function setQHouse(isQuesited, house, house$) {
			var highlightClass;
			var $oldHouse;
			var msg;
			var icon;

			// if 2nd arg is not passed in, search for and find the html element of the house selected
			if ( house$ === undefined ) {
				house$ = tableChartTable$.find('#chart' + house );
			}

			if ( isQuesited ) {		// House of QUESITED
				highlightClass = 'gradient4';
				if ( houseOfQuesited !== 0 ) {
					$oldHouse = tableChartTable$.find('#chart' + houseOfQuesited);
				}
				houseOfQuesited = house;
				icon = 'icon-question-sign';
				msg = 'House of QUESITED set : ';
			}
			else {					// House of QUESITOR
				highlightClass = 'gradient5';
				$oldHouse = tableChartTable$.find('#chart' + houseOfQuesitor);
				houseOfQuesitor = house;
				icon = 'icon-user';
				msg = 'House of QUESITOR set : ';

			}

			my.audio.play('whoosh1', 0.2);
			house$.addClass(highlightClass);
			if ( $oldHouse ) { $oldHouse.removeClass(highlightClass); }
			my.statusMsg(msg + house, false, icon);
		}


		return {
			houseOfQuesited	: function() { return houseOfQuesited; },
			houseOfQuesitor : function() { return houseOfQuesitor; },	// aka querent
			knownMothers : function() { return knownMothers; },
			init : init,							// public functions
			activateHandlers : activateHandlers,
			reset : reset,
			newMother : newMother,
			setQHouse: setQHouse,
			house : function(n) { return house[n]; }  // house array is not zero based, I mean house[0] is the reconciler
		};
	}();				// my.chart




    return my;

}(jQuery, autoGEO || {}));