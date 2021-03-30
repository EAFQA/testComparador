

var ObjectId = require('mongodb').ObjectID;
//const moment = require("moment");

var getCategoryById = function( id ){

    var promise = new Promise(function(resolve){
		require("../../../src/dao/daoFactory")().then(function(db){
						
			db.collection( "dream_category" ).findOne({ "_id" : ObjectId(id) }, ( error, record ) => {
				//resolve( results );
                if( ! record["id"] ) record["id"] = record["_id"];
				resolve( record );
			});// findOne

		});// requireDao
	});

	return promise
};

var populateCategoriesDetailList = async function( detail, results, resolve ){

    for( var i = 0; i < results.length; i++ ){
        var category = await getCategoryById( results[i]["categoryid"] );

        results[i]["id"] = results[i]["_id"];
        results[i]["name"] = category["name"]; 
    }

    detail.list = results;
    resolve( detail );
};

var getCategoryDetails = function(entityid){

    var detail =  {
            "title" : "Categorias",
			//"description" : "Exemplo de lista básica",
			"size" : "col-sm-12", // tamanho de colunas por bootstrap
			"type" : "basic",
			"selected" : true,
			"searchmodel" : "",
			"modalid" : "modal-category",
            "modaltitle" : "Categoria",
            "entityname" : "dream_companycategories",
            "model" : {
                "parentid" : entityid
            },
            "schema" : {
                "fields" : [
                    {
                        type: 'select',
                        label: 'Categoria',
                        model: 'categoryid',
                        id : "input-categoryid",
						visible: true,
                        readonly: false,
                        disabled: false,
                        required: true,
                        options: []
                    }
                ]
            },
			"headers" : [
			      { text: 'Categoria', value: 'name' },
			      { text: 'Ações', value: 'actions', sortable: false }
			],
			"list": [
			]
    };//

    var promise = new Promise( function(resolve){

        require("../../../src/dao/daoFactory")().then(function(db){

            db.collection("dream_category").find( {} ).toArray( ( error, results ) => {

                var options = [];
                for(var i = 0; i < results.length; i++ ){

                    var to = {};
                    to["id"] = results[i]["_id"];
                    to["value"] = results[i]["name"];

                    options.push( to );
                }
               
                detail.schema.fields[0]["options"] = options;

                db.collection("dream_companycategories").find( { "parentid" : entityid } ).toArray( ( error, resultList ) => {
                    
                    populateCategoriesDetailList( detail, resultList, resolve );/*
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
    detail = await getCategoryDetails(entityid);

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

		var title = "Empresas";
		var path = "Cadastros > Empresas > ";

		//console.log("load table is sort", issort );
		
		/*
		if( request.query.path ){
			title = "Registro de atividades";
			path = "Cadastros > Registro de atividades > ";
		}*/
		
		var table = {
			"entityname" : "dream_company",
			"title" : title,
			"path" : path,
			"showbutton" : true,
			"formedit" : "/pages/dream/edit?entity=dream_company",
			"type" : "list",
			"scriptList" : [
				"js/next/fragment/list.js"
			],
			"headers": [
			      
			      { text: 'Empresa', value: 'name' },
			      { text: 'Ações', value: 'actions', sortable: false },
		    ],
		    "list" : [
		    ]
		}

		var promise = new Promise( function( resolve, reject){
				require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("dream_company").find( {} ).toArray( ( error, results ) => {

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
			"entityname" : "dream_company",
			"title" : "Empresa",
			"path" : "Cadastros > Empresas > ",
			"formback" : "/pages/dream/list?entity=dream_company",
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
								visible: true,
								readonly: true,
								disabled: true,
								required: false
							},
							{
								type: 'input',
								label: 'Categoria',
								model: 'name',
								id : "input-priority",
								visible: true,
								readonly: false,
								disabled: false,
								required: true
							},
                            {
								type: 'file',
								label: 'File',
								model: 'image',
								id : "input-filelogo",
								visible: true,
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

        var promise = null;

        if( request.query.id ){
            var entityid = request.query.id;

            promise = new Promise( function(resolve){
                require("../../../src/dao/daoFactory")().then(function(db){
                    db.collection("dream_company").findOne({ "_id" : ObjectId(entityid) }, ( error, to ) => {

                        to["id"] = to["_id"];

						to["image"] = null;

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