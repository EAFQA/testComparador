

const mercadopago = require('mercadopago');

var setConfigurations = function(){

    var promise = new Promise( function(resolve){

        require("../../src/dao/daoFactory")().then(function(db){
            
            db.collection("next_paymentmethods").findOne({ "channelid" : "mercadopago" }, ( error, to ) => {
				
                if( to ){
                    mercadopago.configure({
                        client_id : to["clientid"], //"4530898811348233",
                        client_secret : to["secret"], //"4a8ZWlQxWjFlsPQffwzU9pMShUromDlZ",
                        sandbox : to["sandbox"], //true,
                        access_token: to["accesstoken"], //"TEST-4530898811348233-052722-d2fb8f2560cff680b09cbae79485783e-73787846"
                    });
                }
                else{
                    global.mercadopago.desable = true;
                }
                
                resolve();	
			});
			
        });// dao
    });
    
    return promise;    
};

var putPreferenceInGlobal = function( preference, productname ){

    mercadopago.preferences.create(preference).then(function(response){
        
        // Este valor substituirá a string "$$init_point$$" no seu HTML
        //global.init_point = response.body.id;

        global.mercadopago[ productname ] = response.body.id;
    }).catch(function(error){
        console.log(error);
    });
};

var init = function( global ){

    global.mercadopago = {};
    
    // setando as configurações
    setConfigurations().then(function(){

        var basicSignature = {
            items: [
                {
                title: 'Park System - Assinatura Basic',
                unit_price: 129.99,
                quantity: 1,
                }
            ]
        };

        var premiumSignature = {
            items: [
                {
                title: 'Park System - Assinatura Premium',
                unit_price: 700,
                quantity: 1,
                }
            ]
        };

        var enterpriseSignature = {
            items: [
                {
                title: 'Park System - Assinatura Enterprise',
                unit_price: 1300,
                quantity: 1,
                }
            ]
        };

        if( global.mercadopago.desable ) return;
        
        try{
            putPreferenceInGlobal( basicSignature, "basic");
            putPreferenceInGlobal( premiumSignature, "premium");
            putPreferenceInGlobal( enterpriseSignature, "enterprise");
        }
        catch(e){

        }
        
    });

};

module.exports = init;