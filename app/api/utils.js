const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Admin = require('../models/admin');

exports.createToken = function (user) {
  return jwt.sign({ id: user._id, email: user.email }, 'secretpasswordnotrevealedtoanyone', {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
};

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
