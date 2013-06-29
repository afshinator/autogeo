// load html 

var autoGEO = (function ($, my) {

// TODO: the Shield chart table -- hardcoded until I get to loading it via ajax...
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


 	$('#shieldChart').append(schart);
    $('#figtab').append(figtab);
    $('#housetab').append(housetab);

	return my;
}(jQuery, autoGEO || {}));