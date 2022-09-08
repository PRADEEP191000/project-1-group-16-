const mongoose = require('mongoose');


const AuthorSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: 'First Name is required',
    trim: true
  },

  lname: {
    type: String,
    required: 'Second Name is required',
    trim: true
  },

  title: {
    type: String,
    required: 'Title is required',
    enum: ["Mr", "Mrs", "Miss"],
    trim: true
  },

  email: {
    type: String,
    trim: true,
    required: 'Email address is required',
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: 'Password is required',
    trim: true
  }

}, { timeStamps: true });

module.exports = mongoose.model('Author', AuthorSchema);