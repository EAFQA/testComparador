

var ObjectId = require('mongodb').ObjectID;
//const moment = require("moment");

var getTicketTypeList = function(){
    var promise = new Promise(function(resolve){
		require("../../../src/dao/daoFactory")().then(function(db){
						
			db.collection("next_tickettype").find().toArray( ( error, results ) => {

                var list = [];
                for( var i = 0; i < results.length; i++ ){
                    var to = {};
                    to["id"] = results[i]["_id"];
                    to["value"] = results[i]["name"];

                    list.push( to );
                }

				resolve( list );
			});// findOne

		});// requireDao
	});

	return promise;
};
var getTicketTypeById = function( id ){

    var promise = new Promise(function(resolve){
		require("../../../src/dao/daoFactory")().then(function(db){
						
			db.collection( "next_tickettype" ).findOne({ "_id" : ObjectId(id) }, ( error, record ) => {
				//resolve( results );
                if( ! record["id"] ) record["id"] = record["_id"];
				resolve( record );
			});// findOne

		});// requireDao
	});

	return promise
};

var populateList = async function( results, table, resolve ){

	var list = [];
	for( var i = 0; i < results.length; i++ ){
			var record = results[i];
			var to = {};

			to["id"] = record["_id"].toString();
			to["name"] = record["name"];

			var tickettype = await getTicketTypeById( record["tickettypeid"] );
			to["tickettypename"] = tickettype["name"];

			list.push( to );
	}

	table["list"] = list;

	resolve( table );

	return list;
};

var constructor =  {

	"beforeSave" : function( to, isExternal, externalEntity ){

	},
	"afterSave" : function( old, newto, entityname ){

	},
	"loadTable" : function( resquest, issort ){

		var title = "Assuntos";
		var path = "Atendimento > Assuntos > ";

		//console.log("load table is sort", issort );
		
		/*
		if( request.query.path ){
			title = "Registro de atividades";
			path = "Cadastros > Registro de atividades > ";
		}*/
		
		var table = {
			"entityname" : "next_ticketsubject",
			"title" : title,
			"path" : path,
			"showbutton" : true,
			"formedit" : "/pages/crm/edit?entity=next_ticketsubject",
			"type" : "list",
			"scriptList" : [
				"js/next/fragment/list.js"
			],
			"headers": [
			      {
			        text: 'Código',
			        align: 'start',
			        sortable: false,
			        value: 'id',
			      },
                  { text: "Tipo de solicitação", value : "tickettypename" },
			      { text: 'Assunto', value: 'name' },
			      { text: 'Ações', value: 'actions', sortable: false },
		    ],
		    "list" : [
		    ]
		}

		var promise = new Promise( function( resolve, reject){
				require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("next_ticketsubject").find( {} ).toArray( ( error, results ) => {

                        populateList( results, table, resolve );
                        /*for(var i = 0; i < results.length; i++ ){
                            if( ! results[i]["id"] ) results[i]["id"] = results[i]["_id"]

                            // trazer o tipo de solicitação
                        }
                        table["list"] = results;
                        resolve( table );*/
                    });
                    //resolve( table );						
				});
		});

		return promise;
	},
	"loadFormData" : function( request ){

		var defaultFormData = {
			"entityname" : "next_ticketsubject",
			"title" : "Assunto",
			"path" : "Atendimento > Assuntos > ",
			"formback" : "/pages/crm/list?entity=next_ticketsubject",
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
								required: false
							},
                            {
								type: 'select',
								label: 'Tipo de solicitação',
								model: 'tickettypeid',
								id : "input-solicitation",
								readonly: false,
								disabled: false,
								required: true,
                                options: []
							},
							{
								type: 'input',
								label: 'Assunto',
								model: 'name',
								id : "input-priority",
								readonly: false,
								disabled: false,
								required: true
							}
						]
				}
			},
			"details" : [
			]
		};

        var promise = null;

        if( request.query.id ){
            var entityid = request.query.id;

            promise = new Promise( function(resolve){
                require("../../../src/dao/daoFactory")().then(function(db){
                    db.collection("next_ticketsubject").findOne({ "_id" : ObjectId(entityid) }, ( error, to ) => {

                        to["id"] = to["_id"];
                        defaultFormData.primary.model = to;

                        // trazer os tipos de solicitação
                        getTicketTypeList().then(function(tickettypelist){
                            defaultFormData.primary.schema.fields[1]["options"] = tickettypelist;

                            if( tickettypelist.length == 1 ){
                                defaultFormData.primary.model.tickettypeid = tickettypelist[0]["id"];
                            }
                            resolve( defaultFormData );
                        });

                        //resolve( defaultFormData );	
                    });
                });
            });
        }
        else{
            promise = new Promise( function(resolve){

                // trazer os tipos de solicitação
                getTicketTypeList().then(function(tickettypelist){
                    defaultFormData.primary.schema.fields[1]["options"] = tickettypelist;

                    console.log("length ", tickettypelist.length );
                    if( tickettypelist.length == 1 ){
                        console.log("if", tickettypelist[0] );
                        defaultFormData.primary.model.tickettypeid = tickettypelist[0]["id"];
                    }
                    
                    resolve( defaultFormData );
                });

                //resolve( defaultFormData );
            });
        }

		return promise;
	}
};

module.exports = constructor;