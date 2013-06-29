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
						if (my.data.knownMothers < 4) {				// dont do if chart is already derived
							my.data.quesitedHouse = $(this).closest('ul').data('id');
							my.playAudio('whoosh1', 0.2);
							my.log('l', 'House of Quesited chosen: ' + my.data.quesitedHouse);
						}
					}
				);


			}
		);

	};



	return my;

}(jQuery, autoGEO || {}));