

Vue.use(VueFormGenerator)

var externalScope = window.parent.app;

if( externalScope.vm.form.data.model && externalScope.vm.form.data.model["file"] ){

	var filename = externalScope.vm.form.data.model["file"]["filename"];
	externalScope.vm.form.data.model["file"]["filepath"] = "../assets/images/uploads/" + filename;
}


var profile = new Vue({
	el: '#div-profile',
	vuetify: new window.parent.Vuetify(),
	data: {
		message: 'Hello Vue profile!',
		data : externalScope.vm.form.data,
		formdata : externalScope.vm.form.data.formdata,
		model: externalScope.vm.form.data.model,
    	schema: externalScope.vm.form.data.schema,
		entityname : externalScope.vm.form.data.entityname,
    	formOptions: {
        	validateAfterLoad: true,
        	validateAfterChanged: true,
        	validateAsync: true
    	},
		currentmodal : {
			"title" : "",
			"iframe" : "",
			"schema" : externalScope.vm.form.data.schema,
			"model" : externalScope.vm.form.data.model
		}
	},
	methods : {
		openForm : externalScope.openForm,
		saveForm : function( model, entityname, link, schema, modalid ){
			externalScope.saveForm(model, entityname, link, schema );
		},
		saveModal : function( model, entityname, link, schema, modalid, entityparent, entityparentid ){

			var callback = function(){
				refreshFn( entityparent, entityparentid, modalid );
				//profile.openForm( link );
			};

			externalScope.saveForm(model, entityname, link, schema, callback, true );

			
		},
		removeRecord : externalScope.removeRecord,
		onSelectInputFile : externalScope.onSelectInputFile,
		openModal : function( detail, modalid ){

			profile.currentmodal.title = detail.title;
			profile.currentmodal.schema = detail.schema;
			profile.currentmodal.model = detail.modal;


			$("#" + modalid ).modal();

			$("body").animate({scrollTop:-300}, 'slow'); //slow, medium, fast
		}
	},
	created: function(){
		  //console.log("created", this.data); 
		  
		/*
		setTimeout(function(){  
		   refreshFn();
		}, 3000); */
	}
});

var refreshFn = function( entityname, entityid, modalid ){
	
	var url = "/pages/fragment/edit?entity={entityname}&id={entityid}";
	url = url.replace("{entityname}", entityname );
	url = url.replace("{entityid}", entityid );

	axios.get( url ).then( function( result ){
		var formdata = result.data.formdata;

		profile.data = formdata.data,
		profile.formdata = formdata.data.formdata,
		profile.model = formdata.data.model,
    	profile.schema = formdata.data.schema,
		profile.entityname = entityname;

		if( modalid ){
			$("#" + modalid ).modal("hide");
		}
	
	});
	// Request URL: http://localhost:8080/pages/fragment/edit?entity=crc_leads&id=5ed5e2324f04304b9877369c

}