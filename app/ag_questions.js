// 

var autoGEO = (function ($, my) {


	//
	// 
	my.loadQuestions = function(filename) {
		// inject HTML into tab from file, & when done create hover & click handlers
		my.loadHTMLintoTab(filename, my.data.uiElt$['questions'],
			function(){

				//  Hover over entire House, no click
				my.data.uiElt$['questions'].find('.questnHouse').hover(
					function() {
						$(this).addClass('chartHover');
					},
					function() {
						$(this).removeClass('chartHover');
					}
				);

				//  Hover & Click handlers for individual questions
				my.data.uiElt$['questions'].find('.questnHouse li').hover(
					function() {
						$(this).addClass('gradient1');
					},
					function() {
						$(this).removeClass('gradient1');
					}
					).dblclick(function() {
						var q = $(this).text();		// get questions that was clicked on
						var house = $(this).closest('ul').data('id');

						if (my.chart.knownMothers() < 4) {				// dont do if chart is already derived
							my.log('l', 'Question chosen from house: ' + house + ", setting house of quesited.");
							my.log('l', 'Question is:' + q);
							my.data.uiElt$['questionBox'].val(q);	// put question in textarea on home tab
							my.chart.setQHouse( true, house );
							$('#appTabs li:eq(0) a').tab('show');	// show first tab
						}
					}
				);

			}
		);

	};



	return my;

}(jQuery, autoGEO || {}));