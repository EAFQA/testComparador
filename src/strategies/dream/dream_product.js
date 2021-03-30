

var ObjectId = require('mongodb').ObjectID;
//const moment = require("moment");

var getCompanyTypeById = function( id ){

    var promise = new Promise(function(resolve){
		require("../../../src/dao/daoFactory")().then(function(db){
						
			db.collection( "dream_company" ).findOne({ "_id" : ObjectId(id) }, ( error, record ) => {

				if( ! record ){
					resolve( null );
				} 
				else{
					if( ! record["id"] ) record["id"] = record["_id"];
					resolve( record );
				}
				
			});// findOne

		});// requireDao
	});

	return promise
};

var getCategoryTypeById = function( id ){

    var promise = new Promise(function(resolve){
		require("../../../src/dao/daoFactory")().then(function(db){
						
			db.collection( "dream_category" ).findOne({ "_id" : ObjectId(id) }, ( error, record ) => {

				if( ! record ){
					resolve( null );
				} 
				else{
					if( ! record["id"] ) record["id"] = record["_id"];
					resolve( record );
				}
				
			});// findOne

		});// requireDao
	});

	return promise
};

var populateList = async function( results, table, resolve ){

	var list = [];
	var mapCompany = {};
	var mapCategory = {};

	for( var i = 0; i < results.length; i++ ){
			var record = results[i];
			var to = {};

			to["id"] = record["_id"].toString();
			to["name"] = record["name"];
			to["pricequote"] = record["pricequote"];

			if( record["company"] ){

				var company = null;

				if( mapCompany[ record["company"] ] ){
					company = mapCompany[ record["company"] ];
				}
				else{
					company = await getCompanyTypeById( record["company"] );
					mapCompany[ record["company"] ] = company;
				}
				 
				if( ! company ){
					to["companyname"] = "";
				}
				else{
					to["companyname"] = company["name"];
				}
			}
			else{
				to["companyname"] = "";
			}

			if( record["category"] ){

				var category = null;

				if( mapCategory[ record["category"] ] ){
					category = mapCategory[ record["category"] ];
				}
				else{
					category = await getCategoryTypeById( record["category"] );
					mapCategory[ record["category"] ] = category;
				}
				
				if( ! category ){
					to["categoryname"] = "";
				}
				else{
					to["categoryname"] = category["name"];
				}
			}
			else{
				to["categoryname"] = "";
			}

			list.push( to );

			if( i == ( results.length - 1 ) ){
				table.list = list;

				resolve( table );
			}
	}

	//mapCompany = {};
	//mapCategory = {};

	//resolve( table );

	return list;
};

var beforeRenderValidations = function( model, fields ){

	if( model["dofacilitythrow"] == "Y" ){
		fields[15]["visible"] = true;
		fields[16]["visible"] = true;
	}
	else{
		fields[15]["visible"] = false;
		fields[16]["visible"] = false;
	}

	if( model["dofixedthrow"] == "Y" ){
		fields[18]["visible"] = true;
		fields[19]["visible"] = true;
	}	
	else{
		fields[18]["visible"] = false;
		fields[19]["visible"] = false;
	}

	if( model["secondfixedthrow"] == "Y" ){
		fields[21]["visible"] = true;
		fields[22]["visible"] = true;
	}
	else{
		fields[21]["visible"] = false;
		fields[22]["visible"] = false;
	}

}

