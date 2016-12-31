This application uses an Angular front end which makes calls to a NodeJS RESTful API. The NodeJS API interacts with a MySQL database and supports a POST operation to add an expense object to the database and GET operation to retrieve the list of expenses.

To run this application, you must install NodeJS found at:
https://nodejs.org/en/ (tested with MacOS v6.9.2).

MySQL server is also needed which can be found at:
http://dev.mysql.com/downloads/ (tested with MySQL Community Server v5.7.17)

Start the MySQL server (can be done in System preferences -> MySQL if you're on Mac)

A database for the application must be created in the MySQL database and the credentials must be put in the config.js file in the root directory.

You should create a table that looks like the one below in your database (this can be done manually or by executing the SQL script 'expensesDB.sql' found in the root directory of this challenge. It will import the database and expense table with all the columns as specified below):

```
Name of Table: expenses
Columns:
+-----------------+---------------+------+-----+---------+----------------+
| Field           | Type          | Null | Key | Default | Extra          |
+-----------------+---------------+------+-----+---------+----------------+
| expense_id      | int(11)       | NO   | PRI | NULL    | auto_increment |
| date            | datetime      | NO   |     | NULL    |                |
| category        | varchar(45)   | YES  |     | NULL    |                |
| employeeName    | varchar(45)   | YES  |     | NULL    |                |
| employeeAddress | varchar(100)  | YES  |     | NULL    |                |
| expenseDesc     | varchar(45)   | YES  |     | NULL    |                |
| preTaxAmount    | decimal(45,2) | NO   |     | NULL    |                |
| taxName         | varchar(45)   | YES  |     | NULL    |                |
| taxAmount       | decimal(45,2) | NO   |     | NULL    |                |
+-----------------+---------------+------+-----+---------+----------------+
```

Once the database is running, you will need to run the Node server. If Node JS has been install, you can go the root directory of the application in your terminal and use the following command to run the server:

```
node ./bin/www
```

An output saying "You are connected..." should appear in your console meaning that the database connection was successful. From here you, can go to localhost:3000 to start the app and upload your CSV file to calculate your monthly expenses.
