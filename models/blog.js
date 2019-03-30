
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://localhost/post');
var db = mongoose.connection;

//User Schema
 var blogSchema = mongoose.Schema({
     title:{
         type:String,
         
     },
     description:{
         type:String
     }

     
 });
 var User = module.exports = mongoose.model('User',blogSchema);
 