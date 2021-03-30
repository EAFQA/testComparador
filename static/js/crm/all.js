

$(".preloader").fadeOut();


var headers = []
var list = [];

var defaultEntityData = {
	"headers" : headers,
	"list" : list,
	"title" : "Nome da entidade",
	"path" : "Caminho do menu > Tela > ",
	"selected" : []
}

var changeFieldValue = function( fields, fieldname, parameter, value ){

	for( var i = 0; i < fields.length; i++ ){
		if( fields[i]["model"] == fieldname ){
			fields[i][ parameter ] = value;
			break;
		}
	}
}

var loadUsers = function( app ){

	var endpoint = "/services/users";

	axios.get( endpoint ).then( function(userResponse ){

		var users = userResponse.data;

		users.sort( function(a,b){
			if( a.name == b.name ) return 0;
			else if ( a.name < b.name ) return -1;
			else return 1;
		});

		app.vm.users = userResponse.data;
	});
	//app.vm.users;
};

var loadStatus = function( app ){

	var endpoint = "/services/dream_leadstatus";
	
	//statusList
	axios.get( endpoint ).then( function( response ){

		var statusList = response.data;
		statusList.sort( function(a,b){
			if( a.name == b.name ) return 0;
			else if ( a.name < b.name ) return -1;
			else return 1;
		});

		app.vm.statusList = statusList;
	});
}

var changeLeadStatus = function(){

	var leadstatus = app.vm.statusmodel;
	console.log("lead status", leadstatus );


	if( ! app.vm.originalList ) app.vm.originalList = app.vm.entitydata.list;


	if( ! leadstatus || leadstatus == "" ){
		app.vm.entitydata.list = app.vm.originalList;
		return;
	}

	var filtered = app.vm.entitydata.list.filter(function(obj){
		if( obj["leadstatusfk"] && obj["leadstatusfk"].length > 0 ){

			var status = obj["leadstatusfk"][0];
			if( status["_id"] == leadstatus ) return true;
			else return false;
		}
		else{
			return false;
		}
	});

	app.vm.entitydata.list = filtered;

}

