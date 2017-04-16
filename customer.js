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
	showProducts();
});

function showProducts() {

	var query = "SELECT * FROM products";

	connection.query(query, function(err, results) {

		if(err) throw err;
		
		for (var i=0;i<results.length;i++){
			console.log("Item ID: "+results[i].item_id+", Product Name: "+results[i].product_name+", Department: "+results[i].department_name+", Price: "+results[i].price);
		};
		console.log("-------------------------------------------------");
		
		inquirer.prompt([
		  {
		    name: "id",
		    message: "What is the ID of the product you wish to purchase?"
		  }, {
		  	name: "units",
		  	message: "How many units of this product would you like to purchase?"
		  }
		]).then(function(answers) {

			run(answers.id, answers.units);
		
		});

	});

};

function run(id,units) {

	var query = "SELECT * FROM products";

	connection.query(query, function(err, results) {

		if(err) throw err;
		
		for (var i=0;i<results.length;i++){
			if (results[i].item_id == id) {
				var item = results[i].product_name;
				var sales = results[i].product_sales;
				var price = results[i].price;
				var cost = results[i].cost;
				var dept = results[i].department_name;
				var unitsLeft = results[i].stock_quantity - units;
				if (unitsLeft >= 0) {
					console.log("---------------------------------------------------------------");
					var query = "UPDATE products SET stock_quantity = "+unitsLeft+", product_sales = "+((price*units)+sales)+" WHERE item_id = "+id+";";
					connection.query(query, function(err, results) {
						if(err) throw err;
						var query = "SELECT * FROM departments";
						connection.query(query, function(err, results) {
							if(err) throw err;
							for (var i=0;i<results.length;i++){
								if (results[i].department_name == dept) {
									var totalSales = parseInt(results[i].total_sales);
									var totalCost = parseInt(results[i].over_head_costs);
									var totalProfit = parseInt(results[i].total_profit);
									var query = "UPDATE departments SET total_sales = "+(totalSales+(price*units))+", total_profit = "+((totalSales+(price*units))-totalCost)+" WHERE department_name = '"+dept+"';";
									connection.query(query, function(err, results) {
										if(err) throw err;
										console.log("Congratulations! You purchased a "+item+" for $"+(price*units)+"!");
										console.log("---------------------------------------------------------------");
										showProducts();
									});
								}
							}
						});
					});
				}
				else {
					console.log("---------------------------------------------------------------");
					console.log("Insufficent Quantity!");
					console.log("---------------------------------------------------------------");
					showProducts();
				}
			}
		};
	});
};