

var getConsultor = function(){

    console.log("getCOnsulor");
    console.log("url", location.href);

    var index = location.href.indexOf("consultor/");
    var partnerlink = location.href.substring( index + 10 );

    console.log("partnerlink", partnerlink );

    var endpoint = root + "api/dream/consultor/" + partnerlink;

    //app.vm.isLoading = true;
    axios.get( endpoint ).then( function(response){
        app.vm.landing = response.data;

        //app.vm.isLoading = false;
    });
};

console.log("before getData");
getConsultor();