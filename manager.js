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
	    	"View Products for Sale",
			"View Low Inventory",
			"Add to Inventory",
			"Add New Product"
	    ]
	  }
	]).then(function(answers) {

		if (answers.command == "View Products for Sale") {
			showProducts();
		}
		else if (answers.command == "View Low Inventory") {
			lowInventory();
		}
		else if (answers.command == "Add to Inventory") {
			addInventory();
		}
		else if (answers.command == "Add New Product") {
			addProduct();
		}
		else {
			console.log("Please enter a proper command.");
			menu();
		}
	});
};

function showProducts() {

	var query = "SELECT * FROM products";

	connection.query(query, function(err, results) {
		if(err) throw err;
		for (var i=0;i<results.length;i++){
			console.log("Item ID: "+results[i].item_id+", Product Name: "+results[i].product_name+", Department: "+results[i].department_name+", Price: "+results[i].price+", Quantity: "+results[i].stock_quantity);
		};
		menu();
	});
};

function lowInventory() {

	var query = "SELECT * FROM products";

	connection.query(query, function(err, results) {
		if(err) throw err;
		console.log("---------------------------------------------------------------");
		console.log("Low Inventory: ");
		for (var i=0;i<results.length;i++){
			if (results[i].stock_quantity <= 5) {
				console.log("Item ID: "+results[i].item_id+", Product Name: "+results[i].product_name+", Department: "+results[i].department_name+", Price: "+results[i].price+", Quantity: "+results[i].stock_quantity);
			}
		};
		console.log("---------------------------------------------------------------");
		menu();
	});
};

function addInventory() {

	inquirer.prompt([
	  {
	    name: "id",
	    message: "What is the ID of the product you wish to add inventory?"
	  }, {
	  	name: "units",
	  	message: "How many units of this product would you like to add?"
	  }
	]).then(function(answers) {

		addInv(answers.id, answers.units);
	
	});
}

function addInv(id,units) {

	var query = "SELECT * FROM products";

	connection.query(query, function(err, results) {

		if(err) throw err;

		for (var i=0;i<results.length;i++){
			if (results[i].item_id == id) {
				var item = results[i].product_name;
				var unitsAdded = parseInt(results[i].stock_quantity) + parseInt(units);
				var query = "UPDATE products SET stock_quantity = "+unitsAdded+" WHERE item_id = "+id+";";
				connection.query(query, function(err, results) {
					if(err) throw err;
					console.log("---------------------------------------------------------------");
					console.log("You added "+units+" units to the "+item+" inventory.");
					console.log("---------------------------------------------------------------");
					menu();
				});
			}
		};
	});
}

function addProduct() {

	inquirer.prompt([
	  {
	    name: "name",
	    message: "What is the name of the product you wish to add?"
	  }, {
	  	name: "dept",
	  	message: "What is the name of the deptartment you wish to add it to?"
	  }, {
	  	name: "price",
	  	message: "What is the price of the product you wish to add?"
	  }, {
	  	name: "quantity",
	  	message: "How many units of this product would you like to add?"
	  }
	]).then(function(answers) {
		addProd(answers.name, answers.dept, answers.price, answers.quantity);
	});
};

function addProd(name,dept,price,quantity) {

	var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('"+name+"', '"+dept+"', "+price+", "+quantity+");";
	connection.query(query, function(err, results) {
		if(err) throw err;
		console.log("You added "+name+" to the product list.");
		menu();
	});
	
}