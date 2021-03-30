

const MongoClient = require("mongodb").MongoClient;

const uri = "mongodb://dreamprod:dreamprod2020@kamino.mongodb.umbler.com:45200/dreamprod";
//const uri = "mongodb://next:Next2020@kamino.mongodb.umbler.com:46185/next";


var tryConnect = function( resolve ){

	MongoClient.connect( uri, (error,client)=>{

		if( error ){
			console.log( error );
			setTimeout( tryConnect, 1000 );
		}
		else{
			var db = client.db("dreamprod");
			resolve( db );
		}
	});
}

var getDao = function(){

	var promise = new Promise((resolve, reject) => {

		var connectionDB = global["mongodbconnection"];
		if( ! connectionDB ){
			MongoClient.connect( uri, { useUnifiedTopology: true}, ( error , client ) => {

				if( error ){
					console.log( error );	
					tryConnect( resolve );
				} 
				//else console.log("logou");

				var db = client.db("dreamprod");

				resolve(db);
			});
		}
		else{ 
			resolve( connectionDB );
		}
		
	}); // promise

	return promise;
};

module.exports = getDao;