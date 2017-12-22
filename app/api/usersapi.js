'use strict';

const User = require('../models/user');
const Boom = require('boom');
const cloudinary = require('cloudinary');
const deleteFromCloud = require('../utils/pictureHelpers');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const utils = require('./utils.js');


/**
 * Find all users
 */
exports.find = {
  auth: false,

  handler: function (request, reply) {
    User.find({}).exec().then(users => {
      reply(users);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};

/**
 * Find one user by id
 */
exports.findOne = {
  auth: false,

  handler: function (request, reply) {
    User.findOne({ _id: request.params.id }).then(user => {
      if (user != null) {
        reply(user);
      }

      reply(Boom.notFound('id not found'));
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/**
 * Create a user
 */
exports.create = {
  auth: false,

  handler: function (request, reply) {
    const user = new User(request.payload);
    const plaintextPassword = user.password;
    bcrypt.hash(plaintextPassword, saltRounds, (err, hash) => {
      user.password = hash;
      user.save().then(newUser => {
        reply(newUser).code(201);
      }).catch(err => {
        reply(Boom.badImplementation('error creating user'));
      });
    });
  },
};

/**
 * Delete all users
 */
exports.deleteAll = {
  auth: false,

  handler: function (request, reply) {
    User.find({}).then(foundUsers => {
      for (let user of foundUsers) {
        deleteFromCloud(user.image);
      }

      return User.remove({});
    }).then(success => {
      reply(success).code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing users'));
    });
  },
};

/**
 * Delete one user by id
 */
exports.deleteOne = {
  auth: false,

  handler: function (request, reply) {
    User.findOne({ _id: request.params.id }).then(foundUser => {
      deleteFromCloud(foundUser.image);
      return User.remove({ _id: request.params.id });
    }).then(success => {
      reply(success).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/**
 * Update a user by id
 */
exports.update = {
  auth: false,

  handler: function (request, reply) {
    let updateData = request.payload;
    bcrypt.hash(updateData.password, saltRounds, (err, hash) => {
      updateData.password = hash;
      User.findOneAndUpdate({ _id: request.params.id }, updateData, { new: true }).then(user => {
        reply(user).code(200);
      }).catch(err => {
        reply(Boom.notFound('error updating user'));
      });
    });
  },
};

/**
 * Update a user profile picture by id
 */
exports.updateProfilePicture = {
  auth: false,

  payload: {
    maxBytes: 209715200,
    output: 'stream',
    parse: true,
  },

  handler: function (request, reply) {
    const stream = cloudinary.v2.uploader.upload_stream({ upload_preset: "cth4nyko-profile" }, function (error, uploadResult) {
      console.log(uploadResult);
      User.findOne({ _id: request.params.id }).then(foundUser => {
        deleteFromCloud(foundUser.image);
        foundUser.image = uploadResult.url;
        return foundUser.save();
      }).then(savedUser => {
        reply(savedUser).code(200);
      }).catch(err => {
        reply(Boom.notFound('error updating user profile picture'));
      });
    });

    request.payload.image.pipe(stream);
  },
};

/**
 * Delete profile picture
 */
exports.deleteProfilePicture = {
  auth: false,

  handler: function (request, reply) {

    User.findOne({ _id: request.params.id }).then(foundUser => {
      deleteFromCloud(foundUser.image);
      foundUser.image = '';
      return foundUser.save();
    }).then(savedUser => {
      reply(savedUser).code(200);
    }).catch(err => {
      reply(Boom.notFound('error deleting profile picture'));
    });

  },
};

exports.authenticate = {
  auth: false,
  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      bcrypt.compare(user.password, foundUser.password, (err, isValid) => {
        if (isValid && foundUser) {
          const token = utils.createToken(foundUser);
          reply({ success: true, token: token }).code(201);
        } else {
          reply({ success: false, message: 'Authentication failed. User not found.' }).code(201);
        }
      });
    }).catch(err => {
      reply(Boom.notFound('internal db failure'));
    });
  },
};
