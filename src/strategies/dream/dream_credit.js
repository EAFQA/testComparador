

var ObjectId = require('mongodb').ObjectID;
//const moment = require("moment");


var constructor =  {

	"beforeSave" : function( to, isExternal, externalEntity ){

		var parcela = 0;

        try{
            if( to["credit"] ) to["credit"] = parseFloat( to["credit"] );
        }
        catch(e){}
		
		
		var promise = new Promise( function(resolve){

            require("../../../src/dao/daoFactory")().then(function(db){
						
                db.collection( "dream_paymentconditions" ).findOne({ "_id" : ObjectId( to["parentid"] ) }, ( error, record ) => {
                    
                    db.collection("dream_duedate").find( { "parentid" : to["parentid"] } ).sort( { "duedate" : 1} ).toArray( ( error, results ) => {

                        var text = "";

                        for(var i = 0; i < results.length; i++ ){

                            var taxa = 0;
                            if( results[i]["tax"] ){
                                taxa = results[i]["tax"];
                            }
                            else{
                                taxa = record["admintaxs"];
                            }

                            var taxaAdesao = 0;
                            if( record["membershipfee"] ){
                                taxaAdesao = parseFloat( record["membershipfee"] )
                            }

                            var percentual = parseFloat( taxa ) + parseFloat( record["reservefunds"] );
                            if( taxaAdesao ){
                                //percentual = percentual + taxaAdesao;
                            }


                            // se tiver amortização, tirar a taxa da amortização antes de somar
                            var credit = parseFloat( to["credit"] );
                            var creditoArmotizado = null;

                            if( record["amorization"] && parseFloat( record["amorization"] ) > 0 ){

                                var valorAmortizacao = credit * ( parseFloat( record["amorization"] ) / 100 );
                                creditoArmotizado = credit - valorAmortizacao;
                                credit = creditoArmotizado;
                            }

                            // taxa
                            var valuePlusPercentual = credit + ( parseFloat( to["credit"] ) * ( percentual / 100 ) ); 
                            
                            var seguro = 0;

                            if( record["secutiryfunds"] ){ 

                                var taxaFundo = percentual;
                                if( taxaAdesao ) taxaFundo = taxaFundo + taxaAdesao;

                                var taxa = parseFloat( to["credit"] ) * ( taxaFundo / 100 );
                                var saldodevedor = parseFloat( to["credit"] ) + taxa;

                                seguro = saldodevedor * ( parseFloat( record["secutiryfunds"] ) / 100 )
                            } 

                           console.log("seguro", seguro);

                           if( results[i]["duedate"] ){
                               var prazo = parseInt( results[i]["duedate"] );
                               if( prazo > 0 ){
                                   var parcela = valuePlusPercentual / prazo;
                                   if( parcela > 0 ){

                                       if( seguro ) parcela += seguro;

                                       parcela = parcela.toFixed(2);

                                       // record

                                       var dream_creditparcela = {
                                           "paymentcondition" : ObjectId( to["parentid"] ),
                                           "duedate" : results[i]["duedate"],
                                           "parcela" : parseFloat( parcela ),
                                           "credit" : to["_id"]
                                       };


                                   }
                                   text += " Em " + results[i]["duedate"] + " meses : " + parcela;
                                   //text += "<br />";
                                   text += "\n";
                               }
                               
                           }// results duedate
                           
                        }

                        console.log("text", text );
                        console.log(" ");
                        to["parcelas"] = text;
                      
                        resolve( to );
                    }); 

                    
                });// findOne
            });// requireDao
        });

        return promise;
	},
	"afterSave" : function( old, newto, entityname ){
        var parcela = 0;

        var to = newto;
        console.log("after save", newto );

		var promise = new Promise( function(resolve){

            require("../../../src/dao/daoFactory")().then(function(db){

                db.collection("dream_creditparcela").deleteMany({ "credit" : ObjectId(newto["_id"]) }, ( error, deletedTo ) => {
					
                        db.collection( "dream_paymentconditions" ).findOne({ "_id" : ObjectId( newto["parentid"] ) }, ( error, record ) => {
                            
                            console.log("record", record );
                            console.log("duedate", to["parentid"] );
                            db.collection("dream_duedate").find( { "parentid" : to["parentid"]  } ).sort( { "duedate" : 1} ).toArray( ( error, results ) => {

                                console.log("after duedate", results);
                                var text = "";

                                for(var i = 0; i < results.length; i++ ){

                                    var taxa = 0;
                                    if( results[i]["tax"] ){
                                        taxa = results[i]["tax"];
                                    }
                                    else if( record && record["admintaxs"] ){
                                        taxa = record["admintaxs"];
                                    }

                                    var taxaAdesao = 0;
                                    if( record && record["membershipfee"] ){
                                        taxaAdesao = parseFloat( record["membershipfee"] )
                                    }

                                    var percentual = parseFloat( taxa ) + parseFloat( record ? record["reservefunds"] : 0 );
                                    if( taxaAdesao ){
                                        //percentual = percentual + taxaAdesao;
                                    }


                                    // se tiver amortização, tirar a taxa da amortização antes de somar
                                    var credit = parseFloat( to["credit"] );
                                    var creditoArmotizado = null;

                                    if( record && record["amorization"] && parseFloat( record["amorization"] ) > 0 ){

                                        var valorAmortizacao = credit * ( parseFloat( record["amorization"] ) / 100 );
                                        creditoArmotizado = credit - valorAmortizacao;
                                        credit = creditoArmotizado;
                                    }

                                    // taxa
                                    var valuePlusPercentual = credit + ( parseFloat( to["credit"] ) * ( percentual / 100 ) ); 
                                    
                                    var seguro = 0;

                                    if( record && record["secutiryfunds"] ){ 

                                        var taxaFundo = percentual;
                                        if( taxaAdesao ) taxaFundo = taxaFundo + taxaAdesao;

                                        var taxa = parseFloat( to["credit"] ) * ( taxaFundo / 100 );
                                        var saldodevedor = parseFloat( to["credit"] ) + taxa;

                                        seguro = saldodevedor * ( parseFloat( record["secutiryfunds"] ) / 100 )
                                    } 

                                console.log("seguro", seguro);

                                if( results[i]["duedate"] ){ console.log("inside duedate");
                                    var prazo = parseInt( results[i]["duedate"] );
                                    if( prazo > 0 ){
                                        var parcela = valuePlusPercentual / prazo;
                                        if( parcela > 0 ){

                                            if( seguro ) parcela += seguro;

                                            parcela = parcela.toFixed(2);

                                            // record

                                            var parcelaNumber = parseFloat( parcela );

                                            var dream_creditparcela = {
                                                "paymentcondition" : ObjectId( to["parentid"] ),
                                                "duedate" : parseInt( results[i]["duedate"] ),
                                                "parcela" : parcelaNumber,
                                                "credit" : ObjectId( newto["_id"] )
                                            };

                                            db.collection( "dream_creditparcela" ).save( dream_creditparcela, ( error, result ) =>{
                                                });
                                        }
                                        text += " Em " + results[i]["duedate"] + " meses : " + parcela;
                                        //text += "<br />";
                                        text += "\n";
                                    }
                                    
                                }// results duedate
                                
                                }

                                console.log("text", text );
                                console.log(" ");
                                //to["parcelas"] = text;
                            
                                resolve( to );
                            }); 

                            
                        });// findOne
                });
            });// requireDao
        });

        return promise;
	},
	"loadTable" : function( resquest, issort ){

	},
	"loadFormData" : function( request ){

	}
};

module.exports = constructor;