var methods = {
	app : {},
	init : function(){
		app.openForm("/pages/dream/list?entity=next_account");
	},
	getScope : function(){
		return this.vm;
	},
	loadScript : function(src) {
	    return new Promise(function (resolve, reject) {
	        var s;
	        s = document.createElement('script');
	        s.src = src;
	        s.onload = resolve;
	        s.onerror = reject;
	        document.head.appendChild(s);
	    });
	},
	openForm : function( link, isCollapseSidebar ){ 
		this.loadRightContent( link, app, isCollapseSidebar );
	},
	loadRightContent : function( url, app, isCollapseSidebar ){

		app.showSpinner = true;
		app.showList = false;
		app.showEdit = false;

		axios({ method: "GET", "url": url }).then( function( result ){

	  		if( result.data.entitydata ){
	  			app.vm.entitydata = result.data.entitydata;
	  		}
	  		else{
	  			app.vm.entitydata = defaultEntityData;
	  		}

	  		if( result.data && result.data.type && result.data.type == "list" ){
	  			app.showList = true;
				app.showIframe = false;
				app.showEdit = false;

				//app.vm.formdata = null;
	  		}
			else if( result.data && result.data.type && result.data.type == "edit" ){
				
				//app.vm.formdata = result.data.formdata;

				app.vm.formdata = result.data.formdata;

				app.showList = false;
				app.showIframe = false;
				app.showEdit = true;
			}
	  		else{
	  			app.showList = false;
				app.showEdit = false;
				app.showIframe = true;

				//app.vm.formdata = null;
				
	  			app.vm.form = result.data.formdata;

				var formlink  = "";
				if( result.data.formlink ) formlink = result.data.formlink;
				else formlink += url //+ ".html";

	  			app.vm.html.rightside = formlink; //"/person/profile.html";//result.data.html;
	  		}

			if( isCollapseSidebar && isCollapseSidebar == true ){ 
				$("#localScope").removeClass("show-sidebar");
			}

			app.showSpinner = false;

	  		/*
	  		var scriptList = result.data.scriptList;

	  		if( scriptList && scriptList.length > 0 ){
	  			var index = 0;
	  			var source = scriptList[ index ];
		  		var callback = function(index, list){

		  			if( (index + 1 ) == list.length ) return

		  			var source = list[ index + 1 ];
		  			app.loadScript( source ).then(function(){
		  				callback( index + 1, list );
		  			});
		  		}

		  		app.loadScript( source ).then(function(){
	  				callback( index, scriptList );
	  			});
	  		}*/
	  		
	  		
	    });
	},
	openModal : function( detail, modalid ){

		//profile.currentmodal.title = detail.title;
		//profile.currentmodal.schema = detail.schema;
		//profile.currentmodal.model = detail.modal;


		$("#" + modalid ).modal();

		//$("body").animate({scrollTop:-300}, 'slow'); //slow, medium, fast
	},
	loadDatetime : function( elementid ){
		console.log("load datetime ", elementid );
	},
	"tableActions" : {
		"editItem" : function(item){ 


			if( item.ismodal && item.ismodal == true ){

				app.openModal( null, item.modalid );
				return;
			}
			
			var url = "";

			if( app.vm.entitydata.anotheredit ){
				url = app.vm.entitydata.anotheredit;
				if( item.id ) url += "&id=" + item.id;
				
				app.vm.recordid = item.id;
			}
			else{
				url = app.vm.entitydata.formedit;
				url += "&id=" + item.id;
			}

			app.openForm( url );

		},
		modalEdit : function( item, modalid, entityname, detail ){

			var url = "/services/" + entityname + "/" + item.id;
			axios.get( url ).then( function( result ){

				detail.model = result.data
				app.openModal( detail, modalid );
			});
			
			return;
		},
		modalDelete : function( item, entityname, parentEntity, parentid ){
			
			var url = "/services/" + entityname + "/" + item.id;
			var link = "/pages/dream/edit?entity=" + parentEntity + "&id=" + parentid ;

			axios.delete( url ).then( function( result ){
				$.notify("Registro removido com sucesso", {
					"autoHide" : true,
					"className" : "error"
				});
				app.openForm( link );
			});

		},
		deleteItem : function(item){

			var confirm = window.confirm("Deseja remover o registro ? ");

			if( ! confirm ) return;
			var entityname = app.vm.entitydata.entityname;
			var url = "/services/" + entityname + "/" + item.id;
			var link = "/pages/dream/list?entity=" + entityname;

			axios.delete( url ).then( function( result ){
				$.notify("Registro removido com sucesso", {
					"autoHide" : true,
					"className" : "error"
				});
				app.openForm( link );
			});
		},
		transferLead : function(item){
			
			app.vm.leadid = item._id;

			$("#modal_transfer").modal();
		}
	},
	"saveForm" : function(model, entityname, link, schema, callback, isModal ){
		
		var url = "/services/" + entityname;
		if( model && model.id ) url += "/" + model.id;

		// verificando os campos obrigatórios
		var requiredNotFill = false;

		if( schema ){
			for( var i = 0; i < schema.fields.length; i++ ){
				var field = schema.fields[i];

				if( field["required"] && field["required"] == true ){
					var fieldname = field["model"];

					if( ! model[ fieldname ] || model[ fieldname ] == "" ){
						var message = "Favor preencher o campo: " + field["label"];
						$.notify(message, {
							"autoHide" : true,
							"className" : "error"
						});

						requiredNotFill = true;
						break;
					}
				}
			}// for

		  if( requiredNotFill == true ) return;
		}

		axios.post( url, model ).then( function( result ){
			$.notify("Registro salvo com sucesso", {
				"autoHide" : true,
				"className" : "success"
			});
			
			if( ! isModal ) app.openForm( link );

			if( callback ) callback();
		});
	},
	"saveModal" : function( detail, entityname, formback, schema, modalid, parententity ){

		var model = detail.model
		var callback = function(){

			var url = "/pages/dream/edit?entity={entityname}&id={entityid}";
			url = url.replace("{entityname}", parententity );
			//url = url.replace("{entityid}", model.parentid );
			var redirectid = null;

			if( detail.parentname ){
				redirectid = model[ detail.parentname ];
			}
			else{
				redirectid = model.parentid;
			}

			url = url.replace("{entityid}", redirectid );


			axios.get( url ).then( function( result ){
				var formdata = result.data.formdata;

				app.vm.formdata = result.data.formdata

				if( modalid ){
					$("#" + modalid ).modal("hide");
				}
			
			});
			
			//refreshFn( entityparent, entityparentid, modalid );
		};

		if( ! model.id ) model.id = model._id;

		app.saveForm( model, entityname, formback, schema, callback, true );
	},
	"removeRecord" : function( entityname, modelid, link ){
		
		var url = "/services/" + entityname + "/" + modelid;
		
		axios.delete( url ).then( function( result ){
			$.notify("Registro removido com sucesso", {
				"autoHide" : true,
				"className" : "error"
			});
			app.openForm( link );
		});
	},
	onchangefile : function(name, files, model, fieldname ){
		
		var file = files[0];
		var formdata = new FormData();
		formdata.append("file", file );

		axios.post("/upload", formdata).then( function(result){
			
			if( result && result.data && result.data.filename ){
				var filetype = result.data.mimetype.substring( result.data.mimetype.indexOf("/") + 1 );
				var filename = result.data.filename;

				model[ fieldname + "-file" ] = result.data;
				model[ fieldname + "-file" ]["filepath"] = filename + "." + filetype;
			}

		});

	},
	"onSelectInputFile" : function(name, files, model, fieldname ){
		

		console.log("fieldname", fieldname );
		var file = files[0];
		var formdata = new FormData();
		formdata.append("file", file );

		axios.post("/upload", formdata).then( function(result){
			
			if( result && result.data && result.data.filename ){
				var filetype = result.data.mimetype.substring( result.data.mimetype.indexOf("/") + 1 );
				var filename = result.data.filename;

				model["file"] = result.data;
				model["file"]["filepath"] = filename + "." + filetype;
			}
		});
	},
	changeSelect : function( model, field, fields ){

		if( field["onchange"] ){
			for( var i = 0; i < field["onchange"].length; i++ ){
				var condition = field["onchange"][i];


				console.log("leadstatus ", model[ condition["parameter"] ] );
				console.log("condition", condition );
				
				if( condition["condition"] && condition["condition"] == "different" ){
					
					if( model[ condition["parameter"] ] != condition["value"] ){

						// do actions
						for( var j = 0; j < condition.actions.length; j++ ){
							var action = condition.actions[j];

							changeFieldValue( fields, action["fieldname"], action["property"], action["value"] );
						}
					}
				}
				else if( model[ condition["parameter"] ] == condition["value"] ){

					// do actions
					for( var j = 0; j < condition.actions.length; j++ ){
						var action = condition.actions[j];

						changeFieldValue( fields, action["fieldname"], action["property"], action["value"] );
					}
				}

			}// for
		}// field onchange

	},
	changeSelect2 : function(){
		console.log("change select 2");
	},
	transferLeadFn : function(){

		// app.vm.leadid
		// app.vm.leadowner 

		var leadid = app.vm.leadid;

		app.vm.leadid = null;

		var to = {
			"leadid" : leadid,
			"leadowner" : app.vm.leadowner
		};

		var endpoint = "/api/dream/transferlead";

		axios.post( endpoint, to ).then( function( response ){


			$("#modal_transfer").modal("hide");

			var url = "/pages/dream/list?entity=dream_lead";
			app.loadRightContent( url, app );
		});
	},
	changeLeadStatus : changeLeadStatus
}

