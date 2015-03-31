
function showChart(){


	var primePrice = document.getElementById("primeCost").value;
	document.getElementById("disappear").style.display = 'none';
	document.getElementById("disappear2").style.display = 'none';

  // var OEMrates = [];
	 var incentiveData = getIncentives($("#trim").val(), 'M1G3V4');
	//var OEMrates = getIncentives("369453", 'M1G3V4');
	console.log("OEM RATE LENGTH" +incentiveData.length);
	//drawChart(primePrice-1750);
//	drawChart(primePrice);
	//drawOEMchart(primePrice-500, OEMrates);
//	drawOEMchart(primePrice, OEMrates);
	//drawCommissionChart(primePrice);
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
	printChart(dealerCommisionChart);
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
		//	console.log(chart[j][i]);
		}
		console.log('\n');
	}
}

// oemRates comes by [(interest, to, from, disclosure)*n]
function calculateOEMrates(primePrice, oemRates) {
	var monthlyOEMrates = [];
	var monthlyOEMrate = [];

	for (var i=0; i<oemRates.length; i++){
		monthlyOEMrate.push(i);
		monthlyOEMrate.push(0);
		monthlyOEMrate.push(Math.round(calcOemMonthlyRate(primePrice, oemRates[i].interest, oemRates[i].to)));
		//console.log("OEM RATE: " + oemRates[i].interest + " TOTAL COST: " + monthlyOEMrate[2]);
		//console.log("Prog Desc: " + oemRates[i].programDesc);
		monthlyOEMrates.push(monthlyOEMrate);
		monthlyOEMrate = [];
	}

	return monthlyOEMrates;

}

function drawOEMchart(primePrice, oemRates) {
	var data = calculateOEMrates(primePrice, oemRates);
 var rates = oemRates;
	var xaxis = ['OEM RATES'];
	var termLength = [];

	for (var i=0; i<oemRates.length; i++){
		termLength.push(oemRates[i].to);
	}

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
					categories : xaxis,
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
						var programDesc = " ";
						var rate = "";
						for(i=0;i<rates.length;i++){
						//	console.log("WHATS WRONG HERE "+rates[i].programDesc);
								if(rates[i].to == this.series.xAxis.categories[this.point.x]){
								//	console.log("THERE THERE: "+rates[i].programDesc);
									programDesc = rates[i].programDesc;
									rate = rates[i].interest;
								}
						}
						return '<b>'
								+ this.series.xAxis.categories[this.point.x] + " Months"
								+ '</b>  <br><b>' + "Total Cost: "+ this.point.value*parseInt(this.series.xAxis.categories[this.point.x], 10)
								+ '</b>  <br><b>'
								+ rate + "% Interest Rate"
								+ '</b>  <br><b>'
								+ "Program : " + programDesc
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
