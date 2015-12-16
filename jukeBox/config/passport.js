// config/passport.js

// load all the things we need
var LocalStrategy       = require('passport-local').Strategy;
var soundcloudStrategy  = require('passport-soundcloud').Strategy;
var config              = require('./config.js');
// load up the user model
var User                = require('../models/user');
var soundcloud          = require('node-soundcloud');
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error

            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));


    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        
        function(req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user);
            });

        }
    ));

    passport.use('soundcloud-login', new soundcloudStrategy({
            clientID : config.soundcloud.clientID,
            clientSecret: config.soundcloud.clientSecret,
            callbackURL: config.soundcloud.uri,
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, accessToken, refreshToken, profile, done) {
            process.nextTick(function(){


                // check if the user is already logged in
                if (!req.user) {
                    console.log('not a user');
                    User.findOne({'soundcloud.id' : profile.id}, function(err, user) {
                        //if there is an error, retrun 
                        if(err)
                            return done(err);
                        //if found, log them in 
                        if(user){
                            return done(null, user); //return the user that we find 
                        }else{
                             //if no user, lets create one with soundcloud credentials 
                            var newUser = new User();
                            //set all sound cloud credentials 
                            newUser.soundcloud.id = profile.id;
                            newUser.soundcloud.username = profile.username;
                            newUser.soundcloud.token = accessToken;
                            newUser.soundcloud.refresh_token = refreshToken;
                      
                             // save our user to the database
                            newUser.save(function(err) {
                                if (err)
                                    throw err;
                                // if successful, return the new user
                                return done(null, newUser);
                            });
                        }
                    })
                }else {
                // user already exists and is logged in, we have to link accounts
                    var user  = req.user; // pull the user out of the session
                    Console.log('already a user');
                    // update the current users SOUNDCLOUD credentials
                    newUser.soundcloud.id = profile.id;
                    newUser.soundcloud.username = profile.username;
                    newUser.soundcloud.token = accessToken;
                    newUser.soundcloud.refresh_token = refreshToken;

                    // save the user
                    user.save(function(err) {
                        if (err)
                            throw err;
                        //create a client and make a playlist
                        var client = soundcloud.Client(access_token=access_token);
                        SC.post('/playlists', {
                            playlist: { title: 'Jukebox_Playlist', tracks: tracks }
                        });

                        return done(null, user);
                    });
                }
            })
        }
    ));


};