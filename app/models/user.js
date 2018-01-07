'use strict';

const mongoose = require('mongoose');

/**
 * User mongoose schema/model
 */
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  image: { type: String, default: '' },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
