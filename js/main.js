var globalOEM;

function showChart(){

    $(document).ready(function() {
        $('#selectedcar').text($('#year').val());
    });
    
	var primePrice = document.getElementById("primeCost").value;
	document.getElementById("disappear2").style.display = 'none';
    document.getElementById("editbutton").style.display = 'block';
    document.getElementById("submitbutton").style.display = 'none';

   $("#cashIncentivesTable tr").remove();
  // var OEMrates = [];
	var OEMrates = getIncentives($("#trim").val(), 'M1G3V4');
	//var OEMrates = getIncentives("372238", 'M1G3V4');
	globalOEM = OEMrates;


	//console.log('OEMRATELENGTH - SHOWCHART: ' + OEMrates.length);

	console.log("1st OEMRATES: " + OEMrates.length);
	console.log("1st CASHRRATES: " + OEMrates[1].length);

	//console.log("OEM RATE LENGTH" +incentiveData.length);
	//drawChart(primePrice-1750);
	drawChart(primePrice);
	//drawOEMchart(primePrice-500, OEMrates);
	drawOEMchart(primePrice, OEMrates);
	//drawCommissionChart(primePrice);
	drawCashIncentivesTable(OEMrates[1]);
}

function reload(){
	document.getElementById("disappear2").style.display = 'block';
    document.getElementById("editbutton").style.display = 'none';
    document.getElementById("submitbutton").style.display = 'block';
    document.getElementById("charts").style.display = 'none';

}

function createCheckBoxes(rbcValue, oemValue, cash){
	checkbox = "<input type='checkbox' id='"+rbcValue + "' value=" + cash + " onclick='" + "onChangeCheck()" + "'>RBC"
	+ "<input type='checkbox' id='"+oemValue + "' value=" + cash + " onclick='" + "onChangeCheck()" + "'>OEM";

	console.log(checkbox);

	return checkbox;
}

function drawCashIncentivesTable(cashIncentives){

	var cashTable = document.getElementById("cashIncentivesTable");
		var header = cashTable.createTHead();
		var row = header.insertRow(0);

		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		var cell4 = row.insertCell(3);

		cell1.innerHTML = '<b> PROGRAM DESCRIPTION </b>';
		cell2.innerHTML = '<b> CASH AMOUNT </b>';
		cell3.innerHTML = "<b> APPLY TO </b>";
		cell4.innerHTML = '<b> GROUP ELIGBILITY </b>';

	for(var i=0; i<cashIncentives.length; i++){
		var row = cashTable.insertRow(-1);

		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		var cell4 = row.insertCell(3);

		cell1.innerHTML = cashIncentives[i].programDesc;
		cell2.innerHTML = cashIncentives[i].cashAmt;
		cell3.innerHTML = createCheckBoxes('rbc'+i, 'oem'+i, cashIncentives[i].cashAmt);
		cell4.innerHTML = cashIncentives[i].group;
	}

}

function onChangeCheck(){

	//Check checkbox to see how much discounts
var rbcDiscount = 0;
var oemDiscount = 0;
//var tableLength = $("#cashIncentivesTable").rows.length;
var tableLength = document.getElementById("cashIncentivesTable").rows.length;
for(i=0;i<tableLength; i++){
	var rbcChkBoxID = "#rbc" + i;
	var oemChkBoxID = "#oem" + i;
	// if(document.getElementById(rbcChkBoxID).checked){
	// 	rbcDiscount = rbcDiscount +document.getElementById(rbcChkBoxID).value();
	// }
	// if(document.getElementById(oemChkBoxID).checked){
	// 	oemDiscount = oemDiscount + document.getElementById(oemChkBoxID).value();
	// }
	if($(rbcChkBoxID).is(':checked')){
		rbcDiscount = rbcDiscount +parseInt($(rbcChkBoxID).val(), 10);
	}
	if($(oemChkBoxID).is(':checked')){
		oemDiscount = oemDiscount + parseInt($(oemChkBoxID).val(),10);
	}

}
	redrawCharts(rbcDiscount, oemDiscount);
}

function redrawCharts(rbcDiscount, oemDiscount) {

	var primePrice = document.getElementById("primeCost").value;

	drawChart(primePrice-rbcDiscount);
	drawOEMchart(primePrice-oemDiscount, globalOEM);

}


function createChartValues(primePrice) {

	var selectedInterestSet;
	var terms;

	var monthlyPaymentChart = [];
	var monthlyPaymentCell = [];

	selectedInterestSet = getRatesByPrice(primePrice);
	terms = termLengths;

	for (var j = 0; j < selectedInterestSet.length; j++) {
		for (var i = 0; i < termLengths.length; i++) {
			monthlyPaymentCell.push(i);
			monthlyPaymentCell.push(selectedInterestSet.length - j);
			monthlyPaymentCell.push(Math.round(calcMonthlyRate(primePrice,
					selectedInterestSet[j], terms[i])));
			monthlyPaymentChart.push(monthlyPaymentCell);
			monthlyPaymentCell = [];
		}
		// monthlyPaymentChart.push(monthlyPaymentRow);
		// monthlyPaymentRow = [];
	}
	// printChart(monthlyPaymentChart);
	return monthlyPaymentChart;
}

