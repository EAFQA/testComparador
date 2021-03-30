

// var root = "https://www.comparadordeconsorcio.com.br/";
// var serviceroot = "https://www.comparadordeconsorcio.com.br/services/";

var root = "/";
var serviceroot = "/services/";


var showContact = function(){
		app.vm.showContact = true;
		app.vm.showRange = false;
};

var saveLead = function( model ){

	var url = serviceroot + "dream_lead";

	/*

	axios.post( url, model ).then( function(response){

		if( response && response.data && response.data._id ){
			model["_id"] = response.data._id;
		}
		//location.href ="products.html";
	});*/
}

var saveLeadAndRedirect = function( model, origin, landingid ){

	if( ( ! model.name || model.name == "" ) 
		|| ( ! model.email || model.email == "" )
		|| ( ! model.cellphone || model.cellphone == "") ){

			alert("Por favor preencha os campos obrigatórios");
			return;
		}


	
	if( model.cellphone && model.cellphone.length && model.cellphone.length > 5 ){
		
		var cellphone = model.cellphone.substring(5);
		if( cellphone.charAt(0) != "9" ){
			alert("O celular deve iniciar com 9 ");
			return;
		};

		if( cellphone == "99999-9999"){
			alert("Celular inválido");
			return;
		}

		if( cellphone == "00000-00000"){
			alert("Celular inválido");
			return;
		}

		if( cellphone == "11111-1111"){
			alert("Celular inválido");
			return;
		}
	}


	var url = serviceroot + "dream_lead";

	var filtered = app.vm.categories.filter( function(obj){
		return obj._id == model["category"];
	});

	var categoryname = "";
	if( filtered && filtered.length > 0 ){
		categoryname = filtered[0]["name"];
	}

	if( model["_id"] ){
		url += "/" + model["_id"];
	}

	model["categoryname"] = categoryname;
	model["leaddate"] = new Date();
	model["origin"] = "Site principal";
	model["isnew"] = true;

	if( origin ){
		model["origin"] = origin;
	}

	if( landingid ){
		model["landingid"] = landingid;
	}
	
	axios.post( url, model ).then( function(response){

		model["_id"] = response.data._id;

		var text = "?id=1";
		for( var m in model ){

			var parameter = "&" + m + "=" + model[m];
			text = text + parameter;
		}

		if( app.vm.landing ){
			location.href = "../../products.html" + text;
		}
		else{
			location.href ="products.html" + text;
		}
		
	});
}

var onlyRedirect = function( model ){

	console.log("only redirect");

	var url = serviceroot + "dream_lead";

	var filtered = app.vm.categories.filter( function(obj){
		return obj._id == model["category"];
	});

	var categoryname = "";
	if( filtered && filtered.length > 0 ){
		categoryname = filtered[0]["name"];
	}

	model["categoryname"] = categoryname;

	//axios.post( url, model ).then( function(response){

		var text = "?id=1";
		for( var m in model ){

			var parameter = "&" + m + "=" + model[m];
			text = text + parameter;
		}
		location.href ="products.html" + text;
	//});
}


var toggleCheck = function( product ){

	if( product.checked == true ){
		product.checked = false;

		var filtered = app.vm.selectedProducts.filter( function(obj){
			return obj._id != product._id;
		});

		app.vm.selectedProducts = filtered;
	} 
	else{
		product.checked = true;
		app.vm.selectedProducts.push( product );
	} 
}

var callSpecialist = function( product ){

	if( product.checked == false ) toggleCheck( product );

	app.vm.productfinished = true;

	
    $(window).scrollTop(0);

	var params = {
		"meta" : app.vm.meta,
		"productsSelecteds" : app.vm.selectedProducts
	};

	var endpoint = root + "api/dream/sendmail/lead";

	axios.post( endpoint, params ).then( function(response){

	});

}

var callAction = function( model ){

	if( ( ! model.name || model.name == "" ) 
		|| ( ! model.cellphone || model.cellphone == "") ){

			$.notify("Por favor preencha os campos obrigatórios", "error");
			return;
	}

	if( location.href.indexOf("?name=") > -1  ){
		var index = location.href.indexOf("?name=") + 6;
		var partnerlink = location.href.substring( index );

		model["partnerlink"] = partnerlink;	
	}
	
	var filtered = app.vm.categories.filter( function(obj){
		return obj._id == model["category"];
	});

	var categoryname = "";
	if( filtered && filtered.length > 0 ){
		categoryname = filtered[0]["name"];
	}

	model["categoryname"] = categoryname;

	axios.post("/api/dream/sendmail/call", model ).then( function(repsonse){
		$.notify("E-mail enviado com sucesso", "success");
	});
	
}

