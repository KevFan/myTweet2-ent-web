const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Admin = require('../models/admin');

/**
 * Util to create JWT Token
 * @param user User to create token
 * @returns {*} Token
 */
exports.createToken = function (user) {
  return jwt.sign({ id: user._id, email: user.email }, 'secretpasswordnotrevealedtoanyone', {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
};

/**
 * Util to decode token
 * @param token Token to decode
 * @returns {{}} Return user id from decoded token
 */
exports.decodeToken = function (token) {
  let userInfo = {};
  try {
    const decoded = jwt.verify(token, 'secretpasswordnotrevealedtoanyone');
    userInfo.userId = decoded.id;
    userInfo.email = decoded.email;
  } catch (e) {
  }

  return userInfo;
};

/**
 * Util to validate decodes token to a user or admin in database
 * @param decoded Decoded Token
 * @param request Request
 * @param callback Callback
 */
exports.validate = function (decoded, request, callback) {
  let user = null;
  User.findOne({ _id: decoded.id }).then(foundUser => {
    user = foundUser;
    return Admin.findOne({ _id: decoded.id });
  }).then(foundAdmin => {
    if (user != null) {
      callback(null, true);
    } else if (foundAdmin != null) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }).catch(err => {
    callback(null, false);
  });
};

/**
 * Util to userId from request
 * @param request Request
 * @returns {*} user id extracted from request
 */
exports.getUserIdFromRequest = function (request) {
  let userId = null;
  try {
    const authorization = request.headers.authorization;
    const token = authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secretpasswordnotrevealedtoanyone');
    userId = decodedToken.id;
  } catch (e) {
    userId = null;
  }

  return userId;
};
