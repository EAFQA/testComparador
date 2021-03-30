

const ObjectId = require('mongodb').ObjectID;
const url = require("url");
var fs = require('fs'); 
var mustache = require('mustache');
var multer  = require('multer');
var upload = multer({ dest: './static/img/uploads/' })
var moment = require("moment");

var init = function( app, global ){
	
	
	app.get("/api/dream/simulate", function( request, response ){
		require("../../src/dao/daoFactory")().then(function(db){

            var feiraid = request.query.feiraid;
			var categoryid = request.query.categoryid; //"5ef4d2e501d61900164aa73b";
			var credits = request.query.credits; //parseFloat( "21000.00" );
			
			if( credits ){
				credits = parseFloat( credits );
			}

            var aggregate = [];
            var sortable = {
                "company.name" : 1
            };


            var paymentcondition = { $lookup:
                    {
                        from: 'dream_paymentconditions',
                        localField: 'paymentcondition',
                        foreignField: '_id',
                        as: 'paymentconditions'
                    }
            };
        
			var credit = { $lookup:
                    {
                        from: 'dream_credit',
                        localField: 'credit',
                        foreignField: '_id',
                        as: 'credits'
                    }
            };

			var company = { $lookup:
                    {
                        from: 'dream_company',
                        localField: 'paymentconditions.companyid',
                        foreignField: '_id',
                        as: 'company'
                    }
            };

            

            aggregate.push( paymentcondition );
			aggregate.push( credit );

			aggregate.push( { $unwind : "$paymentconditions" } );
			aggregate.push( { $unwind : "$credits" } );
            
			aggregate.push( company );
            aggregate.push( { $unwind : "$company" } );


			if( categoryid ){
				aggregate.push( { $match : { "paymentconditions.categoryid" : categoryid   } } );
			}

			if( credits ){

                
                
                if( request.query.optionsimulation == "P" ){

                    var plus = credits + ( credits * 0.15 );
                    var minus = credits;// - ( credits * 0.15 );

                    aggregate.push( { 
                        $match : { 
                            "parcela" : { 
                                $lte : plus,
                                $gte : minus
                            }   
                        } 
                    });

                }
                else{
                    
                    var plus = credits + ( credits * 0.10 );
                    var minus = credits;// - ( credits * 0.05 );


                    aggregate.push( { 
                        $match : { 
                            "credits.credit" : { 
                                $lte : plus,
                                $gte : minus
                            }   
                        } 
                    });
                }
                

				//aggregate.push( { $match : { "credits.credit" : { $lte : credits }   } } );
                //aggregate.push( { $match : { "credits.credit" : credits    } } );
			}

             //aggregate.push( { $sort : sortable } );
            

            db.collection("dream_creditparcela").aggregate( aggregate ).toArray( ( error, resultList ) => {
                
                resultList.sort( function(a,b){
                    //if( a.company.name ==b.company.name ){

                        if( request.query.optionsimulation == "P" ){
                            if( a.parcela == b.parcela ){
                                if( a.duedate == b.duedate ) return 0;
                                else if( a.duedate > b.duedate ) return -1;
                                else return 1;
                            } 
                            else if( a.parcela > b.parcela ) return 1;
                            else return -1;
                        }
                        else{
                            if( a.credits.credit == b.credits.credit ){
                                if( a.duedate == b.duedate ) return 0;
                                else if( a.duedate > b.duedate ) return -1;
                                else return 1;
                            } 
                            else if( a.credits.credit > b.credits.credit ) return 1;
                            else return -1;
                        }
                    //}
                    //else if( a.company.name > b.company.name ) return 1;
                    //else return -1;
                });

                var mapCompany = {};
                var newList = [];

                for( var i = 0; i < resultList.length; i++ ){
                    var count = mapCompany[ "" + resultList[i]["company"]["_id"] ];
                    if( ! count ) count = 0;

                    if( count <= 4 ){
                        newList.push( resultList[i] );
                        count = count + 1;

                        mapCompany[ "" + resultList[i]["company"]["_id"] ] = count;
                    } 
                }

                console.log("mapCompany", mapCompany);

                response.send( newList );
            });
                			
        });
	});

    app.get("/api/dream/consultor/:link", function(request,response){
        require("../../src/dao/daoFactory")().then(function(db){

            var link = request.params.link;
            var aggregate = [];
            aggregate.push( { $match : { "link" : link  } } );
            

            db.collection("users").aggregate( aggregate ).toArray( ( error, resultList ) => {
                
                var record = null;
                if( resultList && resultList.length > 0 ) record = resultList[0]
                response.send( record );
            });
                			
        });
    });

    app.post("/api/dream/sendmail/lead", function( request, response){

        var to = request.body;

        var dest = "o.hugo.santos@gmail.com;rzancheti@gmail.com";
        var subject = "Novo registro de Lead - Comparador de consórcio";
        var mailtext = "";

        if( to["meta"] && to["meta"]["urlparameters"]  ){
            
            var params = to["meta"]["urlparameters"];
            mailtext += "Nome : " +  params.name + "<br />";
            mailtext += "E-mail : " + params.email + "<br />";
            mailtext += "Celular : " + params.cellphone + "<br />";
            mailtext += "Cidade : "  + params.city + "<br />";
            mailtext += "Tipo do Bem : "   + params.categoryname + "<br />";
            mailtext += "Valor : "  + params.endrangevalue + "<br />";
            // mailtext += "Possui interesse nos produtos : " + "<br />";
            // mailtext += "<hr />";

            /*
            for( var i = 0; i < to.productsSelecteds.length; i++ ){
                var product = to.productsSelecteds[i];

                mailtext += "Empresa : " + product.company.name + "<br />";
                mailtext += "Plano: " + product.paymentconditions.name + "<br />";
                mailtext += "Crédito: " + product.credits.credit + "<br />";
                mailtext += "Prazo: " + product.duedate + "<br />";
                mailtext += "Parcela: " + product.parcela + "<br />";

                mailtext += "<hr />";
            } */


            require("../../src/dao/daoFactory")().then(function(db){

                    db.collection("dream_lead").findOne({ "_id" : ObjectId( params["_id"] )  }, ( error, dreamLead ) => {

                            dreamLead["callespecialist"] = true;
                            dreamLead["products"] = to.productsSelecteds;

                            var updateDoc = {
                                "$set" : dreamLead
                            };

                            db.collection( "dream_lead" ).updateOne( { "_id" : dreamLead["_id"] }, updateDoc  , ( error, result ) =>{
                                //resolve( to );
                            });
                    });
            });
            
        }

        //global["email"].sendEmail( dest, subject, mailtext );

        response.send( {"message" : "E-mail enviado com sucesso"} );

    });

    app.post("/api/dream/sendmail/call", function( request, response){

        var model = request.body;

        var dest = "rzancheti@gmail.com";
        var subject = "Receba uma ligação - Comparador de consórcio";
        var mailText = "";

        if( model  ){
            
            mailText += "O cliente abaixo entrou em contato através do site <br />";
            mailText += "Nome : " + model.name + "<br />";
            mailText += "E-mail : " + model.email + "<br />";
            mailText += "Celular : " + model.cellphone + "<br />";
            mailText += "Melhor horário para contato : " + model.contacttime + "<br />";
            mailText += "CEP : " + model.cep + "<br />";
            mailText += "Bem : " + model.categoryname + "<br />";
            mailText += "Comentários : " + model.comment + "<br />";
        }

        var callTo = {
            "name" : model.name,
            "email" : model.email,
            "cellphone" : model.cellphone,
            "contacttime" : model.contacttime,
            "cep" : model.cep,
            "categoryname" : model.categoryname,
            "comment" : model.comment
        }

        callTo["created"] = new Date();

        require("../../src/dao/daoFactory")().then(function(db){

            if( model["partnerlink"] ){
                db.collection("users").findOne( { "link": model["partnerlink"] } ).then( function( userTo, error ){
                    
                    callTo["userid"] = userTo["_id"];
                    callTo["origin"] = model["partnerlink"];

                    dest = userTo["email"];

                    db.collection( "dream_call" ).save( callTo, ( error, result ) =>{
                        global["email"].sendEmail( dest, subject, mailText );
                    });
                });
            }
            else{

                callTo["origin"] = "Site principal";

                db.collection( "dream_call" ).save( callTo, ( error, result ) =>{
                    global["email"].sendEmail( dest, subject, mailText );
                });
            }
            
        });

        

        response.send( {"message" : "E-mail enviado com sucesso"} );

    });

    app.post("/api/dream/sendmail/visita", function( request, response){

        var model = request.body;

        var dest = "o.hugo.santos@gmail.com;rzancheti@gmail.com";
        var subject = "Solicite uma visita - Comparador de consórcio";
        var mailText = "";

        if( model  ){
            
            mailText += "O cliente abaixo entrou em contato através do site <br />";
            mailText += "Nome : " + model.name + "<br />";
            mailText += "E-mail : " + model.email + "<br />";
            mailText += "Celular : " + model.cellphone + "<br />";
            mailText += "Melhor horário para contato : " + model.contacttime + "<br />";
            mailText += "CEP : " + model.cep + "<br />";
            mailText += "Endereço : " + model.address + "<br />";
            mailText += "Número : " + model.addressnumber + "<br />";
            mailText += "Bairro : " + model.bairro + "<br />";
            mailText += "Cidade : " + model.cityname + "<br />";
            mailText += "Estado : " + model.state + "<br />";
            mailText += "Data da visita : " + moment( model.visita ).format("DD/MM/YYYY HH:mm") + "<br />";
        }

        var visitaTo = {
            "name" : model.name,
            "email" : model.email,
            "cellphone" : model.cellphone,
            "contacttime" : model.contacttime,
            "cep" : model.cep,
            "address" : model.address,
            "addressnumber" : model.addressnumber,
            "bairro" : model.bairro,
            "cityname" : model.cityname,
            "state" : model.state,
            "visita" : model.visita
        }

        visitaTo["created"] = new Date();

        require("../../src/dao/daoFactory")().then(function(db){

            if( model["partnerlink"] ){

                visitaTo["origin"] = model["partnerlink"];

                db.collection("users").findOne( { "link": model["partnerlink"] } ).then( function( userTo, error ){

                    visitaTo["userid"] = userTo["_id"];

                    db.collection( "dream_visita" ).save( visitaTo, ( error, result ) =>{
                        global["email"].sendEmail( dest, subject, mailText );
                    });
                });
            }
            else{

                visitaTo["origin"] = "Site principal";

                db.collection( "dream_visita" ).save( visitaTo, ( error, result ) =>{
                    global["email"].sendEmail( dest, subject, mailText );
                });
            }
            
        });

        response.send( {"message" : "E-mail enviado com sucesso"} );

    });

    app.get("/api/dream/minvalue", function( request, response ){
		require("../../src/dao/daoFactory")().then(function(db){

            var feiraid = request.query.feiraid;
			var categoryid = request.query.categoryid; //"5ef4d2e501d61900164aa73b";
			var credits = request.query.credits; //parseFloat( "21000.00" );
			
			if( credits ){
				credits = parseFloat( credits );
			}

            var aggregate = [];
            var sortable = {
                "company.name" : 1
            };

            var paymentcondition = { $lookup:
                    {
                        from: 'dream_paymentconditions',
                        localField: 'paymentcondition',
                        foreignField: '_id',
                        as: 'paymentconditions'
                    }
            };
        
			var credit = { $lookup:
                    {
                        from: 'dream_credit',
                        localField: 'credit',
                        foreignField: '_id',
                        as: 'credits'
                    }
            };

            
            aggregate.push( paymentcondition );
			aggregate.push( credit );
			aggregate.push( { $unwind : "$credits" } );
            aggregate.push( { $unwind : "$paymentcondition" } );
            
			// aggregate.push( company );
            // aggregate.push( { $unwind : "$company" } );


			if( categoryid ){
				aggregate.push( { $match : { "paymentconditions.categoryid" : categoryid   } } );
			}

			
            db.collection("dream_creditparcela").aggregate( aggregate ).toArray( ( error, resultList ) => {
                
                resultList.sort( function(a,b){
                    if( a.credits.credit == b.credits.credit ) return 0;
                    else if( a.credits.credit > b.credits.credit ) return 1;
                    else return -1; 
                });

                var minvalue = 0;
                if( resultList && resultList.length > 0 ) minvalue = resultList[0]["credits"]["credit"];
                

                response.send( { "minvalue" : minvalue } );
            });
        });
    });

    app.post("/api/dream/transferlead", function( request, response ){

        var leadid = request.body.leadid;
        var leadowner = request.body.leadowner;

        require("../../src/dao/daoFactory")().then(function(db){

            var updateDoc = {
                "$set" : {
                    "userid" : ObjectId( leadowner )
                }
            };

            db.collection( "dream_lead" ).updateOne( { "_id" : ObjectId( leadid ) }, updateDoc  , ( error, result ) =>{
                //resolve( to );
                response.send( { "sucess" : true } );
            });

        });
    });
};


module.exports["init"] = init;