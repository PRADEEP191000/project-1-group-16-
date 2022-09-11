const mongoose = require('mongoose');


const AuthorSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true
  },

  lname: {
    type: String,
    required: true,
    trim: true
  },

  title: {
    type: String,
    required: true,
    enum: ["Mr", "Mrs", "Miss"],
    trim: true
  },

  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    trim: true
  }

}, { timeStamps: true });

module.exports = mongoose.model('Author', AuthorSchema);