

var ObjectId = require('mongodb').ObjectID;
const moment = require("moment-timezone");

var getLeadStatus = function(){

    var promise = new Promise(function(resolve){

        require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("dream_leadstatus").find( {} ).toArray( ( error, results ) => {

                        for(var i = 0; i < results.length; i++ ){
                            if( ! results[i]["id"] ) results[i]["id"] = results[i]["_id"]

                            results[i]["value"] = results[i]["name"];
                        }
                      
                        resolve( results );
                    });
                    //resolve( table );						
				});
    });


    return promise;
    
}

var getCategories = function(){

    var promise = new Promise(function(resolve){

        require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("dream_category").find( {} ).toArray( ( error, results ) => {

                        for(var i = 0; i < results.length; i++ ){
                            if( results[i]["id"] ) results[i]["id"] = results[i]["_id"]

                            results[i]["value"] = results[i]["name"];
                        }
                      
                        resolve( results );
                    });
                    //resolve( table );						
				});
    });


    return promise;
    
}

var saveHistoric = function( leadid, userid, username, text ){

	var to = {
		"leadid" : leadid,
		"userid" : userid,
		"username" : username,
		"message" : text,
		"created" : new Date()
	};

	require("../../../src/dao/daoFactory")().then(function(db){
		db.collection( "dream_leadhistoric" ).save( to, ( error, result ) =>{

		});
	});
};

var createHistoric = function( newLead, request ){

	// data de retorno
	// status do lead
	// observações

	var leadid = newLead["_id"];
	var userid = request.session.user._id;
	var username = request.session.user.name;

	require("../../../src/dao/daoFactory")().then(function(db){

		db.collection("dream_lead").findOne( { "_id" : newLead["_id"] } ).then( function( oldLead ){

			//returndate
			//leadstatus 
			//observations
			var text = "";

			if( oldLead["returndate"] != newLead["returndate"] ){
				text += " Data do retorno: {olddate} - para {newdate} ";// + oldLead["returndate"] + " - para : " + newLead["returndate"];

				var olddate = "";
				if( oldLead["returndate"] ){
					olddate = moment( oldLead["returndate"]  ).tz('America/Sao_Paulo').format("DD/MM/YYYY HH:mm");
				}

				var newdate = "";
				if( newLead["returndate"] ){
					newdate = moment( newLead["returndate"]  ).tz('America/Sao_Paulo').format("DD/MM/YYYY HH:mm");
				}

				text = text.replace("{olddate}", olddate );
				text = text.replace("{newdate}", newdate );
			}

			if( oldLead["observations"] != newLead["observations"] ){
				text += " Observações: " + oldLead["observations"] + " - para : " + newLead["observations"];
				
			}

			if( ( "" + oldLead["leadstatus"] ) != ( "" + newLead["leadstatus"] ) ){

				
				text += " Status: {oldleadstatus} - para : {newleadstatus} ";

				db.collection("dream_leadstatus").findOne( { "_id" : oldLead["leadstatus"] } ).then( function( oldLeadStatus ){
					db.collection("dream_leadstatus").findOne( { "_id" : newLead["leadstatus"] } ).then( function( newLeadStatus ){
						text = text.replace("{oldleadstatus}", oldLeadStatus["name"] );
						text = text.replace("{newleadstatus}", newLeadStatus["name"] );

						saveHistoric( leadid, userid, username, text );
					});
				});
			}
			else if( text != "" ){ console.log("else ", text );
				saveHistoric( leadid, userid, username, text );
			}


		});
	});


};

