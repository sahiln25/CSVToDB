var app = angular.module('expenseApp');

app.controller('expenseController', function($scope, $http){

	$scope.expenseList = [];
	$scope.message = "Please select and submit a comma-delimited text file to add to database.";

	updateExpenses(); //Get whatever we have from DB to be displayed by default

	$scope.submitFile = function () { //Get the comma separated files from the uploaded file and parse them to a new expense object and add it to the view
		if(document.getElementById('file').files[0] == undefined) { $scope.message = "You must select a file."; }
		else {
			Papa.parse(document.getElementById('file').files[0], { 
				complete: function(results) {
					if(results.errors.length >= 1)
					{
						$scope.message = "There was an error processing your file. Please try again.";
					}
					else {
						
						var tempExpenseList = [];
						for(var i = 1; i < results.data.length; i++) { //ignore header line
							var newExpense = {date: new Date(), category: '', employeeName: '', expenseDesc: '', preTaxAmount:-1, taxName: '', taxAmount: -1}

			 				tempDate = new Date(results.data[i][0]);

			 				tempDate = moment(tempDate).format('YYYY-MM-DD hh:mm:ss');
			 				newExpense.date = tempDate;
			 				newExpense.category = results.data[i][1];
			 				newExpense.employeeName = results.data[i][2];
			 				newExpense.employeeAddress = results.data[i][3]
			 				newExpense.expenseDesc = results.data[i][4];
			 				newExpense.preTaxAmount = results.data[i][5].trim().replace(',', '');
			 				newExpense.taxName = results.data[i][6];
			 				newExpense.taxAmount = results.data[i][7].trim().replace(',', '');

			 				tempExpenseList.push(newExpense);
			 			}

			 			//Send the expense list server side to be added to DB and print the message
			 			sendExpenses(tempExpenseList, function (message){
							$scope.message = message;
						});

						updateExpenses(); //Update our expense list and the table shown
			 		}
				}
			});
		}
	}

	function sendExpenses(expenseList, callback) { //Sends an expense list to be added to DB
		$http
			.post('/expense', JSON.stringify(expenseList))
			.success(function(data){
				callback(data.message);
			})
			.error(function(data){
				callback(data.message);
		});
	}

	function updateExpenses() { //Retrieves expense from server (DB) and updates the scope expenseList
		getExpensesFromServer(function(expenses) {				
			for(var i = 0; i < expenses.length; i++) {
				expenses[i].date = expenses[i].date.substring(0, 10); //So that we have proper date for displaying
			}
			$scope.expenseList = expenses;
		});
	}

	function getExpensesFromServer(callback) { //Call get method on server to retrieve expenselist
		$http
			.get('/expense')
			.success(function(data){
				callback(data.rows);
			})
			.error(function(data){
				callback(data.rows);
		});
	}
});