var defaultFormData = {
	"title" : "Chamado",
	"path" : "Atendimento > Chamados > ",
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
		"type" : "v1",
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
		{
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
		},// end details
		{
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
		}, // with-button
		{
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
		},
		{
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
		},
		{
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
		},
		{
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
		},
		{
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
		},
		{
			"title" : "Template Vazio",
			"description" : "Exemplo de template vazio",
			"size" : "col-sm-4", // tamanho de colunas por bootstrap
			"type" : "with-button",
			"modalid" : "modal-templatevazio",
			"records" : [
				{
					"id" : 0,
					"title" : "Ainda não foram incluídos registros nessa seção",
					"description" : ""
				}// record
			] // end record
		},
		{
			"title" : "Template básico",
			"description" : "Exemplo de lista básica",
			"size" : "col-sm-8", // tamanho de colunas por bootstrap
			"type" : "basic",
			"selected" : true,
			"searchmodel" : "",
			"modalid" : "modal-basico",
			"headers" : [{
			        text: 'Código',
			        align: 'start',
			        sortable: false,
			        value: 'id',
			      },
			      { text: 'Nome', value: 'name' },
				  { text: 'Telefone', value: 'telphone' },
				  { text: 'E-mail', value: 'email' },
			      { text: 'Ações', value: 'actions', sortable: false }
			],
			"list": [{
					"id" : 1,
					"name" : "First Client",
					"telphone" : "55 11 00000 - 0000",
					"email" : "atendimento@nextsolucoes.digital",
					"ismodal" : true,
					"modalid" : "modal-basico"
				}
			]
		}
		
	]
};

