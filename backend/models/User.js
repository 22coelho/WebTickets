const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  typeUser: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  ticketsBought: {
    type: Number,
  },
  ticketsCanceled: {
    type: Array,
  },
  numberEvents: {
    type: Number,
  },
  sentRequest: {
    type: Boolean,
  },
  tickets : {
    type: Array,
  },
  active: {
    type: Boolean,
    default: true
  }
});

const User = mongoose.model('User', UserSchema, 'Users');

module.exports = User;