var constructor =  {

	"beforeSave" : function( to, isExternal, externalEntity ){

	},
	"afterSave" : function( old, newto, entityname ){

	},
	"loadTable" : function( resquest, issort ){

		var title = "Planos";
		var path = "Cadastros > Planos > ";

		//console.log("load table is sort", issort );
		
		/*
		if( request.query.path ){
			title = "Registro de atividades";
			path = "Cadastros > Registro de atividades > ";
		}*/
		
		var table = {
			"entityname" : "dream_product",
			"title" : title,
			"path" : path,
			"showbutton" : true,
			"formedit" : "/pages/dream/edit?entity=dream_product",
			"type" : "list",
			"scriptList" : [
				"js/next/fragment/list.js"
			],
			"headers": [
			     
                  { text : "Empresa", value : "companyname" },
				  { text : "Categoria", value : "categoryname" },
			      { text: 'Plano', value: 'name' },
				  { text: 'Valor da cota', value: 'pricequote' },
			      { text: 'Ações', value: 'actions', sortable: false },
		    ],
		    "list" : [
		    ]
		}

		var promise = new Promise( function( resolve, reject){
				require("../../../src/dao/daoFactory")().then(function(db){


                    db.collection("dream_product").find( {} ).toArray( ( error, results ) => {

                        populateList( results, table, resolve );
                        /*for(var i = 0; i < results.length; i++ ){
                            if( ! results[i]["id"] ) results[i]["id"] = results[i]["_id"]
                        }
                        table["list"] = results; */
                        //resolve( table );	
                    });
                    //resolve( table );					
				});
		});

		return promise;
	},
	"loadFormData" : function( request ){

		var defaultFormData = {
			"entityname" : "dream_product",
			"title" : "Produto",
			"path" : "Cadastros > Planos > ",
			"formback" : "/pages/dream/list?entity=dream_product",
			"primary" : {
				"modaltitle" : "Dados do chamado",
				"modalid" : "modal-primary",
				"type" : "v1",
				"model" : {
						"name" : "",
                        freethrow : false,
                        limitedthrow : false,
                        fixedthrow : false,
                        secondfreethrow : false,
                        dofacilitythrow : "N",
                        dofixedthrow : "N",
                        dosecondfixedthrow : "N",
						secondfixedthrow : "N",
						acessiontax : "N"
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
								type: 'select',
								label: 'Empresa',
								model: 'company',
								id : "input-priority",
								visible: true,
								readonly: false,
								disabled: false,
								required: true,
                                options : []
							},
                            {
								type: 'select',
								label: 'Categoria',
								model: 'category',
								id : "input-priority",
								visible: true,
								readonly: false,
								disabled: false,
								required: true,
                                options : []
							},
							{
								type: 'input',
								label: 'plano',
								model: 'name',
								id : "input-priority",
								visible: true,
								readonly: false,
								disabled: false,
								required: true
							},
							{
								type: 'number',
								label: 'Valor da cota',
								model: 'pricequote',
								id : "input-pricequote",
								visible: true,
								readonly: false,
								disabled: false,
								required: false
							},
                           {
								type: 'number',
								label: 'Valor da parcela',
								model: 'pricepotion',
								id : "input-pricepotion",
								visible: true,
								readonly: false,
								disabled: false,
								required: false
							},
							{
								type: 'select',
								label: 'Taxa de adesão',
								visible: true,
								model: 'acessiontax',
								id : "input-acessiontax",
								readonly: false,
								disabled: false,
								required: false,
                                options : [
                                    {
                                        "id" : "Y",
                                        "value" : "Sim"
                                    },
                                    {
                                        "id" : "N",
                                        "value" : "Não"
                                    }
                                ]
							},
							{
								type: 'number',
								label: 'Valor da taxa de adesão',
								model: 'acessiontaxnumber',
								id : "input-acessiontaxnumber",
								visible: true,
								readonly: false,
								disabled: false,
								required: false
							},
                            {
								type: 'number',
								label: 'Prazo do plano',
								model: 'productduedate',
								id : "input-productduedate",
								visible: true,
								readonly: false,
								disabled: false,
								required: false
							},
                            {
								type: 'number',
								label: 'Prazo do grupo',
								model: 'groupduedate',
								id : "input-groupduedate",
								visible: true,
								readonly: false,
								disabled: false,
								required: false
							},
                            {
								type: 'checkbox',
								label: 'Lance livre',
								model: 'freethrow',
								id : "input-freethrow",
								visible: true,
								readonly: false,
								disabled: false,
								required: false
							},
                            {
								type: 'checkbox',
								label: 'Lance limitado',
								model: 'limitedthrow',
								id : "input-limitedthrow",
								visible: true,
								readonly: false,
								disabled: false,
								required: false
							},
                            {
								type: 'checkbox',
								label: 'Lance Fixo',
								model: 'fixedthrow',
								id : "input-fixedthrow",
								visible: true,
								readonly: false,
								disabled: false,
								required: false
							},
                            {
								type: 'checkbox',
								label: 'Segundo lance fixo',
								model: 'secondfreethrow',
								id : "input-secondfreethrow",
								visible: true,
								readonly: false,
								disabled: false,
								required: false
							},
                            {
								type: 'select',
								label: 'Lance facilitado',
								model: 'dofacilitythrow',
								id : "input-priority",
								readonly: false,
								disabled: false,
								required: false,
								visible: true,
								onchange : [
									{
										"type" : "if",
										"parameter" : "dofacilitythrow",
										"value" : "Y",
										"actions" : [
											{
												"fieldname" : "dofacilitythrowtype",
												"property" : "visible",
												"value" : true
											},
											{
												"fieldname" : "facilitythrowtypequantity",
												"property" : "visible",
												"value" : true
											}
										]// actions
									},
									{
										"type" : "if",
										"parameter" : "dofacilitythrow",
										"value" : "N",
										"actions" : [
											{
												"fieldname" : "dofacilitythrowtype",
												"property" : "visible",
												"value" : false
											},
											{
												"fieldname" : "facilitythrowtypequantity",
												"property" : "visible",
												"value" : false
											}
										]// actions
									}
								],
                                options : [
                                    {
                                        "id" : "Y",
                                        "value" : "Sim"
                                    },
                                    {
                                        "id" : "N",
                                        "value" : "Não"
                                    }
                                ]
							},
							{
								type: 'select',
								label: 'Tipo',
								visible: true,
								model: 'dofacilitythrowtype',
								id : "input-dofacilitythrowtype",
								readonly: false,
								disabled: false,
								required: false,
                                options : [
                                    {
                                        "id" : "Percentual",
                                        "value" : "Percentual"
                                    },
                                    {
                                        "id" : "Parcela",
                                        "value" : "Parcela"
                                    }
                                ]
							},
							{
								type: 'number',
								label: 'Quantidade',
								model: 'facilitythrowtypequantity',
								id : "input-facilitythrowtypequantity",
								visible: true,
								readonly: false,
								disabled: false,
								required: false
							},
                            {
								type: 'select',
								label: 'Lance fixo',
								model: 'dofixedthrow',
								id : "input-priority",
								visible: true,
								readonly: false,
								disabled: false,
								required: false,
								onchange : [
									{
										"type" : "if",
										"parameter" : "dofixedthrow",
										"value" : "Y",
										"actions" : [
											{
												"fieldname" : "dofixedthrowtype",
												"property" : "visible",
												"value" : true
											},
											{
												"fieldname" : "fixedthrowtypequantity",
												"property" : "visible",
												"value" : true
											}
										]// actions
									},
									{
										"type" : "if",
										"parameter" : "dofixedthrow",
										"value" : "N",
										"actions" : [
											{
												"fieldname" : "dofixedthrowtype",
												"property" : "visible",
												"value" : false
											},
											{
												"fieldname" : "fixedthrowtypequantity",
												"property" : "visible",
												"value" : false
											}
										]// actions
									}
								],
                                options : [
                                    {
                                        "id" : "Y",
                                        "value" : "Sim"
                                    },
                                    {
                                        "id" : "N",
                                        "value" : "Não"
                                    }
                                ]
							},
							{
								type: 'select',
								label: 'Tipo',
								visible: true,
								model: 'dofixedthrowtype',
								id : "input-dofixedthrowtype",
								readonly: false,
								disabled: false,
								required: false,
                                options : [
                                    {
                                        "id" : "Percentual",
                                        "value" : "Percentual"
                                    },
                                    {
                                        "id" : "Parcela",
                                        "value" : "Parcela"
                                    }
                                ]
							},
							{
								type: 'number',
								label: 'Quantidade',
								model: 'fixedthrowtypequantity',
								id : "input-groupduedate",
								visible: true,
								readonly: false,
								disabled: false,
								required: false
							},
                            {
								type: 'select',
								label: 'Segundo lance fixo',
								model: 'secondfixedthrow',
								id : "input-priority",
								visible: true,
								readonly: false,
								disabled: false,
								required: false,
								onchange : [
									{
										"type" : "if",
										"parameter" : "secondfixedthrow",
										"value" : "Y",
										"actions" : [
											{
												"fieldname" : "dosecondthrowtype",
												"property" : "visible",
												"value" : true
											},
											{
												"fieldname" : "secondthrowtypequantity",
												"property" : "visible",
												"value" : true
											}
										]// actions
									},
									{
										"type" : "if",
										"parameter" : "secondfixedthrow",
										"value" : "N",
										"actions" : [
											{
												"fieldname" : "dosecondthrowtype",
												"property" : "visible",
												"value" : false
											},
											{
												"fieldname" : "secondthrowtypequantity",
												"property" : "visible",
												"value" : false
											}
										]// actions
									}
								],
                                options : [
                                    {
                                        "id" : "Y",
                                        "value" : "Sim"
                                    },
                                    {
                                        "id" : "N",
                                        "value" : "Não"
                                    }
                                ]
							},
							{
								type: 'select',
								label: 'Tipo',
								visible: true,
								model: 'dosecondthrowtype',
								id : "input-dosecondthrowtype",
								readonly: false,
								disabled: false,
								required: false,
                                options : [
                                    {
                                        "id" : "Percentual",
                                        "value" : "Percentual"
                                    },
                                    {
                                        "id" : "Parcela",
                                        "value" : "Parcela"
                                    }
                                ]
							},
							{
								type: 'number',
								label: 'Quantidade',
								model: 'secondthrowtypequantity',
								id : "input-secondthrowtypequantity",
								visible: true,
								readonly: false,
								disabled: false,
								required: false
							},
							{
								type: 'textarea',
								label: 'Informações adicionais',
								model: 'aditionalinformation',
								id : "input-aditionalinformation",
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
                    db.collection("dream_product").findOne({ "_id" : ObjectId(entityid) }, ( error, to ) => {

                        to["id"] = to["_id"];
                        defaultFormData.primary.model = to;
						beforeRenderValidations( defaultFormData.primary.model, defaultFormData.primary.schema.fields );

						//populateDetails( defaultFormData, entityid, resolve );

                        // empresas
                        db.collection("dream_company").find( {} ).toArray( ( error, results ) => {

                            var companies = [];
                            for(var i = 0; i < results.length; i++ ){

                                var company = {};
                                company["id"] = results[i]["_id"];
                                company["value"] = results[i]["name"];

                                companies.push( company );
                            }
                            
                            defaultFormData.primary.schema.fields[1].options = companies;
                            
                            //resolve( defaultFormData );

                            // Categorias
                            db.collection("dream_category").find( {} ).toArray( ( error, categoriesList ) => {

                                var categories = [];
                                for(var i = 0; i < categoriesList.length; i++ ){

                                    var category = {};
                                    category["id"] = categoriesList[i]["_id"];
                                    category["value"] = categoriesList[i]["name"];

                                    categories.push( category );
                                }
                                
                                defaultFormData.primary.schema.fields[2].options = categories;
                                
                                resolve( defaultFormData );	
                            });	
                        });

                        //resolve( defaultFormData );	
                    });
                });
            });
        }
        else{
            promise = new Promise( function(resolve){

                // empresas
                require("../../../src/dao/daoFactory")().then(function(db){
                        db.collection("dream_company").find( {} ).toArray( ( error, results ) => {

                            var companies = [];
                            for(var i = 0; i < results.length; i++ ){

                                var company = {};
                                company["id"] = results[i]["_id"];
                                company["value"] = results[i]["name"];

                                companies.push( company );
                            }
                            
                            defaultFormData.primary.schema.fields[1].options = companies;
                            
                            //resolve( defaultFormData );

                            // Categorias
                            db.collection("dream_category").find( {} ).toArray( ( error, categoriesList ) => {

                                var categories = [];
                                for(var i = 0; i < categoriesList.length; i++ ){

                                    var category = {};
                                    category["id"] = categoriesList[i]["_id"];
                                    category["value"] = categoriesList[i]["name"];

                                    categories.push( category );
                                }
                                
                                defaultFormData.primary.schema.fields[2].options = categories;
                                
								beforeRenderValidations( defaultFormData.primary.model, defaultFormData.primary.schema.fields );

                                resolve( defaultFormData );	
                            });	
                        });
                });
                //resolve( defaultFormData );
            });
        }

		return promise;
	}
};

module.exports = constructor;