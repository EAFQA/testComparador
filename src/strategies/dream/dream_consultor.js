

var ObjectId = require('mongodb').ObjectID;
//const moment = require("moment");


var getUsers = function(){

    var promise = new Promise(function(resolve){

        require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("users").find( {} ).toArray( ( error, results ) => {

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

var constructor =  {

	"beforeSave" : function( to, isExternal, externalEntity ){

        var promise = new Promise(function(resolve){

            //to["category"] = ObjectId( to["category"] );
            //if( to["leadstatus"] ) ObjectId( to["leadstatus"] );

            resolve( to );
        });

        return promise;
        
	},
	"afterSave" : function( old, newto, entityname ){

	},
    "loadTable" : function( resquest, issort ){

		var title = "Consultores";
		var path = "Administração Geral > Consultores > ";

		//console.log("load table is sort", issort );
		
		/*
		if( request.query.path ){
			title = "Registro de atividades";
			path = "Cadastros > Registro de atividades > ";
		}*/
		
		var table = {
			"entityname" : "dream_consultor",
			"title" : title,
			"path" : path,
			"showbutton" : true,
			"formedit" : "/pages/dream/edit?entity=dream_consultor",
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
			      { text: 'Consultor', value: 'name' },
                  { text: 'Link', value: 'link' },
			      { text: 'Ações', value: 'actions', sortable: false },
		    ],
		    "list" : [
		    ]
		}

		var promise = new Promise( function( resolve, reject){
				require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("dream_consultor").find( {} ).toArray( ( error, results ) => {

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
			"entityname" : "dream_consultor",
			"title" : "Consultor",
			"path" : "Administração Geral > Consultores > ",
			"formback" : "/pages/dream/list?entity=dream_consultor",
			"primary" : {
				"modaltitle" : "Dados do chamado",
				"modalid" : "modal-primary",
				"type" : "v1",
				"model" : {
						"name" : "",
                        "primarycolor" : "#005f61",
                        "secondarycolor" : "#20bea7",
                        "menufont" : "#ffffff"
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
								label: 'Nome',
								model: 'name',
								id : "input-priority",
								readonly: false,
								disabled: false,
								visible: true,
								required: true
							},
							{
								type: 'select',
								label: 'Usuário',
								model: 'user',
								id : "input-user",
								readonly: false,
								disabled: false,
								visible: true,
								required: true
							},
                            {
								type: 'input',
								label: 'E-mail',
								model: 'email',
								id : "input-priority",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
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
								type: 'textarea',
								label: 'Sobre',
								model: 'about',
								id : "input-priority",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'file',
								label: 'Logo',
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
							}/*,
                            {
								type: 'color',
								label: 'Cor primária',
								model: 'primarycolor',
								id : "input-primarycolor",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'color',
								label: 'Cor secundária',
								model: 'secundarycolor',
								id : "input-secundarycolor",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'color',
								label: 'Cor fonte menu',
								model: 'menufont',
								id : "input-menufont",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							}*/
							
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
                    db.collection("dream_consultor").findOne({ "_id" : ObjectId(entityid) }, ( error, to ) => {

                        to["id"] = to["_id"];

                        delete to["logo"];

						// user
						getUsers().then( function(users){

							defaultFormData.primary.schema.fields[2].options = users;

							defaultFormData.primary.model = to;
							resolve( defaultFormData );
						});
                        	
						//populateDetails( defaultFormData, entityid, resolve );
                        
                    });
                });
            });
        }
        else{
            promise = new Promise( function(resolve){
                //resolve( defaultFormData );

				getUsers().then( function(users){

					defaultFormData.primary.schema.fields[2].options = users;
					resolve( defaultFormData );
				});

                	
            });
        }

		return promise;
	}
};

module.exports = constructor;