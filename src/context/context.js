

var constructor =  {
	"beforeSave" : function( to, entityname, request ){
		
		try{
			console.log("before save");
			return require("../strategies/dream/" + entityname ).beforeSave( to, null, null, request );
		}
		catch(e){
			console.log("não deu certo", e);
		}
	},
	"afterSave" : function( old, newto, entityname ){
		
		try{
			return require("../strategies/dream/" + entityname ).afterSave( old, newto );
		}
		catch(e){
			//console.log("não deu certo", e);
		}
	}
};

module.exports = constructor;