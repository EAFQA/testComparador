

var constructor = function(){

	var promise = new Promise( function( resolve, reject){

		resolve({
			"type" : "list",
			"scriptList" : [
				"js/crm/fragment/list.js"
			]
		})
	});

	return promise;
	
};

module.exports = constructor;