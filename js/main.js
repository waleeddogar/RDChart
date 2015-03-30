
function showChart(){


	var primePrice = document.getElementById("primeCost").value;
	document.getElementById("disappear").style.display = 'none';
	document.getElementById("disappear2").style.display = 'none';

  var OEMrates = [];
	console.log("1");
	var OEMrates = getIncentives($("#trim").val(), 'M1G3V4');
	console.log("3");
	console.log("OEM RATE LENGTH" +OEMrates.length);
	drawChart(primePrice-1750);
	drawOEMchart(primePrice-500, OEMrates);
	//drawCommissionChart(primePrice);
}
function getIncentives(styleId, postalCode){
	var incentivesData = [];
	console.log("2");
	jQuery.ajax({
			type: "POST",
			async: false,
			url: "php/getIncentives.php",
			data: {'styleId': styleId, 'postalCode': postalCode},
			success: function(response){
			// console.log(response);
				var data = JSON.parse(response);


				//console.log(data.model._);

				for(i=0; i< data.incentives.length; i++){
			//	console.log("2nd time" +data.incentives.length );
				if(data.incentives[i].categoryID == "101"){

					for(j=0;j<data.incentives[i].programValues.valueVariationList.length ;j++){
					//	console.log("j =" +data.incentives[i].programValues.valueVariationList.length);
						for(k=0;k<data.incentives[i].programValues.valueVariationList[j].programValueList.length;k++){
					//		console.log("k =" +data.incentives[i].programValues.valueVariationList[j].programValueList.length);

						//	console.log("l =" +data.incentives[i].programValues.valueVariationList[j].programValueList[k].termList.length);
							for(l=0;l<data.incentives[i].programValues.valueVariationList[j].programValueList[k].termList.length;l++){

							//	console.log("l =" +data.incentives[i].programValues.valueVariationList[j].programValueList[k].termList.length);
										var incentive = new Incentive();
										incentive.interest =data.incentives[i].programValues.valueVariationList[j].programValueList[k].termList[l].value;
								//		console.log(incentive.interest);
										incentive.to = data.incentives[i].programValues.valueVariationList[j].programValueList[k].termList[l].to;
									//	console.log(incentive.to);
										incentive.from = data.incentives[i].programValues.valueVariationList[j].programValueList[k].termList[l].from;
							//			console.log(incentive.from);
										incentive.financialDisclosure = data.incentives[i].programValues.valueVariationList[j].programValueList[k].termList[l].financialDisclosure;
								//		console.log(incentive.financialDisclosure);
										//adding the incentive obj to incentives array
										incentivesData.push(incentive);
							}
						}
					}
				}
			}
			console.log("FROM getIncentives"+incentivesData.length);
				//$("#primeCost").val(data.basePrice.msrp.high);
				//return incentivesData;
			},
		error: function (response){
			console.log(response);
		}
		});
		return incentivesData;
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
		console.log("OEM RATE: " + oemRates[i].interest + " TOTAL COST: " + monthlyOEMrate[2]);
		monthlyOEMrates.push(monthlyOEMrate);
		monthlyOEMrate = [];
	}

	return monthlyOEMrates;

}

function drawOEMchart(primePrice, oemRates) {
	var data = calculateOEMrates(primePrice, oemRates);

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

	/*$('#commission').highcharts(
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

			});*/
}


function getMakes(value){
	//var name = "_";
	$('#make').empty();
	jQuery.ajax({
			type: "POST",
			url: "php/getMakes.php",
			data: {'year': value},
			success: function(response){
				//console.log(response);
				var makes = JSON.parse(response);
				console.log(makes.division);
				for(i=0;i<makes.division.length;i++){
								var option = $('<option />');
								option.attr('value',makes.division[i].id ).text(makes.division[i]._);
								$('#make').append(option);

							}
			},
		error: function (response){
			console.log(response);
		}
		});
}

function getModels(makeId){
	$("#model").empty();
	jQuery.ajax({
			type: "POST",
			url: "php/getModels.php",
			data: {'year': $("#year").val() ,'make': makeId},
			success: function(response){
				console.log(response);
				var data = JSON.parse(response);
				//console.log(data.model._);
				for(i=0;i<data.model.length;i++){
								var option = $('<option />');
								option.attr('value',data.model[i].id ).text(data.model[i]._);
								$('#model').append(option);
							}
			},
		error: function (response){
			console.log(response);
		}
		});
}

function getTrims(modelId){
	$("#trim").empty();
	jQuery.ajax({
			type: "POST",
			url: "php/getTrims.php",
			data: {'modelId': modelId},
			success: function(response){
				console.log(response);
				var data = JSON.parse(response);
				//console.log(data.model._);
				for(i=0;i<data.style.length;i++){
								var option = $('<option />');
								option.attr('value',data.style[i].id ).text(data.style[i]._);
								$('#trim').append(option);
							}
			},
		error: function (response){
			console.log(response);
		}
		});
}

function getBasePrice(styleId){

	jQuery.ajax({
			type: "POST",
			url: "php/getBasePrice.php",
			data: {'styleId': styleId},
			success: function(response){
				console.log(response);
				var data = JSON.parse(response);
				//console.log(data.model._);

				$("#primeCost").val(data.basePrice.msrp.high);
				//getIncentives(styleId, 'M1G3B4');
			},
		error: function (response){
			console.log(response);
		}
		});
}
function Incentive (interest,to,from,disclosure) {
			this.interest = interest;
			this.to = to;
			this.from = from;
			this.disclosure = disclosure;
}
