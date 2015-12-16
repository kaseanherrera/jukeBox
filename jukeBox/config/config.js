//database configuration 

module.exports = {

	database : {
	'url' : 'mongodb://127.0.0.1:27018/test'
	},

	//soundcloud stuff 
	soundcloud : {
		clientID : 'b3cc7ee3c002791123030571ff9189fd',
    	clientSecret: 'ddc1c1326dae1b468122e1654edc44da',
    	uri: 'http://localhost:3002/auth/soundcloud/callback'
	}
}