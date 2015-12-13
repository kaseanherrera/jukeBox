var express = require('express');
var router = express.Router();
var SC = require('node-soundcloud');
var request = require('request');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//get the access token from the call back function and save it
//create a user object and save the token with it. 
router.get('/login/callback', function(req, res, next) {
	var code = req.query.code;
 
  	SC.authorize(code, function(err, accessToken) {
  		//handel this error
    	if ( err ) {
      		throw err;
    	} else {
      		// Client is now authorized and able to make API calls 
      		console.log('access token:', accessToken);
   		}
  	});
});

//login --> soundcloud
router.get('/login', function(req, res, next){
	//initilaize a sound cloud client 
	SC.init({
  		id: 'b3cc7ee3c002791123030571ff9189fd',
  		secret: 'ddc1c1326dae1b468122e1654edc44da',
  		uri: 'http://localhost:3001/'
	});

	// Connect user to authorize application 
  	var url = SC.getConnectUrl();
 	
 	
	request(url, function (error, response, body) {
 		if (!error && response.statusCode == 200) {
    		console.log(body) // Print the google web page.
  		}
  		else{
  			console.log(error);
  		}
	})

  	res.end();

})

module.exports = router;
