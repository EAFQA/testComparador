

var constructor = function( request ){ 

	var entityname = null;
	var formdata = null; 
	var hasSource = false;
	var to =  {
		"type" : "edit",
		"formlink" : "/fragment/edit.html",
		"scriptList" : [
    	],
    	"formdata" : formdata
	}

	if( request && request.query && request.query.entity ){
		entityname = request.query.entity;
	}

	var promise = new Promise( function( resolve, reject ){
		if( entityname ){
			try{ 

				var source = require("../../src/strategies/crm/" + entityname);
				hasSource = true;

				source["loadFormData"]( request ).then( function(promiseResponse){
					formdata = promiseResponse;
					to["formdata"] = formdata;
					resolve( to );
				});
			}
			catch(e){
				console.log(" fonte não encontrado", e);
			}
		}

		if( ! hasSource ){
			to["formdata"] = formdata;
			resolve( to );
		}
	});

	return promise;
};

module.exports = constructor;