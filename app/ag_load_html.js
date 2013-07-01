// HTML to be injected into index.html
//
// Could ajax this stuff in but why load a bunch more files... this is just one extra file.


var autoGEO = (function ($, my) {


var schart = '<table id="ChartTable"> \
    <tr>\
        <td></td>\
        <td class="house" id="chart8"><img src="./img/figempty.png" alt="8th House"></img></td>\
        <td></td>\
        <td class="house" id="chart7"><img src="./img/figempty.png" alt="7th House"></img></td>\
        <td></td>\
        <td class="house" id="chart6"><img src="./img/figempty.png" alt="6th House"></img></td>\
        <td></td>\
        <td class="house" id="chart5"><img src="./img/figempty.png" alt="5th House"></img></td>\
        <td></td>\
        <td class="house" id="chart4"><img src="./img/figempty.png" alt="4th Mother"></img></td>\
        <td></td>\
        <td class="house" id="chart3"><img src="./img/figempty.png" alt="3rd Mother"></img></td>\
        <td></td>\
        <td class="house" id="chart2"><img src="./img/figempty.png" alt="2nd Mother"></img></td>\
        <td></td>\
        <td class="house" id="chart1"><img src="./img/figempty.png" alt="1st Mother"></img></td>\
        <td></td>\
    </tr>\
    <tr>\
        <td></td>\
        <td></td>\
        <td class="house" id="chart12"><img src="./img/figempty.png" alt="12th House"></img></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td class="house" id="chart11"><img src="./img/figempty.png" alt="11th House"></img></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td class="house" id="chart10"><img src="./img/figempty.png" alt="10th House"></img></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td class="house" id="chart9"><img src="./img/figempty.png" alt="9th House"></img></td>\
        <td></td>\
        <td></td>\
    </tr>\
    <tr>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td class="house" id="chart14"><img src="./img/figempty.png" alt="Left Witness"></img></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td class="house" id="chart13"><img src="./img/figempty.png" alt="Right Witness"></img></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td></td>\
    </tr>\
    <tr>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td class="house" id="chart15"><img src="./img/figempty.png" alt="The Judge"></img></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td></td>\
        <td class="house" id="chart16"><img src="./img/figempty.png" alt="The Reconciler" width="60%"></img></td>\
        <td></td>\
    </tr>\
</table>';


var home = '<div class="row">\
        <div class="span3">        \
            <span id="testpic"></span>       \
        </div>\
        <div class="span9">\
            <p>Once you select the Geolocation button, your current location will appear to the left</p>\
            <p>To do a session, you have to have a question you want answered.</p>\
\
            <p>If you already have a question in mind, find which house in the chart the question belongs to and double click to select that house.</p>\
            <textarea id="questionBox" name="question">Enter your question here or choose one from the list.</textarea>\
            <p>Some times it is better to ask some questions that others.  Take a look at what the ruler of the day and current time is for the type of question that is favorable to ask right now.</p>\
\
            shift-mouse click on any house in the chart, or figure above to get details.<br>\
        </div>\
    </div>';



var figtab = '<table id="ChartTable"> \
  <p><strong>SHIFT + Single-click</strong> on any of the figures in the table above to learn more about each individual figure, its associations and attributes.</p>\
  <p>That information will stay in this tab until you choose another figure.</p>\
  <p>Each figure consists of four lines of either one or two dots. Two dots are often shown as a dash.</p>\
  <p>Each line is associated with an element, and a single dot (or vertical line) means that element is present in the figure. A dash (two dots) means it is not. From the top, the elements are:</p>\
  <p><strong>Fire</strong> - energry, activity, purpose; summer, noon, youth, the will</p>\
  <p><strong>Air</strong> - relation, response, and interaction; corresonds to spring, dawn, childhood, and the mind</p>\
  <p><strong>Water</strong> - flow, receptivity, and change; corresponds to autumn, dusk, maturity, and the emotions</p>\
  <p><strong>Earth</strong> - stability, form, and structure; corresponds to winter, midnight, old age, and the senses</p>';


var housetab = '<p>Each house is associated with a different sector of life. SHIFT + single-click on any of the houses in the chart above to learn more about common associations and attributions to each house.</p>\
    <p>Most questions require a house of the quesited. Choose one by double-clicking on that house. Once the casting is done, the primary answer to your question will be the figure in the house of the quesited, and the interpretations will revolve around that.</p>\
    <p>If you have a general question about a whole day/week/month/..., there will be no house of the quesited. When done casting and the chart is built, look at ALL of the houses, the figures in them, and their interactions for a detailed picture of all aspects of life in that time-span.<p>\
    <p>Other special questions will have specific information in particular houses.</p>';


var interptChoices = '<form id="interptForm" name="form1">\
    <p>\
        <input type="radio" name="interps" value="a"/><strong>Correct placement</strong><br/>\
        <input type="radio" name="interps" value="b"/><strong>Basic interpretation</strong><br/>\
        <input type="radio" name="interps" value="c"/><strong>Root of the question</strong><br/>\
        <input type="radio" name="interps" value="d"/><strong>The 4 triplicities</strong><br/>\
        <input type="radio" name="interps" value="e"/><strong>Elemental triplicities</strong><br/>\
        <input type="radio" name="interps" value="g"/><strong>The houses 1</strong><br/>\
        <input type="radio" name="interps" value="i"/><strong>Index, Part of Fortune</strong><br/>\
        <input type="radio" name="interps" value="j"/><strong>Essential Dignities</strong><br/>\
        <input type="radio" name="interps" value="m"/><strong>Modes of Perfection</strong><br/>\
        <input type="radio" name="interps" value="n"/><strong>Aspects between Houses</strong><br/>\
        <input type="radio" name="interps" value="o"/><strong>Company of Houses</strong><br/>\
        <input type="radio" name="interps" value="r"/><strong>The Reconciler</strong><br/>\
    </p>\
    </form>';  

var interptText = '\
    <p>Remember:</p>\
    <ul>\
        <li><strong>The Querent</strong> is  the person for whom the chart has been cast, \
        whether its you or someone else.</li>\
        <li><strong>The Quesited</strong> is the person or thing the querent wants to know about.</li>\
    </ul>\
    <p align="left"><strong>Some interpretation details:</strong></p>\
    <ul>\
        <li><strong>Correct Placement</strong> will tell you about the reliability of the casting</li>\
        <li><strong>Basic Interp</strong> will look at the judge and witnesses for the answer</li>\
        <li><strong>Root of the question</strong> will show you the driving force behind the scenario</li>\
        <li><strong>The 4 Triplicities</strong> show a broad picture of all the forces in the querents life</li>\
        <li>Elemental triplicities</li>\
        <li>Elemental interaction</li>\
        <li>The Houses  1 - Interpretation of the querent, quesited, and their interaction</li>\
        <li><strong>Modes of Perfection</strong></li>\
        <li><strong>The Reconciler</strong></li>\
    </ul>\
    <p>&nbsp;</p>';



    $('#home').append(home);
 	$('#shieldChart').append(schart);
    $('#figtab').append(figtab);
    $('#housetab').append(housetab);
    $('#interptChoices').append(interptChoices);
    $('#interptText').append(interptText);


	return my;
}(jQuery, autoGEO || {}));