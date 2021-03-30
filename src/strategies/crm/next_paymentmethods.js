



var ObjectId = require('mongodb').ObjectID;
//const moment = require("moment");

var getProductDetails = function(entityid){

    var detail =  {
            "title" : "Produtos",
			//"description" : "Exemplo de lista básica",
			"size" : "col-sm-12", // tamanho de colunas por bootstrap
			"type" : "basic",
			"selected" : true,
			"searchmodel" : "",
			"modalid" : "modal-produtos",
            "modaltitle" : "produto",
            "entityname" : "next_paymentmethodsproducts",
            "model" : {
                "teamid" : "",
                "parentid" : entityid
            },
            "schema" : {
                "fields" : [
                    {
                        type: 'input',
                        label: 'Código',
                        model: 'id',
                        id : "input-productid",
                        readonly: false,
                        disabled: true,
                        required: false
                    },
                    {
                        type: 'input',
                        label: 'Chave',
                        model: 'key',
                        id : "input-key",
                        readonly: false,
                        disabled: false,
                        required: true
                    },
                    {
                        type: 'input',
                        label: 'Produto',
                        model: 'name',
                        id : "input-productname",
                        readonly: false,
                        disabled: true,
                        required: false
                    },
                    {
                        type: 'number',
                        label: 'Preço',
                        model: 'price',
                        id : "input-productprice",
                        readonly: false,
                        disabled: true,
                        required: false
                    }
                ]
            },
			"headers" : [{
			        text: 'Código',
			        align: 'start',
			        sortable: false,
			        value: 'id',
			      },
			      { text: 'Produto', value: 'name' },
                  { text: 'Preço', value: 'price' },
			      { text: 'Ações', value: 'actions', sortable: false }
			],
			"list": [
			]
    };//

    var promise = new Promise( function(resolve){

        require("../../../src/dao/daoFactory")().then(function(db){

            db.collection("next_paymentmethodsproducts").find( { "parentid" : entityid } ).toArray( ( error, resultList ) => {
                
                for( var i = 0; i < resultList.length; i++ ){
                    //var team = await getTeamById( results[i]["teamid"] );

                    resultList[i]["id"] = resultList[i]["_id"];
                }

                detail.list = resultList;
                resolve( detail );
                //populateTeamDetailList( detail, resultList, resolve );
            });
                			
        });
        
        //resolve( detail );
    });

    return promise;
};

var populateDetails = async function( defaultFormData, entityid, resolve){

    var list = [];
    detail = await getProductDetails(entityid);

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

		var title = "Meios de pagamento";
		var path = "Integrações > Meios de pagamento > ";

		//console.log("load table is sort", issort );
		
		/*
		if( request.query.path ){
			title = "Registro de atividades";
			path = "Cadastros > Registro de atividades > ";
		}*/
		
		var table = {
			"entityname" : "next_paymentmethods",
			"title" : title,
			"path" : path,
			"showbutton" : true,
			"formedit" : "/pages/crm/edit?entity=next_paymentmethods",
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
			      { text: 'Meio de pagamento', value: 'name' },
			      { text: 'Ações', value: 'actions', sortable: false },
		    ],
		    "list" : [
		    ]
		}

		var promise = new Promise( function( resolve, reject){
				require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("next_paymentmethods").find( {} ).toArray( ( error, results ) => {

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
			"entityname" : "next_paymentmethods",
			"title" : "Meio de pagamento",
			"path" : "Integrações > Meio de pagamento > ",
			"formback" : "/pages/crm/list?entity=next_paymentmethods",
			"primary" : {
				"modaltitle" : "Dados do chamado",
				"modalid" : "modal-primary",
				"type" : "v1",
				"model" : {
						"name" : "",
                        "sandbox" : false
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
								label: 'Meio de pagamento',
								model: 'name',
								id : "input-priority",
								readonly: false,
								disabled: false,
								required: true
							},
                            {
								type: 'select',
								label: 'Canal',
								model: 'channelid',
								id : "input-priority",
								readonly: false,
								disabled: false,
								required: true,
                                options: [
                                    {
                                        "id" : "mercadopago",
                                        "value" : "Mercado pago"
                                    }
                                ]
							},
                            {
								type: 'input',
								label: 'Código do cliente',
								model: 'clientid',
								id : "input-clientid",
								readonly: false,
								disabled: false,
								required: true
							},
                            {
								type: 'input',
								label: 'Segredo',
								model: 'secret',
								id : "input-secret",
								readonly: false,
								disabled: false,
								required: true
							},
                            {
								type: 'input',
								label: 'Token de acesso',
								model: 'accesstoken',
								id : "input-accesstoken",
								readonly: false,
								disabled: false,
								required: true
							},
                            {
								type: 'checkbox',
								label: 'Sandbox',
								model: 'sandbox',
								id : "input-sandbox",
								readonly: false,
								disabled: false,
								required: false
							}
						]
				}
			},
            "showpaymentmethods" : true,
            "paymentmethods" : {
                "mercadopago" : {
                    "basic" : global.mercadopago.basic
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
                    db.collection("next_paymentmethods").findOne({ "_id" : ObjectId(entityid) }, ( error, to ) => {

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