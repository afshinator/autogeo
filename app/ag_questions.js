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
						var house = $(this).closest('ul').data('id');
						if (my.data.knownMothers < 4) {				// dont do if chart is already derived
							my.log('l', 'Question chosen from house: ' + house + ", setting house of quesited.");
							my.setQuesitedHouse( house );
						}
					}
				);


			}
		);

	};



	return my;

}(jQuery, autoGEO || {}));