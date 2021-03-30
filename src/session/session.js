

var putOnSession = function( sessionId, session, objectTo, key ){

	var userContent = session[ sessionId ];

	if( ! userContent ) userContent = {};

	userContent[ key ] = objectTo;
	session[ sessionId ] = userContent;
};

var getInSession = function( sessionId, session, key ){

	var userContent = session[ sessionId ];

	if( ! userContent ) return null;

	return userContent[ key ];
};

var init = function( app ){
	
	
	app.get("/session/list/:parameterkey", function(request, response){

		response.setHeader('Access-Control-Allow-Origin', '*');	

		var content = getInSession( request.sessionID, request.session, request.params.parameterkey );
		response.send( content );	
	});

	app.post("/session/list/:parameterkey", function(request, response){

		response.setHeader('Access-Control-Allow-Origin', '*');	
		putOnSession( request.sessionID, request.session, request.body.list, request.params.parameterkey );

		response.send("OK");	
	});

	app.get("/session/map/:parameterkey", function(request, response){
		response.setHeader('Access-Control-Allow-Origin', '*');		

		var content = getInSession( request.sessionID, request.session, request.params.parameterkey );
		response.send( content );
	});

	app.post("/session/map/:parameterkey", function(request, response){
		
		response.setHeader('Access-Control-Allow-Origin', '*');	
		putOnSession( request.sessionID, request.session, request.body.map, request.params.parameterkey );

		response.send("OK");
	});

	app.delete("/session", function(request, response){

		response.setHeader('Access-Control-Allow-Origin', '*');	

		var sessionid = request.sessionID;
		request.session[ sessionid ] = {};

		response.send("OK");		
	});

};

module.exports = init;