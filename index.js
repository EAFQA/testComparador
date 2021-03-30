

const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const session = require("express-session");
const uuid = require("uuid");
const passport = require("passport");
var cors = require('cors')


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);


     if (req.headers["x-forwarded-proto"] == "http") //Checa se o protocolo informado nos headers é HTTP 
        res.redirect(`https://${req.headers.host}${req.url}`);
    else{
        // Pass to next layer of middleware
        next();
    }
    
});



require("./src/auth/authentication")( passport );
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// iniciando configurações do mercado pago
//require("./src/mercadopago/preferences")( global );

// configurações de sessão
app.use(session({
  genid: (req) => {
    return uuid.v4()
  },
  secret: 'node-application-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static('static'));

app.use(express.static('/static'));
//app.use(express.static('img'));
//app.use(express.static('js'));
//app.use(express.static('views'));
//app.use(express.static('assets'));
//app.use(express.static('fragment'));
//app.use(express.static('scss'));

global["email"] = require("./src/mail/mailBusiness");

require("./services")["init"]( app, passport );
require("./src/api/dreamAPI")["init"]( app, global );
require("./src/session/session")( app );



app.listen(process.env.PORT || "8080", () => {
  console.log('serviços iniciados');
});
