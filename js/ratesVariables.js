

var termLengths = [24, 36, 48, 60, 72];


// Legend = [interest rate, origination fee, cash bonus]
var fixedRatesLow = []; 				// Prime = $7,500 - $12,499
fixedRatesLow[0] = [5.99, 2.00, 0];
fixedRatesLow[1] = [6.99, 3.75, 0];

var fixedRatesMedLow = [];				// Prime = $12,500 - $19,999
fixedRatesMedLow[0] = [3.98, 0, 75];
fixedRatesMedLow[1] = [4.99, 1.75, 0];
fixedRatesMedLow[2] = [5.99, 2.00, 0];
fixedRatesMedLow[3] = [6.99, 3.75, 0];

var fixedRatesMed = [];					// Prime = $20,000 - $29,999
fixedRatesMed[0] = [3.98, 0, 75];
fixedRatesMed[1] = [4.99, 2.50, 0];
fixedRatesMed[2] = [5.99, 3.75, 0];
fixedRatesMed[3] = [6.24, 4.25, 0];

var fixedRatesMedHigh = [];				// Prime = $30,000 - $39,999
fixedRatesMedHigh[0] = [3.98, 0, 125];
fixedRatesMedHigh[1] = [4.99, 2.50, 0];
fixedRatesMedHigh[2] = [5.99, 3.75, 0];
fixedRatesMedHigh[3] = [6.24, 4.25, 0];

var fixedRatesHigh = [];					// Prime = $40,000 +
fixedRatesHigh[0] = [3.98, 0, 125];
fixedRatesHigh[1] = [4.99, 2.50, 0];
fixedRatesHigh[2] = [5.99, 4.00, 0];
fixedRatesHigh[3] = [6.24, 4.25, 0];

var HOC = [];
HOC[0] = [2.85, 0, 0];

var OEM = [];
OEM[0] = [5, 0, 125];
OEM[1] = [12, 5, 0];
OEM[2] = [19, 9, 0];
OEM[3] = [24, 15, 0];

function addTo(output, source) {
	var src = [];
	var out = [];

	out = output;
	src = source;

	for(var i=0; i < src.length; i++) {
		out.push(src[i]);
	}

}

function getRatesByPrice(primePrice) {

	var selectedRates = [];

	//fixedRatesLow		// Prime = $7,500 - $12,499
	//fixedRatesMedLow	// Prime = $12,500 - $19,999
	//fixedRatesMed		// Prime = $20,000 - $29,999
	//fixedRatesMedHigh	// Prime = $30,000 - $39,999
	//fixedRatesHigh	// Prime = $40,000 +

	if (primePrice <= 12499){ addTo(selectedRates,fixedRatesLow); };
	if (primePrice >= 12500 && primePrice < 19999) { addTo(selectedRates,fixedRatesMedLow); };
	if (primePrice >= 20000 && primePrice < 29999) { addTo(selectedRates,fixedRatesMed); };
	if (primePrice >= 30000 && primePrice < 39999) { addTo(selectedRates,fixedRatesMedHigh); };
	if (primePrice >= 40000) { addTo(selectedRates,fixedRatesHigh); };

	//addTo(selectedRates, HOC);

	//addTo(selectedRates, OEM);

	console.log(selectedRates.toString());

	return selectedRates;
}


function calcMonthlyRate(prime, interest, terms) {

	var modInterest = 0.01*interest[0]/12;
	var monthlyAmount = (prime * modInterest) / (1 - Math.pow(1 + modInterest, -terms));

	//console.log(prime);
	//console.log(interest);
	//console.log(terms);
	//console.log(monthlyAmount);
	//console.log('\n');

	return monthlyAmount;
}

function calcOemMonthlyRate(prime, interest, terms) {
	var monthlyAmount;

	if (interest != 0){
		console.log("SHIT IS NOT 0");
		var modInterest = 0.01*interest/12;
		monthlyAmount = (prime * modInterest) / (1 - Math.pow(1 + modInterest, -terms));

	}
	else {
		console.log("SHIT IS 0");
		monthlyAmount = prime/terms;

	}


	//console.log(prime);
	//console.log(interest);
	//console.log(terms);
	//console.log(monthlyAmount);
	//console.log('\n');

	return monthlyAmount;
}


function calcBiMonthlyRate(prime, interest, terms) {
	var modInterest = 0.01*interest[0]/24;
	var biMonthlyAmount = (prime * modInterest) / (1 - Math.pow(1 + modInterest, -2*terms));

	return biMonthlyAmount;
}
