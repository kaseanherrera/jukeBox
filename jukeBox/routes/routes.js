var express = require('express');
var SC = require('node-soundcloud');


module.exports = function(app,passport){



  //signup 
  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/auth/soundcloud', // redirect to the secure profile section
      failureRedirect : '/bs', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));


  //login 
  app.post('/login', passport.authenticate('local-login',{
      successRedirect : '/',
      failureRedirect : '/bs',
      failureFlash : true 
  }))


  // =====================================
  // soundcloud  ROUTES =====================
  // =====================================
  // route for facebook authentication and login
  app.get('/auth/soundcloud', passport.authenticate('soundcloud-login'));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/soundcloud/callback',
      passport.authenticate('soundcloud-login', function(err, u,m){
          successRedirect : '/',
          failureRedirect : '/'
      
      }));


}