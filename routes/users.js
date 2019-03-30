var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
/* For Register */
router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
});
/* For Login */ 
router.get('/login', function(req, res, next) {
  res.render('login',{title:'Login'});
});
router.get('/create',function(req,res,next){
  res.render('create');
})

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid username or password'}),
  function(req, res) {
    req.flash('success','Your are now logged in');
    res.redirect('/');
  });

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(function(username,password,done){
    User.getUserByUsername(username,function(err,user){
      if(err) throw err;
      if(!user){
        return done(null,false,{message:'Unknown User'});
      }
      User.comparePassword(password,user.password,function(err,isMatch){
        if(err) return done(err);
        if(isMatch){
          return done(null,user); 
        }else{
          return done(null,false,{message:'Invalid Password'});
        }
    });
    });
  }));

   
// registration form submit
router.post('/register',function(req, res, next){
     var name = req.body.name;
     var username = req.body.username;
     var email = req.body.email;
     var password = req.body.password;
     var repassword = req.body.repassword;
     var select = req.body.select;

// Form validation
req.checkBody('name','Name field must be required').notEmpty();
req.checkBody('username','Username field must be required').notEmpty();
req.checkBody('email','Email field must be required').notEmpty();
req.checkBody('email','Email is not valid').isEmail();
req.checkBody('password','Password field must be required').notEmpty();
req.checkBody('repassword','Password do not match').equals(req.body.password);
req.checkBody('select','Name field must be required').notEmpty();

// Check Errors
var errors=req.validationErrors();
  if(errors){
    res.render('register',{
      errors:errors
    });
  }
    else{
      var newUser = new User({
        name: name,
        username:username,
        email: email,
        password: password,
        select  :select
      });
      User.createUser(newUser, function(err, user){
        if(err) throw err;
        console.log(user);
      });
      req.flash('success','You are now registered and can log')
      res.location('/');
      res.redirect('/');
    }
  });
  router.get('/logout',function(req,res){
    req.logout();
    req.flash('success','You are now logged out');
    res.redirect('/users/login');
  });
module.exports = router;
