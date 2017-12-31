const User = require('../models/user');
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const utils = require('./utils.js');
const Boom = require('boom');

exports.authenticate = {
  auth: false,

  handler: function (request, reply) {
    const userData = request.payload;
    let user = null;
    User.findOne({ email: userData.email }).then(foundUser => {
      user = foundUser;
      return Admin.findOne({ email: userData.email });
    }).then(foundAdmin => {
      if (user) {
        bcryptTokenHepler(userData.password, user, reply);
      } else if (foundAdmin) {
        bcryptTokenHepler(userData.password, foundAdmin, reply);
      } else {
        reply({ success: false, message: 'Authentication failed. User not found.' }).code(201);
      }
    }).catch(err => {
      reply(Boom.notFound('internal db failure'));
    });
  },
};

function bcryptTokenHepler(passwordAttempt, foundUser, reply) {
  bcrypt.compare(passwordAttempt, foundUser.password, (err, isValid) => {
    if (isValid) {
      const token = utils.createToken(foundUser);
      reply({ success: true, token: token, user: foundUser }).code(201);
    } else {
      reply({ success: false, message: 'Authentication failed. User not found.' }).code(201);
    }
  });
}
