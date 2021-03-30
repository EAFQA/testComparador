

var ObjectId = require('mongodb').ObjectID;
//const moment = require("moment");


var constructor =  {

	"beforeSave" : function( to, isExternal, externalEntity ){

	},
	"afterSave" : function( old, newto, entityname ){

	},
	"loadTable" : function( resquest, issort ){

		var title = "Status do chamado";
		var path = "Atendimento > Status do chamado > ";

		//console.log("load table is sort", issort );
		
		/*
		if( request.query.path ){
			title = "Registro de atividades";
			path = "Cadastros > Registro de atividades > ";
		}*/
		
		var table = {
			"entityname" : "next_ticketstatus",
			"title" : title,
			"path" : path,
			"showbutton" : true,
			"formedit" : "/pages/crm/edit?entity=next_ticketstatus",
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
			      { text: 'Status do chamado', value: 'name' },
			      { text: 'Ações', value: 'actions', sortable: false },
		    ],
		    "list" : [
		    ]
		}

		var promise = new Promise( function( resolve, reject){
				require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("next_ticketstatus").find( {} ).toArray( ( error, results ) => {

                        for(var i = 0; i < results.length; i++ ){
                            if( ! results[i]["id"] ) results[i]["id"] = results[i]["_id"]
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
			"entityname" : "next_ticketstatus",
			"title" : "Status do chamado",
			"path" : "Atendimento > Status do chamado > ",
			"formback" : "/pages/crm/list?entity=next_ticketstatus",
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
								type: 'input',
								label: 'Status do chamado',
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
                    db.collection("next_ticketstatus").findOne({ "_id" : ObjectId(entityid) }, ( error, to ) => {

                        to["id"] = to["_id"];
                        defaultFormData.primary.model = to;
                        resolve( defaultFormData );	
                    });
                });
            });
        }
        else{
            promise = new Promise( function(resolve){
                resolve( defaultFormData );
            });
        }

		return promise;
	}
};

module.exports = constructor;