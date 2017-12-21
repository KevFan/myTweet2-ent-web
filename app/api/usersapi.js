'use strict';

const User = require('../models/user');
const Boom = require('boom');
const cloudinary = require('cloudinary');
const deleteFromCloud = require('../utils/pictureHelpers');

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
    user.save().then(newUser => {
      reply(newUser).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating user'));
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
    User.findOneAndUpdate({ _id: request.params.id }, request.payload, { new: true }).then(user => {
      reply(user).code(200);
    }).catch(err => {
      reply(Boom.notFound('error updating user'));
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
