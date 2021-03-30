

var fs = require('fs'); 
var mustache = require('mustache');


var init = function( app ){
	
	app.get("/", function( request, response ){

		var path    = require("path");
		
		var replace = { "name"  : "example" };

		console.log("path", path );
		console.log("");
		console.log("__dirname", __dirname );

		var page = fs.readFileSync( path.join(__dirname+'/views/inicial.html') , "utf8");
		
		var html = mustache.to_html(page, replace); 
		response.send(html);

	});

};

module.exports = init;