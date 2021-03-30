

var ObjectId = require('mongodb').ObjectID;
const bcrypt = require('bcrypt')
const moment = require("moment");


var constructor =  {

	"beforeSave" : function( to, isExternal, externalEntity, request ){

        var promise = new Promise(function(resolve){

			if( to["userid"] ) to["userid"] = ObjectId( to["userid"] );
            resolve( to );
        });

        return promise;
	},
	"afterSave" : function( old, newto, entityname ){

		var promise = new Promise(function(resolve){
			resolve( newto );
		});

		return promise;
	},
	"loadTable" : function( resquest, issort ){

		var title = "Ligações";
		var path = "Formulários > Ligações > ";

		//console.log("load table is sort", issort );
		
		/*
		if( request.query.path ){
			title = "Registro de atividades";
			path = "Cadastros > Registro de atividades > ";
		}*/
		
		var table = {
			"entityname" : "dream_call",
			"title" : title,
			"path" : path,
			"showbutton" : true,
			"formedit" : "/pages/dream/edit?entity=dream_call&modulename=crm",
			"type" : "list",
			"scriptList" : [
				"js/next/fragment/list.js"
			],
			"headers": [
			      /*{
			        text: 'Código',
			        align: 'start',
			        sortable: false,
			        value: 'id',
			      }, */
			      { text: 'Nome', value: 'name' },
				  { text: 'Celular', value: 'cellphone' },
                  { text: "Melhor horário para contato", value: 'contacttime' },
				  { text: "Origem", value: 'origin' },
			      { text: 'Ações', value: 'actions', sortable: false },
		    ],
		    "list" : [
		    ]
		}

		var criteria = {};
		var request = resquest;

		if( request && request.session && request.session.user ){

			if( request.session.user.type == "master" || request.session.user.type == "admin" ){
				criteria = {};
			}
			else{
				criteria["userid"] = ObjectId( request.session.user._id );
			}
			
		}

		var promise = new Promise( function( resolve, reject){
				require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("dream_call").find( criteria ).sort( { "created" : -1 } ).toArray( ( error, results ) => {

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
			"entityname" : "dream_call",
			"title" : "Ligação",
			"path" : "Formulários > Ligações > ",
			"modulename" : "crm",
			"formback" : "/pages/dream/list?entity=dream_call&modulename=crm",
			"primary" : {
				"modaltitle" : "Dados do chamado",
				"modalid" : "modal-primary",
				"type" : "v1",
				"model" : {
						"name" : "",
                        "type" : "user"
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
								required: false,
                                visible: true
							},
                            {
								type: 'input',
								label: 'Nome',
								model: 'name',
								id : "input-name",
								readonly: true,
								disabled: false,
								required: true,
                                visible: true
							},
                            {
								type: 'input',
								label: 'E-mail',
								model: 'email',
								id : "input-name",
								readonly: true,
								disabled: false,
								required: true,
                                visible: true
							},
                            {
								type: 'input',
								label: 'Celular',
								model: 'cellphone',
								id : "input-name",
								readonly: true,
								disabled: false,
								required: true,
                                visible: true
							},
                            {
								type: 'input',
								label: 'Melhor horário para contato',
								model: 'contacttime',
								id : "input-name",
								readonly: true,
								disabled: false,
								required: true,
                                visible: true
							},
                            {
								type: 'input',
								label: 'CEP',
								model: 'cep',
								id : "input-name",
								readonly: true,
								disabled: false,
								required: true,
                                visible: true
							},
                            {
								type: 'input',
								label: 'Bem',
								model: 'categoryname',
								id : "input-name",
								readonly: true,
								disabled: false,
								required: true,
                                visible: true
							},
							{
								type: 'input',
								label: 'Origem',
								model: 'origin',
								id : "input-name",
								readonly: true,
								disabled: false,
								required: true,
                                visible: true
							},
                            {
								type: 'textarea',
								label: 'Comentário',
								model: 'comment',
								id : "input-name",
								readonly: true,
								disabled: false,
								required: true,
                                visible: true
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
                    db.collection("dream_call").findOne({ "_id" : ObjectId(entityid) }, ( error, to ) => {

                        to["id"] = to["_id"];

                        /*
                        if( to["visita"] ){
                            to["visitatimedescription"] = moment( to["visita"] ).format("DD/MM/YYYY HH:mm");
                        } */
                       
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