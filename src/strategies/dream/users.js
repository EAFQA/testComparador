

var ObjectId = require('mongodb').ObjectID;
const bcrypt = require('bcrypt')
//const moment = require("moment");


var constructor =  {

	"beforeSave" : function( to, isExternal, externalEntity, request ){

        var promise = new Promise(function(resolve){

            if( ! to["type"] ) to["type"] = "user";

            if( to["newpassword"] ){
                var cryptPwd = bcrypt.hashSync( to["newpassword"] , 10);

                to["password"] = cryptPwd;
            }

			if( request && request.session && request.session.user
				&& request.session.user.companyid ){

				to["companyid"] = request.session.user.companyid;
			}

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

		var title = "Usuários";
		var path = "Cadastros > Usuários > ";

		//console.log("load table is sort", issort );
		
		/*
		if( request.query.path ){
			title = "Registro de atividades";
			path = "Cadastros > Registro de atividades > ";
		}*/
		
		var table = {
			"entityname" : "users",
			"title" : title,
			"path" : path,
			"showbutton" : true,
			"formedit" : "/pages/dream/edit?entity=users&modulename=crm",
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
				  { text: 'Usuário', value: 'username' },
                  { text: "Tipo", value: 'typedescription' },
			      { text: 'Ações', value: 'actions', sortable: false },
		    ],
		    "list" : [
		    ]
		}

		var criteria = {};

		if( resquest.session && resquest.session.user 
			&& resquest.session.user.type
			&& resquest.session.user.type == "admin" ){
			
			criteria = {};
		}
		else if ( resquest.session && resquest.session.user
			&& resquest.session.user.companyid ){

			criteria = { "companyid" : resquest.session.user.companyid };
		}

		var promise = new Promise( function( resolve, reject){
				require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("users").find( criteria ).toArray( ( error, results ) => {

                        for(var i = 0; i < results.length; i++ ){
                            if( ! results[i]["id"] ) results[i]["id"] = results[i]["_id"]

                            if( results[i]["type"] == "master" ) results[i]["typedescription"] = "Master";
                            else if( results[i]["type"] == "admin" ) results[i]["typedescription"] = "Administrador";
                            else if( results[i]["type"] == "consult" ) results[i]["typedescription"] = "Consultor";
                            else if( results[i]["type"] == "promoter" ) results[i]["typedescription"] = "Promotor";
                            else if( results[i]["type"] == "user" ) results[i]["typedescription"] = "Usuário";
                            else if( results[i]["type"] == "client" ) results[i]["typedescription"] = "Cliente";
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
			"entityname" : "users",
			"title" : "Usuário",
			"path" : "Cadastros > Usuários > ",
			"modulename" : "crm",
			"formback" : "/pages/dream/list?entity=users&modulename=crm",
			"primary" : {
				"modaltitle" : "Dados do chamado",
				"modalid" : "modal-primary",
				"type" : "v1",
				"model" : {
						"name" : "",
                        "type" : "user",
						"lastleaddate" : null
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
								readonly: false,
								disabled: false,
								required: true,
                                visible: true
							},
							{
								type: 'input',
								label: 'Usuário',
								model: 'username',
								id : "input-username",
								readonly: false,
								disabled: false,
								required: true,
                                visible: true
							},
                            {
								type: 'input',
								label: 'E-mail',
								model: 'email',
								id : "input-email",
								readonly: false,
								disabled: false,
								required: false,
                                visible: true
							},
							{
								type: 'input',
								label: 'Celular',
								model: 'cellphone',
								id : "input-priority",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
							{
								type: 'datetime',
								label: 'Data de nascimento',
								model: 'birthday',
								id : "input-priority",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'input',
								label: 'CPF',
								model: 'cpf',
								id : "input-priority",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'input',
								label: 'Link',
								model: 'link',
								id : "input-priority",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'file',
								label: 'Foto',
								model: 'logo',
								id : "input-logo",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'input',
								label: 'Facebook',
								model: 'facebook',
								id : "input-priority",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'input',
								label: 'Instagram',
								model: 'instagram',
								id : "input-priority",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'input',
								label: 'Linkedin',
								model: 'linkedin',
								id : "input-priority",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'input',
								label: 'Youtube',
								model: 'youtube',
								id : "input-priority",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'select',
								label: 'Tipo',
								model: 'type',
								id : "input-type",
								readonly: false,
								disabled: false,
								required: true,
                                visible: true,
                                options: [
                                    {
                                        "id" : "master",
                                        "value" : "Master"
                                    },
                                    {
                                        "id" : "admin",
                                        "value" : "Administrador"
                                    },
                                    {
                                        "id" : "consult",
                                        "value" : "Consultor"
                                    },
                                    {
                                        "id" : "promoter",
                                        "value" : "Promotor"
                                    }
                                ]
							},
                            {
								type: 'password',
								label: 'Senha',
								model: 'newpassword',
								id : "input-password",
								readonly: false,
								disabled: false,
								required: false,
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
                    db.collection("users").findOne({ "_id" : ObjectId(entityid) }, ( error, to ) => {


						if( ! to["lastleaddate"] ){
							to["lastleaddate"] = null;
						}

                        to["id"] = to["_id"];
                        to["newpassword"] = "";

						delete to["logo"];
						
                        if( to["type"] == "admin" ) to["typedescription"] = "Administrador";
                        else if( to["type"] == "user" ) to["typedescription"] = "Usuário";
                        else if( to["type"] == "client" ) to["typedescription"] = "Cliente";

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