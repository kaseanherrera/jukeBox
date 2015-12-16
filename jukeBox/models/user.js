// models/user

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema  = new mongoose.Schema({

	local : {
		email : String,
		password : String,
		createdAt: Date, 
	},
	soundcloud : {
		id : String,
		username : String,
		token : String,
		refresh_token : String,
		exoires_in : Date,
	}
	
});


// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('user', userSchema);