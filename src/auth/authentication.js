

const bcrypt = require('bcrypt')  
const LocalStrategy = require('passport-local').Strategy

var init = function( passport ){

    passport.serializeUser(function(user, done){

        if( user.error ) done( null, user );
        else done(null,user._id);
    });

    passport.deserializeUser(function(id, done){

        console.log("deserializeUser", id);

        require("../../src/dao/daoFactory")().then(function(db){

			db.collection( "users" ).findOne({ "_id" : id }, ( error, recordTo ) => {
                done(error, recordTo );
			});// findOne

		});// requireDao

    });

    passport.use(new LocalStrategy( { 
            usernameField: 'username',
            passwordField: 'password'
        },
      (username, password, done) => {

        require("../../src/dao/daoFactory")().then(function(db){

			db.collection( "users" ).findOne({ "username" : username }, ( err, user ) => {


				if (err) { return done(null, err) }
    
                var error = { "error" : {} };


                // usuário inexistente
                if (!user) { 
                
                    error["error"]["message"] = "user-notfound"
                    return done(null, error) 
                }
            
                // comparando as senhas
                bcrypt.compare(password, user.password, (err, isValid) => {


                    if (err) { return done(err) }
                    if (!isValid) { 
                        error["error"]["message"] = "invalid-password";
                        return done(null, error) 
                    }
                    return done(null, user)
                })
                
			});// findOne

		});// requireDao
      }
    )); // passport.use

 
};

module.exports = init;