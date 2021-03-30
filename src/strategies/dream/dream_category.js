

var ObjectId = require('mongodb').ObjectID;
//const moment = require("moment");

var getCompanyById = function( id ){

    var promise = new Promise(function(resolve){
		require("../../../src/dao/daoFactory")().then(function(db){
						
			db.collection( "dream_company" ).findOne({ "_id" : ObjectId(id) }, ( error, record ) => {
                if( ! record["id"] ) record["id"] = record["_id"];
				resolve( record );
			});// findOne

		});// requireDao
	});

	return promise
};

var populateCompaniesDetailList = async function( detail, results, resolve ){

    for( var i = 0; i < results.length; i++ ){

        var category = await getCompanyById( results[i]["parentid"] );

        results[i]["id"] = results[i]["_id"];
        results[i]["name"] = category["name"]; 
    }

    detail.list = results;
    resolve( detail );
};

var getCompanyDetails = function(entityid){

    var detail =  {
            "title" : "Empresa",
			//"description" : "Exemplo de lista básica",
			"size" : "col-sm-12", // tamanho de colunas por bootstrap
			"type" : "basic",
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
			      { text: 'Empresa', value: 'name' },
			      { text: 'Ações', value: 'actions', sortable: false }
			],
			"list": [
			]
    };//

    var promise = new Promise( function(resolve){

        require("../../../src/dao/daoFactory")().then(function(db){

            db.collection("dream_company").find( {} ).toArray( ( error, results ) => {

                var options = [];
                for(var i = 0; i < results.length; i++ ){

                    var to = {};
                    to["id"] = results[i]["_id"];
                    to["value"] = results[i]["name"];

                    options.push( to );
                }
               
                detail.schema.fields[0]["options"] = options;

                db.collection("dream_companycategories").find( { "categoryid" : entityid } ).toArray( ( error, resultList ) => {
                    
                    populateCompaniesDetailList( detail, resultList, resolve );
                });
                
            });					
        });
        
        //resolve( detail );
    });

    return promise;
};

var populateDetails = async function( defaultFormData, entityid, resolve){

    var list = [];
    detail = await getCompanyDetails(entityid);

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

		var title = "Categorias";
		var path = "Cadastros > Categorias > ";

		//console.log("load table is sort", issort );
		
		/*
		if( request.query.path ){
			title = "Registro de atividades";
			path = "Cadastros > Registro de atividades > ";
		}*/
		
		var table = {
			"entityname" : "dream_category",
			"title" : title,
			"path" : path,
			"showbutton" : true,
			"formedit" : "/pages/dream/edit?entity=dream_category",
			"type" : "list",
			"scriptList" : [
				"js/next/fragment/list.js"
			],
			"headers": [
			      
			      { text: 'Categoria', value: 'name' },
			      { text: 'Ações', value: 'actions', sortable: false },
		    ],
		    "list" : [
		    ]
		}

		var promise = new Promise( function( resolve, reject){
				require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("dream_category").find( {} ).toArray( ( error, results ) => {

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
			"entityname" : "dream_category",
			"title" : "Categoria",
			"path" : "Cadastros > Categorias > ",
			"formback" : "/pages/dream/list?entity=dream_category",
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
								label: 'Categoria',
								model: 'name',
								id : "input-priority",
								readonly: false,
								disabled: false,
								visible: true,
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
                    db.collection("dream_category").findOne({ "_id" : ObjectId(entityid) }, ( error, to ) => {

                        to["id"] = to["_id"];
                        defaultFormData.primary.model = to;

						populateDetails( defaultFormData, entityid, resolve );
                        //resolve( defaultFormData );	
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