function calculateSellerCommision(primePrice) {

	var constantCommision = 150;

	var selectedInterestSet;

	var dealerCommisionChart = [];
	var dealerCommisionCell = [];

	selectedInterestSet = getRatesByPrice(primePrice);

	for (var j = 0; j < selectedInterestSet.length; j++) {
		dealerCommisionCell.push(0);
		dealerCommisionCell.push(selectedInterestSet.length - j);
		dealerCommisionCell.push(Math.round((primePrice * 0.01 * selectedInterestSet[j][1])
						+ selectedInterestSet[j][2] + constantCommision));
		dealerCommisionChart.push(dealerCommisionCell);
		dealerCommisionCell = [];
	}
	//printChart(dealerCommisionChart);
	return dealerCommisionChart;

}

function drawChart(primePrice) {

	var data = createChartValues(primePrice);
	var data2 = calculateSellerCommision(primePrice);
	var interestRates = [ '0' ];
	var termLength = [];
	var selectedInterestSet = getRatesByPrice(primePrice);
	var terms = termLengths;

	for (var i = selectedInterestSet.length - 1; i >= 0; i--) {
		interestRates.push(selectedInterestSet[i][0].toString() + "%");
	}
//	console.log(interestRates.toString());
	for (var i = 0; i < terms.length; i++) {
		termLength.push(terms[i].toString());
	}
	$('#rates').highcharts(
			{

				chart : {
					type : 'heatmap',
					marginTop : 40,
					marginBottom : 80
				},

				title : null,

				xAxis : {
					categories : termLength,
					title: {
						text: 'Term in Months'
					}
				},

				yAxis : {
					categories : interestRates,
					title: {
						text: 'Rates %'
					}
				},

				colorAxis : {
					// min : 0,
					// stops: [
					// [0, '#fffbbc'],
					// [0.5, '#3060cf']
					// ],
					minColor : '#FFFFFF',
					maxColor : '#00688B'
				},

				legend : {
					align : 'right',
					layout : 'horizontal',
					margin : 0,
					verticalAlign : 'bottom',
					y : 25,
					symbolHeight : 50,
					enabled : false,
				},

				tooltip : {
					formatter : function() {
						return '<b>'
								+ this.series.xAxis.categories[this.point.x] + " Months"
								+ '</b>  <br><b>' + "Total Cost: "+ this.point.value*parseInt(this.series.xAxis.categories[this.point.x], 10)
								+ '</b>  <br><b>'
								+ this.series.yAxis.categories[this.point.y] + " Interest Rates"
								+ '</b>';
					}
				},
				exporting:{
					enabled: false,
				},
				credits : {
					enabled : false
				},
				series : [ {
					name : 'Sales per employee',
					borderWidth : 1,
					data : data,
					dataLabels : {
						enabled : true,
						color : '#000000',
					}
				} ]

			});

	$('#commission').highcharts(
			{

				chart : {
					type : 'heatmap',
					marginTop : 40,
					marginBottom : 80
				},

				title : null,

				xAxis : {
					categories : [ 'Commision' ],
				},

				yAxis : {
					categories : ['','','','','','','','','','','','','',''],
					title : null
				},

				exporting:{
					enabled: false,
				},
				colorAxis : {
					// min : 0,
					// stops: [
					// [0, '#fffbbc'],
					// [0.5, '#3060cf']
					// ],
					minColor : '#FFFFFF',
					maxColor : '#CD0000'
				},

				legend : {
					align : 'right',
					layout : 'vertical',
					margin : 0,
					verticalAlign : 'top',
					y : 25,
					symbolHeight : 280,
					enabled : false,
				},

				tooltip : {
					formatter : function() {
						return '<b>'
								+ this.series.xAxis.categories[this.point.x]
								+ '</b>  <br><b>$' + this.point.value
								+ '</b>  <br><b>'
								+ this.series.yAxis.categories[this.point.y]
								+ '</b>';
					}
				},
				credits : {
					enabled : false
				},
				series : [ {
					name : 'Sales per employee',
					borderWidth : 1,
					data : data2,
					dataLabels : {
						enabled : true,
						color : '#000000',
					}
				} ]

			});

}

function printChart(chart) {
	for (var j = 0; j < chart.length; j++) {
		for (var i = 0; i < chart[j].length; i++) {
			console.log(chart[j][i]);
		}
		console.log('/n');
	}
}

