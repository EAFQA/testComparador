

var loadProducts = function(){
    var url = window.decodeURIComponent( location.href );

    var parameters = url.substring( url.indexOf("?") + 1 );
    var list = parameters.split("&");
    var map = {};

    for( var i = 0; i < list.length; i++ ){
        var internal = list[i].split("=");

        map[ internal[0] ] = internal[1].trim();
    }

    var categoryid = map.category; 
    var credits = map.endrangevalue;
    var optionsimulation = map.optionsimulador; 


    if( optionsimulation && optionsimulation == "P" ){
        credits = map.parcelaendrangevalue;
    }

    app.vm.meta.urlparameters = map;
    app.vm.meta.credits = credits;
    app.vm.meta.categoryname = map.categoryname;

    app.vm.model.category = map.category;

    var endpoint = root + "api/dream/simulate?categoryid=" + categoryid + "&credits=" + credits + "&optionsimulation=" + optionsimulation;

    axios.get( endpoint ).then( function(results){

        for( var i = 0; i < results.data.length; i++ ){

            results.data[i]["checked"] = false;
        }

        app.vm.products = results.data;

        app.vm.loadingSimulation = false;


    });
}

loadProducts();