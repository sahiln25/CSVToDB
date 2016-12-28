var app = angular.module('expenseApp');

app.controller('expenseController', function($scope){

	$scope.expenseList = [];
	$scope.message = "Please select and submit a comma-delimited text file to add to database.";

	$scope.submitFile = function () { //Get the comma separated files from the uploaded file and parse them to a new expense object and add it to the view
		Papa.parse(document.getElementById('file').files[0], { 
			complete: function(results) {
				if(results.errors.length >= 1)
				{
					$scope.message = "There was an error processing your file. Please try again.";
				}
				else {
					for(var i = 1; i < results.data.length; i++) { //ignore header lines
						var newExpense = {date: '', category: '', employeeName: '', expenseDesc: '', preTaxAmount:-1, taxName: '', taxAmount: -1}

		 				newExpense.date = results.data[i][0];
		 				newExpense.category = results.data[i][1];
		 				newExpense.employeeName = results.data[i][2];
		 				newExpense.expenseDesc = results.data[i][3];
		 				newExpense.preTaxAmount = results.data[i][4];
		 				newExpense.taxName = results.data[i][5];
		 				newExpense.taxAmount = results.data[i][6];

		 				$scope.message = "Success!";
		 				$scope.expenseList.push(newExpense);
		 			}
		 		}
		 		$scope.$apply();
			}
		});
	}
});
