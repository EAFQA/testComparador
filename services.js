

const ObjectId = require('mongodb').ObjectID;
const url = require("url");
var fs = require('fs'); 
var mustache = require('mustache');
var multer  = require('multer');
var upload = multer({ dest: './static/img/uploads/' })

var init = function( app, passport ){
	
	app.get("/services/:entityname", function(request, response){
				
		response.setHeader('Access-Control-Allow-Origin', '*');

		var entityname = request.params.entityname;
		var criteria = {};//url.parse(request.url,true).query;
		if( ! criteria ) criteria = {};

		require("./src/dao/daoFactory")().then(function(db){

			if( request.query.sort ){

				var orderable = { "temperaturestatus" : -1 };

				db.collection(entityname).find( criteria ).sort( orderable ).toArray( ( error, results ) => {
					response.send( results );
				});
			}
			else{
				db.collection(entityname).find( criteria ).toArray( ( error, results ) => {
					response.send( results );
				});
			}
			

		});
		
	});

	app.get("/services/:entityname/:entityid", function(request, response){
				
		response.setHeader('Access-Control-Allow-Origin', '*');
		var entityname = request.params.entityname;
		var entityid = request.params.entityid;
		
		require("./src/dao/daoFactory")().then(function(db){

			db.collection(entityname).findOne({ "_id" : ObjectId(entityid) }, ( error, to ) => {
				response.send( to );	
			});
			
		});
		
	});

	app.post("/services/:entityname", function(request, response){
				
		response.setHeader('Access-Control-Allow-Origin', '*');
		var entityname = request.params.entityname;

		require("./src/dao/daoFactory")().then(function(db){

			var to = request.body;

			try{
				if( to["_id"] ) to["_id"] = ObjectId( to["_id"] );
				
				var promise = require("./src/context/context").beforeSave( to, entityname, request );

				if( promise ){
					promise.then( function(beforeTo){
						to = beforeTo;

						db.collection( entityname ).save( to, ( error, result ) =>{

							var promise = require("./src/context/context").afterSave( null, to, entityname );
							if( promise ){
								promise.then(function(){
									response.send( to );
								});
							}
							else{
								response.send( to );
							}
							
						});
					});
				}
				else{
					db.collection( entityname ).save( to, ( error, result ) =>{

						var promise = require("./src/context/context").afterSave( null, to, entityname );
						if( promise ){
							promise.then(function(){
								response.send( to );
							});
						}
						else{
							response.send( to );
						}
						
					});
				}// else
				
			}
			catch(e){

				db.collection( entityname ).save( to, ( error, result ) =>{

					try{
						var promise = require("./src/context/context").afterSave( null, to, entityname );
						if( promise ){
							promise.then(function(){
								response.send( to );
							});
						}
						else{
							response.send( to );
						}
					}
					catch(internalError){
						response.send( to );
					}
					
					
				}); //collection
				
			} //catch
			

		});

	});

	app.post("/services/:entityname/:entityid", function(request, response){
		
		response.setHeader('Access-Control-Allow-Origin', '*');
		var entityname = request.params.entityname;
		var entityid = request.params.entityid;

		require("./src/dao/daoFactory")().then(function(db){

			var to = request.body;
			var storeId = to["_id"];

			delete to["_id"];

			db.collection( entityname ).findOne({ "_id" : ObjectId(entityid) }, ( error, oldTo ) => {

				try{
					if( to["_id"] ) to["_id"] = ObjectId( to["_id"] );
					
					var beforeSavePromise = require("./src/context/context").beforeSave( to, entityname, request );
					if( beforeSavePromise ){

						beforeSavePromise.then(function( beforeTo){

							to = beforeTo;
							
							var updateDoc = {
								"$set" : to
							};

							db.collection( entityname ).updateOne( { "_id" : ObjectId(entityid) }, updateDoc  , ( error, result ) =>{

								to["_id"] = storeId;

								require("./src/context/context").afterSave( oldTo, to, entityname );
								response.send( to );
							});
						});
					}
					else{
						var updateDoc = {
							"$set" : to
						};

						db.collection( entityname ).updateOne( { "_id" : ObjectId(entityid) }, updateDoc  , ( error, result ) =>{

							to["_id"] = storeId;

							require("./src/context/context").afterSave( oldTo, to, entityname );
							response.send( to );
						});
					}// else
				}	
				catch(e){

					try{
						var updateDoc = {
							"$set" : to
						};

						db.collection( entityname ).updateOne( { "_id" : ObjectId(entityid) }, updateDoc  , ( error, result ) =>{

							to["_id"] = storeId;

							require("./src/context/context").afterSave( oldTo, to, entityname );
							response.send( to );
						});
					}
					catch(e){
						response.send( to );
					}
				}
				
			});// findOne

		});// requireDao
	});

	app.delete("/services/:entityname/:entityid", function(request, response){ 
		
		response.setHeader('Access-Control-Allow-Origin', '*');
		
		var entityname = request.params.entityname;
		var entityid = request.params.entityid;
		
		require("./src/dao/daoFactory")().then(function(db){

			db.collection(entityname).deleteOne({ "_id" : ObjectId(entityid) }, ( error, to ) => {
				response.send( true );	
			});
			
		});
	});

	/* Login */

	/*
	app.post("/auth", passport.authenticate('local'), function(request, response){
			

		if( request.user ){
			request.session.user = request.user;
			response.redirect("/render/inicio/index");
		}
		else{
			response.redirect("/?fail=true");
		}
	});
	*/

	app.get("/render/:folder/:pagename", function( request, response ){

		var path    = require("path");
		var folder = request.params.folder;
		var pagename = request.params.pagename;
		var hasSource = false;
		var hasPageSource = false;
		

		var filePath = '/views/' + folder + '/' + pagename + '.html';
		var page = fs.readFileSync( path.join(__dirname+ filePath) , "utf8");
		var replace = {};

	//	var html = mustache.render(page); 

		response.send( page );
	
	});

	app.get("/mustache/:folder/:pagename", function( request, response ){

		var path    = require("path");
		var folder = request.params.folder;
		var pagename = request.params.pagename;
		var hasSource = false;
		var hasPageSource = false;
		

		var filePath = '/views/' + folder + '/' + pagename + '.html';
		var page = fs.readFileSync( path.join(__dirname+ filePath) , "utf8");
		var replace = {};

		// mercado pago
		replace["basic"] = global.mercadopago.basic;

		var html = mustache.render(page, replace); 

		response.send( html );
	
	});

	var callbackResponse = function( folder, pagename, response, to ){

		var path    = require("path");

			if( ! to ) to = {};

			var filePath = '/views/' + folder + '/' + pagename + '.html';
			var page = fs.readFileSync( path.join(__dirname+ filePath) , "utf8");
			var replace = {};

			var html = page; //mustache.render(page); 

			to["html"] = html;
			response.send( to );
	};


	var entityDataFn = function( request, hasSource, to, folder, pagename, response ){

		if( request && request.query && request.query.entity ){
			var entitydata = null;
			var entityname = request.query.entity;
			var foldername = request.params.folder;

			if( to && to["type"] == "edit" ){

				callbackResponse( folder, pagename, response, to  );
				return;
			}

			try{
				var sourceEntity = require("./src/strategies/" + foldername + "/" + entityname);
				
				if( sourceEntity ){
					hasSource = true;
					sourceEntity.loadTable( request, request.query.sort ).then(function(responsePromise){ 

						entitydata = responsePromise;
						if( ! to ) to = {};

						to["entitydata"] = entitydata;

						if( request.query.path ){
							to["entitydata"]["title"] = "Registro de atividades";
							to["entitydata"]["path"] = "Cadastros > Registro de atividades > ";
							to["entitydata"]["showbutton"] = false;

							to["entitydata"]["anotheredit"] = "/pages/fragment/edit?entity=crc_leads&formback=anotherform"
						}


						callbackResponse( folder, pagename, response, to  );
					});
				}
			}
			catch( e ){ 

				console.log("erro ");
				console.log( e );

				console.log("-------");
				entitydata = {};
				if( ! to ) to = {};

				to["entitydata"] = entitydata;

				callbackResponse( folder, pagename, response, to );
			}

			
		}
		else{
			if( ! hasSource ) callbackResponse( folder, pagename, response, to );
		}

	};
	// end method
	
	/* URL's */
	app.get("/pages/:folder/:pagename", function( request, response ){

		var path    = require("path");
		var folder = request.params.folder;
		var pagename = request.params.pagename;
		var hasSource = false;
		var hasPageSource = false;
		var to = null;

		
		try{
			var sourcePage = require("./src/" + folder + "/" + pagename );
			sourcePage( request ).then( function( sourcePageResponse ){

				hasPageSource = true;
				
				to = sourcePageResponse; 
				entityDataFn( request, hasSource, to, folder, pagename, response ); 

				if( ! hasPageSource ){ 
					entityDataFn( request, hasSource, to, folder, pagename, response );
				}

			});
		}
		catch(e){
			console.log("catch");
			console.log(e);
			console.log("-------");
			to = {};

			if( ! hasPageSource ){ 
				entityDataFn( request, hasSource, to, folder, pagename, response );
			}
		}


		
	});

	/*
	app.get("//", function( request, response ){

		var path    = require("path"); 
		
		var replace = { "name"  : "example" };
		//var page = fs.readFileSync( path.join(__dirname+'/views/index.html') , "utf8");
		var page = fs.readFileSync( path.join(__dirname+'/views/index.html') , "utf8");

		var html = mustache.render(page, replace); 

		response.redirect("/render/dream/admin");
		//response.send(html);
	}); */

	app.post("/upload", upload.single('file'),  function( request, response, next ){

		response.send( request.file );
	});

	var updatePrazoAfterSave = function( newTo ){

		var promise = new Promise( function(resolve){
			require("./src/strategies/dream/dream_credit")["afterSave"](null, newTo, "dream_credit" ).then(function(db){
				resolve();
			});
		});

		return promise;
	};

	var updatePrazo = async function( results, db ){

		for( var i = 0; i < results.length; i++ ){

			/*
			if( results[i]["categoryid"] ) results[i]["categoryid"] = "" + results[i]["categoryid"];

			
			var updateDoc = {
				"$set" : results[i]
			};

			db.collection( "dream_paymentconditions" ).updateOne( { "_id" : results[i]["_id"] }, updateDoc  , ( error, result ) =>{
				console.log("update " + i + " de " + results.length );
			}); */
			
			await updatePrazoAfterSave( results[i] );
		}
	}

	app.get("/updateprazos", function( request, response ){

		require("./src/dao/daoFactory")().then(function(db){

			db.collection("dream_credit").find( {} ).toArray( ( error, results ) => {

				updatePrazo( results,db );	
				response.send( results );
			});
		});
	});

	app.get("/painel", function( request, response ){
		response.redirect("/render/dream/login");
	});

	app.post("/auth", passport.authenticate('local'), function(request, response){
			
		if( request.user && request.user.error ){

			console.log("request error", request.error );
			console.log("user error", request.user.error );

			var url = "/render/dream/login?fail=true";
			var message = request.user.error.message;

			url = url + "&message=" + message;

			response.redirect( url );
		}
		else if( request.user ){
			request.session.user = request.user;
			response.redirect("/render/dream/admin");
		}

	});
	
	app.get("/logout", function( request, response ){

		console.log("before", request.session );

		console.log("----")
		request.session.user = null;
		//delete request.session

		console.log("session", request.session );

		response.redirect("/render/dream/login");
	});

	app.get("/loggeduser", function(request,response){

		var user = null;
		if( request && request.session.user ){
			user = request.session.user;
			user["password"] = "";
		}

		response.send( user );
	});

	app.get("/consultor/:consultorname", function( request, response ){

		var path    = require("path"); 
		
		var replace = { "name"  : "example" };
		//var page = fs.readFileSync( path.join(__dirname+'/views/index.html') , "utf8");
		var page = fs.readFileSync( path.join(__dirname+'/static/consultor.html') , "utf8");

		//var html = mustache.render(page, replace); 

		//response.redirect("/render/dream/admin");
		response.send( page );
	});
};


module.exports["init"] = init;