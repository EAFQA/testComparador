

var ObjectId = require('mongodb').ObjectID;
//const moment = require("moment");

var getTeamById = function( id ){

    var promise = new Promise(function(resolve){
		require("../../../src/dao/daoFactory")().then(function(db){
						
			db.collection( "next_team" ).findOne({ "_id" : ObjectId(id) }, ( error, record ) => {
				//resolve( results );
                if( ! record["id"] ) record["id"] = record["_id"];
				resolve( record );
			});// findOne

		});// requireDao
	});

	return promise
};

var populateTeamDetailList = async function( detail, results, resolve ){

    for( var i = 0; i < results.length; i++ ){
        var team = await getTeamById( results[i]["teamid"] );

        results[i]["id"] = results[i]["_id"];
        results[i]["name"] = team["name"]; 
    }

    detail.list = results;
    resolve( detail );
};

var getTeamDetails = function(entityid){

    var detail =  {
            "title" : "Times",
			//"description" : "Exemplo de lista básica",
			"size" : "col-sm-12", // tamanho de colunas por bootstrap
			"type" : "basic",
			"selected" : true,
			"searchmodel" : "",
			"modalid" : "modal-teams",
            "modaltitle" : "Time",
            "entityname" : "next_teamuser",
            "model" : {
                "teamid" : "",
                "parentid" : entityid
            },
            "schema" : {
                "fields" : [
                    {
                        type: 'select',
                        label: 'Time',
                        model: 'teamid',
                        id : "input-teamid",
                        readonly: false,
                        disabled: false,
                        required: true,
                        options: []
                    }
                ]
            },
			"headers" : [{
			        text: 'Código',
			        align: 'start',
			        sortable: false,
			        value: 'id',
			      },
			      { text: 'Time', value: 'name' },
			      { text: 'Ações', value: 'actions', sortable: false }
			],
			"list": [
			]
    };//

    var promise = new Promise( function(resolve){

        require("../../../src/dao/daoFactory")().then(function(db){

            db.collection("next_team").find( {} ).toArray( ( error, results ) => {

                var options = [];
                for(var i = 0; i < results.length; i++ ){

                    var to = {};
                    to["id"] = results[i]["_id"];
                    to["value"] = results[i]["name"];

                    options.push( to );
                }
               
                detail.schema.fields[0]["options"] = options;

                db.collection("next_teamuser").find( { "parentid" : entityid } ).toArray( ( error, resultList ) => {
                    
                    populateTeamDetailList( detail, resultList, resolve );/*
                    for( var j = 0; j < resultList.length; j++ ){
                        if( ! resultList[j]["id"] ) resultList[j]["id"] = resultList[j]["_id"];
                    }

                    detail.list = resultList;

                    resolve( detail ); */
                });
                
            });					
        });
        
        //resolve( detail );
    });

    return promise;
};

var populateDetails = async function( defaultFormData, entityid, resolve){

    var list = [];
    detail = await getTeamDetails(entityid);

    list.push( detail );

    defaultFormData.details = list;
    resolve( defaultFormData );

    return list;
}

var constructor =  {

	"beforeSave" : function( to, isExternal, externalEntity ){

	},
	"afterSave" : function( old, newto, entityname ){

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
			"entityname" : "next_user",
			"title" : title,
			"path" : path,
			"showbutton" : true,
			"formedit" : "/pages/crm/edit?entity=next_user",
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
			      { text: 'Usuário', value: 'name' },
			      { text: 'Ações', value: 'actions', sortable: false },
		    ],
		    "list" : [
		    ]
		}

		var promise = new Promise( function( resolve, reject){
				require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("next_user").find( {} ).toArray( ( error, results ) => {

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
			"entityname" : "next_user",
			"title" : "Usuário",
			"path" : "Cadastros > Usuários > ",
			"formback" : "/pages/crm/list?entity=next_user",
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
								label: 'Usuário',
								model: 'name',
								id : "input-priority",
								readonly: false,
								disabled: false,
								required: true
							},
							{
								type: 'file',
								label: 'Foto',
								model: 'userphoto',
								id : "input-userphoto",
								readonly: false,
								disabled: false,
								required: false
							}
						]
				}
			},
			"details" : [
			]
		};

        //defaultFormData.details.push( getTeamDetails() );
        

        var promise = null;

        if( request.query.id ){
            var entityid = request.query.id;

            promise = new Promise( function(resolve){
                require("../../../src/dao/daoFactory")().then(function(db){
                    db.collection("next_user").findOne({ "_id" : ObjectId(entityid) }, ( error, to ) => {

                        to["id"] = to["_id"];
                        defaultFormData.primary.model = to;
                        //resolve( defaultFormData );

                        populateDetails( defaultFormData, entityid, resolve );	
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