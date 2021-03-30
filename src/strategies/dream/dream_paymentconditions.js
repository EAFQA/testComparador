

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

var getCategoryById = function( id ){

    var promise = new Promise(function(resolve){
		require("../../../src/dao/daoFactory")().then(function(db){
						
			db.collection( "dream_category" ).findOne({ "_id" : ObjectId(id) }, ( error, record ) => {
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
			"headers" : [{
			        text: 'Código',
			        align: 'start',
			        sortable: false,
			        value: 'id',
			      },
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

var getCompanies = function(){

    var promise = new Promise(function(resolve){

        require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("dream_company").find( {} ).toArray( ( error, results ) => {

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

var getDuedateDetails = function( entityid ){

	return {
					"title" : "Prazos",
					"size" : "col-sm-12", // tamanho de colunas por bootstrap
					"type" : "basic",
					"modalid" : "modal-duedatedetails",
					"modaltitle" : "Prazos",
					"entityname" : "dream_duedate",
					"model" : {
						"parentid" : entityid
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
								visible : true
							},
							{
								type: 'number',
								label: 'Prazo',
								model: 'duedate',
								id : "input-duedate",
								readonly: false,
								disabled: false,
								required: true,
								visible : true
							},
							{
								type: 'number',
								label: 'Taxa',
								model: 'tax',
								id : "input-tax",
								readonly: false,
								disabled: false,
								required: false,
								visible : true
							}
						]
					},
					"headers" : [
						{ text: 'Prazo', value: 'duedate' },
						{ text: 'Taxa', value: 'tax' },
						{ text: 'Ações', value: 'actions', sortable: false }
					],
					"list": [
					]
				}
};

var getCreditDetails = function( entityid ){

	return {
					"title" : "Créditos",
					"size" : "col-sm-12", // tamanho de colunas por bootstrap
					"type" : "basic",
					"modalid" : "modal-credit",
					"modaltitle" : "Créditos",
					"entityname" : "dream_credit",
					"model" : {
						"parentid" : entityid
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
								visible : true
							},
							{
								type: 'number',
								label: 'Crédito',
								model: 'credit',
								id : "input-credit",
								readonly: false,
								disabled: false,
								required: true,
								visible : true
							},
							{
								type: 'textarea',
								label: 'Parcelas',
								model: 'parcelas',
								id : "input-parcelas",
								readonly: true,
								disabled: false,
								required: false,
								visible : true
							}
						]
					},
					"headers" : [
						{ text: 'Crédito', value: 'credit' },
						{ text: 'Parcelas', value: 'parcelas' },
						{ text: 'Ações', value: 'actions', sortable: false }
					],
					"list": [
					]
				}
};

var gueDuedateDetailsList = function( entityid ){
	
	var promise = new Promise(function(resolve){

        require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("dream_duedate").find( { "parentid" : "" + entityid } ).toArray( ( error, results ) => {

                        for(var i = 0; i < results.length; i++ ){
                            if( ! results[i]["id"] ) results[i]["id"] = results[i]["_id"]
                        }
                      
                        resolve( results );
                    });
                    //resolve( table );						
				});
    });


    return promise;
};

var getCreditDetailsList = function( entityid ){
	
	var promise = new Promise(function(resolve){

        require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("dream_credit").find( { "parentid" : "" + entityid } ).toArray( ( error, results ) => {

                        for(var i = 0; i < results.length; i++ ){
                            if( ! results[i]["id"] ) results[i]["id"] = results[i]["_id"]
                        }
                      
                        resolve( results );
                    });
                    //resolve( table );						
				});
    });


    return promise;
};


var populateDetails =  async function( defaultFormData, resolve, parentid ){

	var duedateDetails = getDuedateDetails( parentid );
	var creditDetails = getCreditDetails( parentid );

	gueDuedateDetailsList( parentid ).then( function( duedateList ){

		duedateDetails.list = duedateList;

		getCreditDetailsList( parentid ).then( function( creditList ){

			creditDetails.list = creditList;

			defaultFormData.details.push( duedateDetails );
			defaultFormData.details.push( creditDetails );

			resolve( defaultFormData );
		});
		
	});

	
};


var populateList = async function( table, results, resolve ){


	for( var i = 0; i < results.length; i++ ){

		var company = await getCompanyById( results[i]["companyid"] );
		if( company ) results[i]["companyname"] = company["name"];

		var category = await getCategoryById( results[i]["categoryid"] );
		if( category ) results[i]["categoryname"] = category["name"];
	}

	table["list"] = results;
	resolve( table );
};

var constructor =  {

	"beforeSave" : function( to, isExternal, externalEntity ){

		var parcela = 0;

		// somar a taxa de adm + fundo reserva
		// admintaxs + reservefunds
		var percentual = to["admintaxs"] + to["reservefunds"];

		if( to["companyid"] ) to["companyid"] = ObjectId( to["companyid"]  );

		
	},
	"afterSave" : function( old, newto, entityname ){

	},
	"loadTable" : function( resquest, issort ){

		var title = "Condições de pagamento";
		var path = "Cadastros > Condições de pagamento > ";

		//console.log("load table is sort", issort );
		
		/*
		if( request.query.path ){
			title = "Registro de atividades";
			path = "Cadastros > Registro de atividades > ";
		}*/
		
		var table = {
			"entityname" : "dream_paymentconditions",
			"title" : title,
			"path" : path,
			"showbutton" : true,
			"formedit" : "/pages/dream/edit?entity=dream_paymentconditions",
			"type" : "list",
			"scriptList" : [
				"js/next/fragment/list.js"
			],
			"headers": [
			      
				  { text: 'Categoria', value: 'categoryname' },
				  { text: 'Empresa', value: 'companyname' },
			      { text: 'Nome do plano', value: 'name' },
				  { text: "Faixa de crédito", value: 'creditname' },
			      { text: 'Ações', value: 'actions', sortable: false },
		    ],
		    "list" : [
		    ]
		}

		var promise = new Promise( function( resolve, reject){
				require("../../../src/dao/daoFactory")().then(function(db){

                    db.collection("dream_paymentconditions").find( {} ).toArray( ( error, results ) => {

                        for(var i = 0; i < results.length; i++ ){
                            if( ! results[i]["id"] ) results[i]["id"] = results[i]["_id"]
                        }

						populateList( table, results, resolve );
                        
                    });
                    //resolve( table );						
				});
		});

		return promise;
	},
	"loadFormData" : function( request ){

		var defaultFormData = {
			"entityname" : "dream_paymentconditions",
			"title" : "Condição de pagamento",
			"path" : "Cadastros > Condições de pagamento > ",
			"formback" : "/pages/dream/list?entity=dream_paymentconditions",
			"primary" : {
				"modaltitle" : "Dados do chamado",
				"modalid" : "modal-primary",
				"type" : "v1",
				"model" : {
						"name" : "",
                        "optionalsecurity" : "N",
                        "embeedthrow" : "N"
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
								label: 'Faixa de crédito',
								model: 'creditname',
								id : "input-creditname",
								readonly: false,
								disabled: false,
								visible: true,
								required: true
							},
                            {
								type: 'select',
								label: 'Empresa',
								model: 'companyid',
								id : "input-company",
								readonly: false,
								disabled: false,
								visible: true,
								required: true
							},
                            {
								type: 'select',
								label: 'Categoria',
								model: 'categoryid',
								id : "input-categoryid",
								readonly: false,
								disabled: false,
								visible: true,
								required: true
							},
							{
								type: 'input',
								label: 'Nome do plano',
								model: 'name',
								id : "input-name",
								readonly: false,
								disabled: false,
								visible: true,
								required: true
							},
                            {
								type: 'number',
								label: 'Taxa de Adm (%)',
								model: 'admintaxs',
								id : "input-admintaxs",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'number',
								label: 'Fundo reserva (%)',
								model: 'reservefunds',
								id : "input-reservefunds",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'select',
								label: 'Seguro opcional',
								model: 'optionalsecurity',
								id : "input-optionalsecurity",
								readonly: false,
								disabled: false,
								visible: true,
								required: false,
                                options : [
                                    {
                                        "id" : "N",
                                        "value" : "Não"
                                    },
                                    {
                                        "id" : "Y",
                                        "value" : 'Sim'
                                    }
                                ]
							},
                            {
								type: 'number',
								label: 'Seguro (%)',
								model: 'secutiryfunds',
								id : "input-secutiryfunds",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'number',
								label: 'Amortização (%)',
								model: 'amorization',
								id : "input-amortization",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'number',
								label: 'Taxa de adesão (%)',
								model: 'membershipfee',
								id : "input-membershipfee",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'number',
								label: 'Taxa de adesão parcelas',
								model: 'membershipporionfee',
								id : "input-membershipporionfee",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'checkbox',
								label: 'Sorteio',
								model: 'sorteio',
								id : "input-membershipfee",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'checkbox',
								label: 'Lance livre',
								model: 'freethrow',
								id : "input-freethrow",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'checkbox',
								label: 'Lance fixo',
								model: 'fixedthrow',
								id : "input-fixedthrow",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'checkbox',
								label: '2º Lance fixo',
								model: 'secondfixedthrow',
								id : "input-secondfixedthrow",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'checkbox',
								label: 'Lance limitado',
								model: 'limitedthrow',
								id : "input-limitedthrow",
								readonly: false,
								disabled: false,
								visible: true,
								required: false
							},
                            {
								type: 'select',
								label: 'Lance embutido',
								model: 'embeedthrow',
								id : "input-embeedthrow",
								readonly: false,
								disabled: false,
								visible: true,
								required: false,
                                options: [
                                    {
                                        "id" : "N",
                                        "value" : "Não"
                                    },
                                    {
                                        "id" : "Y",
                                        "value" : "Sim"
                                    }
                                ]
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
                    db.collection("dream_paymentconditions").findOne({ "_id" : ObjectId(entityid) }, ( error, to ) => {

                        to["id"] = to["_id"];
                        defaultFormData.primary.model = to;


                        getCompanies().then( function( companies ){
                            defaultFormData.primary.schema.fields[2].options = companies;

                            getCategories().then( function( categories){
                                defaultFormData.primary.schema.fields[3].options = categories;

								populateDetails( defaultFormData, resolve, to["_id"] );
                                //resolve( defaultFormData );	
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

                getCompanies().then( function( companies ){
                    defaultFormData.primary.schema.fields[2].options = companies;

                    getCategories().then( function( categories){
                        defaultFormData.primary.schema.fields[3].options = categories;
                        resolve( defaultFormData );	
                    });
                    //resolve( defaultFormData );	
                });
            });
        }

		return promise;
	}
};

module.exports = constructor;