var scheduleVisita = function( model ){

	if( ( ! model.name || model.name == "" ) 
		|| ( ! model.cellphone || model.cellphone == "") ){

			$.notify("Por favor preencha os campos obrigatórios", "error");
			return;
	}

	if( location.href.indexOf("?name=") > -1  ){
		var index = location.href.indexOf("?name=") + 6;
		var partnerlink = location.href.substring( index );

		model["partnerlink"] = partnerlink;	
	}
	
	var filtered = app.vm.categories.filter( function(obj){
		return obj._id == model["category"];
	});

	var categoryname = "";
	if( filtered && filtered.length > 0 ){
		categoryname = filtered[0]["name"];
	}

	model["categoryname"] = categoryname;

	axios.post("/api/dream/sendmail/visita", model ).then( function(repsonse){
		$.notify("E-mail enviado com sucesso", "success");
	});
}

var toggleSimulator = function(){

	app.vm.showSimulator = !app.vm.showSimulator; 
}

var getPostsFromBlog = function(){

	var endpoint = "https://api.medium.com/feed/";
	var blogname = "@huguinho";

	axios.get( endpoint + blogname ).then( function(response){
		console.log("response ", response );
	});
};

var onChangeCategory = function( categoryvalue ){

	app.vm.meta.isloading = true;

	console.log("categoryvalue ", categoryvalue );

	var endpoint = "/api/dream/minvalue?categoryid=" + categoryvalue;
	//app.vm.model.endrangevalue = 30000

	axios.get( endpoint ).then( function(response){
		console.log("response min value", response.data.minvalue );
		app.vm.model.endrangevalue = response.data.minvalue;

		app.vm.meta.isloading = false;
	});
}

if( window.VMoney ){
	Vue.use(VMoney, {precision: 4})
}

if( window.VueTheMask ){
	Vue.use( window.VueTheMask );
}

var app = new Vue({
	  el: '#localScope',
	  data: {
		money: {
          decimal: ',',
          thousands: '.',
          prefix: 'R$ ',
          suffix: ' ',
          precision: 0,
          masked: false
        },
		fullmoney: {
		  decimal: ',',
          thousands: '.',
          prefix: 'R$ ',
          suffix: ' ',
          precision: 2,
          masked: false
		},
	    message: 'Hello Vue!',
	    vm : {
				"model" : {
						"category" : null,
						"optionsimulador" : "B",
						"parcelaendrangevalue" : 100,
						"initrangevalue" : 20000,
						"endrangevalue" : 5000,
						"whatsapp" : true,
						"contacttime" : "Manhã"
				},
				"meta" : {
					"loading" : false
				},
				"products" : [],
				"employes" : [],
				"categories" : [],
				"rangevalue" : 20000,
				"showRange" : true,
				"showSimulator" : false,
				"showContact" : false,
				"loadingSimulation" : true,
				"landing" : {
					'logo-file' : ''
				},
				"isLoading" : false,
				"productfinished" : false,
				"selectedProducts" : [],
				"contacttime" : [
					{ 
						"id" : "Manhã",
						"name" : "Manhã"
					},
					{ 
						"id" : "Tarde",
						"name" : "Tarde"
					},
					{ 
						"id" : "Noite",
						"name" : "Noite"
					}
				]
	    }
	  },
	  methods : {
				"showContact" : showContact,
				"saveLead" : saveLead,
				"saveLeadAndRedirect" : saveLeadAndRedirect,
				"toggleCheck" : toggleCheck,
				"callSpecialist" : callSpecialist,
				"toggleSimulator" : toggleSimulator,
				"callAction" : callAction,
				"scheduleVisita" : scheduleVisita,
				"onlyRedirect" : onlyRedirect,
				"onChangeCategory" : onChangeCategory
		},
	  created: function(){

          var internal = this;

		  //getPostsFromBlog();

          axios.get( serviceroot + "dream_company").then( function(response){
              internal.vm.employes = response.data;

							axios.get( serviceroot + "dream_category").then( function( responseCategory){
									internal.vm.categories = responseCategory.data;

									if( responseCategory.data && responseCategory.data.length > 0 ){
										 internal.vm.model.category = responseCategory.data[0]["_id"];

										 onChangeCategory( responseCategory.data[0]["_id"] ); 
									}

									//
									setTimeout(function(){  
                    
										console.log("carousel");
										$(".owl-carousel").owlCarousel({
											rtl:true,
											loop:true,
											margin:10,
											nav:true,
											responsive:{
												0:{
													items:2
												},
												600:{
													items:9
												}
											},
											autoplay:true,
											autoplayTimeout:2000,
											autoplayHoverPause:true
										});
							
									}, 500);
								  });
          });
	  }
});//
