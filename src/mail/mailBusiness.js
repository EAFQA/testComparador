

const nodemailer = require("nodemailer");

var scope = {
    "sendEmail" : function( dest, subject, mailtext){    


        var config = nodemailer.createTransport({
            "host" : "smtp.kinghost.net",
            "port" : 587,
            "secure" : false,
            "tls": {
                rejectUnauthorized: false
            },
            "auth" : {
                "user" : "novolead@comparadordeconsorcio.com.br",
                "pass" : "Lead@comparador"
            }
        }); 

        var mailTo = {
            "from": "novolead@comparadordeconsorcio.com.br",
            "to": dest,
            "subject": subject,
            "html": mailtext,
        };

        config.sendMail(mailTo, function(error){
            if (error) {
                console.log("erro");
                console.log(error);
            } 
            else {
                console.log("E-mail enviado com sucesso");
            }
        });
            
      }
    };

module.exports = scope;