var constructor =  {

	"beforeSave" : function( to, isExternal, externalEntity, request ){

		var subject = "Novo registro de Lead - Comparador de consórcio";
		var mailtext = "Um novo lead entrou em contato <br />";
		mailtext += "Acesse os dados através do <a href='https://www.comparadordeconsorcio.com.br/painel'>";
		mailtext += "Comparador de Consórcio</a>";


		

        var promise = new Promise(function(resolve){

			if( ! to["_id"] && ! to["id"] && ! to["created"] ) to["created"] = new Date();

			if( to["_id"] ) to["_id"] = ObjectId( to["_id"] );

			if( to["id"] ) to["_id"] = ObjectId( to["id"] );

            to["category"] = ObjectId( to["category"] );

            if( to["leadstatus"] ) to["leadstatus"] = ObjectId( to["leadstatus"] );

			if( ! to["_id"] ){
				to["leaddate"] = new Date();
			}

			if( ! to["leaddate"] ) to["leaddate"] = new Date();
			if( ! to["origin"] ){
				to["origin"] = "Cadastrado manualmente";

				var userid = request.session.user._id;

				to["userid"] = userid;
			} 

			if( to["userid"] ) to["userid"] = ObjectId( to["userid"] );

			// gerando o histórico de alteração
			if( to["id"] || to["_id"] ){
				createHistoric( to, request );
			}

			require("../../../src/dao/daoFactory")().then(function(db){

				db.collection("dream_lead").findOne( { "cellphone" : to["cellphone"] } ).then( function( oldLead ){
					
					if( oldLead  ){
						to["userid"] = oldLead["userid"];

						resolve( to );
						return;
					}
					else if( ! to["landingid"] ){

						// distribuição de lead's'
						var criteria = {
							"type" : "admin"
						};

						var sortable = {
							"lastleaddate" : 1
						};

						if( ! to["userid"] ){
							db.collection("users").find( criteria ).sort( sortable ).toArray( ( error, results ) => {

								if( results.length && results.length > 0 ){
									var admin = results[0];

									to["userid"] = admin["_id"];

									admin["lastleaddate"] = new Date();

									// avisando a data do último lead
									var updateDoc = {
										"$set" : admin
									};

									db.collection( "users" ).updateOne( { "_id" : admin["_id"] }, updateDoc  , ( error, result ) =>{
										
										// enviando o e-mail para o dono do lead
										global["email"].sendEmail( admin["email"], subject, mailtext );

										resolve( to );
									});
								}
							});
						}
						else{
							console.log("userid ", to["userid"] );
							console.log("typeof ", typeof to["userid"] );
							resolve( to );
						}
					}
					else{
						// caso a origem seja landing
						if( ! to["userid"] ) to["userid"] = ObjectId( to["landingid"] );

						// envio de e-mail
						db.collection("users").findOne( { "_id" : ObjectId( to["landingid"] ) } ).then( function(userLanding){
							var dest = userLanding["email"];

							// enviando o e-mail para o dono do lead
							global["email"].sendEmail( dest, subject, mailtext );
							resolve( to );
						});

						
					}// final else
					
				});
				
			});

            
        });

        return promise;
        
	},
	"afterSave" : function( old, newto, entityname ){

	},
    "loadTable" : function( resquest, issort ){

		var request = resquest;

		var title = "Lead's";
		var path = "Cadastros > Lead's > ";

		//console.log("load table is sort", issort );
		
		/*
		if( request.query.path ){
			title = "Registro de atividades";
			path = "Cadastros > Registro de atividades > ";
		}*/
		
		var table = {
			"entityname" : "dream_lead",
			"title" : title,
			"path" : path,
			"showbutton" : true,
			"formedit" : "/pages/dream/edit?entity=dream_lead",
			"type" : "list",
			"scriptList" : [
				"js/next/fragment/list.js"
			],
			"headers": [
			      { text: "Tipo do Bem", value: 'categories.name' },
			      { text: 'Lead', value: 'name' },
				  { text: "Origem", value: 'origin' },
				  { text: "Data da simulação", value: 'leaddateformated' },
				  { text: "Novo lead", value: "newlead" },
				  { text: "Status", value: "statusdescription" },
			      { text: 'Ações', value: 'actions', sortable: false }
				  
		    ],
		    "list" : [
		    ]
		}

		var criteria = {};
		if( request && request.session && request.session.user ){

			if( request.session.user.type != "master" ){
				criteria["userid"] = ObjectId( request.session.user._id );
			}

			if( request.session.user.type == "master" || request.session.user.type == "admin" ){
				var newHeader = [
					{ text: "Proprietário", value: 'ownername' },
					{ text: "Tipo do Bem", value: 'categories.name' },
					{ text: 'Lead', value: 'name' },
					{ text: "Origem", value: 'origin' },
					{ text: "Data da simulação", value: 'leaddateformated' },
					{ text: "Novo lead", value: "newlead" },
					{ text: "Status", value: "statusdescription" },
					{ text: 'Ações', value: 'actions', sortable: false },
					{ text: 'Transferir Lead', value: 'leadtransfer', sortable: false }
				];

				table.headers = newHeader;
			}
			
		}

		var aggregate = [];

		var categories = { $lookup:
				{
					from: 'dream_category',
					localField: 'category',
					foreignField: '_id',
					as: 'categories'
				}
		};

		var owners = { $lookup:
				{
					from: 'users',
					localField: 'userid',
					foreignField: '_id',
					as: 'owners'
				}
		};

		var leadstatus = {$lookup:
				{
					from: 'dream_leadstatus',
					localField: 'leadstatus',
					foreignField: '_id',
					as: 'leadstatusfk'
				}
		}

		aggregate.push( categories );
		aggregate.push( owners );
		aggregate.push( leadstatus );

		aggregate.push( { $unwind : "$categories" } );
		//aggregate.push( { $unwind : "$leadstatusfk" } );
		//aggregate.push( { $unwind : "$owners" } );

		if( request && request.session && request.session.user ){

			if( request.session.user.type != "master" ){
				aggregate.push( { $match: { "userid": ObjectId( request.session.user._id ) } } );
				//criteria["userid"] = ObjectId( request.session.user._id );
			}
		}

		var promise = new Promise( function( resolve, reject){
				require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("dream_lead").aggregate( aggregate ).sort( { "created" : -1 } ).toArray( ( error, results ) => {

                        for(var i = 0; i < results.length; i++ ){
                            results[i]["id"] = results[i]["_id"]



							results[i]["statusdescription"] = "";
							if( results[i]["leadstatusfk"] && results[i]["leadstatusfk"].length > 0  ){

								results[i]["statusdescription"] = results[i]["leadstatusfk"][0]["name"];
							}

							//console.log(" name ", results[i]["name"] );

							delete results[i]["leaddateformated"];

							if( results[i]["created"] ) results[i]["leaddateformated"] = moment( results[i]["created"] ).tz('America/Sao_Paulo').format("DD/MM/YYYY HH:mm"); // + "( " + results[i]["created"]  + "))"

							if( results[i]["returndate"] ){
								results[i]["returndateformated"] = moment( results[i]["returndate"] ).tz('America/Sao_Paulo').format("DD/MM/YYYY HH:mm");
							}


							if( ! results[i]["isnew"] ) results[i]["newlead"] = "Não";
							else{
								results[i]["newlead"] = "Sim";
							}

							if( results[i]["owners"] && results[i]["owners"].length > 0 ){
								results[i]["ownername"] = results[i]["owners"][0]["name"];
							}
                        }
                        table["list"] = results;
                        resolve( table );
                    });
                    //resolve( table );						
				});
		});

		return promise;
	},
    "loadFormData" : function( request ){

		var defaultFormData = {
			"entityname" : "dream_lead",
			"title" : "Lead",
			"path" : "Cadastros > Lead > ",
			"formback" : "/pages/dream/list?entity=dream_lead",
			"primary" : {
				"modaltitle" : "Dados do chamado",
				"modalid" : "modal-primary",
				"type" : "v1",
				"model" : {
						"name" : "",
				},
				"schema" : {
						"fields": [
							{
								type: 'input',
								label: 'Código',
								model: 'id',
								id : "input-id",
								readonly: true,
								disabled: true,
								visible: true,
								required: false
							},
							{
								type: 'input',
								label: 'Nome do Lead',
								model: 'name',
								id : "input-priority",
								readonly: true,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'input',
								label: 'Celular',
								model: 'cellphone',
								id : "input-priority",
								readonly: true,
								disabled: false,
								visible: true,
								required: false,
								whatsapp : true
							},
                            {
								type: 'input',
								label: 'E-mail',
								model: 'email',
								id : "input-priority",
								readonly: true,
								disabled: false,
								visible: true,
								required: false
							},
							{
								type: 'input',
								label: 'Tipo do Bem',
								model: 'categorydescription',
								id : "input-priority",
								readonly: true,
								disabled: false,
								visible: false,
								required: false
							},
                            {
								type: 'select',
								label: 'Tipo do Bem',
								model: 'category',
								id : "input-priority",
								readonly: true,
								disabled: false,
								visible: true,
								required: false,
                                options : []
							},
							{
								type: 'input',
								label: 'Valor',
								model: 'endrangevalue',
								id : "input-priority",
								readonly: true,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'checkbox',
								label: 'Deseja receber informações por Whatsapp',
								model: 'whatsapp',
								id : "input-priority",
								readonly: true,
								disabled: false,
								visible: true,
								required: false
							},
							{
								type: 'input',
								label: 'Data do lead',
								model: 'leaddateformated',
								id : "input-priority",
								readonly: true,
								disabled: false,
								visible: true,
								required: false
							},
							{
								type: 'input',
								label: 'Origem do lead',
								model: 'origin',
								id : "input-priority",
								readonly: true,
								disabled: false,
								visible: true,
								required: false
							},
							{
								type: 'datetime',
								label: 'Data de retorno',
								model: 'returndate',
								id : "input-priority",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
							{
								type: 'select',
								label: 'Status do Lead',
								model: 'leadstatus',
								id : "input-priority",
								readonly: false,
								disabled: false,
								visible: true,
								required: false,
                                options : [],
								/*onchange : [
									{
										"type" : "if",
										"parameter" : "leadstatus",
										"value" : "5f38cf145dee0900161d51c8",
										"actions" : [
											{
												"fieldname" : "returndate",
												"property" : "visible",
												"value" : true
											}
										]// actions
									},
									{
										"type" : "if",
										"condition" : "different",
										"parameter" : "leadstatus",
										"value" : "5f38cf145dee0900161d51c8",
										"actions" : [
											{
												"fieldname" : "returndate",
												"property" : "visible",
												"value" : false
											}
										]// actions
									}
								]*/
							},
							{
								type: 'textarea',
								label: 'Observações',
								model: 'observations',
								id : "input-priority",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							}
                            
						]
				}
			},
			"details" : [
				{
					"title" : "Produtos em interesse",
					//"description" : "Exemplo de lista básica",
					"size" : "col-sm-12", // tamanho de colunas por bootstrap
					"type" : "nobutton",
					"selected" : true,
					"searchmodel" : "",
					"parentname" : "categoryid",
					"modalid" : "modal-company",
					"modaltitle" : "Empresas",
					"entityname" : "dream_companycategories",
					"model" : {
						"categoryid" : entityid
					},
					"schema" : {
						"fields" : [
								{
									type: 'select',
									label: 'Empresa',
									model: 'parentid',
									id : "input-categoryid",
									readonly: false,
									disabled: false,
									required: true,
									visible: true,
									options: []
								}
							]
					  },
					 "headers" : [
							{ text: 'Empresa', value: 'company.name' },
							{ text: 'Plano', value: 'paymentconditions.name' },
							{ text: 'Crédito', value: 'credits.credit' },
							{ text: 'Prazo', value: 'duedate' },
							{ text: 'Parcela', value: 'parcela' }
					  ],
					  "list": []
				},
				{
					"title" : "Histórico de alterações",
					//"description" : "Exemplo de lista básica",
					"size" : "col-sm-12", // tamanho de colunas por bootstrap
					"type" : "nobutton",
					"selected" : true,
					"searchmodel" : "",
					"parentname" : "categoryid",
					"modalid" : "modal-changehistory",
					"modaltitle" : "Histórico de alterações",
					"entityname" : "dream_leadhistoric",
					"model" : {
						"categoryid" : entityid
					},
					"schema" : {
						"fields" : [
								{
									type: 'select',
									label: 'Empresa',
									model: 'parentid',
									id : "input-categoryid",
									readonly: false,
									disabled: false,
									required: true,
									visible: true,
									options: []
								}
							]
					  },
					 "headers" : [
							{ text: 'Usuário', value: 'username' },
							{ text: 'Data de alteração', value: 'formateddate' },
							{ text: 'Mensagem', value: 'message' }
					  ],
					  "list": []
				}
			]
		};

        var promise = null;

        if( request.query.id ){
            var entityid = request.query.id;

            promise = new Promise( function(resolve){
                require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("dream_lead").findOne({ "_id" : ObjectId( entityid )  }, ( error, to ) => {

						if( ! to ) to = {};
						
						to["isnew"] = false;

						var updateDoc = {
							"$set" : to
						};

						delete to["created"];
						delete to["leaddate"];

						db.collection( "dream_lead" ).updateOne( { "_id" : ObjectId( entityid ) }, updateDoc  , ( error, result ) =>{
							//resolve( to );
								to["id"] = to["_id"];
								delete to["created"];
								delete to["leaddate"];
								
								if( to["created"] ) to["leaddateformated"] = moment( to["created"] ).format("DD/MM/YYYY HH:mm");

								defaultFormData.primary.model = to;
								defaultFormData.details[0].list = to["products"];

								getCategories().then(function(categoryList){

									var filtered = categoryList.filter(function(obj){
										return ( obj._id + "" ) == ( to["category"] + "" )
									});

									
									if( filtered && filtered.length > 0 ){
										to["categorydescription"] = filtered[0]["name"];

										defaultFormData.primary.schema.fields[4].visible = true;
										defaultFormData.primary.schema.fields[5].visible = false;
									}

									getLeadStatus().then( function(leadstatuslist){
										
										defaultFormData.primary.schema.fields[5].options = categoryList;
										defaultFormData.primary.schema.fields[11].options = leadstatuslist;

										db.collection("dream_leadhistoric").find( { leadid : to["_id"] } ).toArray( ( error, resultsHistoric ) => {
										
											for( var j = 0; j < resultsHistoric.length; j++  ){

												if( resultsHistoric[j]["created"] ){
													resultsHistoric[j]["formateddate"] = moment( resultsHistoric[j]["created"]  ).tz('America/Sao_Paulo').format("DD/MM/YYYY HH:mm");
												}
												//created
												//formateddate
											}

											defaultFormData.details[1].list = resultsHistoric;
											resolve( defaultFormData );
										});
											
									});
								});
						});
						//populateDetails( defaultFormData, entityid, resolve );
                        
                    });
                });
            });
        }
        else{
            promise = new Promise( function(resolve){
                //resolve( defaultFormData );

                getCategories().then(function(categoryList){

                    getLeadStatus().then( function(leadstatuslist){
                        
                        defaultFormData.primary.schema.fields[5].options = categoryList;
                        defaultFormData.primary.schema.fields[11].options = leadstatuslist;

						//1 to 10
						defaultFormData.primary.schema.fields[1].readonly = false;
						defaultFormData.primary.schema.fields[2].readonly = false;
						defaultFormData.primary.schema.fields[3].readonly = false;
						defaultFormData.primary.schema.fields[4].readonly = false;
						defaultFormData.primary.schema.fields[5].readonly = false;
						defaultFormData.primary.schema.fields[6].readonly = false;
						defaultFormData.primary.schema.fields[7].readonly = false;
						defaultFormData.primary.schema.fields[8].readonly = false;
						//defaultFormData.primary.schema.fields[9].readonly = false;
						defaultFormData.primary.schema.fields[10].readonly = false;

                        resolve( defaultFormData );	
                    });
                });
            });
        }

		return promise;
	}
};

module.exports = constructor;