var menuStructure = window.next.menu;
var alternativeMenu = window.next.alternativeMenu;

var app = new Vue({
	  el: '#main-wrapper',
	  vuetify: new Vuetify(),
	  data: {
	    message: 'Hello Vue!',
	    vm : {
			leadowner : null,
	    	html : {
	    		"rightside" : ""
	    	},
			statusList : [],
			users : [],
			statusmodel : "",
			searchmodel : "",
	    	methods : methods,
	    	entitydata : defaultEntityData,
			formdata : defaultFormData
	    },
	    showList : false,
		showEdit : false,
		showIframe : false,
		showSpinner : false,
	    menuStructure : []
	  },
	  methods : methods,
	  created: function(){

		var internalApp = this;

		axios.get("/loggeduser").then( function(responseUser){

			if( responseUser.data && responseUser.data._id ){
				console.log("usuário autenticado");

				if( responseUser.data.type == "admin" || responseUser.data.type == "master" ){
					internalApp.menuStructure = menuStructure;
				}
				else{
					internalApp.menuStructure = alternativeMenu;
				}

				//var url = "/pages/dream/list?entity=dream_lead";
				var url = "/render/dream/dashboard";

				loadUsers( internalApp );
				loadStatus( internalApp );

				methods["app"] = internalApp;
				internalApp.loadRightContent( url, internalApp );

			}
			else{
				location.href="/render/dream/login";
			}
			
		});

	  	
	  	
	  }
});//

Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">Você clicou em mim {{ count }} vezes.</button>'
})

Vue.component("dynamic-list", function(resolve, reject){
	axios({ method: "GET", "url": "/render/crm/list" }).then( function( result ){

		resolve({
		  props: ["message", "vm"],
	      template: result.data
	    });
	});
});

Vue.component("dynamic-edit", function(resolve, reject){
	axios({ method: "GET", "url": "/render/dream/edit-v2" }).then( function( result ){

		resolve({
		  props: ["message", "vm"],
	      template: result.data
	    });
	});
});

Vue.component("dynamic-details", function(resolve, reject){
	axios({ method: "GET", "url": "/render/dream/details" }).then( function( result ){

		resolve({
		  props: ["message", "vm"],
	      template: result.data
	    });
	});
});

Vue.component("payment-methods", function(resolve, reject){
	axios({ method: "GET", "url": "/mustache/dream/paymentmethods" }).then( function( result ){

		resolve({
		  props: ["message", "vm"],
	      template: result.data
	    });
	});
});

Vue.component("formgenerator", function(resolve, reject){
	axios({ method: "GET", "url": "/render/dream/formgenerator" }).then( function( result ){

		resolve({
		  props: ["message", "vm", "schema", "model"],
	      template: result.data
	    });
	});
});
