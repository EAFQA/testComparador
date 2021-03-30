

var constructor = function(){

	return {
		"type" : "form",
		"formlink" : "/fragment/edit?entity=person",
		"scriptList" : [
			"../assets/plugins/chartist-js/dist/chartist.min.js",
    		"../assets/plugins/chartist-plugin-tooltip-master/dist/chartist-plugin-tooltip.min.js",
    		"js/dashboard1.js",
    		"js/next/person/profile.js"
    	]
	}
};

module.exports = constructor;