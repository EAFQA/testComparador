

var ObjectId = require('mongodb').ObjectID;
//const moment = require("moment");

var getDetailTask = function(){
	return {
					"title" : "Tarefas",
					"description" : "Registre aqui todas as tarefas para esse chamado",
					"size" : "col-sm-4", // tamanho de colunas por bootstrap
					"type" : "without-button",
					"modalid" : "modal-tarefas",
					"modaltitle" : "Tarefa",
					"model" : {
						"id" : 1,
						"name" : "202011070001",
						"cxb" : "",
						"selectoption" : "",
						"numero" : 2,
						"data" : ""
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
								label: 'Nome',
								model: 'name',
								id : "input-name",
								readonly: false,
								disabled: false,
								required: true
							},
							{
								type: 'checkbox',
								label: 'Teste Checkbox',
								model: 'cxb',
								name : "input-checkbox",
								readonly: false,
								disabled: false,
								required: false
							},
							{
								type: 'select',
								label: 'Teste Select',
								model: 'selectoption',
								name : "input-select",
								readonly: false,
								disabled: false,
								required: false,
								options: [
									{
										"id" : 1,
										"value" : "opção 1"
									},
									{
										"id" : 2,
										"value" : "opção 2"
									}
								]
							},
							{
								type: 'number',
								label: 'Teste número',
								model: 'numero',
								id : "input-numberid",
								readonly: false,
								disabled: false,
								required: false
							},
							{
								type: 'datetime',
								label: 'Teste Data',
								model: 'data',
								id : "input-data",
								readonly: false,
								disabled: false,
								required: false
							},
							{
								type: 'file',
								label: 'Teste Arquivo',
								model: 'file',
								id : "input-file",
								readonly: false,
								disabled: false,
								required: false
							}
						]
					},
					"records" : [
						{
							"id" : 1,
							"title" : "Ligar para o cliente",
							"description" : "Será necessário ligar para o cliente para agendar um atendimento",
							"content" : {
								"Status :" : "Em atendimento",
								"Previsão :" : "13/06/2020"
							}
						}// record
					] // end record
				}
};

var getDetailEmail = function(){
	return {
					"title" : "E-mails",
					"description" : "",
					"size" : "col-sm-8", // tamanho de colunas por bootstrap
					"type" : "with-button",
					"modalid" : "modal-emails",
					"records" : [
						{
							"id" : 1,
							"title" : "Assunto do e-mail com elogio",
							"description" : "Essa foi uma mensagem enviada através do CRM",
							"image" : "../../img/crm/users/2.jpg",
							"content" : {
								"De:" : "atendimento@nextsolucoes.digital",
								"Para:" : "atendimento@nextsolucoes.digital"
							}
						}// record
					] // end record
				};
};

var getDetailAnotacoes = function(){
	return {
					"title" : "Anotações",
					"description" : "",
					"size" : "col-sm-4", // tamanho de colunas por bootstrap
					"type" : "with-button",
					"modalid" : "modal-anotacoes",
					"records" : [
						{
							"id" : 1,
							"title" : "Primeira Anotação sobre esse chamado",
							"description" : "Esse foi o registro de envio de mensagem para o cliente",
							"content" : {
							}
						}// record
					] // end record
				};
};

var getDetailAnexos = function(){
	return {
					"title" : "Anexos",
					"description" : "",
					"size" : "col-sm-4", // tamanho de colunas por bootstrap
					"type" : "with-button",
					"modalid" : "modal-anexos",
					"records" : [
						{
							"id" : 1,
							"title" : "Primeiro anexo do chamado",
							"description" : "",
							"content" : {
							}
						}// record
					] // end record
				};
};

var getDetailLigacoes = function(){
	return {
					"title" : "Ligações",
					"description" : "Registros de ligações feitos para esse chamado",
					"size" : "col-sm-4", // tamanho de colunas por bootstrap
					"type" : "with-button",
					"modalid" : "modal-ligacoes",
					"records" : [
						{
							"id" : 1,
							"title" : "Registro de ligação para o cliente",
							"description" : "Esse foi o registro de envio de mensagem para o cliente",
							"content" : {
								"Para" : " (11) 00000-0000"
							}
						}// record
					] // end record
				};
};

var getDetailWhatsapp = function(){
	return {
					"title" : "Whatsapp",
					"description" : "",
					"size" : "col-sm-6", // tamanho de colunas por bootstrap
					"type" : "with-button",
					"modalid" : "modal-whatsapp",
					"records" : [
						{
							"id" : 1,
							"title" : "Mensagem whatsapp para o cliente",
							"description" : "Esse foi o registro de envio de mensagem para o cliente",
							"content" : {
								"Para" : " (11) 00000-0000"
							}
						}// record
					] // end record
				};
};

