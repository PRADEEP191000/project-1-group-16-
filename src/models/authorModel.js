const mongoose = require('mongoose');


const AuthorSchema = new mongoose.Schema({
  fname   : {
    type: String, 
    require: true},

  lname : {
    type: String, 
    require: true},

  title : {type: String, 
    enum: [Mr, Mrs, Miss]},

  email : {
    type: String, 
    require: true,
    validate: [validateEmail],
    unique: true
  },
  
  password: {
    type: String, 
    require: true}
    
}, {timeStamps: true});

module.exports = mongoose.model('Author', AuthorSchema)