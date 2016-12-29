var express = require('express');
var router = express.Router();

router.route('/')
	.get(function(request, response) { //Serve get requests
		var data = request.body;
		var connection = request.app.locals.connection;

		selectRows(connection, function (rows, message){
			var res = {rows: [], message: ''};
			res.rows = rows;
			res.message = message;
			response.send(res);
		});
	})
	.post(function(request, response) { //Serve post requests
		var data = request.body;
		var connection = request.app.locals.connection;
		
		insertRows(connection, data, function (messageToSend) {
			response.send({message: messageToSend});
		});
	});

function insertRows(connection, data, callback) { //insert rows to table
	var sql = "INSERT INTO expenses SET ?";
	var error = false;
	for(var i = 0; i < data.length; i++) {
		connection.query(sql , data[i], function(err,rows){
			if(err) {
				error = true;
			}
		});
	}
	if(error == true) { 
		callback("There was an error adding the rows to DB");
	}
	else {
		callback("Successfully inserted rows");
	}
}

function selectRows(connection, callback) { //select rows from table
	connection.query("SELECT * FROM expenses", function(err, rows) {
        if (err) {
            callback([], err);
        } 
        else {
        	callback(rows, "Successfully retrieved data!");
        }
    });
}

module.exports = router;

