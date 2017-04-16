var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user:'root',

	password:'',
	database:'Bamazon'
});
connection.connect(function(err){
	if(err) throw err;
	console.log("connected as id "+ connection.threadId);
	console.log("-------------------------------------------------");
	menu();
});

function menu() {

	inquirer.prompt([
	  {
	  	type: "list",
	    name: "command",
	    message: "What would you like to do?",
	    choices: [
	    	"View Product Sales by Department",
			"Create New Department"
	    ]
	  }
	]).then(function(answers) {

		if (answers.command == "View Product Sales by Department") {
			viewDepartments();
		}
		else if (answers.command == "Create New Department") {
			createDept();
		}
		else {
			console.log("Please enter a proper command.");
			menu();
		}
	});
};

function viewDepartments() {

	var query = "SELECT * FROM departments";

	connection.query(query, function(err, results) {

		if(err) throw err;
		
		for (var i=0;i<results.length;i++){
			console.log("Department ID: "+results[i].department_id+", Department Name: "+results[i].department_name+", Over Head Costs: "+results[i].over_head_costs+", Total Sales: "+results[i].total_sales+", Total Profit: "+results[i].total_profit);
		};
		console.log("-------------------------------------------------");
		menu();
	});
}

function createDept(){

	inquirer.prompt([
	  {
	    name: "dept",
	    message: "What is the name of the department you wish to add?"
	  }
	]).then(function(answers) {
		createDepartment(answers.dept);
	});

}

function createDepartment(dept) {

	var query = "SELECT * FROM departments";

	connection.query(query, function(err, results) {
		if(err) throw err;
		var query = "INSERT INTO departments (department_name, over_head_costs, total_sales, total_profit) VALUES ('"+dept+"', 0, 0, 0);";
		connection.query(query, function(err, results) {
			if(err) throw err;
			console.log("You added "+dept+" to the department list.");
			menu();
		});
	});
}