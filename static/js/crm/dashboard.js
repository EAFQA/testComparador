

var loadLeads = function( app ){

    var endpoint = "/pages/dream/list?entity=dream_lead";
    axios.get( endpoint ).then(function(response){
        var leadlist = response.data.entitydata.list;

        var generatedleads = leadlist.filter( function(obj){
            return obj.origin != "Site principal";
        });

        var scheduledLeads = leadlist.filter( function(obj){
            if( obj.returndate ) return true;
            else return false;
        });

        scheduledLeads.sort( function(a,b){
            if( a.returndate == b.returndate ) return 0;
            else if( a.returndate < b.returndate ) return -1;
            else return 1;
        });

        app.vm.entitydata = response.data.entitydata;


        app.vm.generatedleads = generatedleads.length;
        app.vm.receivedleads = leadlist.length;
        app.vm.scheduleleads = scheduledLeads.length;

        //app.vm.headers = response.data.entitydata.headers;
        app.vm.resultlist = scheduledLeads;
    });
};

var loadUsername = function( app ){

    axios.get("/loggeduser").then( function(responseUser){

	    if( responseUser.data && responseUser.data._id ){
            app.vm.username = responseUser.data.name;
        }
    });
};

var methods = {
    "tableActions" : {
        "editItem" : function(item){ 

            if( item.ismodal && item.ismodal == true ){

               // app.openModal( null, item.modalid );
                return;
            }
            
            var url = "";

            if( dashboard.vm.entitydata.anotheredit ){
                url = app.vm.entitydata.anotheredit;
                if( item.id ) url += "&id=" + item.id;
                
                app.vm.recordid = item.id;
            }
            else{
                url = dashboard.vm.entitydata.formedit;
                url += "&id=" + item.id;
            }

            window.parent.app.openForm( url );

        }
    }
};

var dashboard = new Vue({
	  el: '#dashboard-scope',
	  vuetify: new Vuetify(),
	  data: {
	    message: 'Hello Vue!',
	    vm : {
            "username" : "",
            "generatedleads" : 0,
            "receivedleads" : 0,
            "scheduleleads" : 0,
            "entitydata" : {},
            "resultlist" : [],
            "headers" : [
                { text: "Tipo do Bem", value: 'categories.name' },
                { text: 'Lead', value: 'name' },
                { text: "Origem", value: 'origin' },
                { text: "Data do agendamento", value: 'returndateformated' },
                { text: "Data da simulação", value: 'leaddateformated' },
                { text: "Novo lead", value: "newlead" },
                { text: "Status", value: "statusdescription" },
                { text: 'Ações', value: 'actions', sortable: false }
            ],
            "methods" : methods
	    }
	  },
	  methods : methods,
	  created: function(){

            var internalApp = this;	
            loadLeads( internalApp );
            loadUsername( internalApp );
	  } 
});//