function calculateOEMtermLength(oemRates) {
	termLength = [];
	longestTermLength = 0;
	longestIncentive = 0;

	//oemRates.sort()

	//console.log('OEMRATELENGTH - TERMLENGTH: ' + oemRates.length);
	for(var i=0; i<oemRates.length; i++){
		//console.log('OEMRATELENGTH - INCENTIVELENGTH: ' + oemRates[i].incentiveRateList.length);
		for(var j=0; j<oemRates[i].incentiveRateList.length; j++){
			var currentTermLength = oemRates[i].incentiveRateList[j].to;
			//console.log('currentTermLength: ' + currentTermLength);
			if ($.inArray(currentTermLength, termLength) == -1){
				termLength.push(currentTermLength);
			}
		}
	}

	termLength.sort();
	//console.log('termLength: ' + termLength);

	return termLength;

}

// oemRates comes by [(interest, to, from, disclosure)*n]
function calculateOEMrates(primePrice, oemRates, termLength) {
	var monthlyOEMrates = [];
	var monthlyOEMrate = [];

	for (var i=0; i<oemRates.length; i++){
		for (var j=0; j<oemRates[i].incentiveRateList.length; j++){

			var xVal = $.inArray(oemRates[i].incentiveRateList[j].to, termLength);
			//console.log('INARRAY for i,j-> ' + i + " J: " + j + ' TO: ' + oemRates[i].incentiveRateList[j].to +" VAL: " + xVal);
			monthlyOEMrate.push(xVal);
			monthlyOEMrate.push(i);
			monthlyOEMrate.push(Math.round(calcOemMonthlyRate(primePrice, oemRates[i].incentiveRateList[j].interest, oemRates[i].incentiveRateList[j].to)));
			monthlyOEMrates.push(monthlyOEMrate);
			monthlyOEMrate = [];
		}
	}

	//printChart(monthlyOEMrates);
	return monthlyOEMrates;

}

function calculateOEMinterestLabel(oemRates){
	var interestLabel = []

	for(var i=0; i<oemRates.length; i++){
		interestLabel.push(oemRates[i].programDesc);
	}

	return interestLabel;

}

function drawOEMchart(primePrice, oemRates) {

	console.log("OEMRATES: " + oemRates.length);
	console.log("CASHRRATES: " +oemRates[1].length);
	//drawCashIncentivesTable(oemRates[1]);

  var rates = oemRates[0];
	var interestLabels = [];
	var termLength = [];

	//console.log('OEMRATELENGTH - DRAWOEM: ' + oemRates.length);

	termLength = calculateOEMtermLength(oemRates[0]);
	interestLabels = calculateOEMinterestLabel(oemRates[0]);

	var data = calculateOEMrates(primePrice, oemRates[0], termLength);

	$('#rates1').highcharts(
			{
				chart : {
					type : 'heatmap',
					marginTop : 40,
					marginBottom : 80
				},

				title : null,

				xAxis : {
					categories : termLength,
					title: {
						text: 'Term in Months'
					}
				},

				yAxis : {
					categories : interestLabels,
					title: {
						text: ' '
					}
				},

				colorAxis : {
					// min : 0,
					// stops: [
					// [0, '#fffbbc'],
					// [0.5, '#3060cf']
					// ],
					minColor : '#FFFFFF',
					maxColor : '#00688B'
				},

				legend : {
					align : 'right',
					layout : 'horizontal',
					margin : 0,
					verticalAlign : 'bottom',
					y : 25,
					symbolHeight : 50,
					enabled : false,
				},

				tooltip : {
					formatter : function() {
						var rate = "";
						for(i=0;i<rates.length;i++){
							//	console.log("WHATS WRONG HERE "+rates[i].programDesc);
							if(rates[i].programDesc == this.series.yAxis.categories[this.point.y]){
								for (var j=0; j<rates[i].incentiveRateList.length; j++){
									if(rates[i].incentiveRateList[j].to == this.series.xAxis.categories[this.point.x]){
											//console.log("THERE THERE: "+ rates[i].programDesc);
											rate = rates[i].incentiveRateList[j].interest;
									}
								}
							}
						}
						return '<b>'
								+ this.series.xAxis.categories[this.point.x] + " Months"
								+ '</b>  <br><b>' + "Total Cost: "+ this.point.value*parseInt(this.series.xAxis.categories[this.point.x], 10)
								+ '</b>  <br><b>'
								+ rate + "% Interest Rate"
								+ '</b>  <br><b>'
								+ "Program : " + this.series.yAxis.categories[this.point.y]
								+ '</b>';
					}
				},
				exporting:{
					enabled: false,
				},
				credits : {
					enabled : false
				},
				series : [ {
					name : 'Sales per employee',
					borderWidth : 1,
					data : data,
					dataLabels : {
						enabled : true,
						color : '#000000',
					}
				} ]

			});
}