var getDetailSms = function(){
	return {
					"title" : "SMS",
					"description" : "",
					"size" : "col-sm-6", // tamanho de colunas por bootstrap
					"type" : "with-button",
					"modalid" : "modal-sms",
					"records" : [
						{
							"id" : 1,
							"title" : "Mensagem sms para o cliente",
							"description" : "Esse foi o registro de envio de mensagem para o cliente",
							"content" : {
								"Para" : " (11) 00000-0000"
							}
						}// record
					] // end record
				};
};

var constructor =  {

	"beforeSave" : function( to, isExternal, externalEntity ){

	},
	"afterSave" : function( old, newto, entityname ){

	},
	"loadTable" : function( resquest, issort ){

		var title = "Chamados";
		var path = "Atendimento > Chamados > ";
		
		var table = {
			"entityname" : "next_ticket",
			"title" : title,
			"path" : path,
			"showbutton" : true,
			"formedit" : "/pages/crm/edit?entity=next_ticket",
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
			      { text: 'Protocolo', value: 'protocol' },
				  { text: 'Cliente', value: 'client' },
                  { text: 'Tipo de Solicitação', value: 'typesolicitation' },
                  { text: 'Assunto', value: 'subject' },
				  { text: 'Status', value: 'status' },
			      { text: 'Ações', value: 'actions', sortable: false },
		    ],
		    "list" : [
				{
					"id" : 1,
					"protocol" : "202011070001",
                    "client" : "First Client",
                    "typesolicitation" : "Elogio",
                    "subject" : "Meu produto",
                    "status" : "Em andamento"
				}
		    ]
		}

		var promise = new Promise( function( resolve, reject){
				require("../../../src/dao/daoFactory")().then(function(db){
                    resolve( table );						
				});
		});

		return promise;
	},
	"loadFormData" : function( request ){
		
		var defaultFormData = {
			"entityname" : "next_account",
			"title" : "Chamado",
			"path" : "Atendimento > Chamados > ",
			"primary" : {
				"background": "../../img/crm/background/tickets-bg.jpg",
				"title" : "First Client",
				//"image" : "../../img/crm/users/_4.jpg",
				"content" : {
					"Protocolo:": "202011070001",
					"Tipo de solicitação:": "Elogio",
					"Assunto:": "Meu produto",
					"Prioridade:": "Alta",
					"Canal de origem:": "Whatsapp",
					"Status:": "Em atendimento"
				},
				"description" : "Gostaria de registrar um elogio sobre esse produto que está muito bom !",
				"modaltitle" : "Dados do chamado",
				"modalid" : "modal-primary",
				"type" : "v2",
				"model" : {
						"id" : 1,
						"name" : "202011070001",
						"cxb" : "",
						"selectoption" : "",
						"numero" : 2,
						"data" : ""
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
								label: 'Nome',
								model: 'name',
								id : "input-name",
								readonly: false,
								disabled: false,
								required: true
							},
							{
								type: 'checkbox',
								label: 'Teste Checkbox',
								model: 'cxb',
								name : "input-checkbox",
								readonly: false,
								disabled: false,
								required: false
							},
							{
								type: 'select',
								label: 'Teste Select',
								model: 'selectoption',
								name : "input-select",
								readonly: false,
								disabled: false,
								required: false,
								options: [
									{
										"id" : 1,
										"value" : "opção 1"
									},
									{
										"id" : 2,
										"value" : "opção 2"
									}
								]
							},
							{
								type: 'number',
								label: 'Teste número',
								model: 'numero',
								id : "input-numberid",
								readonly: false,
								disabled: false,
								required: false
							},
							{
								type: 'datetime',
								label: 'Teste Data',
								model: 'data',
								id : "input-data",
								readonly: false,
								disabled: false,
								required: false
							},
							{
								type: 'file',
								label: 'Teste Arquivo',
								model: 'file',
								id : "input-file",
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

		defaultFormData.details.push( getDetailTask() );
		defaultFormData.details.push( getDetailEmail() );
		defaultFormData.details.push( getDetailAnotacoes() );
		defaultFormData.details.push( getDetailAnexos() );
		defaultFormData.details.push( getDetailLigacoes() );
		defaultFormData.details.push( getDetailWhatsapp() );
		defaultFormData.details.push( getDetailSms() );
		
		var promise = new Promise( function(resolve){
			resolve( defaultFormData );
		});
			

		return promise;
	}
};

module.exports = constructor;