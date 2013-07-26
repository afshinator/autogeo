// ag_Interpretations -  
//

var autoGEO = (function ($, my) {

	var interptForm$ = null;		// Will point to the radio button list of interpretations

	var lastShown = null;			// Will reflect last shown (but not necessarily run) interpretation

	// To help keep track of what interpretations have already been run (& have been implemented)
	var interptStatus = [
		{ 'done' : false, 'desc' : '<h5>Correct Placement</h5><table width="100%" border="0" cellspacing="0" cellpadding="10"><tr><td><p>In some traditions, there is a pattern of certain figures in the houses that verify the reliability of a reading.  If a figure appears in that house, it swears the event will come to pass.  This is often the first check that is made in interpretation.</p><p>Although it doesn\'t necessary mean the reading is invalid if it does not happen, it\'s good to get at least one figure to be in \'correct placement\'.</p><p>This small table below shows which houses \'should\' contain which figures.</p></td><td><table id="littleFigs" width="200px" border="0" cellspacing="0" cellpadding="0"><tr align="center"><th scope="col"><img src="img/fig8.gif" alt="Tristicia" width="12" /></th><th scope="col"><img src="img/fig2.gif" alt="Rubeus" width="12" /></th><th scope="col"><img src="img/fig5.gif" alt="Amissio" width="12" /></th><th scope="col"><img src="img/fig15.gif" alt="Via" width="12" /></th><th scope="col"><img src="img/fig4.gif" alt="Albus" width="12" /></th><th scope="col"><img src="img/fig14.gif" alt="Caput Draconis" width="12" /></th><th scope="col"><img src="img/fig1.gif" alt="Latecia" width="12" /></th><th scope="col"><img src="img/fig11.gif" alt="puer" width="12" /></th></tr><tr><td><img src="img/fig12.gif" alt="Fortuna Major" width="12" align="right" /></td><td> </td><td><img src="img/fig6.gif" alt="Conjunctio" width="12" align="right" /></td><td> </td><td> </td><td><img src="img/fig9.gif" alt="Carcer" width="12" align="left" /></td><td> </td><td><img src="img/fig3.gif" alt="Fortuna Minor" width="12" align="left" /></td></tr><tr><td> </td><td><img src="img/fig13.gif" alt="Puella" width="12" align="right" /></td><td> </td><td> </td><td> </td><td> </td><td><img src="img/fig7.gif" alt="Cauda Draconis" width="12" /></td><td> </td></tr><tr><td> </td><td> </td><td> </td><td><img src="img/fig10.gif" alt="Acquisitio" width="12" align="right" /></td><td> </td><td> </td><td> </td><td> </td></tr></table></td></tr></table>'}, // 0
		{ 'done' : false, 'desc' : '<h5>The Way of the Points</h5><p><small>This interpretation points to the force, desire, or cause thats driving things through.  It reflects the root of the question being asked.  The way points to a house wherein the figure reflects why things are happening, rather than how they <i>will</i> happen.  If the figure of the judge has a 1 as its top element, there is always one root cause. If it has a 2 as its top element, there are many diffuse causes - the topmost causes are stronger causes.</p><p>To determine the way of the points, we first see if the top line of the judge is repeated in either of the top lines of the right or left witness. If neither one, then \'the way\' stops there and the interpretation is that the situation with the quesited is exactly as it seems.  Otherwise, following the witness that had the same top line up the chart, you repeat the same process and see which house on the row above has the same top line as the rows below to the judge. This process ends with ending up with one to many ends of the branch which reflect either the one root cause or the number of diffuse causes.</small></p>'},// 1 - 
		{ 'done' : false, 'desc' : '<h5>The Judge and Witnesses</h5><small><p><strong>The Judge and Witnesses give the basic answer to your question.</strong>  The rest of the houses in the chart (Houses 1 through 12) give the details, the process the situation will go through.</p><p>The Judge is the figure that winds up in <a id="blink-h15">house 15</a>.   The <em>right witness is in <a id="blink-h13">house 13</a></em>, and the<em> left witness in <a id="blink-h14">house 14</a></em>. Some figures are often favorable, and some are often unfavorable, but favorable and unfavorable are really relative to the question. Learn about each figure, its imagry and associations, and in what situations that figure is favored.</p><p><strong>The Judge</strong> describes the interaction between the <strong>querent</strong> (the person asking the question) and the <strong>quesited</strong> (what is being asked), and is also a snapshot of the present moment, with respect to the question. In many reading the Judge by itself gives a good basic answer. In a yes or no type question, you are looking mainly at weighing the figure of the judge against your question. </p><p><strong>The Judge will always be one of the 8 figures</strong>, shown below along with their Mobile / Stable quality. This is a property of the figures that is more important in some questions (for example: theft), than others. It could also indicate a fixed or changing situation.</p></small><table width="100%" border="0" cellspacing="0" cellpadding="10"><tr><td><img src="img/fig5.gif" alt="Amissio" width="16" height="48" /></td><td><img src="img/fig0.gif" alt="Populus" width="16" height="48" /></td><td><img src="img/fig12.gif" alt="Fortuna Major" width="16" height="48" /></td><td><img src="img/fig6.gif" alt="Conjunctio" width="16" height="48" /></td><td><img src="img/fig9.gif" alt="Carcer" width="16" height="48" /></td><td><img src="img/fig10.gif" alt="Acquisitio" width="16" height="48" /></td><td><img src="img/fig3.gif" alt="Fortuna Minor" width="16" height="48" /></td><td><img src="img/fig15.gif" alt="Via" width="16" height="48" /></td></tr><tr><td>mobile</td><td>stable</td><td>stable</td><td>mobile</td><td>stable</td><td>stable</td><td>mobile</td><td>mobile</td></tr></table><small><p>&nbsp;</p><p><strong>The Right Witness</strong> represents the querent, everything the querent brings to the question including their attitude, agenda, and past. A &quot;favorable&quot; figure as the right witness means the querent is positioned strongly at the beginning of the matter. An unfavorable figure means a weak start.</p><p><strong>The Left Witness</strong> represents what the quesited means to the querent and everything it brings to the question. Its a reflection of how the quesited affects the querent, and also the future of the matter (whereas the judge is the present, right witness is past). A &quot;favorable&quot; left witness means that the quesited is beneficial to the querent while an &quot;unfavorable&quot;one means the quesited is something that will harm the querent or the querent is better off without.</p></small>'}, // 2  The Judge and Witnesses
		{ 'done' : false, 'desc' : '<h5>The 4 Triplicities</h5><small><p><strong>Looks at the broad picture of the querents life around the question</strong> by diving the 12 houses into four sets of three houses, each like a minuture chart itself with the lower house being the judge with respect to the other two houses. This interpretation is one way to get a general idea of all the forces at work, its useful in non-yes/no questions and when the answers to yes/no questions in the Judge and Witnesses isnt satisfying or clear.</p><p>This interpretation also reflects the general notion that the right side of the chart reflects the querent, while the left side of the chart is everything else.</p><p><a id="triplicity_a">The 1st triplicity</a> : houses <strong>1, 2, and 9</strong> represent<strong> the querent, their circumstances, health, habits, and outlook on life</strong>.</p><p><a id="triplicity_b">The 2nd triplicity : </a>houses <strong>3, 4, and 10</strong> represent<strong> the events shaping the querents life at the time of the reading</strong>.</p><p><a id="triplicity_c">The 3rd triplicity</a> : houses <strong>5, 6, and 11</strong> represent<strong> the querents home and work environment, places frequented, people met there, family and housemates</strong>.</p><p><a id="triplicity_d">The fourth triplicity</a> : houses <strong>7, 8, and 12</strong> represent <strong>the querents friends, associates, and authority figures</strong>.</p><p>Read each triplicity as though the bottom row is the judge, and the two   houses above it in its respective triplicity are the witnesses.  For example, in a question about your job house 5 talks about the past situation and house 6 the future, which combine to give the present in house 11.</p></small>'},	// 3 the triplicities
		{ 'done' : false, 'desc' : '<h5>Elemental Triplicities</h5><small><p><strong>This is another perspective on the situation around the querents life where the 12 houses are split into 4 triplicities, this time based on association with the elements.</strong></p><p>Each of 4 elements are each associated with 3 different houses:</p><p><a id="interpE_Fire">The <strong>Fire</strong> triplicity</a> : houses <strong>1, 5, and 9</strong>, reflect the querents <strong>private life, personality, sexuality, love, children, arts, spirituality, temperament, thought, vices &amp; virtues</strong>.</p><p><a id="interpE_Air">The <strong>Air</strong> triplicity</a> : houses <strong>3, 7, and 11</strong>, reflect <strong>the quality of those things from the social standpoint.</strong> Social life, concrete realization, anything opposed to quesited, the non-self, hopes, expectations.</p><p><a id="interpE_Water">The <strong>Water</strong> triplicity</a> : houses <strong>4, 8, and 12</strong> reflect <strong> the querents Occult life, heredity, death or transformation, doubts &amp; renouncement.</strong>.</p><p><a id="interpE_Earth">The <strong>Earth</strong> triplicity</a> : houses <strong>2, 6, and 10</strong> reflect <strong>the chance of things from their material standpoint</strong>.</p></small>'},		// 4  Elemental Triplicities		{ 'done' : false, 'desc' : 'bunch of <i>html</i> in here describing the interpt5'},		// 5
		{ 'done' : false, 'desc' : '<h5>The Querent, the Quesited, and the Outcome</h5><small><p>The quesited house(s), if there is one, answers the basic question.  The 1st house tells how the querent is affected by the quesited. The 4th house tells what the result of the whole situation will be. (See also The Reconciler).</p><p>If the figure of the querent is positive, but quesited negative, then querent wont get their desire, but its for the best.</p><p>If querent is negative, but quesited positive, then querent will get what they want, but they will regret it.</p><p>If   the querent or quesited figure passes to another house, then another   factor involving that house is involved in the matter.  Use the   associations of that house to understand what/who that factor is.</p>'},			// 6
		{ 'done' : false, 'desc' : '<h5>The Index and Part of Fortune</h5><small><p><strong>The Index </strong>represents the hidden factor at work in the situation.  Its derived couting the number of single points in the first 12 houses.</p><p><strong>The Part of Fortune</strong> indicates a house from which the querent can expect good fortune to   come in the situation.  It is derived from adding all the points in the   first 12 houses together.</p></small>'},
		{ 'done' : false, 'desc' : '<h5>Essential Dignities</h5><small><p>The different figures are either empowered or weakened by their placement in the different houses. On a 5-tier scale from strongest to weakest, each figure is influenced by the house it winds up in. These relationships are   derived from  taking the planet corresponding to the figure,   and reconciling with its astrological aspect to the house it gets found in.</p><p>A figure is </p></small><ul>  <li><small><em>strongest</em> in its own house,</small></li><li><small><em>very strong</em> when in its Exaltation, </small></li><li><small><em>strong</em> in its Triplicity, </small></li><li><small><em>weak</em> in its Fall, </small></li> <li><small><em>weakest</em> in its Detriment.</li></ul></small>'},
		{ 'done' : false, 'desc' : '<h5>Modes of Perfection</h5><small>For this interpretation you must have selected a house where your question falls: the house of the quesited. In this interpretation we check 4 particular patterns that are positive indicators and <strong>"perfect" the chart</strong>.  One of the basic meanings of a perfected chart is that the querent will be able to accomplish their goal. Listed here from the most strongest/positive to least:</small></p><small><p><strong>Occupation</strong> - Same figure appears in house of both querent &amp; quesited.</p><p><strong>Conjunction</strong> - Either the querent or quesited figure passes to a house next to the other.</p><p><strong>Mutation</strong> - Querent &amp; quesited both pass to adjacent houses elsewhere in chart.</p><p><strong>Translation</strong> - A figure other than that of querent or quesited appears next to both.</p></small>'},
		{ 'done' : false, 'desc' : '<i>Sorry dear Charlie</i>, this interpt has yet to be implemented :-( 10'},
		{ 'done' : false, 'desc' : '<i>Sorry dear Charlie</i>, this interpt has yet to be implemented :-( 11'}
	];

	// isFireLineActive(figure)
	// return TRUE if top line of figure passed in is a 1 (as opposed to 0 or 2)
	function isFireLineActive(figure) {
		// assert ( figure < 16)
		return ( ( figure & 1 ) === 1 ) ? true : false;
	}



	// Correct Placement --s
	// Pattern starting from house 1 is:
	// puer, laeticia, cap draco, albus, via, amissio, reub, 
	// trist, f minor, carcer, conjunct, fmajor, caud d, puella, acquisitio
	interptStatus[0].interpret = function() {
		var html = "";					// what is going to be returned as results/html to inject
		var i;							// iteration

		// figures in the houses they 'should' be
		var stdByWhichToMeasure = [ 11, 1, 14, 4, 15, 5, 2, 8, 3, 9, 6, 12, 7, 13, 10];
		// assert(stdByWhichToMeasure.length === 15)

		for ( i=0; i < 15; i += 1 ) {
			if ( my.chart.house(i+1) === stdByWhichToMeasure[i] ) {
				html += ( '<p>' + my.data.figs[my.chart.house(i+1)].name + ' correctly placed in House ' + (i+1) + '.</p>' );
			}
		}

		//my.log('l', 'interpt result --->' + html);
		return ( (html.length === 0) ? 'None of the houses have figures that are \"correctly placed\".' : html );
	};



	//
	// The Way of the Points (Via Puncti) --
	interptStatus[1].interpret = function() {
		var html = "";					// what is going to be returned as results/html to inject
		var house;						// house of figure where and if way of points ends, will be located in top row so 0-7
		var fig;						// figure in that house


		// the witnesses top line is the same but they dont match the judges top line
		if ( ( isFireLineActive( my.chart.house(13) ) === isFireLineActive( my.chart.house(14) ) ) && ( isFireLineActive( my.chart.house(14) ) !== isFireLineActive( my.chart.house(15) ) ) ){
			html += '<p>For the way of the points, top line of judge is different from top lines of the witnesses - so no way up the chart.  The chart is saying either there is <em>no root cause, or many root causes, but not one particular root cause</em>.</p>';
		}
		else {	// There is a way up, ...
			if ( isFireLineActive( my.chart.house(15) ) === true ) {
				html += '<p>A judge with an active top(fire) line always results in one root cause, located in top row.';
				if ( isFireLineActive( my.chart.house(13) ) === true ) {	// right witness
					if ( isFireLineActive( my.chart.house(9) ) === true ) {
						house = ( isFireLineActive( my.chart.house(1) ) === true ) ? 0 : 1;
					} else { // my.chart.house(10) === true
						house = ( isFireLineActive( my.chart.house(3) ) === true ) ? 2 : 3;
					}
				} else { // my.chart.house(14) === true
					if ( isFireLineActive( my.chart.house(12) ) === true ) {
						house = ( isFireLineActive( my.chart.house(8) ) === true ) ? 7 : 6;
					} else { // my.chart.house(11) === true
						house = ( isFireLineActive( my.chart.house(6) ) === true ) ? 5 : 4;
					}
				}
				html += 'The way of points ends house ' + (house+1) + ', with figure ' + my.data.figs[my.chart.house(house+1)].name + '.</p>';
			} else {
				html += '<p>A judge with an inactive top(fire) line has multiple root causes.</p>';
			}
		}

		//my.log('l', 'interpt result --->' + html);
		return ( (html.length === 0) ? '' : html );
	};




	//
	// The Judge and Witnesses --
	interptStatus[2].interpret = function() {
		var html = "";					// what is going to be returned as results/html to inject
		var i;							// iteration

		var stable = [ 0, 4, 8, 9, 10, 12, 13, 14 ];			// The stable figures
		var judge = my.chart.house(15);
		var rw = my.chart.house(13);
		var lw = my.chart.house(14);

		html += '<p><strong>The Judge and Witnesses</strong> - By looking at the Stable/Mobile Quality of each of the figures in these houses, you can get a sense of whether the situation is fixed or changing.</p><ul>';

		/* This code doesn't belong here
		 */
			// set up a delegated event handler to highlight the house if they mouseover text in the interpt
			my.data.uiElt$['interpts'].on('mouseover', "#blink-h13", function(e) {
				$("#chart13").effect('highlight', {}, 2000); // addClass("blowUp120");
				e.preventDefault();
			});

			// set up a delegated event handler to highlight the house if they mouseover text in the interpt
			my.data.uiElt$['interpts'].on('mouseover', "#blink-h14", function(e) {
				$("#chart14").effect('highlight', {}, 2000); // addClass("blowUp120");
				e.preventDefault();
			});

			// set up a delegated event handler to highlight the house if they mouseover text in the interpt
			my.data.uiElt$['interpts'].on('mouseover', "#blink-h15", function(e) {
				$("#chart15").effect('highlight', {}, 2000); // addClass("blowUp120");
				e.preventDefault();
			});

		/*
		 */



		// CRITERIA 1:  Stable/Mobile Quality of Figures
		// Quick and dirty way to find out whether judge, lw, rw are stable or mobile figures.
		var judgeStable = false, rwStable = false, lwStable = false;
		for (i=0 ; i < stable.length ; i += 1) {
			if ( stable[i] === my.chart.house(15) ) { judgeStable = true; }
			if ( stable[i] === my.chart.house(13) ) { rwStable = true; }
			if ( stable[i] === my.chart.house(14) ) { lfStable = true; }
		}

		// Right now we are just outputing in 3 cases, 1.) whether all are stable
		if ( judgeStable && rwStable && lwStable ) {
			html += '<li>The judge and witnesses are all stable figures.  Whether favorable or not, this implies a fixed situation.</li>';
		} else {
			if ( judgeStable ) {	//  2.) All arent stable, but Judge definitely is
				html += '<li>The Judge ' + my.data.figs[judge].name + ' has a stable quality which might imply a definite yes or no, in those type of questions.</li>';
			} else {
				// 3. No stable figures
				if ( ! (judgeStable || rwStable || lwStable ) ) {
					html += '<li>The Judge and both Witnesses are all mobile figures!  This might indicate a situation in change with maybe uncertain, or quick to pass outcomes.</li>';
				}
			}
		}


		// CRITERIA 2: Special cases
		// NEUTRAL figures: Conjunctio 6, via 15, populus 0,  (and fminor 3)
		if ( judge === 6 || judge === 15 || judge === 0 || judge === 3 ) {
			html += '<li>The Judge: ' + my.data.figs[judge].name + ' is a neutral figure which takes on the negative or positive influences of the Witnesses.</li>';
		}

		// POSITIVE figures: FMajor 12, ( Acquisitio 10 )
		if ( judge === 12 ) {
			html += '<li>The figure of the the Judge: ' + my.data.figs[judge].name + ' is almost always a positive indicator.</li>';
		}

		/* TODO: put more info for each of the 8 possible judges */

		// NEGAIVE figures: Reubeus 2, Tristicia 8, Caud Drac 7, Amissio 5, Carcer 9
		if ( judge === 5 || judge === 9 ) {
			html += '<li>The figure of the the Judge: ' + my.data.figs[judge].name + ' is almost always a negative indicator.</li>';
		}

		if ( rw === 2 || rw === 8 || rw === 7 || rw === 5 || rw ===9 ||lw === 2 || lw === 8 || lw === 7 || lw === 5 || lw ===9 ) {
			html += '<li>Usually NEGATIVE: Reubeus, Tristicia, Cauda Drac, Amissio, Carcer detected in one (or both) of the Witnesses.</li>';
		}

		// RW or LF is CAUDA DRACONIS (7), judge cant be c.draconis
		if ( rw === 7 || lw === 7) {
			html += '<li>The ' + ((rw === 7) ? 'Right' : 'Left') + ' Witness is Cauda Draconis, a disruptive figure, good only for losses and endings.</li>';
		}

		html += '</ul>';
		//my.log('l', 'interpt result --->' + html);
		return html;
	};




	//
	// The 4 Triplicities --
	interptStatus[3].interpret = function() {
		/* This code doesn't really belong here, 
		 */
			// set up a delegated event handler to highlight the house if they mouseover text in the interpt
			my.data.uiElt$['interpts'].on('mouseover', "#triplicity_a", function(e) {
				$("#chart1").effect('highlight', {}, 2000);
				$("#chart2").effect('highlight', {}, 2000);
				$("#chart9").effect('highlight', {}, 2000);
				e.preventDefault();
			});

			my.data.uiElt$['interpts'].on('mouseover', "#triplicity_b", function(e) {
				$("#chart3").effect('highlight', {}, 2000);
				$("#chart4").effect('highlight', {}, 2000);
				$("#chart10").effect('highlight', {}, 2000);
				e.preventDefault();
			});

			my.data.uiElt$['interpts'].on('mouseover', "#triplicity_c", function(e) {
				$("#chart5").effect('highlight', {}, 2000);
				$("#chart6").effect('highlight', {}, 2000);
				$("#chart11").effect('highlight', {}, 2000);
				e.preventDefault();
			});

			my.data.uiElt$['interpts'].on('mouseover', "#triplicity_d", function(e) {
				$("#chart7").effect('highlight', {}, 2000);
				$("#chart8").effect('highlight', {}, 2000);
				$("#chart12").effect('highlight', {}, 2000);
				e.preventDefault();
			});
		/*
		 */
	};



	//
	// The Elemental Triplicities --
	interptStatus[4].interpret = function() {
		/* This code doesn't really belong here, 
		 */
			// set up a delegated event handler to highlight the house if they mouseover text in the interpt
			my.data.uiElt$['interpts'].on('mouseover', "#interpE_Fire", function(e) {
				$("#chart1").effect('highlight', {}, 2000);
				$("#chart5").effect('highlight', {}, 2000);
				$("#chart9").effect('highlight', {}, 2000);
				e.preventDefault();
			});

			my.data.uiElt$['interpts'].on('mouseover', "#interpE_Air", function(e) {
				$("#chart3").effect('highlight', {}, 2000);
				$("#chart7").effect('highlight', {}, 2000);
				$("#chart11").effect('highlight', {}, 2000);
				e.preventDefault();
			});

			my.data.uiElt$['interpts'].on('mouseover', "#interpE_Water", function(e) {
				$("#chart4").effect('highlight', {}, 2000);
				$("#chart8").effect('highlight', {}, 2000);
				$("#chart12").effect('highlight', {}, 2000);
				e.preventDefault();
			});

			my.data.uiElt$['interpts'].on('mouseover', "#interpE_Earth", function(e) {
				$("#chart2").effect('highlight', {}, 2000);
				$("#chart6").effect('highlight', {}, 2000);
				$("#chart10").effect('highlight', {}, 2000);
				e.preventDefault();
			});
		/*
		 */
	};


	//
	// The Querent & the Quesited --
	interptStatus[5].interpret = function() {

	};


	//
	// The Index & Part of Fortune --
	interptStatus[6].interpret = function() {
		var html = "";					// what is going to be returned as results/html to inject		
		var i, index = 0;
		var partOfFortune = 0;
		var figure;

		// Index is all the 1's in the chart, mod 12
		// Part of Fortune is all and 1's and 2's added up, mod 12]
		for ( i = 0; i < 12; i += 1) {
			figure = my.chart.house(i+1);
			if (figure === 0) {
				partOfFortune += 8;
			} else if (figure === 1) {
				index += 1;	partOfFortune += 7;
			} else if (figure === 2) {
				index +=1;	partOfFortune +=7;
			} else if (figure === 3) {
				index +=2;	partOfFortune +=6;
			} else if (figure === 4) {
				index +=1;	partOfFortune +=7;
			} else if (figure === 5) {
				index +=2;	partOfFortune +=6;
			} else if (figure === 6) {
				index +=2;	partOfFortune +=6;
			} else if (figure === 7) {
				index +=3;	partOfFortune +=5;
			} else if (figure === 8) {
				index +=1;	partOfFortune +=7;
			} else if (figure === 9) {
				index +=2;	partOfFortune +=6;
			} else if (figure === 10) {
				index +=2;	partOfFortune +=6;
			} else if (figure === 11) {
				index +=3;	partOfFortune +=5;
			} else if (figure === 12) {
				index +=2;	partOfFortune +=6;
			} else if (figure === 13) {
				index +=3;	partOfFortune +=5;
			} else if (figure === 14) {
				index +=3;	partOfFortune +=5;
			} else if (figure === 15) {
				index +=4;	partOfFortune +=4;
			}
		}	// end for

		index = index % 12;
		if (index === 0) { index = 12; }

		partOfFortune = partOfFortune % 12;
		if (partOfFortune === 0 ) { partOfFortune = 12; }

		my.log('log', 'index:' + index + ' -- pof:'+ partOfFortune);

		html += '<ul>';
		html += '<li><strong>Index - The hidden factor in the situation is in house #' + index + '</strong></li>';
		html += '<li><strong>Part of Fortune - House #' + partOfFortune + '</strong>.</li>';
		html += '</ul>';
		return html;
	};



	//
	// Essential Dignities --
	interptStatus[7].interpret = function() {
		var html = "";					// what is going to be returned as results/html to inject		
		var i;
		var figure;
		var dignity;

		//	figure as a string :  Array is house its in with value of dignity
		//
		//	Values from Terrestrial Astrology by Skinner
		//		3	- Strongest: rules of own House
		//		2	- Very strong : exaltation
		//		1	- Strong triplicity
		//		0	- if figure is NEUTRAL in the passed in house
		//		-1	- Very weak - fall
		//		-2	- Weakest - Detriment
		var dignityList = {
				// 1  2  3  4  5  6  7  8  9 10  11 12   
			'0' : [0, 2, 0, 3, 0, 0, 0, -1,0,-2, 0, 1],	// Populus, h4:3, h2:2, h12:1, h8:-1, h10:-2 
			'1' : [1, 1,-2, 2, 0,-2, 1, 0, 3,-1, 0, 3],	// Laetitia, h9/12:3, h4:2, h1/2/7:1, h10:-1, h3/6:-2
			'2' : [3,-2, 0,-1, 1, 0,-2, 3, 0, 2, 0, 0],	// Rubeus, 1/8:3, 10:2, 5:1, 4:-1, 2/7:-2
			'3' : [2, 0, 0, 0, 3, 0,-1, 1, 0, 0,-2, 0],	// Fort Minor, 1:2, 5:3, 7:-1, 8:1, 11:-2
			'4' : [0, 0, 3, 1, 0, 3, 0, 0,-2, 1, 0,-1],	// Albus, 3/6:3, 4/10:1, 9:-2, 12:-1  // book lists fall:12 & detriment 9,12
			'5' : [-2,3, 0, 0, 0,-1, 3, -2,1, 0, 1, 2],	// Amissio, 1/8:-2, 2/7:3, 6:-1, 9/11:1, 12:2
			'6' : [0, 0, 3, 1, 0, 2, 0, 0,-2, 1, 0,-1],	// Conjunctio, 3:3, 4/10:1, 6:2, 9:-2, 12:-1
			'7' : [0, 0,-1, 0, 0, 0, 0, 0, 2, 0, 0, 0],	// Cauda Draconis, 3:-1, 9:2
			'8' : [-1,0, 1,-2,-2, 1, 2, 0, 0, 3, 3, 0],	// Tristicia, 1:-1, 3/6:1, 4/5:-2, 7:2, 10/11:3
			'9' : [-1,0, 1,-2,-2, 1, 2, 0, 0, 3, 3, 0],	// Carcer, 1:-1, 3/6:1, 4/5:-2, 7:2, 10/11:3
			'10': [1, 1,-2, 2, 0,-2, 1, 0, 3,-1, 0, 3],	// Acquisitio, 1/2/7:1, 3/6:-2, 4:2, 9/12:3, 10:-1
			'11': [3,-2, 0,-1, 1, 0,-2, 3, 0, 2, 0, 0],	// Puer, 1/8:3, 2/7:-2, 4:-1, 5:1, 10:2	
			'12': [2, 0, 0, 0, 3, 0,-1, 1, 0, 0,-1, 0],	// Fort Major, 1:2, 5:3, 7:-1, 8:1, 11:-2
			'13': [-2,3, 0, 0, 0,-1, 3,-2, 1, 0, 1, 2],	// Puella, 1/8:-2, 2/7:3, 6:-1, 9/11:1, 12:2
			'14': [0, 0, 2, 0, 0, 0, 0, 0,-1, 0, 0, 0],	// Cap Draconis, 3:2, 9:-1
			'15': [0, 2, 0, 3, 0, 0, 0,-1, 0,-2, 0, 1]	// Via, 2:2, 4:3, 8:-1, 10:-2, 12:1
		};

		html += '<small><ul>';
		for ( i = 0; i < 12; i += 1) {
			figure = my.chart.house(i+1) + '';					// get figure in the house and turn it into a string
			dignity = dignityList[figure][i];		// 
			html += '<li>House ' + (i+1) + ': ' + my.data.figs[my.chart.house(i+1)].name + ' ';

			if ( dignity === 0 ) {
				html += 'is neutral in this house.</li>';
			}
			else if ( dignity === 1 ) {
				html += 'is strong in this house. (+1)</li>';
			}
			else if ( dignity === 2 ) {
				html += 'is very strong in this house. (+2)</li>';
			}
			else if ( dignity === 3 ) {
				html += 'is strongest in this house! (+3)</li>';
			}
			else if ( dignity === -1 ) {
				html += 'is weak (aka fall) in this house. (-1)</li>';
			}
			else if ( dignity === -2 ) {
				html += 'is weakest (aka detriment) in this house! (-2)</li>';
			}
			else {
				html += 'hiccup. error.</li>';
				my.log('err', 'Strange number from dignityList.');
			}
		}
		html += '</ul></small>';

		return html;
	};




	//
	// Modes of Perfection --
	interptStatus[8].interpret = function() {
		var html = "";					// what is going to be returned as results/html to inject		
		var i;
		var houseOfQuesited = my.chart.houseOfQuesited();
		var houseOfQuesitor = my.chart.houseOfQuesitor();
		var quesitedFig = my.chart.house(houseOfQuesited);
		var querentFig = my.chart.house(houseOfQuesitor);

		function neighbor(before, me) {
			var x;

			if ( before === true ) {		// neighbor before me 
				me -= 1;
			} else {						// neighbor after me 
				me += 1;
			}
			x = my.mod(me, 12);				// use my negative-safe modulus fx
			if ( x === 0 ) { x = 12; }		// my.mod(0,12) returns 0 
			return x;
		}

		function checkNeighborsOfQ(quesited) {	// quesited is true then houseof Quesited, else house of Querent
			var houseToCheckAround = ( quesited === true ) ? houseOfQuesited : houseOfQuesitor;
			var targetFigure = ( quesited === true ) ? quesitedFig : querentFig;
			var otherQFigure = ( quesited === true ) ? querentFig : quesitedFig; // opposite of above

			var houseBeforeTarget = neighbor(true, houseToCheckAround);
			var houseAfterTarget = neighbor(false, houseToCheckAround);
			var figInHouseBeforeTarget = my.chart.house(houseBeforeTarget);
			var figInHouseAfterTarget = my.chart.house(houseAfterTarget);

			if ( figInHouseBeforeTarget === otherQFigure ) {		// house before target
				html += '<li>CONJUNCTION Found! Figure ' + my.data.figs[otherQFigure].name + ' has behind house  ' + houseToCheckAround + '.</li>';
				// TODO: highlight houses
			}
			if ( figInHouseAfterTarget === otherQFigure ) {			// house after target
				html += '<li>CONJUNCTION Found! Figure ' + my.data.figs[otherQFigure].name + ' has passed in front of house  ' + houseToCheckAround + '.</li>';
			}
		}


		if ( houseOfQuesited === 0 ) {
			html += 'No house selected as the Quesited House.  This interpretation relies on comparing the Quesited and Quesitor.';
		}
		else {
			html += '<ul>';

			// OCCUPATION - same figure in houses of querent & quesited
			if ( quesitedFig === querentFig ) {
				html += '<li>OCCUPATION Found! The strongest Mode Of Perfection.';
				html += 'The quesited ' + my.data.figs[quesitedFig].name + ' in house ' + houseOfQuesited + ', is also in House of Quesitor ' + houseOfQuesitor + '.</li';
				// TODO: insert bells and whistles here
			} else {
				html += '<li>No Occupation possible - ' + my.data.figs[quesitedFig].name + ' is not ' + my.data.figs[querentFig].name + '.</li>';
			}


			// CONJUNCTION - either querent or quesited pass to a house next to each other
			checkNeighborsOfQ(true);		// check neighbors of House of Quesited
			checkNeighborsOfQ(false);		// check neighbors of House of Querent



			html += '</ul>';
		}

		return html;
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

			my.audio.play('klik1', 0.6);
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
		return ( ( my.chart.knownMothers() > 3 ) ? true : false );
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
				my.audio.play('spring1', 0.4);
				my.log('i', iResult);				// todo: shouldn't really be logging this from here.
			}

			return desc + iResult;
		}
	}



    return my;

}(jQuery, autoGEO || {}));