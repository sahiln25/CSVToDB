var app = angular.module('expenseApp');

app.controller('expenseController', function($scope, $http){

	$scope.expenseList = [];
	$scope.message = "Please select and submit a comma-delimited text file to add to database.";
	$scope.monthlyExpenseList = [];

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
			for(var i = 0; i < expenses.length; i++) { //do a little formatting
				expenses[i].date = moment(expenses[i].date).format('YYYY-MM-DD');
				expenses[i].preTaxAmount = parseFloat(expenses[i].preTaxAmount).toFixed(2); //2 decimal points
				expenses[i].taxAmount = parseFloat(expenses[i].taxAmount).toFixed(2); //2 decimal points	 
			}
			$scope.expenseList = expenses;
			generateMonthlyExpenses();
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

	function generateMonthlyExpenses() {
		var expenses = $scope.expenseList;
		var monthExpenseList = []
		for(var i = 0; i < expenses.length; i++) {
			var monthYearDate = '' + (moment(expenses[i].date).year() +''+ moment(expenses[i].date).month()); //This will be our key for our array so we have expenses per month per year
			if(monthExpenseList[monthYearDate] != undefined) { //if we already have the month year combo, just add to the totals
				monthExpenseList[monthYearDate].preTaxTotal = parseFloat(monthExpenseList[monthYearDate].preTaxTotal) + parseFloat(expenses[i].preTaxAmount);
				monthExpenseList[monthYearDate].taxTotal = parseFloat(monthExpenseList[monthYearDate].taxTotal) + parseFloat(expenses[i].taxAmount);
				monthExpenseList[monthYearDate].total = parseFloat(monthExpenseList[monthYearDate].total) + (parseFloat(expenses[i].preTaxAmount)+ parseFloat(expenses[i].taxAmount));
			}
			else { //otherwise create an entry for that month year combo
				monthExpenseList[monthYearDate] = {monthYear: (moment(expenses[i].date).format("MMM") + ' ' +moment(expenses[i].date).year()), preTaxTotal: parseFloat(expenses[i].preTaxAmount), taxTotal: parseFloat(expenses[i].taxAmount), total: (parseFloat(expenses[i].preTaxAmount)+parseFloat(expenses[i].taxAmount))}
			}
		}

		for(var i in monthExpenseList) { //Add Rows to the scope monthlyExpenseList to be displayed and format to 2 decimal points
			monthExpenseList[i].preTaxTotal = monthExpenseList[i].preTaxTotal.toFixed(2);
			monthExpenseList[i].taxTotal = monthExpenseList[i].taxTotal.toFixed(2);
			monthExpenseList[i].total = monthExpenseList[i].total.toFixed(2); 
			$scope.monthlyExpenseList.push(monthExpenseList[i]);
		}
	}
});
