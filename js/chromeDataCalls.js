function Incentive (interest,to,from,disclosure,programDesc) {
			this.interest = interest;
			this.to = to;
			this.from = from;
			this.disclosure = disclosure;
			this.programDesc = programDesc;
}

function getIncentives(styleId, postalCode){
  var incentivesData = [];
  var data = [];
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
					if(data.incentives[i].categoryID == "101"){
						for(j=0;j<data.incentives[i].programValues.valueVariationList.length ;j++){
							for(k=0;k<data.incentives[i].programValues.valueVariationList[j].programValueList.length;k++){
								for(l=0;l<data.incentives[i].programValues.valueVariationList[j].programValueList[k].termList.length;l++){
									var incentive = new Incentive();
										incentive.interest =data.incentives[i].programValues.valueVariationList[j].programValueList[k].termList[l].value;
										incentive.to = data.incentives[i].programValues.valueVariationList[j].programValueList[k].termList[l].to;
										incentive.from = data.incentives[i].programValues.valueVariationList[j].programValueList[k].termList[l].from;
										incentive.financialDisclosure = data.incentives[i].programValues.valueVariationList[j].programValueList[k].termList[l].financialDisclosure;incentive.programDesc = data.incentives[i].programDescription;
										incentivesData.push(incentive);
								}
							}
						}
					}
				}
			},
			error: function (response){
				console.log(response);
			}
		});
		return incentivesData;
}

function getMakes(value){
	//var name = "_";
	$('#make').empty();
	$('#make').append($('<option />').attr('value',"").text("Select make"));
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
	$('#model').append($('<option />').attr('value',"").text("Select model"));
	jQuery.ajax({
			type: "POST",
			url: "php/getModels.php",
			data: {'year': $("#year").val() ,'make': makeId},
			success: function(response){
				console.log(response);
				var data = JSON.parse(response);
				//console.log(data.model._);
				if (data instanceof Array) {
					for(i=0;i<data.model.length;i++){
									var option = $('<option />');
									option.attr('value',data.model[i].id ).text(data.model[i]._);
									$('#model').append(option);
								}
				} else {
					var option = $('<option />');
					option.attr('value',data.model.id ).text(data.model._);
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
	$('#trim').append($('<option />').attr('value',"").text("Select trim"));
  jQuery.ajax({
    type: "POST",
    url: "php/getTrims.php",
    data: {'modelId': modelId},
    success: function(response){
      console.log(response);
      var data = JSON.parse(response);
      //console.log(data.model._);
			if (data instanceof Array) {
				for(i=0;i<data.style.length;i++){
	        var option = $('<option />');
	        option.attr('value',data.style[i].id ).text(data.style[i]._);
	        $('#trim').append(option);
	      }
			} else {
				var option = $('<option />');
				option.attr('value',data.style.id ).text(data.style._);
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
